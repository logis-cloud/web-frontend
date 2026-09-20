function formatearFecha(fecha) {
  if (!fecha) return "—";

  try {
    return new Date(fecha).toLocaleString("es-PE");
  } catch {
    return fecha;
  }
}

function TrackingDetail({ tracking }) {
  if (!tracking) {
    return null;
  }

  const cliente = tracking.cliente;
  const direccion = tracking.direccionEntrega;
  const vehiculo = tracking.vehiculoAsignado;
  const conductor = tracking.conductorAsignado;
  const items = tracking.items || [];

  return (
    <div className="label-card">
      <div className="label-head">
        <span>{tracking.codigoSeguimiento}</span>

        <span>
          actualizado {formatearFecha(tracking.fechaActualizacion)}
        </span>
      </div>

      <div className="label-body">
        <div>
          <h2 className="label-name">
            {tracking.pedidoId}
          </h2>

          <span className="status-pill activo">
            {tracking.estado}
          </span>
        </div>

        <div>
          <div className="label-row">
            <span className="label-row-key">
              tracking
            </span>

            <span className="label-row-value">
              {tracking.codigoSeguimiento}
            </span>
          </div>

          <div className="label-row">
            <span className="label-row-key">
              fecha creación
            </span>

            <span className="label-row-value">
              {formatearFecha(tracking.fechaCreacion)}
            </span>
          </div>

          <div className="label-row">
            <span className="label-row-key">
              última actualización
            </span>

            <span className="label-row-value">
              {formatearFecha(tracking.fechaActualizacion)}
            </span>
          </div>
        </div>

        <div className="stops">
          <h3 className="stops-title">
            cliente
          </h3>

          <div className="stop">
            <span className="stop-marker">
              C
            </span>

            <div className="stop-body">
              <div className="stop-tipo">
                destinatario
              </div>

              <div>
                {cliente.nombre} {cliente.apellido}
              </div>

              <div style={{ color: "var(--ink-soft)" }}>
                {cliente.email}
              </div>

              <div style={{ color: "var(--ink-soft)" }}>
                {cliente.telefono || "Sin teléfono"}
              </div>
            </div>
          </div>
        </div>

        <div className="stops">
          <h3 className="stops-title">
            dirección de entrega
          </h3>

          <div className="stop">
            <span className="stop-marker">
              1
            </span>

            <div className="stop-body">
              <div className="stop-tipo">
                destino
              </div>

              <div>
                {direccion.calle}, {direccion.distrito}, {direccion.ciudad}
              </div>

              {direccion.codigoPostal && (
                <div style={{ color: "var(--ink-soft)" }}>
                  CP: {direccion.codigoPostal}
                </div>
              )}

              {direccion.referencia && (
                <div style={{ color: "var(--ink-soft)" }}>
                  {direccion.referencia}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stops">
          <h3 className="stops-title">
            vehículo asignado
          </h3>

          <div className="stop">
            <span className="stop-marker">
              V
            </span>

            <div className="stop-body">
              <div className="stop-tipo">
                {vehiculo.placa}
              </div>

              <div>
                {vehiculo.marca || "—"} {vehiculo.modelo || ""}
              </div>

              <div style={{ color: "var(--ink-soft)" }}>
                {vehiculo.tipo || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="stops">
          <h3 className="stops-title">
            conductor asignado
          </h3>

          <div className="stop">
            <span className="stop-marker">
              C
            </span>

            <div className="stop-body">
              <div className="stop-tipo">
                {conductor.turno || "turno"}
              </div>

              <div>
                {conductor.nombre} {conductor.apellido}
              </div>

              {conductor.dni && (
                <div style={{ color: "var(--ink-soft)" }}>
                  DNI: {conductor.dni}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stops">
          <h3 className="stops-title">
            productos ({items.length})
          </h3>

          {items.map((item, index) => (
            <div
              className="stop"
              key={`${item.sku}-${index}`}
            >
              <span className="stop-marker">
                {index + 1}
              </span>

              <div className="stop-body">
                <div className="stop-tipo">
                  {item.sku}
                </div>

                <div>
                  {item.descripcion}
                </div>

                <div style={{ color: "var(--ink-soft)" }}>
                  Cantidad: {item.cantidad}
                  {" · "}
                  Peso: {item.pesoKg} kg
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrackingDetail;