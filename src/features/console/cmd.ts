import {clamp} from "@utils/math";
import {setVariableToCSS} from "@utils/styles";

import Config, {ConfigValue} from "@console/config";

const cmd = (query: string, debug: boolean) => {
  if (query.trim() === "") return;

  const config = new Config();

  const [cmd, arg1, arg2] = query.toLowerCase().split(" ");

  let value: ConfigValue = "";

  switch (cmd) {
    case "reset":
      config.delete();
      window.location.reload();
      return;
    case "debug":
      switch (arg1) {
        case "on":
          value = true;
          break;
        case "off":
          value = false;
          break;
        case undefined:
          value = !debug;
          break;
        default:
          console.warn(`unknown debug command "${arg1}"`);
          return;
      }
      config.update(cmd, "", value);
      window.location.reload();
      break;
    case "color":
      if (!arg1 || !arg2) {
        console.warn(`missing arguments for command "${cmd}"`);
        return;
      }
      switch (arg1) {
        case "h":
          value = clamp(parseFloat(arg2), 0, 360).toFixed(1);
          break;
        case "s":
          value = clamp(parseInt(arg2), 0, 100).toFixed(0);
          break;
        case "l":
          value = clamp(parseInt(arg2), 0, 100).toFixed(0);
          break;
      }
      setVariableToCSS(arg1, value);
      config.update(cmd, arg1, value);
      break;
    default:
      console.warn(`unknown command "${cmd}"`);
      return;
  }

  if (debug && !value) {
    console.warn(`no value set for command "${cmd}"`);
    return;
  }
};

export default cmd;
