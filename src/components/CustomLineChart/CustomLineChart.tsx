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
import { useMemo } from "react";
import { getColor } from "../../utils/colors";
import CustomTooltip from "./CustomTooltip";
import { useHoverClickTooltip } from "../../hooks/useHoverClickTooltip";
import { useConfig } from "../../context/ConfigContext";
import type { PeriodReport } from "../../types/ReportTypes";

const CustomLineChart = () => {
  const { data, selectedGroups } = useReportContext();
  const { metric } = useConfig();
  const { tooltipTrigger, handleChartClick } = useHoverClickTooltip();

  const groupColors = useMemo(() => {
    const map: Record<string, string> = {};
    selectedGroups.forEach((group) => {
      map[group] = getColor(group);
    });
    return map;
  }, [selectedGroups]);

  const chartData = useMemo(() => {
    return data.periods.map((bucket: PeriodReport) => {
      const groupValues: Record<string, number> = {};

      bucket.items.forEach((item) => {
        if (selectedGroups.length === 0 || selectedGroups.includes(item.name)) {
          groupValues[item.name] = item.value ?? 0;
        }
      });

      return {
        period: new Date(bucket.period),
        total: bucket.total ?? 0,
        ...groupValues,
      };
    });
  }, [data.periods, selectedGroups, metric]);

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
        tickFormatter={(time) => shortFormatDate(time)}
        tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
      />
      <YAxis
        tickCount={12}
        tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
      />
      <Tooltip content={<CustomTooltip />} trigger={tooltipTrigger} />

      <Line
        type="monotone"
        dataKey="total"
        stroke="var(--orange)"
        strokeWidth={2.5}
        dot={false}
        filter="url(#glow)"
      />

      {selectedGroups.map((group) => (
        <Line
          key={group}
          type="monotone"
          dataKey={group}
          stroke={groupColors[group]}
          strokeWidth={2.5}
          dot={false}
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
