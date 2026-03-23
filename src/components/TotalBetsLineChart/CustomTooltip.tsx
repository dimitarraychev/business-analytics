import { useReportContext } from "../../context/ReportContext";
import { formatDate } from "../../utils/date";
import "./CustomTooltip.css";

const CustomTooltip = ({ active, payload, label }: any) => {
  const { selectedEndpoints, data } = useReportContext();

  if (active && payload && payload.length) {
    // Find the period report that matches the hovered label
    const periodReport = data.periods.find(
      (r) => new Date(r.period).getTime() === new Date(label).getTime(),
    );

    return (
      <div className="custom-tooltip">
        <p>
          <span className="time-label">Time: </span>
          {formatDate(label)}
        </p>

        {/* Display totalBet for chart lines */}
        {payload.map((p: any) => (
          <p
            key={p.dataKey}
            className="payload-value"
            style={{ color: p.stroke }}
          >
            {p.dataKey}: {p.value}
          </p>
        ))}

        {/* If a single endpoint is selected, show its sub-endpoints or details if needed */}
        {selectedEndpoints.length === 1 && periodReport && (
          <div className="endpoints-wrapper">
            <div className="endpoints-list">
              {periodReport.endpoints
                .filter((ep) => ep.endpoint === selectedEndpoints[0])
                .map((ep) => (
                  <p key={ep.endpoint}>
                    <span className="endpoint-name">{ep.endpoint}:</span>
                    <span className="endpoint-count">{ep.totalBet}</span>
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
