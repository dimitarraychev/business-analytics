export const formatNumber = (number: number) => {
  if (number >= 10000) return number / 1000 + "k";
  if (number >= 1000000) return number / 1000000 + "m";
  return number.toString();
};
