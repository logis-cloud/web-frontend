export default function EnvioList({
  envios,
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
          placeholder="Buscar por tracking, pedido o cliente..."
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={onNuevo}
        >
          + Envío
        </button>
      </div>

      <div className="manifest-list">
        {cargando && (
          <p className="manifest-loading">
            Cargando envíos...
          </p>
        )}

        {!cargando && envios.length === 0 && (
          <p className="manifest-empty">
            No hay envíos que coincidan con la búsqueda.
          </p>
        )}

        {!cargando &&
          envios.map((envio) => (
            <button
              key={envio._id}
              className={`manifest-item ${
                envio._id === seleccionadoId
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                onSeleccionar(envio._id)
              }
            >
              <span className="manifest-code">
                {envio.codigoSeguimiento}
              </span>

              <span className="manifest-name">
                {envio.pedidoId}
              </span>

              <span className="manifest-sub">
                Cliente {envio.clienteId} · {envio.estado}
              </span>
            </button>
          ))}
      </div>

      <div className="manifest-footer">
        <span>
          {total} envío(s) en total
        </span>
      </div>
    </aside>
  );
}