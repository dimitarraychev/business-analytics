import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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
    return data.periods.map((bucket: PeriodReport) => {
      // Use the period string as the unique identifier for matching
      const currentTimestamp = bucket.period;

      const row: Record<string, any> = {
        period: new Date(currentTimestamp),
        current: bucket.total ?? 0,
      };

      // 1. Handle Selected Specific Groups (e.g., specific endpoints/platforms)
      selectedGroups.forEach((qualifiedName) => {
        const [reportKey, ...nameParts] = qualifiedName.split("_");
        const actualGroupName = nameParts.join("_");

        let groupValue = 0;

        if (reportKey === data.key) {
          // Current period group
          const item = bucket.items.find((i) => i.name === actualGroupName);
          groupValue = item ? item.value : 0;
        } else {
          // Comparison period group - Find by timestamp instead of index
          const targetPrevReport = previousPeriods.find(
            (p) => p.key === reportKey,
          );
          const prevBucket = targetPrevReport?.periods.find(
            (p) => p.period === currentTimestamp,
          );
          const item = prevBucket?.items.find(
            (i) => i.name === actualGroupName,
          );
          groupValue = item ? item.value : 0;
        }

        row[qualifiedName] = groupValue;
      });

      // 2. Handle Comparison Period Totals (the full lines for comparison)
      previousPeriods.forEach((prevReport) => {
        // Match comparison period bucket to the current bucket's timestamp
        const prevBucket = prevReport.periods.find(
          (p) => p.period === currentTimestamp,
        );
        if (prevBucket) {
          row[prevReport.key] = prevBucket.total ?? 0;
        } else {
          row[prevReport.key] = 0; // Fallback for missing data points
        }
      });

      return row;
    });
  }, [data, previousPeriods, selectedGroups]);

  return (
    <ResponsiveContainer width="100%" height="97%">
      <LineChart
        data={chartData}
        margin={{ bottom: 80, right: 30, top: 30 }}
        onClick={handleChartClick}
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

        {/* Main Current Period Line */}
        <Line
          type="monotone"
          dataKey="current"
          stroke="var(--orange)"
          strokeWidth={3}
          dot={timeRange !== "day"}
          filter="url(#glow)"
          isAnimationActive={false}
        />

        {/* Specific Group Lines (Dashed) */}
        {selectedGroups.map((groupName) => (
          <Line
            key={groupName}
            type="monotone"
            dataKey={groupName}
            stroke={getColor(groupName)}
            strokeWidth={2}
            strokeDasharray="5 5"
            filter="url(#glow)"
            dot={timeRange !== "day"}
            isAnimationActive={false}
          />
        ))}

        {/* Full Comparison Period Lines */}
        {previousPeriods.map((prevReport) => (
          <Line
            key={prevReport.key}
            type="monotone"
            dataKey={prevReport.key}
            stroke={getColor(prevReport.key)}
            strokeWidth={2.5}
            dot={timeRange !== "day"}
            filter="url(#glow)"
            isAnimationActive={false}
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
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
