import {useCallback} from "react";

import {SESSION_KEY} from "@commons/constants";

import useDebug from "@hooks/useDebug";

function useConfig() {
  const debug = useDebug();

  const load = useCallback(() => {
    try {
      const config = localStorage.getItem(`${SESSION_KEY}_config`);
      if (config) {
        if (debug) console.info("%cconfig loaded", "color:#999");
      }
    } catch (error) {
      console.error("failed to load config", error);
    }
  }, []);

  const save = useCallback((config) => {
    try {
      localStorage.setItem(`${SESSION_KEY}_data`, JSON.stringify(config));
      if (debug) console.info("%cconfig saved", "color:#999");
    } catch (error) {
      console.error("failed to save config", error);
    }
  }, []);

  return {load, save};
}

export default useConfig;
