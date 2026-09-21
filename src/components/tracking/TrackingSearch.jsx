import { useState } from "react";
import { SearchIcon } from "../ui/Icons.jsx";

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
    <form className="form tracking-search-form" onSubmit={manejarSubmit}>
      <h2 className="form-title">Buscar envío</h2>

      <div className="field">
        <label htmlFor="codigoTracking">
          Código de seguimiento
        </label>

        <div className="search-wrap">
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            id="codigoTracking"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ejemplo: LOG-10E2FE6C"
            className="search-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Rastrear envío
        </button>
      </div>
    </form>
  );
}

export default TrackingSearch;