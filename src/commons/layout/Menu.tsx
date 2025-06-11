import {memo} from "react";

import {SESSION_KEY} from "@commons/constants";
import styles from "@layout/Menu.module.css";
import Line from "@ui/Line";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import History from "@history/History";

const Menu = () => {
  const chatStore = useChatCompletionStore();

  const count = chatStore.getChats().length;

  const size = String(localStorage[SESSION_KEY] || "").length + 64;

  return (
    <div className={styles.root}>
      <div>
        <span className={styles.title}>history</span>
        <span className={styles.subtitle}> | </span>
        <span className={styles.count}>{count}</span>
        <span className={styles.title}>{` talk${count > 1 ? "s" : ""}`}</span>
      </div>
      <div>
        <span className={styles.subtitle}></span>
        <span className={styles.count}>{(size / 1024).toFixed(1)}</span>
        <span className={styles.title}> kb wasted</span>
      </div>
      <Line variant="horizontal" char="-" className={styles.line} />
      <History />
    </div>
  );
};

export default memo(Menu);
