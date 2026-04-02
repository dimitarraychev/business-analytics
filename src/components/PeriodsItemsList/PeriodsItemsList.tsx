import "./PeriodItemsList.css";
import { useConfig } from "../../context/ConfigContext";
import { useReportContext } from "../../context/ReportContext";
import { metricLabels } from "../../utils/metricLabels";
import { useMemo } from "react";
import { generatePeriods } from "../../utils/date";
import type { TimeRangeType } from "../../types/ConfigTypes";
import PeriodItem from "../PeriodItem/PeriodItem";
import type { AccountingReport } from "../../types/ReportTypes";

const PeriodItemsList = () => {
  const { data, timePeriodStart, timePeriodEnd } = useReportContext();
  const { metric, timeRange } = useConfig();

  const periods: AccountingReport[] = useMemo(() => {
    if (!timePeriodStart || !timePeriodEnd) return [];
    return generatePeriods(
      new Date(timePeriodStart),
      timeRange as TimeRangeType,
      30,
    );
  }, [timePeriodStart, timePeriodEnd, timeRange]);

  return (
    <ul>
      <li className="items-list-header">
        <span>Period</span>
        <span>{metricLabels[metric]}</span>
      </li>

      <PeriodItem period={data} />

      {periods.map((period) => {
        return <PeriodItem period={period} key={period.key} />;
      })}
    </ul>
  );
};

export default PeriodItemsList;
