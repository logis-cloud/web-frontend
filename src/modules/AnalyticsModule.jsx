import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analyticsApi } from "../api/analyticsApi.js";
import StatCard from "../components/analytics/StatCard.jsx";
import DataTable from "../components/analytics/DataTable.jsx";
import QueryState from "../components/analytics/QueryState.jsx";
import {
  StackedBars,
  HorizontalBars,
  GroupedBars,
  Donut,
  ChartLegend,
} from "../components/analytics/Charts.jsx";
import {
  BarChart3Icon,
  PackageIcon,
  IdCardIcon,
  MapPinnedIcon,
} from "../components/ui/Icons.jsx";

const SECTIONS = [
  { id: "panel", label: "Panel" },
  { id: "territorio", label: "Territorio" },
  { id: "conductores", label: "Conductores" },
  { id: "operaciones", label: "Operaciones" },
];

function colorEstado(estado) {
  const key = String(estado || "").toUpperCase();
  if (key.includes("ENTREG")) return "#3FD8B4";
  if (key.includes("TRANSIT") || key.includes("RUTA") || key.includes("CAMINO")) return "#F5A93B";
  if (key.includes("CANCEL") || key.includes("FALL") || key.includes("DEVUEL")) return "#E15B5B";
  return "#7C88A6";
}

function n(value) {
  return Number(value) || 0;
}

function useConsulta(fetcher, enabled) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listoRef = useRef(false);

  const cargar = useCallback(async () => {
    if (!enabled || listoRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const filas = await fetcher();
      setData(Array.isArray(filas) ? filas : []);
      listoRef.current = true;
    } catch (err) {
      setError(
        `${err.message}. Verifica que ms-analytics esté en ${analyticsApi.baseUrl} (Swagger: /docs).`
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, fetcher]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { data, loading, error };
}

export default function AnalyticsModule() {
  const [seccion, setSeccion] = useState("panel");

  return (
    <div className="main analytics-main">
      <section className="panel analytics-panel">
        <div className="analytics-subs">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`btn ${seccion === item.id ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSeccion(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {seccion === "panel" && <PanelSection />}
        {seccion === "territorio" && <TerritorioSection />}
        {seccion === "conductores" && <ConductoresSection />}
        {seccion === "operaciones" && <OperacionesSection />}
      </section>
    </div>
  );
}

function PanelSection() {
  const envios = useConsulta(analyticsApi.enviosPorVehiculo, true);
  const ciudades = useConsulta(analyticsApi.reporteCiudadesDestino, true);
  const conductores = useConsulta(analyticsApi.rendimientoConductores, true);
  const clientes = useConsulta(analyticsApi.topClientesDemanda, true);

  const { stacked, estados, pie } = useMemo(() => {
    const filas = envios.data;
    const listaEstados = [...new Set(filas.map((fila) => fila.estado_envio).filter(Boolean))];
    const porTipo = {};

    for (const fila of filas) {
      const tipo = fila.tipo_vehiculo || "Sin tipo";
      if (!porTipo[tipo]) porTipo[tipo] = { tipo };
      porTipo[tipo][fila.estado_envio] = n(fila.total_envios);
    }

    const pieMap = {};
    for (const fila of filas) {
      const estado = fila.estado_envio || "SIN_ESTADO";
      pieMap[estado] = (pieMap[estado] || 0) + n(fila.total_envios);
    }

    return {
      stacked: Object.values(porTipo),
      estados: listaEstados,
      pie: Object.entries(pieMap).map(([status, value]) => ({ status, value })),
    };
  }, [envios.data]);

  const kpis = useMemo(() => {
    const totalEnvios = pie.reduce((acc, item) => acc + item.value, 0);
    const asignados = conductores.data.reduce((acc, fila) => acc + n(fila.total_envios_asignados), 0);
    const entregasConductor = conductores.data.reduce((acc, fila) => acc + n(fila.envios_entregados), 0);
    const tasa = asignados > 0 ? Math.round((entregasConductor / asignados) * 1000) / 10 : 0;

    return {
      totalEnvios,
      ciudades: ciudades.data.length,
      conductores: conductores.data.length,
      tasa,
    };
  }, [pie, ciudades.data, conductores.data]);

  const loading = envios.loading || ciudades.loading || conductores.loading || clientes.loading;
  const errorGlobal = [envios.error, ciudades.error, conductores.error, clientes.error].filter(Boolean);

  if (loading) {
    return <p className="manifest-loading">Consultando Athena…</p>;
  }

  return (
    <>
      {errorGlobal.length > 0 && <div className="error-banner">{errorGlobal[0]}</div>}

      <div className="stat-grid">
        <StatCard icon={PackageIcon} label="Envíos analizados" value={kpis.totalEnvios} accent="beacon" />
        <StatCard icon={MapPinnedIcon} label="Ciudades destino" value={kpis.ciudades} accent="route" />
        <StatCard icon={IdCardIcon} label="Conductores" value={kpis.conductores} accent="beacon" />
        <StatCard icon={BarChart3Icon} label="Tasa de entrega" value={kpis.tasa} suffix="%" accent="route" />
      </div>

      <div className="chart-grid">
        <article className="chart-card">
          <p className="chart-card-title">Envíos por tipo de vehículo</p>
          <p className="chart-card-copy">GET /analitica/envios-por-vehiculo · agrupado por estado</p>
          {stacked.length === 0 ? (
            <p className="data-table-empty">Sin datos de flota.</p>
          ) : (
            <>
              <StackedBars
                rows={stacked}
                categoryKey="tipo"
                seriesKeys={estados}
                colorFor={colorEstado}
              />
              <ChartLegend items={pie} colorFor={colorEstado} />
            </>
          )}
        </article>

        <article className="chart-card">
          <p className="chart-card-title">Distribución por estado</p>
          <p className="chart-card-copy">Misma consulta, vista operacional</p>
          {pie.length === 0 ? (
            <p className="data-table-empty">Sin estados para graficar.</p>
          ) : (
            <>
              <Donut slices={pie} colorFor={colorEstado} centerLabel="envíos" />
              <ChartLegend items={pie} colorFor={colorEstado} />
            </>
          )}
        </article>
      </div>

      <article className="chart-card">
        <p className="chart-card-title">Top clientes por demanda</p>
        <p className="chart-card-copy">GET /analitica/top-clientes-demanda · máximo 10</p>
        {clientes.data.length === 0 ? (
          <p className="data-table-empty">Sin ranking de clientes.</p>
        ) : (
          <HorizontalBars
            rows={clientes.data.map((fila) => ({
              cliente: fila.nombre_cliente,
              envios: n(fila.total_envios_realizados),
            }))}
            labelKey="cliente"
            valueKey="envios"
            color="#F5A93B"
          />
        )}
      </article>
    </>
  );
}

function TerritorioSection() {
  const ciudades = useConsulta(analyticsApi.reporteCiudadesDestino, true);
  const flujos = useConsulta(analyticsApi.flujoOrigenDestino, true);

  const barrasCiudad = useMemo(
    () =>
      ciudades.data.slice(0, 12).map((fila) => ({
        ciudad: fila.ciudad_destino,
        paquetes: n(fila.total_paquetes),
        clientes: n(fila.total_clientes),
      })),
    [ciudades.data]
  );

  const loading = ciudades.loading || flujos.loading;
  const error = ciudades.error || flujos.error;

  return (
    <QueryState loading={loading} error={error}>
      <article className="chart-card">
        <p className="chart-card-title">Paquetes y clientes por ciudad destino</p>
        <p className="chart-card-copy">GET /analitica/reporte-ciudades-destino</p>
        {barrasCiudad.length === 0 ? (
          <p className="data-table-empty">Sin ciudades.</p>
        ) : (
          <>
            <GroupedBars
              rows={barrasCiudad}
              categoryKey="ciudad"
              series={[
                { key: "paquetes", label: "Paquetes", color: "#F5A93B" },
                { key: "clientes", label: "Clientes", color: "#3FD8B4" },
              ]}
            />
            <ChartLegend
              items={[
                { status: "Paquetes", value: barrasCiudad.reduce((acc, row) => acc + row.paquetes, 0) },
                { status: "Clientes", value: barrasCiudad.reduce((acc, row) => acc + row.clientes, 0) },
              ]}
              colorFor={(label) => (label === "Paquetes" ? "#F5A93B" : "#3FD8B4")}
            />
          </>
        )}
      </article>

      <article className="chart-card">
        <p className="chart-card-title">Flujo origen → destino</p>
        <p className="chart-card-copy">GET /analitica/flujo-origen-destino</p>
        <DataTable
          rows={flujos.data}
          columns={[
            { key: "ciudad_origen", label: "Origen" },
            { key: "ciudad_destino", label: "Destino" },
            { key: "volumen_envios", label: "Volumen" },
          ]}
        />
      </article>
    </QueryState>
  );
}

function ConductoresSection() {
  const consulta = useConsulta(analyticsApi.rendimientoConductores, true);

  const ranking = useMemo(
    () =>
      consulta.data.map((fila) => {
        const asignados = n(fila.total_envios_asignados);
        const entregados = n(fila.envios_entregados);
        return {
          ...fila,
          conductor: [fila.nombre_conductor, fila.apellido_conductor].filter(Boolean).join(" "),
          asignados,
          entregados,
          tasa: asignados > 0 ? Math.round((entregados / asignados) * 100) : 0,
        };
      }),
    [consulta.data]
  );

  return (
    <QueryState loading={consulta.loading} error={consulta.error} empty={!consulta.loading && ranking.length === 0}>
      <article className="chart-card">
        <p className="chart-card-title">Rendimiento de conductores</p>
        <p className="chart-card-copy">GET /analitica/rendimiento-conductores</p>
        <StackedBars
          rows={ranking.slice(0, 12).map((fila) => ({
            conductor: fila.conductor,
            Entregados: fila.entregados,
            Pendientes: Math.max(fila.asignados - fila.entregados, 0),
          }))}
          categoryKey="conductor"
          seriesKeys={["Entregados", "Pendientes"]}
          colorFor={(key) => (key === "Entregados" ? "#3FD8B4" : "#7C88A6")}
        />
      </article>

      <article className="chart-card">
        <p className="chart-card-title">Detalle de flota asignada</p>
        <DataTable
          rows={ranking}
          columns={[
            { key: "conductor", label: "Conductor" },
            { key: "placa_vehiculo", label: "Placa" },
            { key: "tipo_vehiculo", label: "Tipo" },
            { key: "asignados", label: "Asignados" },
            { key: "entregados", label: "Entregados" },
            {
              key: "tasa",
              label: "Tasa",
              render: (row) => `${row.tasa}%`,
            },
          ]}
        />
      </article>
    </QueryState>
  );
}

function OperacionesSection() {
  const [vista, setVista] = useState("360");
  const operaciones = useConsulta(analyticsApi.reporte360Operaciones, vista === "360");
  const vistaEnvios = useConsulta(analyticsApi.vistaEnvios, vista === "envios");
  const vistaLogistica = useConsulta(analyticsApi.vistaReporteLogistica, vista === "logistica");

  const loading =
    vista === "360" ? operaciones.loading : vista === "envios" ? vistaEnvios.loading : vistaLogistica.loading;
  const error =
    vista === "360" ? operaciones.error : vista === "envios" ? vistaEnvios.error : vistaLogistica.error;
  const rows =
    vista === "360" ? operaciones.data : vista === "envios" ? vistaEnvios.data : vistaLogistica.data;

  return (
    <>
      <div className="analytics-subs analytics-subs-nested">
        <button type="button" className={`btn ${vista === "360" ? "btn-primary" : "btn-ghost"}`} onClick={() => setVista("360")}>
          Reporte 360
        </button>
        <button type="button" className={`btn ${vista === "envios" ? "btn-primary" : "btn-ghost"}`} onClick={() => setVista("envios")}>
          Vista envíos
        </button>
        <button type="button" className={`btn ${vista === "logistica" ? "btn-primary" : "btn-ghost"}`} onClick={() => setVista("logistica")}>
          Vista logística
        </button>
      </div>

      <article className="chart-card">
        <p className="chart-card-title">
          {vista === "360" && "Operaciones logísticas"}
          {vista === "envios" && "Vista analítica de envíos"}
          {vista === "logistica" && "Vista consolidada de logística"}
        </p>
        <p className="chart-card-copy">
          {vista === "360" && "GET /analitica/reporte-360-operaciones · límite 50"}
          {vista === "envios" && "GET /analitica/vista-envios · vista_analitica_envios"}
          {vista === "logistica" && "GET /analitica/vista-reporte-logistica · vista_reporte_logistica"}
        </p>
        <QueryState loading={loading} error={error}>
          {vista === "360" ? (
            <DataTable
              rows={rows}
              columns={[
                { key: "envio_id", label: "Envío" },
                { key: "cliente", label: "Cliente" },
                { key: "conductor", label: "Conductor" },
                { key: "vehiculo_placa", label: "Placa" },
                { key: "origen", label: "Origen" },
                { key: "destino", label: "Destino" },
                {
                  key: "estado_envio",
                  label: "Estado",
                  render: (row) => <span className="status-pill">{row.estado_envio}</span>,
                },
              ]}
            />
          ) : (
            <DataTable rows={rows} />
          )}
        </QueryState>
      </article>
    </>
  );
}
