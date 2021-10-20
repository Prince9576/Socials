const breakpoints = {
  mobile: {
    minValue: 0,
    maxValue: 768,
  },
  tab: {
    minValue: 768,
    maxValue: 1080,
  },
  dekstop: {
    minValue: 1080,
    maxValue: 2440,
  },
};

const getQuery = function (device) {
  if (device === "mobile") {
    return `(min-width: ${breakpoints.mobile.minValue}px) and (max-width: ${breakpoints.mobile.maxValue}px)`;
  } else if (device === "tab") {
    return `(min-width: ${breakpoints.tab.minValue}px) and (max-width: ${breakpoints.tab.maxValue}px)`;
  } else if (device === "dekstop") {
    return `(min-width: ${breakpoints.dekstop.minValue}px) and (max-width: ${breakpoints.dekstop.maxValue}px)`;
  }
};
export default { getQuery, breakpoints };
