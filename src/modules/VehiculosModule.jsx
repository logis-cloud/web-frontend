import { useEffect, useMemo, useState, useCallback } from "react";
import { vehiculosApi } from "../api/vehiculosApi.js";
import VehiculoList from "../components/vehiculos/VehiculoList.jsx";
import VehiculoDetail from "../components/vehiculos/VehiculoDetail.jsx";
import VehiculoForm from "../components/vehiculos/VehiculoForm.jsx";

export default function VehiculosModule() {
  const [vehiculos, setVehiculos] = useState([]);
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState(null);

  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [vehiculoActivo, setVehiculoActivo] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const [vista, setVista] = useState("vacio"); // vacio | detalle | crear | editar
  const [guardando, setGuardando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const cargarLista = useCallback(async () => {
    setCargandoLista(true);
    setErrorLista(null);
    try {
      const pagina = await vehiculosApi.listar({ size: 200 });
      setVehiculos(pagina.content || []);
      setTotalVehiculos(pagina.totalElements ?? (pagina.content || []).length);
    } catch (err) {
      setErrorLista(err.message);
    } finally {
      setCargandoLista(false);
    }
  }, []);

  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  const cargarDetalle = useCallback(async (id) => {
    setCargandoDetalle(true);
    try {
      const vehiculo = await vehiculosApi.obtener(id);
      setVehiculoActivo(vehiculo);
      setVista("detalle");
    } catch (err) {
      mostrarToast(`No se pudo cargar el vehículo: ${err.message}`);
    } finally {
      setCargandoDetalle(false);
    }
  }, [mostrarToast]);

  const seleccionarVehiculo = (id) => {
    setSeleccionadoId(id);
    cargarDetalle(id);
  };

  const abrirCrear = () => {
    setSeleccionadoId(null);
    setVehiculoActivo(null);
    setVista("crear");
  };

  const abrirEditar = () => setVista("editar");

  const cancelarFormulario = () => {
    setVista(vehiculoActivo ? "detalle" : "vacio");
  };

  const guardarVehiculo = async (datos) => {
    setGuardando(true);
    try {
      if (vista === "editar" && vehiculoActivo) {
        const actualizado = await vehiculosApi.actualizar(vehiculoActivo.id, datos);
        setVehiculoActivo({ ...vehiculoActivo, ...actualizado });
        mostrarToast("Vehículo actualizado");
        setVista("detalle");
      } else {
        const creado = await vehiculosApi.crear(datos);
        mostrarToast("Vehículo registrado");
        setSeleccionadoId(creado.id);
        await cargarDetalle(creado.id);
      }
      await cargarLista();
    } catch (err) {
      mostrarToast(`Error al guardar: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarVehiculo = async () => {
    if (!vehiculoActivo) return;
    if (!window.confirm(`¿Eliminar el vehículo con placa ${vehiculoActivo.placa}?`)) return;
    try {
      await vehiculosApi.eliminar(vehiculoActivo.id);
      mostrarToast("Vehículo eliminado");
      setVehiculoActivo(null);
      setSeleccionadoId(null);
      setVista("vacio");
      await cargarLista();
    } catch (err) {
      mostrarToast(`Error al eliminar: ${err.message}`);
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    if (!vehiculoActivo) return;
    setCambiandoEstado(true);
    try {
      const actualizado = await vehiculosApi.cambiarEstado(vehiculoActivo.id, nuevoEstado);
      setVehiculoActivo({ ...vehiculoActivo, ...actualizado });
      mostrarToast("Estado actualizado");
      await cargarLista();
    } catch (err) {
      mostrarToast(`Error al cambiar el estado: ${err.message}`);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const vehiculosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return vehiculos;
    return vehiculos.filter((v) =>
      `${v.placa} ${v.marca || ""} ${v.modelo || ""}`.toLowerCase().includes(q)
    );
  }, [vehiculos, busqueda]);

  return (
    <>
      <div className="main">
        <VehiculoList
          vehiculos={vehiculosFiltrados}
          cargando={cargandoLista}
          seleccionadoId={seleccionadoId}
          onSeleccionar={seleccionarVehiculo}
          busqueda={busqueda}
          onBuscar={setBusqueda}
          onNuevo={abrirCrear}
          total={totalVehiculos}
        />

        <section className="panel">
          {errorLista && (
            <div className="error-banner">
              No se pudo conectar con la API de Vehículos: {errorLista}. Verifica
              que el backend esté corriendo en{" "}
              {import.meta.env.VITE_API_VEHICULOS_URL || "http://localhost:8002"} y que
              tenga CORS habilitado para este origen.
            </div>
          )}

          {vista === "vacio" && !errorLista && (
            <div className="panel-empty">
              <span className="panel-empty-code">// sin selección</span>
              <p>
                Elige un vehículo de la flota para ver sus datos y conductores
                asignados, o registra uno nuevo.
              </p>
            </div>
          )}

          {(vista === "crear" || vista === "editar") && (
            <VehiculoForm
              vehiculoInicial={vista === "editar" ? vehiculoActivo : null}
              onGuardar={guardarVehiculo}
              onCancelar={cancelarFormulario}
              guardando={guardando}
            />
          )}

          {vista === "detalle" && vehiculoActivo && !cargandoDetalle && (
            <VehiculoDetail
              vehiculo={vehiculoActivo}
              onEditar={abrirEditar}
              onEliminar={eliminarVehiculo}
              onCambiarEstado={cambiarEstado}
              cambiandoEstado={cambiandoEstado}
            />
          )}

          {cargandoDetalle && <p className="manifest-loading">Cargando ficha del vehículo…</p>}
        </section>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

