import { useState } from "react";
import "./App.css";
import SideMenu from "./components/SideMenu/SideMenu";
import CustomLineChart from "./components/CustomLineChart/CustomLineChart";
import { useReportContext } from "./context/ReportContext";
import Loader from "./components/Loader/Loader";
import TabsMenu from "./components/TabsMenu/TabsMenu";
import { useTabs } from "./hooks/useTabs";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { loading } = useReportContext();
  const tabs = ["1h", "2h", "3h", "6h", "12h", "1d", "3d", "7d", "14d", "1m"];
  const { selectedTab, changeSelectedTab } = useTabs();

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
          <TabsMenu
            tabs={tabs}
            selectedTab={selectedTab}
            changeSelectedTab={changeSelectedTab}
          />
          <CustomLineChart />
        </div>
      </div>
    </div>
  );
}

export default App;
