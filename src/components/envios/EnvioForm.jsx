import { useState } from "react";

const ITEM_VACIO = {
  sku: "",
  descripcion: "",
  cantidad: 1,
  pesoKg: "",
};

export default function EnvioForm({
  onGuardar,
  onCancelar,
  guardando,
}) {
  const [clienteId, setClienteId] = useState("");
  const [pedidoId, setPedidoId] = useState("");

  const [items, setItems] = useState([
    { ...ITEM_VACIO },
  ]);

  const cambiarItem = (indice, campo, valor) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === indice
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    );
  };

  const agregarItem = () => {
    setItems((prev) => [
      ...prev,
      { ...ITEM_VACIO },
    ]);
  };

  const eliminarItem = (indice) => {
    setItems((prev) =>
      prev.filter((_, i) => i !== indice)
    );
  };

  const enviar = (e) => {
    e.preventDefault();

    const datos = {
      clienteId: Number(clienteId),
      pedidoId,
      items: items.map((item) => ({
        sku: item.sku,
        descripcion: item.descripcion,
        cantidad: Number(item.cantidad),
        pesoKg: Number(item.pesoKg),
      })),
    };

    onGuardar(datos);
  };

  return (
    <form
      className="form"
      onSubmit={enviar}
    >
      <h2 className="form-title">
        Registrar nuevo envío
      </h2>

      <div className="form-grid">

        <div className="field">
          <label htmlFor="clienteId">
            ID del cliente
          </label>

          <input
            id="clienteId"
            type="number"
            min="1"
            required
            value={clienteId}
            onChange={(e) =>
              setClienteId(e.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="pedidoId">
            Código del pedido
          </label>

          <input
            id="pedidoId"
            type="text"
            required
            placeholder="PED-1001"
            value={pedidoId}
            onChange={(e) =>
              setPedidoId(e.target.value)
            }
          />
        </div>

      </div>

      <div className="stops">

        <h3 className="stops-title">
          Items del envío
        </h3>

        {items.map((item, indice) => (
          <div
            key={indice}
            className="sub-form"
            style={{ marginBottom: 16 }}
          >

            <div className="form-grid">

              <div className="field">
                <label>
                  SKU
                </label>

                <input
                  required
                  value={item.sku}
                  onChange={(e) =>
                    cambiarItem(
                      indice,
                      "sku",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  Descripción
                </label>

                <input
                  required
                  value={item.descripcion}
                  onChange={(e) =>
                    cambiarItem(
                      indice,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  Cantidad
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={item.cantidad}
                  onChange={(e) =>
                    cambiarItem(
                      indice,
                      "cantidad",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  Peso (kg)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={item.pesoKg}
                  onChange={(e) =>
                    cambiarItem(
                      indice,
                      "pesoKg",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  eliminarItem(indice)
                }
              >
                Quitar item
              </button>
            )}

          </div>
        ))}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={agregarItem}
        >
          + Agregar item
        </button>

      </div>

      <div className="form-actions">

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando}
        >
          {guardando
            ? "Registrando..."
            : "Registrar envío"}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancelar}
        >
          Cancelar
        </button>

      </div>

    </form>
  );
}