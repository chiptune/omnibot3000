import {memo, useEffect, useRef, useState} from "react";

import {getSubtitle} from "@api/api";
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
  const hasRunOnce = useRef(false);
  const [subtitle, setSubtitle] = useState<string>("");

  const updateSubtitle = async () => {
    const data = await getSubtitle();
    const subtitles = data.split("\n").filter((v) => v.trim() !== "");
    const count = Math.round(Math.random() * (subtitles.length - 1));
    setSubtitle(subtitles[count].trim());
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    updateSubtitle();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.title}>
          OMNIBOT 3000
          <br />
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
        {subtitle && (
          <div className={styles.button}>
            {AVATAR_1}
            <br />
            {AVATAR_2}
          </div>
        )}
      </div>
      <Spacer />
      <div className={styles.button}>
        <ButtonNew />
      </div>
    </div>
  );
};

export default memo(Header);
