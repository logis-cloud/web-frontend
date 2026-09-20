const BASE_URL = import.meta.env.VITE_API_TRACKING_URL;

async function manejarRespuesta(res) {
  if (!res.ok) {
    let detalle = `Error ${res.status}`;

    try {
      const cuerpo = await res.json();
      detalle = cuerpo.detail || detalle;
    } catch {
      // Si no viene JSON, dejamos el error genérico.
    }

    throw new Error(detalle);
  }

  if (res.status === 204) return null;

  return res.json();
}

export const trackingApi = {
  obtenerPorCodigo: async (codigo) => {
    const res = await fetch(`${BASE_URL}/trackings/${codigo}`);
    return manejarRespuesta(res);
  },

  obtenerPorId: async (envioId) => {
    const res = await fetch(`${BASE_URL}/trackings/id/${envioId}`);
    return manejarRespuesta(res);
  },
};