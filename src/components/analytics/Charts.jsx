function n(value) {
  return Number(value) || 0;
}

export function StackedBars({ rows, categoryKey, seriesKeys, colorFor, unit = "" }) {
  const max = Math.max(
    1,
    ...rows.map((row) => seriesKeys.reduce((acc, key) => acc + n(row[key]), 0))
  );

  return (
    <div className="hbar-list">
      {rows.map((row, index) => {
        const total = seriesKeys.reduce((acc, key) => acc + n(row[key]), 0);
        return (
          <div key={`${row[categoryKey]}-${index}`} className="hbar-row">
            <span className="hbar-label" title={row[categoryKey]}>
              {row[categoryKey]}
            </span>
            <div className="hbar-track" role="img" aria-label={`${row[categoryKey]}: ${total}`}>
              {seriesKeys.map((key) => {
                const value = n(row[key]);
                if (!value) return null;
                return (
                  <div
                    key={key}
                    className="hbar-seg"
                    title={`${key}: ${value}`}
                    style={{
                      width: `${(value / max) * 100}%`,
                      background: colorFor(key),
                    }}
                  />
                );
              })}
            </div>
            <span className="hbar-value">
              {total.toLocaleString("es")}
              {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBars({ rows, labelKey, valueKey, color = "#F5A93B" }) {
  const max = Math.max(1, ...rows.map((row) => n(row[valueKey])));

  return (
    <div className="hbar-list">
      {rows.map((row, index) => {
        const value = n(row[valueKey]);
        return (
          <div key={`${row[labelKey]}-${index}`} className="hbar-row">
            <span className="hbar-label" title={row[labelKey]}>
              {row[labelKey]}
            </span>
            <div className="hbar-track">
              <div
                className="hbar-seg hbar-seg-round"
                style={{ width: `${(value / max) * 100}%`, background: color }}
              />
            </div>
            <span className="hbar-value">{value.toLocaleString("es")}</span>
          </div>
        );
      })}
    </div>
  );
}

export function GroupedBars({ rows, categoryKey, series }) {
  const max = Math.max(
    1,
    ...rows.flatMap((row) => series.map((item) => n(row[item.key])))
  );

  return (
    <div className="vbar-chart">
      {rows.map((row) => (
        <div key={row[categoryKey]} className="vbar-group">
          <div className="vbar-cols">
            {series.map((item) => {
              const value = n(row[item.key]);
              return (
                <div key={item.key} className="vbar-col" title={`${item.label}: ${value}`}>
                  <span
                    className="vbar-fill"
                    style={{
                      height: `${(value / max) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <span className="vbar-label">{row[categoryKey]}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ slices, colorFor, centerLabel = "Total" }) {
  const total = slices.reduce((acc, item) => acc + n(item.value), 0) || 1;
  let cursor = 0;
  const stops = slices
    .map((item) => {
      const start = cursor;
      cursor += (n(item.value) / total) * 100;
      const color = colorFor(item.status);
      return `${color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="donut-wrap">
      <div className="donut" style={{ background: `conic-gradient(${stops})` }}>
        <div className="donut-hole">
          <strong>{total.toLocaleString("es")}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function ChartLegend({ items, colorFor, valueKey = "value", labelKey = "status" }) {
  return (
    <div className="chart-legend">
      {items.map((item) => (
        <div key={item[labelKey]} className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: colorFor(item[labelKey]) }} />
          {item[labelKey]}
          <span>{n(item[valueKey]).toLocaleString("es")}</span>
        </div>
      ))}
    </div>
  );
}
