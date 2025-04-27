export const isSystemDarkModeOn = (): boolean => {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return darkModeQuery.matches;
};
