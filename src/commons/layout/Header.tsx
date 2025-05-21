import {memo} from "react";

import {
  ASCII_BLOCK,
  ASCII_LDAB,
  ASCII_LOSANGE,
  ASCII_RDAB,
} from "@commons/constants";
import styles from "@layout/Header.module.css";
import Spacer from "@ui/Spacer";

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
          {`${ASCII_LDAB}${ASCII_LOSANGE}${ASCII_RDAB}`}
          <br />
          {`/${ASCII_BLOCK}\\`}
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
