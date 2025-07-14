import {useCallback} from "react";

import {SESSION_KEY} from "@commons/constants";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import useDebug from "@hooks/useDebug";

function useStorage() {
  const debug = useDebug();
  const chatStore = useChatCompletionStore();

  const load = useCallback(() => {
    try {
      const data = localStorage.getItem(`${SESSION_KEY}_data`);
      if (data) {
        chatStore.importData(JSON.parse(data));
        if (debug) console.info("%cdata loaded", "color:#999");
      }
    } catch (error) {
      console.error("failed to load:", error);
    }
  }, []);

  const save = useCallback(() => {
    try {
      const data = chatStore.exportData();
      localStorage.setItem(`${SESSION_KEY}_data`, JSON.stringify(data));
      if (debug) console.info("%cdata saved", "color:#999");
    } catch (error) {
      console.error("failed to save:", error);
    }
  }, []);

  return {load, save};
}

export default useStorage;
