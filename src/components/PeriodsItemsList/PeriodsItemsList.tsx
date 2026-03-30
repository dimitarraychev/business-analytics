import { useConfig } from "../../context/ConfigContext";
import { useReportContext } from "../../context/ReportContext";
import { getColor } from "../../utils/colors";
import { metricLabels } from "../../utils/metricLabels";
import { useMemo, useEffect } from "react";
import { generatePeriods, type Period } from "../../utils/date";
import type { TimeRangeType } from "../../types/ConfigTypes";

const PeriodItemsList = () => {
  const {
    data,
    previousPeriods,
    loadingPeriods,
    getPreviousPeriod,
    selectedPeriods,
    setSelectedPeriods,
    timePeriodStart,
    timePeriodEnd,
  } = useReportContext();
  const { groupBy, metric, timeRange } = useConfig();

  const periods: Period[] = useMemo(() => {
    if (!timePeriodStart || !timePeriodEnd) return [];
    return generatePeriods(
      new Date(timePeriodStart),
      new Date(timePeriodEnd),
      timeRange as TimeRangeType,
      30,
    );
  }, [timePeriodStart, timePeriodEnd, timeRange]);

  const currentPeriodKey = periods[0]?.key;

  useEffect(() => {
    if (!currentPeriodKey) return;
    if (!selectedPeriods.includes(currentPeriodKey)) {
      setSelectedPeriods([currentPeriodKey]);
    }
  }, [currentPeriodKey, selectedPeriods, setSelectedPeriods]);

  const toggleGroup = (period: Period, index: number) => {
    const isCurrentPeriod = index === 0;

    setSelectedPeriods((prev) => {
      const alreadySelected = prev.includes(period.key);

      if (alreadySelected) {
        return prev.filter((g) => g !== period.key);
      }

      if (!isCurrentPeriod) {
        getPreviousPeriod(period.start, period.end, period.key);
      }

      return [...prev, period.key];
    });
  };

  return (
    <ul>
      <li className="items-list-header">
        <span>{groupBy}</span>
        <span>{metricLabels[metric]}</span>
      </li>

      {periods.map((period, index) => {
        const isCurrentPeriod = index === 0;
        const isSelected = selectedPeriods.includes(period.key);

        let value: number | null = null;
        if (isCurrentPeriod) {
          value = data.total;
        } else if (isSelected) {
          const report = previousPeriods[period.key];
          if (report) value = report.total;
        }

        const isLoading = loadingPeriods.includes(period.key);

        return (
          <li
            key={period.key}
            className={`items-list-item ${isSelected ? "active" : ""}`}
            onClick={() => toggleGroup(period, index)}
            style={{
              color: isCurrentPeriod
                ? "var(--orange)"
                : isSelected
                  ? getColor(period.key)
                  : "var(--text-primary)",
            }}
          >
            <span>{period.label}</span>
            <span>
              {isLoading
                ? "Loading..."
                : value !== null
                  ? value.toFixed(2)
                  : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default PeriodItemsList;
