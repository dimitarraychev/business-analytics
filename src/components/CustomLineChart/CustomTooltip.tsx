import { useConfig } from "../../context/ConfigContext";
import { useReportContext } from "../../context/ReportContext";
import { formatDate, getLabelFromKey } from "../../utils/date";
import { metricLabels } from "../../utils/metricLabels";
import { formatNumber } from "../../utils/number";
import "./CustomTooltip.css";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const { data, previousPeriods } = useReportContext();
  const { metric, showPreciseValues } = useConfig();

  if (active && payload && payload.length && label) {
    return (
      <div className="custom-tooltip">
        <p>
          <span className="tooltip-label">Time: </span>
          {formatDate(label)}
        </p>
        <p>
          <span className="tooltip-label">Metric: </span>
          {metricLabels[metric]}
        </p>
        {payload.map((p) => {
          const isCurrentPeriod = p.dataKey === "current";
          const foundPeriod = previousPeriods.find(
            (period) => period.key === p.dataKey,
          );

          const periodKey = p.dataKey.split("_")[0];
          const groupKey = p.dataKey.split("_")[1];

          return (
            <p
              key={p.dataKey}
              className="payload-value"
              style={{ color: p.stroke }}
            >
              {isCurrentPeriod
                ? data.label
                : foundPeriod?.label ||
                  getLabelFromKey(periodKey, "day") + " " + groupKey}
              : {formatNumber(p.value, showPreciseValues)}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
