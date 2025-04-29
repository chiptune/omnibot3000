import {memo} from "react";
import {useNavigate} from "react-router-dom";

import styles from "./ChatHistory.module.css";

import ChatRemoveButton from "@chat/components/ChatRemoveButton";
import type {Chat} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import cls from "classnames";

const ChatHistory = () => {
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <h1>history</h1>
      {chatStore.getChats().map((chat: Chat) => (
        <div
          key={`chat-history-${chat.id}`}
          className={cls(
            styles.item,
            styles[chatId === chat.id ? "selected" : "not-selected"],
          )}>
          <button
            className={cls("ascii", styles.text, {
              opacity: chatId === chat.id ? 1 : 0.7,
            })}
            onClick={() => {
              navigate(`/chat/${chat.id}`);
            }}>
            {chat.title}
          </button>
          <ChatRemoveButton id={chat.id} />
        </div>
      ))}
    </div>
  );
};

export default memo(ChatHistory);
