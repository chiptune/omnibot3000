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

import {log} from "@utils/debug";

import {useConfig} from "@hooks/useConfig";

import cmd from "@console/cmd";

interface CliContextType {
  command?: string;
  set: (cmd: string[]) => void;
  get: () => string;
  submit: (cmd: string[]) => void;
  blocked?: boolean;
  block: () => void;
  unblock: () => void;
}

const CliContext = createContext<CliContextType | undefined>(undefined);

interface CliProviderProps {
  children: ReactNode;
}

export const CliProvider: FC<CliProviderProps> = ({children}) => {
  const [command, setCommand] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [blocked, setBlocked] = useState(false);

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

  const submit = (lines: string[]) => {
    const query = lines.map((line) => line.trim());
    if (query.join("") === "") return; /* ignore empty commands */
    if (query[0].charAt(0) === "/") {
      cmd(query[0].substring(1), navigate, debug);
    } else {
      set(query);
      block();
      if (!location.pathname.startsWith("/chat")) navigate("/chat");
    }
  };

  const block = () => setBlocked(true);
  const unblock = () => setBlocked(false);

  useEffect(() => {
    log(get(), "cli");
  }, [command]);

  useEffect(() => {
    log(blocked ? "blocked" : "unblocked", "cli");
  }, [blocked]);

  return (
    <CliContext.Provider
      value={{command, set, get, submit, blocked, block, unblock}}>
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
