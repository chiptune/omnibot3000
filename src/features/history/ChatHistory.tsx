import {memo} from "react";
import {useNavigate} from "react-router-dom";

import styles from "./ChatHistory.module.css";

import type {Chat} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import ChatRemoveButton from "@history/components/ChatRemoveButton";
import cls from "classnames";

const ChatHistory = () => {
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
                {selected && <ChatRemoveButton id={chat.id} />}
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default memo(ChatHistory);
