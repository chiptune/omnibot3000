import {createContext, ReactNode, useContext, useEffect, useState} from "react";

import useKeyPress from "@hooks/useKeyPress";

const DebugContext = createContext<boolean>(false);

export const DebugProvider = ({children}: {children: ReactNode}) => {
  const [debug, toggleDebug] = useState(false);

  const debugHotKey = useKeyPress("Escape", {shft: true}, "keydown");

  useEffect(() => {
    if (debugHotKey === 1) toggleDebug((prv) => !prv);
  }, [debugHotKey]);

  return (
    <DebugContext.Provider value={debug}>{children}</DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  return context;
};

export default useDebug;
