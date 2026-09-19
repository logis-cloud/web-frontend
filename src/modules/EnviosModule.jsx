import { useEffect, useMemo, useState, useCallback } from "react";
import { enviosApi } from "../api/enviosApi.js";
import EnvioForm from "../components/envios/EnvioForm.jsx";
import EnvioDetail from "../components/envios/EnvioDetail.jsx";
import EnvioList from "../components/envios/EnvioList.jsx";


export default function EnviosModule() {
  const [envios, setEnvios] = useState([]);
  const [totalEnvios, setTotalEnvios] = useState(0);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState(null);

  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [envioActivo, setEnvioActivo] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [vista, setVista] = useState("vacio");
  // vacio | detalle | crear

  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((mensaje) => {
    setToast(mensaje);

    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  const cargarLista = useCallback(async () => {
    setCargandoLista(true);
    setErrorLista(null);

    try {
      const pagina = await enviosApi.listar({
        size: 200,
      });

      setEnvios(pagina.content || []);
      setTotalEnvios(
        pagina.totalElements ?? (pagina.content || []).length
      );
    } catch (err) {
      setErrorLista(err.message);
    } finally {
      setCargandoLista(false);
    }
  }, []);

  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  const cargarDetalle = useCallback(
    async (id) => {
      setCargandoDetalle(true);

      try {
        const envio = await enviosApi.obtener(id);

        setEnvioActivo(envio);
        setVista("detalle");
      } catch (err) {
        mostrarToast(
          `No se pudo cargar el envío: ${err.message}`
        );
      } finally {
        setCargandoDetalle(false);
      }
    },
    [mostrarToast]
  );

  const seleccionarEnvio = (id) => {
    setSeleccionadoId(id);
    cargarDetalle(id);
  };

  const abrirCrear = () => {
    setSeleccionadoId(null);
    setEnvioActivo(null);
    setVista("crear");
  };

  const cancelarFormulario = () => {
    setVista(envioActivo ? "detalle" : "vacio");
  };

  const guardarEnvio = async (datos) => {
    setGuardando(true);

    try {
      const creado = await enviosApi.crear(datos);

      mostrarToast("Envío registrado");

      setSeleccionadoId(creado._id);
      setEnvioActivo(creado);
      setVista("detalle");

      await cargarLista();
    } catch (err) {
      mostrarToast(
        `Error al registrar el envío: ${err.message}`
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    if (!envioActivo) return;

    setCambiandoEstado(true);

    try {
      const actualizado =
        await enviosApi.actualizarEstado(
          envioActivo._id,
          nuevoEstado
        );

      setEnvioActivo(actualizado);

      mostrarToast("Estado actualizado");

      await cargarLista();
    } catch (err) {
      mostrarToast(
        `Error al cambiar el estado: ${err.message}`
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  const eliminarEnvio = async () => {
    if (!envioActivo) return;

    const confirmar = window.confirm(
      `¿Eliminar el envío ${envioActivo.codigoSeguimiento}?`
    );

    if (!confirmar) return;

    try {
      await enviosApi.eliminar(envioActivo._id);

      mostrarToast("Envío eliminado");

      setEnvioActivo(null);
      setSeleccionadoId(null);
      setVista("vacio");

      await cargarLista();
    } catch (err) {
      mostrarToast(
        `Error al eliminar el envío: ${err.message}`
      );
    }
  };

  const enviosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    if (!q) {
      return envios;
    }

    return envios.filter((e) => {
      return (
        e.codigoSeguimiento
          ?.toLowerCase()
          .includes(q) ||
        e.pedidoId
          ?.toLowerCase()
          .includes(q) ||
        String(e.clienteId)
          .toLowerCase()
          .includes(q)
      );
    });
  }, [envios, busqueda]);

  return (
    <>
      <div className="main">

    <EnvioList
      envios={enviosFiltrados}
      cargando={cargandoLista}
      seleccionadoId={seleccionadoId}
      onSeleccionar={seleccionarEnvio}
      busqueda={busqueda}
      onBuscar={setBusqueda}
      onNuevo={abrirCrear}
      total={totalEnvios}
    />

        <section className="panel">

          {errorLista && (
            <div className="error-banner">
              No se pudo conectar con la API de Envíos:{" "}
              {errorLista}
            </div>
          )}

          {cargandoDetalle && (
            <p>Cargando detalle...</p>
          )}

          {!cargandoDetalle &&
            vista === "vacio" && (
              <div className="panel-empty">

                <span className="panel-empty-code">
                  MS ENVÍOS
                </span>

                <h2>
                  Selecciona un envío
                </h2>

                <p>
                  Elige un envío del listado o registra uno nuevo.
                </p>

              </div>
            )}

          {!cargandoDetalle &&
            vista === "detalle" &&
            envioActivo && (
              <EnvioDetail
                envio={envioActivo}
                onCambiarEstado={cambiarEstado}
                onEliminar={eliminarEnvio}
                cambiandoEstado={cambiandoEstado}
              />
            )}

        {!cargandoDetalle &&
        vista === "crear" && (
            <EnvioForm
            onGuardar={guardarEnvio}
            onCancelar={cancelarFormulario}
            guardando={guardando}
            />
        )}

        </section>

      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  );
}