import {SESSION_KEY} from "@commons/constants";

import {getVariableFromCSS, setVariableToCSS} from "@/commons/utils/styles";

export interface ConfigType {
  debug: boolean;
  color: {
    h: string;
    s: string;
    l: string;
  };
}
export type ConfigParam = "debug" | "color";
export type ConfigValue = boolean | string;

class Config {
  config: ConfigType;

  static readonly KEY: string = `${SESSION_KEY}_config`;

  static readonly DEFAULT: ConfigType = {
    debug: false,
    color: {
      h: getVariableFromCSS("h"),
      s: getVariableFromCSS("s"),
      l: getVariableFromCSS("l"),
    },
  };

  constructor() {
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
    if (Object.keys(config).length === 0) config = Config.DEFAULT;
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
            this.config.color.h = value as string;
            break;
          case "s":
            this.config.color.s = value as string;
            break;
          case "l":
            this.config.color.l = value as string;
            break;
        }
        break;
    }
    this.save();
  }

  delete(): void {
    localStorage.removeItem(Config.KEY);
    this.config = Config.DEFAULT;
    if (this.config.debug) console.info("%cconfig deleted", "color:#999");
  }

  save(config?: ConfigType): void {
    localStorage.setItem(Config.KEY, JSON.stringify(config || this.config));
    if (this.config.debug) console.info("%cconfig saved", "color:#999");
  }

  apply(): void {
    const {color} = this.config;
    setVariableToCSS("h", color.h);
    setVariableToCSS("s", color.s);
    setVariableToCSS("l", color.l);
    if (this.config.debug) console.info("%cconfig applied", "color:#999");
  }
}

export default Config;
