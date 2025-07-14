import {SESSION_KEY} from "@commons/constants";
import {clamp} from "@utils/math";
import {setVariableToCSS} from "@utils/styles";

const cmd = (query: string, debug: boolean) => {
  const [cmd, arg1, arg2] = query.split(" ");

  const config = JSON.parse(localStorage.getItem(`${SESSION_KEY}_cmd`) || "{}");

  let value: string = "";

  switch (cmd) {
    case "help":
      break;
    case "color":
      switch (arg1) {
        case "hue":
          value = clamp(parseFloat(arg2), 0, 360).toFixed(1);
          break;
      }
      setVariableToCSS(arg1, value);
      break;
    default:
      console.warn(`unknown command "${cmd}"`);
      return;
  }

  if (!value) {
    console.warn(`no value set for command "${cmd}"`);
    return;
  }

  if (!config[cmd]) config[cmd] = {};
  config[cmd][arg1] = value;

  localStorage.setItem(`${SESSION_KEY}_cmd`, JSON.stringify(config));
  if (debug) console.info(config, "color:#999");
};

export default cmd;
