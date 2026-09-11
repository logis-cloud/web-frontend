import { useState } from "react";

const VACIO = {
  placa: "",
  tipo: "FURGONETA",
  capacidadKg: "",
  marca: "",
  modelo: "",
  anioFabricacion: "",
};

export default function VehiculoForm({ vehiculoInicial, onGuardar, onCancelar, guardando }) {
  const esEdicion = Boolean(vehiculoInicial);
  const [datos, setDatos] = useState(
    esEdicion
      ? {
          placa: vehiculoInicial.placa,
          tipo: vehiculoInicial.tipo,
          capacidadKg: vehiculoInicial.capacidadKg,
          marca: vehiculoInicial.marca || "",
          modelo: vehiculoInicial.modelo || "",
          anioFabricacion: vehiculoInicial.anioFabricacion || "",
        }
      : VACIO
  );

  const cambiar = (campo) => (e) =>
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    onGuardar({
      ...datos,
      capacidadKg: Number(datos.capacidadKg),
      anioFabricacion: datos.anioFabricacion ? Number(datos.anioFabricacion) : null,
    });
  };

  return (
    <form className="form" onSubmit={enviar}>
      <h2 className="form-title">
        {esEdicion ? "Editar vehículo" : "Registrar nuevo vehículo"}
      </h2>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="placa">placa</label>
          <input
            id="placa"
            required
            placeholder="ABC-123"
            value={datos.placa}
            onChange={cambiar("placa")}
          />
        </div>
        <div className="field">
          <label htmlFor="tipo">tipo</label>
          <select id="tipo" value={datos.tipo} onChange={cambiar("tipo")}>
            <option value="MOTO">moto</option>
            <option value="FURGONETA">furgoneta</option>
            <option value="CAMION">camión</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="capacidadKg">capacidad (kg)</label>
          <input
            id="capacidadKg"
            type="number"
            min="0.1"
            step="0.1"
            required
            value={datos.capacidadKg}
            onChange={cambiar("capacidadKg")}
          />
        </div>
        <div className="field">
          <label htmlFor="anioFabricacion">año de fabricación</label>
          <input
            id="anioFabricacion"
            type="number"
            min="1980"
            value={datos.anioFabricacion}
            onChange={cambiar("anioFabricacion")}
          />
        </div>
        <div className="field">
          <label htmlFor="marca">marca</label>
          <input id="marca" value={datos.marca} onChange={cambiar("marca")} />
        </div>
        <div className="field">
          <label htmlFor="modelo">modelo</label>
          <input id="modelo" value={datos.modelo} onChange={cambiar("modelo")} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Registrar vehículo"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

