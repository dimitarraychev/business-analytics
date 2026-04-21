import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useReportContext } from "../../context/ReportContext";
import { shortFormatDate } from "../../utils/date";
import { getColor } from "../../utils/colors";
import CustomTooltip from "./CustomTooltip";
import { useHoverClickTooltip } from "../../hooks/useHoverClickTooltip";
import type { PeriodReport } from "../../types/ReportTypes";
import { useConfig } from "../../context/ConfigContext";

const CustomLineChart = () => {
  const { data, previousPeriods, selectedGroups } = useReportContext();
  const { tooltipTrigger, handleChartClick } = useHoverClickTooltip();
  const { timeRange } = useConfig();

  const chartData = useMemo(() => {
    return data.periods.map((bucket: PeriodReport, index: number) => {
      const row: Record<string, any> = {
        period: new Date(bucket.period),
        current: bucket.total ?? 0,
      };

      selectedGroups.forEach((qualifiedName) => {
        const [reportKey, ...nameParts] = qualifiedName.split("_");
        const actualGroupName = nameParts.join("_");

        let groupValue = 0;

        if (reportKey === data.key) {
          const item = bucket.items.find((i) => i.name === actualGroupName);
          groupValue = item ? item.value : 0;
        } else {
          const targetPrevReport = previousPeriods.find(
            (p) => p.key === reportKey,
          );
          const prevBucket = targetPrevReport?.periods[index];
          const item = prevBucket?.items.find(
            (i) => i.name === actualGroupName,
          );
          groupValue = item ? item.value : 0;
        }

        row[qualifiedName] = groupValue;
      });

      previousPeriods.forEach((prevReport) => {
        const prevBucket = prevReport.periods[index];
        if (prevBucket) {
          row[prevReport.key] = prevBucket.total ?? 0;
        }
      });

      return row;
    });
  }, [data, previousPeriods, selectedGroups]);

  return (
    <LineChart
      width="100%"
      height="97%"
      data={chartData}
      margin={{ bottom: 80, right: 30, top: 30 }}
      onClick={handleChartClick}
      responsive={true}
    >
      <CartesianGrid
        stroke="rgba(255,255,255,0.2)"
        vertical={false}
        strokeDasharray="5 5"
      />
      <XAxis
        dataKey="period"
        interval="preserveStartEnd"
        angle={-90}
        textAnchor="end"
        dy={5}
        dx={-5}
        tickFormatter={(time) => shortFormatDate(time, timeRange)}
        tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
      />
      <YAxis
        tickCount={12}
        tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
      />
      <Tooltip content={<CustomTooltip />} trigger={tooltipTrigger} />

      <Line
        type="monotone"
        dataKey="current"
        stroke="var(--orange)"
        strokeWidth={3}
        dot={timeRange === "day" ? false : true}
        filter="url(#glow)"
      />

      {selectedGroups.map((groupName) => (
        <Line
          key={groupName}
          type="monotone"
          dataKey={groupName}
          stroke={getColor(groupName)}
          strokeWidth={2}
          strokeDasharray="5 5"
          filter="url(#glow)"
          dot={timeRange === "day" ? false : true}
        />
      ))}

      {previousPeriods.map((prevReport) => (
        <Line
          key={prevReport.key}
          type="monotone"
          dataKey={prevReport.key}
          stroke={getColor(prevReport.key)}
          strokeWidth={2.5}
          dot={timeRange === "day" ? false : true}
          filter="url(#glow)"
        />
      ))}

      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </LineChart>
  );
};

export default CustomLineChart;
