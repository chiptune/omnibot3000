import {getVariableFromCSS} from "@/commons/utils/styles";

export interface Config {
  debug: boolean;
  color: {
    hue: string;
    saturation: string;
    lightness: string;
  };
}

export const DEFAULT_CONFIG: Config = {
  debug: false,
  color: {
    hue: getVariableFromCSS("hue"),
    saturation: getVariableFromCSS("sat"),
    lightness: getVariableFromCSS("lgt"),
  },
};
