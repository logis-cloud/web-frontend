import { useState } from "react";

const VACIO = {
  calle: "",
  distrito: "",
  ciudad: "Lima",
  codigo_postal: "",
  referencia: "",
  tipo: "casa",
  es_principal: false,
};

export default function DireccionForm({ onAgregar, onCancelar, guardando }) {
  const [datos, setDatos] = useState(VACIO);

  const cambiar = (campo) => (e) => {
    const valor =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const enviar = (e) => {
    e.preventDefault();
    onAgregar(datos);
  };

  return (
    <form className="sub-form" onSubmit={enviar}>
      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="calle">calle / avenida</label>
          <input id="calle" required value={datos.calle} onChange={cambiar("calle")} />
        </div>
        <div className="field">
          <label htmlFor="distrito">distrito</label>
          <input id="distrito" required value={datos.distrito} onChange={cambiar("distrito")} />
        </div>
        <div className="field">
          <label htmlFor="ciudad">ciudad</label>
          <input id="ciudad" required value={datos.ciudad} onChange={cambiar("ciudad")} />
        </div>
        <div className="field">
          <label htmlFor="tipo">tipo</label>
          <select id="tipo" value={datos.tipo} onChange={cambiar("tipo")}>
            <option value="casa">casa</option>
            <option value="trabajo">trabajo</option>
            <option value="otro">otro</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="codigo_postal">código postal</label>
          <input
            id="codigo_postal"
            value={datos.codigo_postal}
            onChange={cambiar("codigo_postal")}
          />
        </div>
        <div className="field field-full">
          <label htmlFor="referencia">referencia</label>
          <input id="referencia" value={datos.referencia} onChange={cambiar("referencia")} />
        </div>
        <div className="field checkbox-field field-full">
          <input
            id="es_principal"
            type="checkbox"
            checked={datos.es_principal}
            onChange={cambiar("es_principal")}
          />
          <label htmlFor="es_principal">marcar como dirección principal</label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Agregando…" : "Agregar parada de entrega"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
