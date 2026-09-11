const BASE_URL = import.meta.env.VITE_API_VEHICULOS_URL;

async function manejarRespuesta(res) {
  if (!res.ok) {
    let detalle = `Error ${res.status}`;
    try {
      const cuerpo = await res.json();
      // ms-vehiculos (Spring/GlobalExceptionHandler) usa "message" y, en
      // errores 400, un mapa "detalles" campo->mensaje. Es distinto al
      // {"detail": "..."} que devuelve ms-clientes (FastAPI) por defecto.
      if (cuerpo.detalles && Object.keys(cuerpo.detalles).length > 0) {
        detalle = Object.entries(cuerpo.detalles)
          .map(([campo, msg]) => `${campo}: ${msg}`)
          .join(" | ");
      } else {
        detalle = cuerpo.message || detalle;
      }
    } catch {
      // sin cuerpo JSON, se deja el detalle genérico
    }
    throw new Error(detalle);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const vehiculosApi = {
  // Devuelve un PageResponseDTO: { content, page, size, totalElements, totalPages }
  listar: async ({ page = 0, size = 200, tipo, estado } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (tipo) params.set("tipo", tipo);
    if (estado) params.set("estado", estado);
    const res = await fetch(`${BASE_URL}/vehiculos?${params.toString()}`);
    return manejarRespuesta(res);
  },

  obtener: async (id) => {
    const res = await fetch(`${BASE_URL}/vehiculos/${id}`);
    return manejarRespuesta(res);
  },

  crear: async (payload) => {
    const res = await fetch(`${BASE_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return manejarRespuesta(res);
  },

  actualizar: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return manejarRespuesta(res);
  },

  cambiarEstado: async (id, estado) => {
    const res = await fetch(`${BASE_URL}/vehiculos/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    return manejarRespuesta(res);
  },

  eliminar: async (id) => {
    const res = await fetch(`${BASE_URL}/vehiculos/${id}`, { method: "DELETE" });
    return manejarRespuesta(res);
  },

  conductoresDelVehiculo: async (id) => {
    const res = await fetch(`${BASE_URL}/vehiculos/${id}/conductores`);
    return manejarRespuesta(res);
  },
};

