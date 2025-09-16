import {SESSION_KEY} from "@commons/constants";
import VERSION from "@utils/version";

import {getVariableFromCSS, setVariableToCSS} from "@/commons/utils/styles";

export interface ConfigType {
  version: string;
  debug: boolean;
  color: {
    h: string;
    s: string;
    l: string;
  };
  size: number;
  height: number;
}
export type ConfigParam = "debug" | "color" | "size" | "height";
export type ConfigValue = boolean | string | number;

class Config {
  declare readonly DEFAULT: ConfigType;
  declare config: ConfigType;

  static readonly KEY: string = `${SESSION_KEY}_config`;

  constructor() {
    this.DEFAULT = {
      version: VERSION.join("."),
      debug: false,
      color: {
        h: getVariableFromCSS("h"),
        s: getVariableFromCSS("s"),
        l: getVariableFromCSS("l"),
      },
      size: parseInt(getVariableFromCSS("base-size")),
      height: parseFloat(getVariableFromCSS("base-height")),
    };
    this.config = this.read();
  }

  get configKey(): string {
    return `${SESSION_KEY}_config`;
  }

  create(): void {
    this.save(this.read());
  }

  read(): ConfigType {
    let config = JSON.parse(localStorage.getItem(Config.KEY) || "{}");
    if (Object.keys(config).length === 0) config = this.DEFAULT;
    if (config.version !== this.DEFAULT.version) config = this.DEFAULT;
    return config;
  }

  update(param: ConfigParam, key: string, value: ConfigValue) {
    switch (param) {
      case "debug":
        if (!key && typeof value === "boolean")
          this.config.debug = value as boolean;
        break;
      case "color":
        switch (key) {
          case "h":
          case "s":
          case "l":
            this.config.color[key] = value as string;
            break;
        }
        break;
      case "size":
      case "height":
        if (!key && typeof value === "number")
          this.config[param] = value as number;
        break;
    }
    if (this.config.debug)
      console.info(
        `%cconfig updated: ${param} = ${value}`,
        "color:#999",
        this.config,
      );
    this.save();
  }

  delete(): void {
    localStorage.removeItem(Config.KEY);
    this.config = this.DEFAULT;
    if (this.config.debug) console.info("%cconfig deleted", "color:#999");
  }

  save(config?: ConfigType): void {
    localStorage.setItem(Config.KEY, JSON.stringify(config || this.config));
    if (this.config.debug) console.info("%cconfig saved", "color:#999");
  }

  apply(): void {
    const {color, size, height} = this.config;
    setVariableToCSS("h", color.h);
    setVariableToCSS("s", color.s);
    setVariableToCSS("l", color.l);
    if (size) setVariableToCSS("font-size", `${size}px`);
    if (height) setVariableToCSS("line-height", `${height}rem`);
    if (this.config.debug) console.info("%cconfig applied", "color:#999");
  }
}

export default Config;
