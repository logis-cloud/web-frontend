const BASE_URL = import.meta.env.VITE_API_ENVIOS_URL;

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

export const enviosApi = {
  listar: async ({ page = 0, size = 200, estado, clienteId } = {}) => {
    const params = new URLSearchParams({ page, size });

    if (estado) {
      params.set("estado", estado);
    }

    if (clienteId !== undefined && clienteId !== null && clienteId !== "") {
      params.set("clienteId", clienteId);
    }

    const res = await fetch(`${BASE_URL}/envios?${params.toString()}`);

    return manejarRespuesta(res);
  },

  obtener: async (id) => {
    const res = await fetch(`${BASE_URL}/envios/${id}`);

    return manejarRespuesta(res);
  },

  obtenerPorTracking: async (codigo) => {
    const res = await fetch(`${BASE_URL}/envios/tracking/${codigo}`);

    return manejarRespuesta(res);
  },

  crear: async (payload) => {
    const res = await fetch(`${BASE_URL}/envios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return manejarRespuesta(res);
  },

  actualizarEstado: async (id, estado) => {
    const res = await fetch(`${BASE_URL}/envios/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });

    return manejarRespuesta(res);
  },

  eliminar: async (id) => {
    const res = await fetch(`${BASE_URL}/envios/${id}`, {
      method: "DELETE",
    });

    return manejarRespuesta(res);
  },
};