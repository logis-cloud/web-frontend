function codigoVehiculo(id) {
  return `VHC-${String(id).padStart(6, "0")}`;
}

function formatearFecha(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

const TIPO_LABEL = { MOTO: "moto", FURGONETA: "furgoneta", CAMION: "camión" };
const ESTADOS = ["DISPONIBLE", "EN_RUTA", "MANTENIMIENTO", "INACTIVO"];
const ESTADO_LABEL = {
  DISPONIBLE: "disponible",
  EN_RUTA: "en ruta",
  MANTENIMIENTO: "en mantenimiento",
  INACTIVO: "inactivo",
};
const ESTADO_CLASE = {
  DISPONIBLE: "activo",
  EN_RUTA: "activo",
  MANTENIMIENTO: "inactivo",
  INACTIVO: "inactivo",
};

export default function VehiculoDetail({
  vehiculo,
  onEditar,
  onEliminar,
  onCambiarEstado,
  cambiandoEstado,
}) {
  const conductores = vehiculo.conductores || [];

  return (
    <div>
      <div className="label-card">
        <div className="label-head">
          <span>{codigoVehiculo(vehiculo.id)}</span>
          <span>registrado {formatearFecha(vehiculo.fechaRegistro)}</span>
        </div>

        <div className="label-body">
          <div>
            <h2 className="label-name">{vehiculo.placa}</h2>
            <span className={`status-pill ${ESTADO_CLASE[vehiculo.estado] || ""}`}>
              {ESTADO_LABEL[vehiculo.estado] || vehiculo.estado}
            </span>
          </div>

          <div>
            <div className="label-row">
              <span className="label-row-key">tipo</span>
              <span className="label-row-value">{TIPO_LABEL[vehiculo.tipo] || vehiculo.tipo}</span>
            </div>
            <div className="label-row">
              <span className="label-row-key">capacidad</span>
              <span className="label-row-value">{vehiculo.capacidadKg} kg</span>
            </div>
            <div className="label-row">
              <span className="label-row-key">marca / modelo</span>
              <span className="label-row-value">
                {vehiculo.marca || "—"} {vehiculo.modelo || ""}
              </span>
            </div>
            <div className="label-row" style={{ borderBottom: "none" }}>
              <span className="label-row-key">año</span>
              <span className="label-row-value">{vehiculo.anioFabricacion || "—"}</span>
            </div>
          </div>

          <div className="stops">
            <h3 className="stops-title">cambiar estado operativo</h3>
            <div className="form-actions" style={{ marginTop: 0, flexWrap: "wrap" }}>
              {ESTADOS.map((estado) => (
                <button
                  key={estado}
                  className={`btn ${estado === vehiculo.estado ? "btn-primary" : "btn-ghost"}`}
                  disabled={cambiandoEstado || estado === vehiculo.estado}
                  onClick={() => onCambiarEstado(estado)}
                >
                  {ESTADO_LABEL[estado]}
                </button>
              ))}
            </div>
          </div>

          <div className="stops">
            <h3 className="stops-title">conductores asignados ({conductores.length})</h3>

            {conductores.length === 0 && (
              <p className="stops-empty">
                Este vehículo no tiene conductores asignados actualmente.
              </p>
            )}

            {conductores.map((c) => (
              <div className="stop" key={c.id}>
                <span className="stop-marker">{c.nombre?.[0]}{c.apellido?.[0]}</span>
                <div className="stop-body">
                  <div className="stop-tipo">turno {c.turno?.toLowerCase()}</div>
                  <div>
                    {c.nombre} {c.apellido}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="label-actions">
        <button className="btn" onClick={onEditar}>
          Editar vehículo
        </button>
        <button className="btn btn-danger" onClick={onEliminar}>
          Eliminar vehículo
        </button>
      </div>
    </div>
  );
}

