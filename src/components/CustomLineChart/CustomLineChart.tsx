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
  const { data, selectedGroups, previousPeriods, selectedPeriods } =
    useReportContext();
  const { metric, groupBy } = useConfig();
  const { tooltipTrigger, handleChartClick } = useHoverClickTooltip();

  const groupColors = useMemo(() => {
    const map: Record<string, string> = {};
    selectedGroups.forEach((group) => {
      map[group] = getColor(group);
    });
    return map;
  }, [selectedGroups]);

  const chartData = useMemo(() => {
    if (groupBy !== "period") {
      return data.periods.map((bucket: PeriodReport) => {
        const groupValues: Record<string, number> = {};

        bucket.items.forEach((item) => {
          if (
            selectedGroups.length === 0 ||
            selectedGroups.includes(item.name)
          ) {
            groupValues[item.name] = item.value ?? 0;
          }
        });

        return {
          period: new Date(bucket.period),
          total: bucket.total ?? 0,
          ...groupValues,
        };
      });
    }

    return data.periods.map((bucket: PeriodReport, index: number) => {
      const row: Record<string, any> = {
        period: new Date(bucket.period),
        current: bucket.total ?? 0,
      };

      selectedPeriods.forEach((periodKey: any) => {
        const prevReport = previousPeriods[periodKey];
        const prevBucket = prevReport?.periods[index];

        if (prevBucket) {
          row[periodKey] = prevBucket.total ?? 0;
        }
      });

      return row;
    });
  }, [
    data.periods,
    selectedGroups,
    previousPeriods,
    selectedPeriods,
    groupBy,
    metric,
  ]);

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

      {groupBy !== "period" && (
        <>
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
        </>
      )}

      {groupBy === "period" && (
        <>
          <Line
            type="monotone"
            dataKey="current"
            stroke="var(--orange)"
            strokeWidth={3}
            dot={false}
            filter="url(#glow)"
          />

          {selectedPeriods.map((periodKey) => (
            <Line
              key={periodKey}
              type="monotone"
              dataKey={periodKey}
              stroke={getColor(periodKey)}
              strokeWidth={2.5}
              dot={false}
              filter="url(#glow)"
            />
          ))}
        </>
      )}

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
