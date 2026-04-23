// import { useReportContext } from "../../context/ReportContext";
import { useReportContext } from "../../context/ReportContext";
import { formatDate } from "../../utils/date";
import "./CustomTooltip.css";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const { data, previousPeriods } = useReportContext();

  if (active && payload && payload.length && label) {
    // const periodReport = data.periods.find(
    //   (r) => new Date(r.period).getTime() === new Date(label).getTime(),
    // );

    return (
      <div className="custom-tooltip">
        <p>
          <span className="time-label">Time: </span>
          {formatDate(label)}
        </p>
        {payload.map((p) => {
          const isCurrentPeriod = p.dataKey === "current";
          const foundPeriod = previousPeriods.find(
            (period) => period.key === p.dataKey,
          );
          console.log(p.dataKey);

          return (
            <p
              key={p.dataKey}
              className="payload-value"
              style={{ color: p.stroke }}
            >
              {isCurrentPeriod ? data.label : foundPeriod?.label || p.dataKey}:{" "}
              {p.value.toFixed(2) + " €"}
            </p>
          );
        })}

        {/* {selectedGroups.length === 1 && periodReport && (
          <div className="groups-wrapper">
            {periodReport.items
              .filter((item) => item.name === selectedGroups[0])
              .map((item) => (
                <p key={item.name}>
                  <span className="group-name">{item.name}:</span>
                  <span className="group-value">{item.value.toFixed(2)}</span>
                </p>
              ))}
          </div>
        )} */}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
