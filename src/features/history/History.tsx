import {memo} from "react";
import {useNavigate} from "react-router-dom";

import styles from "@history/History.module.css";

import ButtonRemove from "@chat/components/ButtonRemove";
import type {Chat} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import cls from "classnames";

const History = () => {
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
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
                  className={cls("ascii", styles.text, {
                    opacity: selected ? 1 : 0.7,
                  })}
                  onClick={() => {
                    navigate(`/chat/${chat.id}`);
                  }}>
                  {chat.title}
                </button>
              </div>
              <div className={styles.item}>
                <div className={styles.line}>
                  {String("-").repeat(selected ? 16 : 17)}
                </div>
                {selected && (
                  <div className={styles["button-remove"]}>
                    <ButtonRemove id={chat.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default memo(History);
