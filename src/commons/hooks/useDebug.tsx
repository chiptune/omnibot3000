import {createContext, ReactNode, useContext, useEffect, useState} from "react";

import Config from "@console/config";
import useKeyPress from "@hooks/useKeyPress";

const DebugContext = createContext<boolean>(false);

const config = new Config();

export const DebugProvider = (props: {debug: boolean; children: ReactNode}) => {
  const [debug, toggleDebug] = useState(props.debug);

  const debugHotKey = useKeyPress("Escape", {shft: true}, "keydown");

  useEffect(() => {
    if (debugHotKey === 1) toggleDebug((prv) => !prv);
    config.update("debug", "", debug);
  }, [debugHotKey]);

  return (
    <DebugContext.Provider value={debug}>
      {props.children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  return context;
};

export default useDebug;
