import type {
  AggregationMode,
  GroupByType,
  MetricType,
  TimeRangeType,
} from "../types/ConfigTypes";
import type { AccountingReport } from "../types/ReportTypes";
import { getPeriodKey, getPeriodLabel } from "../utils/date";

export const fetchReport = async (
  start: string,
  end: string,
  timeRange: TimeRangeType,
  groupBy: GroupByType,
  metric: MetricType,
  aggregation: AggregationMode,
) => {
  const params = new URLSearchParams();

  if (start) params.append("start", start);
  if (end) params.append("end", end);

  params.append("groupBy", groupBy);
  params.append("metric", metric);
  params.append("mode", aggregation);

  const BASE_URL = "/api/accounting-report";
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`);

  const reportData: AccountingReport = await res.json();

  const startDate = new Date(reportData.start);
  reportData.key = getPeriodKey(startDate, timeRange);
  reportData.label = getPeriodLabel(startDate, timeRange);

  return reportData;
};
