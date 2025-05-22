export const formatYear = (year) => {
  if (!year) return "";
  return year.replace(/Year(\d)/, "Year $1");
};
