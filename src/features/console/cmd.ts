import {setVariableToCSS} from "@/commons/utils/styles";

const cmd = (query: string) => {
  const [cmd, ...args] = query.split(" ");
  console.log(`Executing command: ${cmd}`, args);
  switch (cmd) {
    case "help":
      console.log("Available commands: /clear, /help");
      break;
    case "color":
      setVariableToCSS(args[0], args[1]);
      break;
    default:
      console.warn(`unknown command "${cmd}"`);
  }
};

export default cmd;
