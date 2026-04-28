import { useState } from "react";
import "./PeriodItem.css";
import downArrow from "../../assets/down-arrow.svg";
import upArrow from "../../assets/up-arrow.svg";
import { useReportContext } from "../../context/ReportContext";
import type { AccountingReport } from "../../types/ReportTypes";
import { getColor } from "../../utils/colors";
import ItemsList from "../ItemsList/ItemsList";
import { useConfig } from "../../context/ConfigContext";
import { formatNumber } from "../../utils/number";

interface PeriodItemProps {
  period: AccountingReport;
  isNow?: boolean;
}

const PeriodItem = ({ period, isNow }: PeriodItemProps) => {
  const {
    data,
    selectedPeriods,
    setSelectedPeriods,
    loadingPeriods,
    previousPeriods,
    clearSelections,
  } = useReportContext();
  const { showPreciseValues } = useConfig();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCurrent = data.key === period.key;
  const isSelected = selectedPeriods.includes(period.key) || isCurrent;
  const isLoading = loadingPeriods.includes(period.key);
  const actualPeriod = isCurrent
    ? data
    : previousPeriods.find((p) => p.key === period.key);

  const toggleGroup = (period: AccountingReport) => {
    if (isCurrent) return;

    setSelectedPeriods((prev) => {
      const alreadySelected = prev.includes(period.key);

      if (alreadySelected) {
        return prev.filter((g) => g !== period.key);
      }

      return [...prev, period.key];
    });
  };

  return (
    <li className="period-item-wrapper">
      <div
        key={period.key}
        className={`period-item ${isSelected ? "active" : ""}`}
        onClick={() => (isNow ? clearSelections() : toggleGroup(period))}
        style={{
          color: isSelected ? getColor(period.key) : "var(--text-primary)",
        }}
        title={period.label}
      >
        <div className="period-item-header">
          <img
            src={isExpanded ? upArrow : downArrow}
            alt="Expand"
            className="expand-arrow"
            title="Expand"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
          />
          <p className="period-item-label">
            {isNow ? period.label + " (Now)" : period.label}
          </p>
          <p
            className="period-item-value"
            title={
              actualPeriod
                ? formatNumber(actualPeriod.total, !showPreciseValues)
                : "-"
            }
          >
            {isLoading
              ? "Loading..."
              : actualPeriod
                ? formatNumber(actualPeriod.total, showPreciseValues)
                : "-"}
          </p>
        </div>
      </div>

      {isExpanded && <ItemsList data={actualPeriod || period} />}
    </li>
  );
};

export default PeriodItem;
