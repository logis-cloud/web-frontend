import { useState } from "react";
import DireccionForm from "./DireccionForm.jsx";

function codigoCliente(id) {
  return `CLI-${String(id).padStart(6, "0")}`;
}

function formatearFecha(iso) {
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

export default function ClienteDetail({
  cliente,
  onEditar,
  onEliminar,
  onAgregarDireccion,
  onEliminarDireccion,
  guardandoDireccion,
}) {
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false);

  const direcciones = cliente.direcciones || [];

  return (
    <div>
      <div className="label-card">
        <div className="label-head">
          <span>{codigoCliente(cliente.id)}</span>
          <span>registrado {formatearFecha(cliente.fecha_registro)}</span>
        </div>

        <div className="label-body">
          <div>
            <h2 className="label-name">
              {cliente.nombre} {cliente.apellido}
            </h2>
            <span className={`status-pill ${cliente.activo ? "activo" : "inactivo"}`}>
              {cliente.activo ? "cliente activo" : "cliente inactivo"}
            </span>
          </div>

          <div>
            <div className="label-row">
              <span className="label-row-key">email</span>
              <span className="label-row-value">{cliente.email}</span>
            </div>
            <div className="label-row">
              <span className="label-row-key">teléfono</span>
              <span className="label-row-value">{cliente.telefono || "—"}</span>
            </div>
            <div className="label-row" style={{ borderBottom: "none" }}>
              <span className="label-row-key">dni</span>
              <span className="label-row-value">{cliente.dni || "—"}</span>
            </div>
          </div>

          <div className="stops">
            <h3 className="stops-title">
              paradas de entrega ({direcciones.length})
            </h3>

            {direcciones.length === 0 && (
              <p className="stops-empty">
                Este cliente todavía no tiene direcciones registradas.
              </p>
            )}

            {direcciones.map((d, i) => (
              <div className="stop" key={d.id}>
                <span className={`stop-marker ${d.es_principal ? "principal" : ""}`}>
                  {i + 1}
                </span>
                <div className="stop-body">
                  <div className="stop-tipo">
                    {d.tipo}
                    {d.es_principal ? " · principal" : ""}
                  </div>
                  <div>
                    {d.calle}, {d.distrito}, {d.ciudad}
                  </div>
                  {d.referencia && (
                    <div style={{ color: "var(--ink-soft)" }}>{d.referencia}</div>
                  )}
                </div>
                <button
                  className="stop-remove"
                  onClick={() => onEliminarDireccion(d.id)}
                >
                  quitar
                </button>
              </div>
            ))}

            {mostrarFormDireccion ? (
              <DireccionForm
                guardando={guardandoDireccion}
                onCancelar={() => setMostrarFormDireccion(false)}
                onAgregar={async (datos) => {
                  await onAgregarDireccion(datos);
                  setMostrarFormDireccion(false);
                }}
              />
            ) : (
              <button
                className="btn btn-ghost"
                style={{ marginTop: 12 }}
                onClick={() => setMostrarFormDireccion(true)}
              >
                + Agregar parada de entrega
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="label-actions">
        <button className="btn" onClick={onEditar}>
          Editar cliente
        </button>
        <button className="btn btn-danger" onClick={onEliminar}>
          Eliminar cliente
        </button>
      </div>
    </div>
  );
}
