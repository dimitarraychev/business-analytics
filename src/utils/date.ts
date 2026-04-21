import type { TimeRangeType } from "../types/ConfigTypes";
import type { AccountingReport } from "../types/ReportTypes";

export const formatDate = (isoString: string) => {
  const d = new Date(isoString);

  const year = String(d.getFullYear()).slice(-2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

export const shortFormatDate = (isoString: string) => {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  if (
    (hours === "00" && minutes === "00") ||
    (hours === "23" && minutes === "55")
  )
    return `${day}.${month} ${hours}:${minutes}`;

  return `${hours}:${minutes}`;
};

export const parsePeriodToHours = (period: string): number => {
  const value = parseInt(period);
  const unit = period.slice(-1);

  switch (unit) {
    case "h":
      return value;

    case "d":
      return value * 24;

    case "m":
      return value * 30 * 24;

    default:
      return 6;
  }
};

export const getDefaultRange = (timeRange: TimeRangeType = "week") => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (timeRange === "day") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (timeRange === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (timeRange === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(now.getMonth() + 1);
    end.setDate(0); 
    end.setHours(23, 59, 59, 999);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export const generatePeriods = (
  currentStart: Date,
  timeRange: TimeRangeType,
  count = 10,
): AccountingReport[] => {
  const periods: AccountingReport[] = [];

  let start = new Date(currentStart);

  for (let i = 0; i < count; i++) {
    let periodStart: Date;
    let periodEnd: Date;

    if (timeRange === "day") {
      periodStart = new Date(start);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(start);
      periodEnd.setHours(23, 59, 59, 999);
      // move start back one day for next iteration
      start.setDate(start.getDate() - 1);
    } else if (timeRange === "week") {
      // set start to beginning of week (Monday)
      const day = start.getDay(); // Sunday=0, Monday=1...
      const diffToMonday = day === 0 ? 6 : day - 1;
      periodStart = new Date(start);
      periodStart.setDate(start.getDate() - diffToMonday);
      periodStart.setHours(0, 0, 0, 0);

      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 6);
      periodEnd.setHours(23, 59, 59, 999);

      // move start back one week
      start.setDate(periodStart.getDate() - 1);
    } else if (timeRange === "month") {
      periodStart = new Date(
        start.getFullYear(),
        start.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      periodEnd = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      // move start back one month
      start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
    } else {
      periodStart = new Date(start);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(start);
      periodEnd.setHours(23, 59, 59, 999);
      start.setDate(start.getDate() - 1);
    }

    periods.push({
      key: getPeriodKey(periodStart, timeRange),
      label: getPeriodLabel(periodStart, timeRange),
      start: periodStart.toISOString(),
      end: periodEnd.toISOString(),
      groupBy: "platform",
      metric: "totalWin",
      mode: "period",
      total: 0,
      groups: {},
      periods: [],
    });
  }

  return periods.slice(1);
};

export const getPeriodKey = (start: Date, timeRange: TimeRangeType): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const bgStart = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  if (timeRange === "day") {
    const day = pad(bgStart.getDate());
    const month = pad(bgStart.getMonth() + 1);
    const year = bgStart.getFullYear();
    return `${year}-${month}-${day}`;
  }

  if (timeRange === "week") {
    const weekStart = new Date(bgStart);
    // const weekEnd = new Date(bgStart.getTime() + 6 * 24 * 60 * 60 * 1000);

    const wsDay = pad(weekStart.getDate());
    const wsMonth = pad(weekStart.getMonth() + 1);

    return `${weekStart.getFullYear()}-${wsMonth}-${wsDay}`;
  }

  if (timeRange === "month") {
    const month = pad(bgStart.getMonth() + 1);
    return `${bgStart.getFullYear()}-${month}`;
  }

  return bgStart.toISOString().split("T")[0];
};

export const getPeriodLabel = (
  start: Date,
  timeRange: TimeRangeType,
): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const shortYear = (d: Date) => d.getFullYear().toString().slice(-2);

  if (timeRange === "day") {
    const day = pad(start.getDate());
    const month = start.toLocaleString("default", { month: "long" });
    return `${day} ${month} ${shortYear(start)}`;
  }

  if (timeRange === "week") {
    const weekStart = new Date(start);
    const weekEnd = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);

    const startDay = pad(weekStart.getDate());
    const startMonth = weekStart.toLocaleString("default", { month: "short" });

    const endDay = pad(weekEnd.getDate());
    const endMonth = weekEnd.toLocaleString("default", { month: "short" });

    const year = shortYear(weekEnd);
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }

  if (timeRange === "month") {
    const month = start.toLocaleString("default", { month: "long" });
    return `${month} ${shortYear(start)}`;
  }

  return start.toISOString();
};
