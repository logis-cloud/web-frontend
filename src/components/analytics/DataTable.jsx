function etiquetaColumna(key) {
  return String(key)
    .replace(/[._]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export default function DataTable({ columns, rows, empty = "No hay registros para esta consulta." }) {
  const resolvedColumns =
    columns ||
    Object.keys(rows[0] || {}).map((key) => ({
      key,
      label: etiquetaColumna(key),
    }));

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {resolvedColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.envio_id || row.email_cliente || row.placa_vehiculo || index}>
              {resolvedColumns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : formatCell(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="data-table-empty">{empty}</p>}
    </div>
  );
}

function formatCell(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString("es");
  return String(value);
}
