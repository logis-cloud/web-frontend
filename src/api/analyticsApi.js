const BASE_URL = import.meta.env.VITE_API_ANALYTICS_URL || "http://localhost:8005";

async function manejarRespuesta(res) {
  if (!res.ok) {
    let detalle = `Error ${res.status}`;

    try {
      const cuerpo = await res.json();
      detalle = cuerpo.detail || cuerpo.message || detalle;
    } catch {
      // Si la respuesta no contiene JSON, mantenemos el error genérico.
    }

    throw new Error(detalle);
  }

  if (res.status === 204) return null;

  return res.json();
}

function get(path) {
  return fetch(`${BASE_URL}${path}`).then(manejarRespuesta);
}

export const analyticsApi = {
  baseUrl: BASE_URL,

  health: () => get("/health"),

  enviosPorVehiculo: () => get("/analitica/envios-por-vehiculo"),
  reporteCiudadesDestino: () => get("/analitica/reporte-ciudades-destino"),
  rendimientoConductores: () => get("/analitica/rendimiento-conductores"),
  topClientesDemanda: () => get("/analitica/top-clientes-demanda"),
  flujoOrigenDestino: () => get("/analitica/flujo-origen-destino"),
  reporte360Operaciones: () => get("/analitica/reporte-360-operaciones"),
  vistaEnvios: () => get("/analitica/vista-envios"),
  vistaReporteLogistica: () => get("/analitica/vista-reporte-logistica"),
};
