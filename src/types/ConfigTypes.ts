export type MetricType =
  | "totalBet"
  | "totalLost"
  | "totalWin"
  | "numberOfGames";

export type GroupByType = "endpoint" | "platform";

export type TimeRangeType = "day" | "week" | "month";

export type AggregationMode = "period" | "cumulative";
