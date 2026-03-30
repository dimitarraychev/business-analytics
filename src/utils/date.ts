import type { TimeRangeType } from "../types/ConfigTypes";

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

  return `${day}.${month} ${hours}:${minutes}`;
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

export const getDefaultRange = () => {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  return {
    start: start.toISOString(),
    end: now.toISOString(),
  };
};

export interface Period {
  key: string;
  label: string;
  start: string;
  end: string;
}

export const generatePeriods = (
  currentStart: Date,
  currentEnd: Date,
  timeRange: TimeRangeType,
  count = 10,
): Period[] => {
  const periods: Period[] = [];
  let start = new Date(currentStart);
  let end = new Date(currentEnd);

  for (let i = 0; i < count; i++) {
    let label = "";
    let key = "";

    if (timeRange === "day") {
      label = start.toISOString().split("T")[0];
      key = label;

      end = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      start = new Date(end.getTime());
    } else if (timeRange === "week") {
      const firstDayOfYear = new Date(start.getFullYear(), 0, 1);

      const weekNumber = Math.ceil(
        ((start.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24) +
          firstDayOfYear.getDay() +
          1) /
          7,
      );

      label = `Week ${weekNumber} ${start.getFullYear()}`;
      key = `${start.getFullYear()}-W${weekNumber}`;

      start = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "month") {
      label = `${start.toLocaleString("default", { month: "short" })} ${start.getFullYear()}`;
      key = `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, "0")}`;

      start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    } else {
      label = start.toISOString().split("T")[0];
      key = label;
      end = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      start = new Date(end.getTime());
    }

    periods.push({
  key,
  label,
  start: start.toISOString(),
  end: end.toISOString(),
});
  }

  return periods;
};
