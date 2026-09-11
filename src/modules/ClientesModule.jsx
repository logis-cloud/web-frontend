import { useEffect, useMemo, useState, useCallback } from "react";
import { clientesApi } from "../api/clientesApi.js";
import ManifestList from "../components/ManifestList.jsx";
import ClienteDetail from "../components/ClienteDetail.jsx";
import ClienteForm from "../components/ClienteForm.jsx";

export default function ClientesModule() {
  const [clientes, setClientes] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState(null);

  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [vista, setVista] = useState("vacio"); // vacio | detalle | crear | editar
  const [guardando, setGuardando] = useState(false);
  const [guardandoDireccion, setGuardandoDireccion] = useState(false);

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
      const datos = await clientesApi.listar({ limit: 200 });
      setClientes(datos);
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
      const cliente = await clientesApi.obtener(id);
      setClienteActivo(cliente);
      setVista("detalle");
    } catch (err) {
      mostrarToast(`No se pudo cargar el cliente: ${err.message}`);
    } finally {
      setCargandoDetalle(false);
    }
  }, [mostrarToast]);

  const seleccionarCliente = (id) => {
    setSeleccionadoId(id);
    cargarDetalle(id);
  };

  const abrirCrear = () => {
    setSeleccionadoId(null);
    setClienteActivo(null);
    setVista("crear");
  };

  const abrirEditar = () => setVista("editar");

  const cancelarFormulario = () => {
    setVista(clienteActivo ? "detalle" : "vacio");
  };

  const guardarCliente = async (datos) => {
    setGuardando(true);
    try {
      if (vista === "editar" && clienteActivo) {
        const actualizado = await clientesApi.actualizar(clienteActivo.id, datos);
        setClienteActivo({ ...clienteActivo, ...actualizado });
        mostrarToast("Cliente actualizado");
        setVista("detalle");
      } else {
        const creado = await clientesApi.crear({ ...datos, direcciones: [] });
        mostrarToast("Cliente registrado");
        setSeleccionadoId(creado.id);
        setClienteActivo(creado);
        setVista("detalle");
      }
      await cargarLista();
    } catch (err) {
      mostrarToast(`Error al guardar: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCliente = async () => {
    if (!clienteActivo) return;
    if (!window.confirm(`¿Eliminar a ${clienteActivo.nombre} ${clienteActivo.apellido}?`)) return;
    try {
      await clientesApi.eliminar(clienteActivo.id);
      mostrarToast("Cliente eliminado");
      setClienteActivo(null);
      setSeleccionadoId(null);
      setVista("vacio");
      await cargarLista();
    } catch (err) {
      mostrarToast(`Error al eliminar: ${err.message}`);
    }
  };

  const agregarDireccion = async (datos) => {
    if (!clienteActivo) return;
    setGuardandoDireccion(true);
    try {
      await clientesApi.crearDireccion(clienteActivo.id, datos);
      const actualizado = await clientesApi.obtener(clienteActivo.id);
      setClienteActivo(actualizado);
      mostrarToast("Dirección agregada");
    } catch (err) {
      mostrarToast(`Error al agregar dirección: ${err.message}`);
    } finally {
      setGuardandoDireccion(false);
    }
  };

  const eliminarDireccion = async (direccionId) => {
    if (!clienteActivo) return;
    try {
      await clientesApi.eliminarDireccion(direccionId);
      const actualizado = await clientesApi.obtener(clienteActivo.id);
      setClienteActivo(actualizado);
      mostrarToast("Dirección eliminada");
    } catch (err) {
      mostrarToast(`Error al eliminar dirección: ${err.message}`);
    }
  };

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [clientes, busqueda]);

  return (
    <>
      <div className="main">
        <ManifestList
          clientes={clientesFiltrados}
          cargando={cargandoLista}
          seleccionadoId={seleccionadoId}
          onSeleccionar={seleccionarCliente}
          busqueda={busqueda}
          onBuscar={setBusqueda}
          onNuevo={abrirCrear}
          total={clientes.length}
        />

        <section className="panel">
          {errorLista && (
            <div className="error-banner">
              No se pudo conectar con la API de Clientes: {errorLista}. Verifica
              que el backend esté corriendo en{" "}
              {import.meta.env.VITE_API_CLIENTES_URL || "http://localhost:8001"}.
            </div>
          )}

          {vista === "vacio" && !errorLista && (
            <div className="panel-empty">
              <span className="panel-empty-code">// sin selección</span>
              <p>
                Elige un cliente del manifiesto para ver sus datos y direcciones
                de entrega, o registra uno nuevo.
              </p>
            </div>
          )}

          {(vista === "crear" || vista === "editar") && (
            <ClienteForm
              clienteInicial={vista === "editar" ? clienteActivo : null}
              onGuardar={guardarCliente}
              onCancelar={cancelarFormulario}
              guardando={guardando}
            />
          )}

          {vista === "detalle" && clienteActivo && !cargandoDetalle && (
            <ClienteDetail
              cliente={clienteActivo}
              onEditar={abrirEditar}
              onEliminar={eliminarCliente}
              onAgregarDireccion={agregarDireccion}
              onEliminarDireccion={eliminarDireccion}
              guardandoDireccion={guardandoDireccion}
            />
          )}

          {cargandoDetalle && <p className="manifest-loading">Cargando etiqueta…</p>}
        </section>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
