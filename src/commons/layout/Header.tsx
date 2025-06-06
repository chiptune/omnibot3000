import {memo} from "react";

import {
  ASCII_BLOCK,
  ASCII_LDAB,
  ASCII_LOSANGE,
  ASCII_RDAB,
} from "@commons/constants";
import styles from "@layout/Header.module.css";
import Spacer from "@ui/Spacer";

import ButtonNew from "@chat/components/ButtonNew";

export const AVATAR_1 = `${ASCII_LDAB}${ASCII_LOSANGE}${ASCII_RDAB}`;
export const AVATAR_2 = `/${ASCII_BLOCK}\\`;

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
          {AVATAR_1}
          <br />
          {AVATAR_2}
        </div>
      </div>
      <Spacer />
      <div className={styles.button}>
        <ButtonNew />
      </div>
    </div>
  );
};

export default memo(Header);
