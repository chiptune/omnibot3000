export const isSystemDarkModeOn = (): boolean => {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return darkModeQuery.matches;
};

export const isDev = (): boolean => import.meta.env.MODE === "development";
