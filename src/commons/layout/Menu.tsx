import {memo} from "react";

import styles from "@layout/Menu.module.css";
import Line from "@ui/Line";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import ChatHistory from "@history/ChatHistory";

const Menu = () => {
  const chatStore = useChatCompletionStore();

  const count = chatStore.getChats().length;

  return (
    <div className={styles.root}>
      <div className={styles.title}>history</div>
      <div>
        <span className={styles.count}>{count}</span>
        <span
          className={
            styles.subtitle
          }>{` talk${count > 1 ? "s" : ""} wasted`}</span>
      </div>
      <Line variant="horizontal" char="-" className={styles.line} />
      <ChatHistory />
    </div>
  );
};

export default memo(Menu);
