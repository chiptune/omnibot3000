import {useCallback} from "react";

import {SESSION_KEY} from "@commons/constants";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

function useStorage() {
  const chatStore = useChatCompletionStore();

  const load = useCallback(() => {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (data) {
        chatStore.importData(JSON.parse(data));
        console.info("%cdata loaded", "color:#999");
      }
    } catch (error) {
      console.error("failed to load:", error);
    }
  }, []);

  const save = useCallback(() => {
    try {
      const data = chatStore.exportData();
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      console.info("%cdata saved", "color:#999");
    } catch (error) {
      console.error("failed to save:", error);
    }
  }, []);

  return {load, save};
}

export default useStorage;
