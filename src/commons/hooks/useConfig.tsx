import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

import {displayPackageVersion} from "@utils/version";

import useKeyPress from "@hooks/useKeyPress";

import Config, {ConfigType} from "@console/config";

interface ConfigContextType {
  config: Config;
  getConfig: () => ConfigType;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({children}) => {
  const config = new Config();
  const getConfig = () => config.config;

  const hasRunOnce = useRef<boolean>(false);

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;
    config.apply();
    displayPackageVersion();
  }, []);

  const debugHotKey = useKeyPress("Escape", {shft: true}, "keydown");

  useEffect(() => {
    if (debugHotKey === 1) config.update("debug", "", !config.config.debug);
  }, [debugHotKey]);

  const value: ConfigContextType = {
    config,
    getConfig,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export default useConfig;
