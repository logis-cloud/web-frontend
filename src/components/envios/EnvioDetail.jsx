const ESTADOS = [
  "CREADO",
  "EN_TRANSITO",
  "ENTREGADO",
];

function formatearFecha(fecha) {
  if (!fecha) return "—";

  try {
    return new Date(fecha).toLocaleString("es-PE");
  } catch {
    return fecha;
  }
}

export default function EnvioDetail({
  envio,
  onCambiarEstado,
  onEliminar,
  cambiandoEstado,
}) {
  const items = envio.items || [];
  const direccion = envio.direccionEntrega;
  const vehiculo = envio.vehiculoAsignado;
  const conductor = envio.conductorAsignado;

  return (
    <div>
      <div className="label-card">

        <div className="label-head">
          <span>{envio.codigoSeguimiento}</span>

          <span>
            creado {formatearFecha(envio.fechaCreacion)}
          </span>
        </div>

        <div className="label-body">

          <div>
            <h2 className="label-name">
              {envio.pedidoId}
            </h2>

            <span className="status-pill activo">
              {envio.estado}
            </span>
          </div>

          <div>

            <div className="label-row">
              <span className="label-row-key">
                cliente
              </span>

              <span className="label-row-value">
                {envio.clienteId}
              </span>
            </div>

            <div className="label-row">
              <span className="label-row-key">
                tracking
              </span>

              <span className="label-row-value">
                {envio.codigoSeguimiento}
              </span>
            </div>

            <div className="label-row">
              <span className="label-row-key">
                última actualización
              </span>

              <span className="label-row-value">
                {formatearFecha(envio.fechaActualizacion)}
              </span>
            </div>

          </div>

          <div className="stops">

            <h3 className="stops-title">
              dirección de entrega
            </h3>

            {direccion ? (
              <div className="stop">

                <span className="stop-marker">
                  1
                </span>

                <div className="stop-body">

                  <div className="stop-tipo">
                    destino
                  </div>

                  <div>
                    {direccion.calle},{" "}
                    {direccion.distrito},{" "}
                    {direccion.ciudad}
                  </div>

                  {direccion.codigoPostal && (
                    <div>
                      CP: {direccion.codigoPostal}
                    </div>
                  )}

                  {direccion.referencia && (
                    <div
                      style={{
                        color: "var(--ink-soft)",
                      }}
                    >
                      {direccion.referencia}
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <p className="stops-empty">
                No hay dirección registrada.
              </p>
            )}

          </div>

          <div className="stops">

            <h3 className="stops-title">
              items ({items.length})
            </h3>

            {items.length === 0 && (
              <p className="stops-empty">
                Este envío no contiene items.
              </p>
            )}

            {items.map((item, indice) => (
              <div
                className="stop"
                key={`${item.sku}-${indice}`}
              >

                <span className="stop-marker">
                  {indice + 1}
                </span>

                <div className="stop-body">

                  <div className="stop-tipo">
                    {item.sku}
                  </div>

                  <div>
                    {item.descripcion}
                  </div>

                  <div
                    style={{
                      color: "var(--ink-soft)",
                    }}
                  >
                    Cantidad: {item.cantidad}
                    {" · "}
                    Peso: {item.pesoKg} kg
                  </div>

                </div>

              </div>
            ))}

          </div>

          <div className="stops">

            <h3 className="stops-title">
              vehículo asignado
            </h3>

            {vehiculo ? (
              <div className="stop">

                <span className="stop-marker">
                  V
                </span>

                <div className="stop-body">

                  <div className="stop-tipo">
                    {vehiculo.placa}
                  </div>

                  <div>
                    {vehiculo.marca || "—"}{" "}
                    {vehiculo.modelo || ""}
                  </div>

                  <div
                    style={{
                      color: "var(--ink-soft)",
                    }}
                  >
                    {vehiculo.tipo || "—"}
                  </div>

                </div>

              </div>
            ) : (
              <p className="stops-empty">
                No hay vehículo asignado.
              </p>
            )}

          </div>

          <div className="stops">

            <h3 className="stops-title">
              conductor asignado
            </h3>

            {conductor ? (
              <div className="stop">

                <span className="stop-marker">
                  C
                </span>

                <div className="stop-body">

                  <div className="stop-tipo">
                    {conductor.turno || "turno"}
                  </div>

                  <div>
                    {conductor.nombre}{" "}
                    {conductor.apellido}
                  </div>

                  {conductor.dni && (
                    <div
                      style={{
                        color: "var(--ink-soft)",
                      }}
                    >
                      DNI: {conductor.dni}
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <p className="stops-empty">
                No hay conductor asignado.
              </p>
            )}

          </div>

          <div className="stops">

            <h3 className="stops-title">
              cambiar estado
            </h3>

            <div
              className="form-actions"
              style={{
                marginTop: 0,
                flexWrap: "wrap",
              }}
            >

              {ESTADOS.map((estado) => (
                <button
                  key={estado}
                  className={`btn ${
                    envio.estado === estado
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                  disabled={
                    cambiandoEstado ||
                    envio.estado === estado
                  }
                  onClick={() =>
                    onCambiarEstado(estado)
                  }
                >
                  {estado}
                </button>
              ))}

            </div>

          </div>

        </div>

      </div>

      <div className="label-actions">

        <button
          className="btn btn-danger"
          onClick={onEliminar}
        >
          Eliminar envío
        </button>

      </div>

    </div>
  );
}