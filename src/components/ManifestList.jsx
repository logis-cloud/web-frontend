function codigoCliente(id) {
  return `CLI-${String(id).padStart(6, "0")}`;
}

export default function ManifestList({
  clientes,
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
          placeholder="Buscar por nombre o email…"
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />
        <button className="btn btn-primary" onClick={onNuevo}>
          + Cliente
        </button>
      </div>

      <div className="manifest-list">
        {cargando && <p className="manifest-loading">Cargando manifiesto…</p>}

        {!cargando && clientes.length === 0 && (
          <p className="manifest-empty">
            No hay clientes que coincidan con la búsqueda.
          </p>
        )}

        {!cargando &&
          clientes.map((c) => (
            <button
              key={c.id}
              className={`manifest-item ${
                c.id === seleccionadoId ? "is-active" : ""
              }`}
              onClick={() => onSeleccionar(c.id)}
            >
              <span className="manifest-code">{codigoCliente(c.id)}</span>
              <span className="manifest-name">
                {c.nombre} {c.apellido}
              </span>
              <span className="manifest-sub">{c.email}</span>
            </button>
          ))}
      </div>

      <div className="manifest-footer">
        <span>{total} cliente(s) en total</span>
      </div>
    </aside>
  );
}
