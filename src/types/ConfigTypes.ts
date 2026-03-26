export type MetricType =
  | "totalBet"
  | "totalLost"
  | "totalWin"
  | "totalWinJackpot"
  | "totalWinProgressiveJackpot"
  | "numberOfGames"
  | "numberOfBets"
  | "numberOfPlayers";

export type GroupByType = "endpoint" | "platform";

export type TimeRangeType = "day" | "week" | "month";

export type AggregationMode = "period" | "cumulative";

export type ViewByType = "group" | "period";

