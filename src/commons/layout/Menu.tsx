import {memo} from "react";

import {SESSION_KEY} from "@commons/constants";
import styles from "@layout/Menu.module.css";
import Line from "@ui/Line";
import Number from "@ui/Number";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import History from "@history/History";

import cls from "classnames";

const Menu = () => {
  const chatStore = useChatCompletionStore();

  const count = chatStore.getChats().length;

  const size = String(localStorage[`${SESSION_KEY}_data`] || "").length + 64;

  return (
    <aside className={cls("text", styles.root)}>
      <header className={styles.header}>
        <span className={styles.title}>history</span>
        <span className={styles.subtitle}>|</span>
        <span className={styles.count}>{count}</span>
        <span className={styles.title}>{` talk${count > 1 ? "s" : ""}`}</span>
      </header>
      <summary>
        <Number value={size} unit="byte" decimal={1} className={styles.size} />{" "}
        <span className={styles.title}>wasted</span>
      </summary>
      <Line variant="horizontal" className={styles.line} />
      <History />
    </aside>
  );
};

export default memo(Menu);
