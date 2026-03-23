import { useState } from "react";
import "./App.css";
import SideMenu from "./components/SideMenu/SideMenu";
import TotalBetsLineChart from "./components/TotalBetsLineChart/TotalBetsLineChart";
import { useReportContext } from "./context/ReportContext";
import Loader from "./components/Loader/Loader";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { loading } = useReportContext();

  return (
    <div className="app">
      <div className="app-body">
        <SideMenu
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        {loading && (
          <div className="loader-overlay">
            <Loader size={20} />
          </div>
        )}
        <div
          className={
            isSidebarCollapsed ? "chart-wrapper expanded" : "chart-wrapper"
          }
        >
          <TotalBetsLineChart />
        </div>
      </div>
    </div>
  );
}

export default App;
