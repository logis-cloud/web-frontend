const BASE_URL = import.meta.env.VITE_API_CLIENTES_URL;

async function manejarRespuesta(res) {
  if (!res.ok) {
    let detalle = `Error ${res.status}`;
    try {
      const cuerpo = await res.json();
      detalle = cuerpo.detail || detalle;
    } catch {
      // sin cuerpo JSON, se deja el detalle genérico
    }
    throw new Error(detalle);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const clientesApi = {
  listar: async ({ skip = 0, limit = 50, activo } = {}) => {
    const params = new URLSearchParams({ skip, limit });
    if (activo !== undefined && activo !== null) params.set("activo", activo);
    const res = await fetch(`${BASE_URL}/clientes?${params.toString()}`);
    return manejarRespuesta(res);
  },

  obtener: async (id) => {
    const res = await fetch(`${BASE_URL}/clientes/${id}`);
    return manejarRespuesta(res);
  },

  crear: async (payload) => {
    const res = await fetch(`${BASE_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return manejarRespuesta(res);
  },

  actualizar: async (id, cambios) => {
    const res = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });
    return manejarRespuesta(res);
  },

  eliminar: async (id) => {
    const res = await fetch(`${BASE_URL}/clientes/${id}`, { method: "DELETE" });
    return manejarRespuesta(res);
  },

  crearDireccion: async (clienteId, payload) => {
    const res = await fetch(`${BASE_URL}/clientes/${clienteId}/direcciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return manejarRespuesta(res);
  },

  eliminarDireccion: async (direccionId) => {
    const res = await fetch(`${BASE_URL}/direcciones/${direccionId}`, {
      method: "DELETE",
    });
    return manejarRespuesta(res);
  },
};
