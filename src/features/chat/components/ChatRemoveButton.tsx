import {BUTTON_REMOVE} from "@/commons/constants";

import styles from "./ChatHistory.module.css";

import type {ChatId} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import cls from "classnames";

const ChatRemoveButton: React.FC<{id: ChatId}> = ({id}) => {
  const chatStore = useChatCompletionStore();

  const removeChatHandler = (chatId: ChatId) => {
    chatStore.removeChat(chatId);
    /* if the removed chat is the current one, we reset to a blank chat */
    if (chatId === chatStore.chatId) {
      chatStore.resetCompletions();
      chatStore.resetChatId();
    }
  };

  return (
    <button
      className={cls("ascii", styles.button)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        removeChatHandler(id);
      }}>
      {BUTTON_REMOVE}
    </button>
  );
};

export default ChatRemoveButton;
