import { useState } from "react";
import ClientesModule from "./modules/ClientesModule.jsx";
import VehiculosModule from "./modules/VehiculosModule.jsx";
import "./styles/global.css";
import "./styles/app.css";

const TABS = [
  { id: "clientes", label: "Clientes", title: "Manifiesto de Clientes", mark: "MS CLIENTES · PYTHON/MYSQL" },
  { id: "vehiculos", label: "Vehículos", title: "Flota de Vehículos", mark: "MS VEHÍCULOS · JAVA/POSTGRESQL" },
];

export default function App() {
  const [tabId, setTabId] = useState("clientes");
  const tab = TABS.find((t) => t.id === tabId);

  return (
    <div className="shell">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">LOGÍSTICA · {tab.mark}</span>
          <h1 className="brand-title">{tab.title}</h1>
        </div>

        <nav className="tabbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${t.id === tabId ? "is-active" : ""}`}
              onClick={() => setTabId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {tabId === "clientes" ? <ClientesModule /> : <VehiculosModule />}
    </div>
  );
}

