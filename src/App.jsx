import { useState } from "react";
import {
  NavigationIcon,
  UsersIcon,
  TruckIcon,
  PackageSearchIcon,
  MapPinnedIcon,
  BarChart3Icon,
} from "./components/ui/Icons.jsx";
import ClientesModule from "./modules/ClientesModule.jsx";
import VehiculosModule from "./modules/VehiculosModule.jsx";
import EnviosModule from "./modules/EnviosModule.jsx";
import TrackingModule from "./modules/TrackingModule.jsx";
import AnalyticsModule from "./modules/AnalyticsModule.jsx";
import "./styles/global.css";
import "./styles/app.css";

const TABS = [
  { id: "clientes", label: "Clientes", title: "Clientes", mark: "MS CLIENTES · PYTHON/MYSQL", icon: UsersIcon },
  { id: "vehiculos", label: "Vehículos", title: "Vehículos", mark: "MS VEHÍCULOS · JAVA/POSTGRESQL", icon: TruckIcon },
  { id: "envios", label: "Envíos", title: "Envíos", mark: "MS ENVIOS · NODE.JS-MONGODB", icon: PackageSearchIcon },
  { id: "tracking", label: "Seguimiento", title: "Seguimiento de envíos", mark: "MS TRACKING · PYTHON", icon: MapPinnedIcon },
  { id: "analytics", label: "Analítica", title: "Analítica operativa", mark: "MS ANALYTICS · FASTAPI/ATHENA", icon: BarChart3Icon },
];

export default function App() {
  const [tabId, setTabId] = useState("clientes");
  const tab = TABS.find((t) => t.id === tabId);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">
            <NavigationIcon size={16} strokeWidth={2.5} />
          </span>
          <div>
            <p className="sidebar-name">Nortia</p>
            <p className="sidebar-kicker">LOGISTICS OPS</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`nav-btn ${t.id === tabId ? "is-active" : ""}`}
                onClick={() => setTabId(t.id)}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-status">
          <p>Estado de microservicios</p>
          <div className="sidebar-status-row">
            <span className="status-dot" />
            {tab.mark}
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <h1 className="topbar-title">{tab.title}</h1>
          <span className="brand-mark">{tab.mark}</span>
        </header>

        <div className="mobile-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`btn ${t.id === tabId ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTabId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="workspace-body">
          {tabId === "clientes" && <ClientesModule />}
          {tabId === "vehiculos" && <VehiculosModule />}
          {tabId === "envios" && <EnviosModule />}
          {tabId === "tracking" && <TrackingModule />}
          {tabId === "analytics" && <AnalyticsModule />}
        </div>
      </div>
    </div>
  );
}
