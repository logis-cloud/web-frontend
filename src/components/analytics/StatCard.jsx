export default function StatCard({ icon: Icon, label, value, suffix = "", accent = "beacon" }) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <div className="stat-card-head">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <span className="stat-card-icon">
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="stat-card-value">
        {typeof value === "number" ? value.toLocaleString("es") : value ?? "—"}
        {suffix}
      </p>
    </article>
  );
}
