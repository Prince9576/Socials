const breakpoints = {
  zero: 0,
  mobile: 549,
  tab: 768,
  dekstop: 1080,
};

const isDekstop = useMediaQuery({
  query: `(min-width: ${breakpoints.dekstop}px) `,
});
const isTablet = useMediaQuery({
  query: `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tab}px)`,
});
const isMobile = useMediaQuery({
  query: `(min-width: ${breakpoints.zero}px) and (max-width: ${breakpoints.mobile}px)`,
});
const media = { isDekstop, isMobile, isTablet };
