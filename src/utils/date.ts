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
