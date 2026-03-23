import "./SideMenu.css";
import logo from "../../assets/logo.svg";
import menuLogo from "../../assets/menu.svg";
import { useReportContext } from "../../context/ReportContext";
// import { getColor } from "../../utils/colors";

interface SideMenuProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

const SideMenu = ({ isCollapsed, onCollapseToggle }: SideMenuProps) => {
  const { data, selectedEndpoints, setSelectedEndpoints } = useReportContext();

  // Get endpoint totals
  const endpointTotals = data.endpoints;

  const sortedEndpoints = Object.entries(endpointTotals)
    .map(([endpoint, info]) => ({
      endpoint,
      totalBet: info.totalBet,
      totalWin: info.totalWin,
    }))
    .sort((a, b) => b.totalBet - a.totalBet); // Sort by totalBet (or totalWin if you prefer)

  const toggleEndpoint = (endpoint: string) => {
    setSelectedEndpoints((prev) =>
      prev.includes(endpoint)
        ? prev.filter((e) => e !== endpoint)
        : [...prev, endpoint],
    );
  };

  return (
    <div className={`side-menu ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="logo-text">Accounting Inspector</h1>
        <img
          src={menuLogo}
          alt="Menu"
          className="collapse-toggle"
          onClick={onCollapseToggle}
        />
      </div>

      <ul>
        <li className="report-code-nav-header">
          <span>Endpoint</span>
          <span>Total Bet</span>
        </li>

        {/* "All" button */}
        <li
          className={`report-code-nav ${selectedEndpoints.length === 0 ? "active" : ""}`}
          onClick={() => setSelectedEndpoints([])}
        >
          {/* <span
            className="code-color"
            style={{ backgroundColor: "var(--orange)" }}
          /> */}
          <span>All</span>
          <span>{data.totalBet.toFixed(2)}</span>
        </li>

        {sortedEndpoints.map((report) => (
          <li
            key={report.endpoint}
            className={`report-code-nav ${
              selectedEndpoints.includes(report.endpoint) ? "active" : ""
            }`}
            onClick={() => toggleEndpoint(report.endpoint)}
          >
            {/* <span
              className="code-color"
              style={{
                backgroundColor: getColor(report.endpoint),
                visibility: selectedEndpoints.includes(report.endpoint) ? "visible" : "hidden",
              }}
            /> */}
            <span>{report.endpoint}</span>
            <span>{report.totalBet.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
