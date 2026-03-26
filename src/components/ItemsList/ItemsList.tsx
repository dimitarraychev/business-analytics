import { useReportContext } from "../../context/ReportContext";
// import { getColor } from "../../utils/colors";

const ItemsList = () => {
  const { data, selectedEndpoints, setSelectedEndpoints } = useReportContext();
  const endpointTotals = data.endpoints;

  const sortedEndpoints = Object.entries(endpointTotals)
    .map(([endpoint, info]) => ({
      endpoint,
      totalBet: info.totalBet,
      totalWin: info.totalWin,
    }))
    .sort((a, b) => b.totalBet - a.totalBet);

  const toggleEndpoint = (endpoint: string) => {
    setSelectedEndpoints((prev) =>
      prev.includes(endpoint)
        ? prev.filter((e) => e !== endpoint)
        : [...prev, endpoint],
    );
  };

  return (
    <ul>
      <li className="report-code-nav-header">
        <span>Endpoint</span>
        <span>Total Bet</span>
      </li>

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
  );
};

export default ItemsList;
