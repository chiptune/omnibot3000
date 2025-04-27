import {memo} from "react";

import Spacer from "@ui/Spacer";

import styles from "./Header.module.css";

import ChatNewButton from "@chat/components/ChatNewButton";

const Header = (_props: {darkMode: boolean; onThemeToggle: () => void}) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.title}>
          OMNIBOT 3000
          <br />
          <div className={styles.subtitle}>your omniscient source of truth</div>
        </div>
        <div className={styles.button}>
          {"<->"}
          <br />
          /T\
        </div>
      </div>
      <Spacer />
      <div className={styles.button}>
        <ChatNewButton />
      </div>
    </div>
  );
};

export default memo(Header);
