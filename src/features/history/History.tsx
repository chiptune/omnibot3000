import {memo} from "react";
import {useNavigate} from "react-router-dom";

import {ASCII_HLINE} from "@commons/constants";
import {getVariableFromCSS} from "@utils/styles";

import styles from "@history/History.module.css";

import ButtonRemove from "@chat/components/ButtonRemove";
import type {Chat} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import cls from "classnames";

const History = () => {
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  const navigate = useNavigate();

  const w = parseInt(getVariableFromCSS("menu-width") ?? 0);

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
              <div className={styles.item}>
                <div className={styles.line}>
                  {String(ASCII_HLINE).repeat(selected ? w - 4 : w - 3)}
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
