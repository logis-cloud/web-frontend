export default function QueryState({ loading, error, empty, children }) {
  if (loading) {
    return <p className="manifest-loading">Consultando Athena…</p>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (empty) {
    return <p className="data-table-empty">Athena no devolvió filas para esta consulta.</p>;
  }

  return children;
}
