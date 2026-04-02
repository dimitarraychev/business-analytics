export interface GroupTotals {
  [groupName: string]: number;
}

export interface PeriodItem {
  name: string;
  value: number;
}

export interface PeriodReport {
  period: string;
  total: number;
  items: PeriodItem[];
}

export interface AccountingReport {
  key: string;
  label: string;
  start: string;
  end: string;
  groupBy: "endpoint" | "platform";
  metric: "totalBet" | "totalWin" | "totalLost" | "numberOfGames";
  mode: "period" | "cumulative";
  total: number;
  groups: GroupTotals;
  periods: PeriodReport[];
}
