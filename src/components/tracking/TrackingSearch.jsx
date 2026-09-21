import { useState } from "react";

function TrackingSearch({ onBuscar }) {
  const [codigo, setCodigo] = useState("");

  function manejarSubmit(e) {
    e.preventDefault();

    const codigoLimpio = codigo.trim();

    if (!codigoLimpio) {
      return;
    }

    onBuscar(codigoLimpio);
  }

  return (
    <form className="form" onSubmit={manejarSubmit}>
      <h2 className="form-title">Buscar envío</h2>

      <div className="field">
        <label htmlFor="codigoTracking">
          Código de seguimiento
        </label>

        <input
          id="codigoTracking"
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ejemplo: LOG-10E2FE6C"
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Buscar tracking
        </button>
      </div>
    </form>
  );
}

export default TrackingSearch;