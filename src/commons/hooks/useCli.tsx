/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import cmd from "@console/cmd";

import {useConfig} from "./useConfig";

interface CliContextType {
  command?: string;
  set: (cmd: string[]) => void;
  get: () => string;
  submit: (cmd: string[]) => void;
  log: (message: string) => void;
}

const CliContext = createContext<CliContextType | undefined>(undefined);

interface CliProviderProps {
  children: ReactNode;
}

export const CliProvider: FC<CliProviderProps> = ({children}) => {
  const [command, setCommand] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const config = useConfig();
  const {debug} = config.getConfig();

  const set = (cmd: string[]) =>
    setCommand(
      cmd
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .join("\n"),
    );
  const get = (): string => command;

  const submit = (query: string[]) => {
    if (query[0].charAt(0) === "/") {
      cmd(query[0].substring(1), navigate, debug);
    } else {
      set(query);
      if (!location.pathname.startsWith("/chat")) navigate("/chat");
    }
  };

  const log = (message: string): void => {
    if (message.trim() === "") return;
    console.info(
      `%c[CLI] ${message}`,
      "padding: 0.3rem; border-radius: 0.3rem; font: monospace; background-color: #000; color: #ccc",
    );
  };

  useEffect(() => {
    log(get());
  }, [command]);

  return (
    <CliContext.Provider value={{command, set, get, submit, log}}>
      {children}
    </CliContext.Provider>
  );
};

export const useCli = () => {
  const context = useContext(CliContext);
  if (context === undefined)
    throw new Error("useCli must be used within a CliProvider");
  return context;
};

export default useCli;
