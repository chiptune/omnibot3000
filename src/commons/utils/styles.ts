export const getVariableFromCSS = (variable: string): string =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--${variable}`)
    .trim();

export const setVariableToCSS = (variable: string, value: string | null) => {
  document.documentElement.style.setProperty(
    `--${variable}`,
    value ? String(value).trim() : null,
  );
};
