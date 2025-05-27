import {getVariableFromCSS} from "@utils/strings";

export const getColorFromCSS = (variable: string): string =>
  getVariableFromCSS(`--color-${variable}`);
