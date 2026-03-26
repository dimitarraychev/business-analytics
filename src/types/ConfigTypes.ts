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

export type TimeRangeType = "day" | "fifteenMin";

export type AggregationMode = "period" | "cumulative";
