import { useState } from "react";

const VACIO = { nombre: "", apellido: "", email: "", telefono: "", dni: "" };

export default function ClienteForm({ clienteInicial, onGuardar, onCancelar, guardando }) {
  const esEdicion = Boolean(clienteInicial);
  const [datos, setDatos] = useState(
    esEdicion
      ? {
          nombre: clienteInicial.nombre,
          apellido: clienteInicial.apellido,
          email: clienteInicial.email,
          telefono: clienteInicial.telefono || "",
          dni: clienteInicial.dni || "",
        }
      : VACIO
  );

  const cambiar = (campo) => (e) =>
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    onGuardar(datos);
  };

  return (
    <form className="form" onSubmit={enviar}>
      <h2 className="form-title">
        {esEdicion ? "Editar cliente" : "Registrar nuevo cliente"}
      </h2>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="nombre">nombre</label>
          <input
            id="nombre"
            required
            value={datos.nombre}
            onChange={cambiar("nombre")}
          />
        </div>
        <div className="field">
          <label htmlFor="apellido">apellido</label>
          <input
            id="apellido"
            required
            value={datos.apellido}
            onChange={cambiar("apellido")}
          />
        </div>
        <div className="field field-full">
          <label htmlFor="email">email</label>
          <input
            id="email"
            type="email"
            required
            value={datos.email}
            onChange={cambiar("email")}
          />
        </div>
        <div className="field">
          <label htmlFor="telefono">teléfono</label>
          <input id="telefono" value={datos.telefono} onChange={cambiar("telefono")} />
        </div>
        <div className="field">
          <label htmlFor="dni">dni</label>
          <input id="dni" value={datos.dni} onChange={cambiar("dni")} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Registrar cliente"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
