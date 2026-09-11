function codigoVehiculo(id) {
  return `VHC-${String(id).padStart(6, "0")}`;
}

const ESTADO_LABEL = {
  DISPONIBLE: "disponible",
  EN_RUTA: "en ruta",
  MANTENIMIENTO: "en mantenimiento",
  INACTIVO: "inactivo",
};

export default function VehiculoList({
  vehiculos,
  cargando,
  seleccionadoId,
  onSeleccionar,
  busqueda,
  onBuscar,
  onNuevo,
  total,
}) {
  return (
    <aside className="manifest">
      <div className="manifest-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por placa, marca o modelo…"
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />
        <button className="btn btn-primary" onClick={onNuevo}>
          + Vehículo
        </button>
      </div>

      <div className="manifest-list">
        {cargando && <p className="manifest-loading">Cargando flota…</p>}

        {!cargando && vehiculos.length === 0 && (
          <p className="manifest-empty">
            No hay vehículos que coincidan con la búsqueda.
          </p>
        )}

        {!cargando &&
          vehiculos.map((v) => (
            <button
              key={v.id}
              className={`manifest-item ${
                v.id === seleccionadoId ? "is-active" : ""
              }`}
              onClick={() => onSeleccionar(v.id)}
            >
              <span className="manifest-code">{codigoVehiculo(v.id)}</span>
              <span className="manifest-name">{v.placa}</span>
              <span className="manifest-sub">
                {v.marca} {v.modelo} · {ESTADO_LABEL[v.estado] || v.estado}
              </span>
            </button>
          ))}
      </div>

      <div className="manifest-footer">
        <span>{total} vehículo(s) en total</span>
      </div>
    </aside>
  );
}

