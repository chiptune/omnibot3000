import {memo} from "react";
import {useNavigate} from "react-router-dom";

import {ASCII_HLINE, BUTTON_DELETE} from "@commons/constants";
import Button from "@ui/Button";
import {getVariableFromCSS} from "@utils/styles";

import styles from "@history/History.module.css";

import type {Chat, ChatId} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import useStorage from "@hooks/useStorage";
import cls from "classnames";

const History = () => {
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();
  const storage = useStorage();

  const navigate = useNavigate();

  const w = parseInt(getVariableFromCSS("menu-width") ?? 0);

  const removeChat = (chatId: ChatId) => {
    chatStore.deleteChat(chatId);
    /* if the removed chat is the current one, we reset to a blank chat */
    if (chatId === chatStore.chatId) {
      chatStore.setCompletions();
      chatStore.setChatId();
    }
    storage.save();
  };

  return (
    <div className={cls("text", styles.root)}>
      {chatStore
        .getChats()
        .map((chat: Chat) => {
          const selected = Boolean(chatId === chat.id);
          return (
            <div key={`chat-history-${chat.id}`}>
              <div
                className={cls(
                  styles.content,
                  styles[`${selected ? "" : "not-"}selected`],
                )}>
                <button
                  className={cls("ascii", "text", styles.text, {
                    opacity: selected ? 1 : 0.7,
                  })}
                  onClick={() => {
                    navigate(`/chat/${chat.id}`);
                  }}>
                  {chat.title}
                </button>
              </div>
              <div className={styles.toolbar}>
                <div className={styles.line}>
                  {String(ASCII_HLINE).repeat(w - 3 - BUTTON_DELETE.length)}
                </div>
                <div className={styles.delete}>
                  <Button
                    name={BUTTON_DELETE}
                    handler={() => {
                      removeChat(chat.id);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default memo(History);
