import {getVariableFromCSS} from "@utils/styles";

export const getColorFromCSS = (variable: string): string =>
  getVariableFromCSS(`color-${variable}`);
