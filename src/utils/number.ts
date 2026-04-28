export const formatNumber = (number: number, isPrecise: boolean) => {
  const eurSign = "€";

  if (isPrecise) return eurSign + number.toFixed(2);

  const output =
    eurSign +
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number);

  return output;
};
