import {memo, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import {getSubtitle} from "@api/api";
import {
  ASCII_BLOCK1,
  ASCII_BLOCK2,
  ASCII_BLOCK3,
  ASCII_LDAB,
  ASCII_LOSANGE,
  ASCII_RDAB,
  BUTTON_CREATE,
  NAME,
} from "@commons/constants";
import styles from "@layout/Header.module.css";
import Button from "@ui/Button";
import Spacer from "@ui/Spacer";
import {formatText} from "@utils/strings";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

import cls from "classnames";

export const AVATAR_1 = `${ASCII_LDAB}${ASCII_LOSANGE}${ASCII_RDAB}`;
export const AVATAR_2 = `/${ASCII_BLOCK2}\\`;

const Header = (_props: {darkMode: boolean; onThemeToggle: () => void}) => {
  const chatStore = useChatCompletionStore();

  const navigate = useNavigate();

  const homeHandler = () => {
    navigate("/home");
  };

  const helpHandler = () => {
    navigate("/help");
  };

  const resetChatHandler = () => {
    chatStore.setChatId();
    chatStore.setCompletionId();
    chatStore.setCompletions();
    navigate("/chat");
  };

  const hasRunOnce = useRef(false);
  const [subtitle, setSubtitle] = useState<string>("");

  const updateSubtitle = async () => {
    const data = await getSubtitle();
    const subtitles = data.split("\n").filter((v) => v.trim() !== "");
    const count = Math.round(Math.random() * (subtitles.length - 1));
    setSubtitle(formatText(subtitles[count].trim()));
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    updateSubtitle();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={cls("text", styles.title)}>
          <Button name={NAME} handler={homeHandler} />
          <span
            className={
              styles.gradient
            }>{`${ASCII_BLOCK3}${ASCII_BLOCK2}${ASCII_BLOCK1}`}</span>
          <br />
          <div className={styles.subtitle}>
            <div className={subtitle && styles.subtext}>{subtitle}</div>
          </div>
        </div>
        {subtitle && (
          <>
            <div className={styles.avatar}>
              {AVATAR_1}
              <br />
              {AVATAR_2}
            </div>
            <Button name="?" handler={helpHandler} className={styles.help} />
          </>
        )}
      </div>
      <Spacer />
      <div className={styles.button}>
        <Button name={BUTTON_CREATE} handler={resetChatHandler} />
      </div>
    </div>
  );
};

export default memo(Header);
