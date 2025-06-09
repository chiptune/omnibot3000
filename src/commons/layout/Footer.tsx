import {memo} from "react";

import {ASCII_COPYRIGHT, AUTHOR_URL, SOURCE_URL} from "@commons/constants";
import styles from "@layout/Footer.module.css";
import Spacer from "@ui/Spacer";
import {numberToRoman} from "@utils/math";
import VERSION from "@utils/version";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import useDebug from "@hooks/useDebug";

const Footer = () => {
  const debug = useDebug();
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  return (
    <div className={styles.root}>
      <div
        className={
          styles.copyright
        }>{`${ASCII_COPYRIGHT}${numberToRoman(Number(new Date().getFullYear()))}`}</div>
      <a href={AUTHOR_URL} target="_blank">
        REZ
      </a>
      {debug && chatId && <div className={styles.info}>{`id: ${chatId}`}</div>}
      <Spacer />
      <div className={styles.version}>
        <a href={SOURCE_URL} target="_blank">
          {`v${VERSION.map((n) => numberToRoman(n)).join(".")}`}
        </a>
      </div>
    </div>
  );
};

export default memo(Footer);
