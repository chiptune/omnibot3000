import {memo} from "react";

import {ASCII_COPYRIGHT} from "@commons/constants";
import styles from "@layout/Footer.module.css";
import Separator from "@ui/Separator";
import Spacer from "@ui/Spacer";
import {numberToRoman} from "@utils/math";
import VERSION, {AUTHOR, NAME} from "@utils/version";

import {RenderTime} from "@/App";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import useDebug from "@hooks/useDebug";

const Footer = (props: {renderTime: RenderTime}) => {
  const debug = useDebug();
  const chatStore = useChatCompletionStore();
  const chatId = chatStore.getChatId();

  return (
    <div className={styles.root}>
      <div>
        <span className={styles.info}>{ASCII_COPYRIGHT}</span>
        <span className={styles.copyright}>
          {`${numberToRoman(Number(new Date().getFullYear()))} `}
        </span>
        <a href={AUTHOR.url} target="_blank">
          {AUTHOR.name}
        </a>
      </div>
      <Separator />
      {debug && chatId && <div className={styles.info}>{`id: ${chatId}`}</div>}
      <Spacer />
      <Separator />
      <div>
        <span className={styles.info}>{`${props.renderTime.phase}: `}</span>
        {props.renderTime.duration.toFixed(1)}
        <span className={styles.info}> ms</span>
      </div>
      <Separator />
      <div>
        <span className={styles.info}>ver </span>
        <a href={`${AUTHOR.url}/${NAME}`} target="_blank">
          {VERSION.map((n) => numberToRoman(n)).join(".")}
        </a>
      </div>
    </div>
  );
};

export default memo(Footer);
