import {BUTTON_REMOVE, SESSION_KEY} from "@commons/constants";

import styles from "@history/ChatHistory.module.css";

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
    localStorage.setItem(SESSION_KEY, JSON.stringify(chatStore.exportData()));
    console.log(JSON.parse(String(localStorage.getItem(SESSION_KEY))));
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
