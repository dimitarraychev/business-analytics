import "./TopMenu.css";

import { useReportContext } from "../../context/ReportContext";
import { formatDate } from "../../utils/date";
import { useConfig } from "../../context/ConfigContext";
import { metricLabels } from "../../utils/metricLabels";

const TopMenu = () => {
  const { timePeriodStart, timePeriodEnd } = useReportContext();

  const { timeRange, metric, groupBy, aggregation } = useConfig();

  const timeRangeInfo =
    timeRange === "day" ? "daily" : timeRange === "week" ? "weekly" : "monthly";

  return (
    <div className="top-menu">
      <div className="selection-info">
        <p className="timerange-info">{timeRangeInfo}</p>
        <p className="metric-info">{metricLabels[metric]}</p>
        <p className="info-label">grouped by</p>
        <p className="group-info">
          {groupBy[0].toUpperCase() + groupBy.slice(1)}
        </p>
        <p className="info-label">aggregation type:</p>
        <p className="aggregation-info">{aggregation}</p>
      </div>

      <div className="times-wrapper">
        <p>
          <span className="time-label">from:</span>{" "}
          <span>{formatDate(timePeriodStart)}</span>
        </p>
        <p>
          <span className="time-label">to:</span>{" "}
          <span>{formatDate(timePeriodEnd)}</span>
        </p>
      </div>
    </div>
  );
};

export default TopMenu;
