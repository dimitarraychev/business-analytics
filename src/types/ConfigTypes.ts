export type MetricType =
  | "totalBet"
  | "totalLost"
  | "totalWin"
  | "totalWinJackpot"
  | "totalWinProgressiveJackpot"
  | "numberOfGames"
  | "numberOfBets"
  | "numberOfPlayers";

export type GroupByType = "platform" | "endpoint" | "period";

export type TimeRangeType = "day" | "week" | "month";

export type AggregationMode = "period" | "cumulative";
