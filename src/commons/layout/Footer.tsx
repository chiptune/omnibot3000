import {memo} from "react";

import {SOURCE_URL} from "@commons/constants";
import Spacer from "@ui/Spacer";
import {numberToRoman} from "@utils/math";
import VERSION from "@utils/version";

import styles from "./Footer.module.css";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

const Footer = () => {
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  return (
    <div className={styles.root}>
      <div className={styles.copyright}>{`©${numberToRoman(Number(new Date().getFullYear()))}`}</div>
      <a href={SOURCE_URL} target="_blank">
        REZ
      </a>
      <Spacer />
      {chatId && <div className={styles.info}>{`id: ${chatId}`}</div>}
      <Spacer />
      <div className={styles.version}>{`v${VERSION.map((n) => numberToRoman(n)).join(".")}`}</div>
    </div>
  );
};

export default memo(Footer);
