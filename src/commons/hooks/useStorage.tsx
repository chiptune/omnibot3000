import {SESSION_KEY} from "@commons/constants";

import useConfig from "@hooks/useConfig";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

function useStorage() {
  const config = useConfig();
  const chatStore = useChatCompletionStore();

  const {debug} = config.getConfig();

  const load = () => {
    try {
      const data = localStorage.getItem(`${SESSION_KEY}_data`);
      if (data) {
        chatStore.importData(JSON.parse(data));
        if (debug) console.info("%cdata loaded", "color:#999");
      }
    } catch (error) {
      console.error("failed to load:", error);
    }
  };

  const save = () => {
    try {
      const data = chatStore.exportData();
      localStorage.setItem(`${SESSION_KEY}_data`, JSON.stringify(data));
      if (debug) console.info("%cdata saved", "color:#999");
    } catch (error) {
      console.error("failed to save:", error);
    }
  };

  return {load, save};
}

export default useStorage;
