import { useState } from "react";
import TrackingSearch from "../components/tracking/TrackingSearch.jsx";
import TrackingDetail from "../components/tracking/TrackingDetail.jsx";
import { trackingApi } from "../api/trackingApi.js";

function TrackingModule() {
  const [tracking, setTracking] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function buscarTracking(codigo) {
    setCargando(true);
    setError("");
    setTracking(null);

    try {
      const datos = await trackingApi.obtenerPorCodigo(codigo);
      setTracking(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

return (
  <div className="main tracking-main">
    <section className="panel tracking-panel">
      <div className="tracking-search">
        <TrackingSearch onBuscar={buscarTracking} />
      </div>

      {cargando && (
        <p className="manifest-loading">Cargando detalle...</p>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {!cargando && !error && !tracking && (
        <div className="panel-empty">
          <span className="panel-empty-code">
            MS TRACKING
          </span>

          <h2>Busca un envío</h2>

          <p>
            Ingresa un código de seguimiento para consultar su estado,
            cliente, dirección, vehículo y conductor.
          </p>
        </div>
      )}

      {!cargando && !error && tracking && (
        <TrackingDetail tracking={tracking} />
      )}
    </section>
  </div>
);
}

export default TrackingModule;