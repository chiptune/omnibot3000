import {memo} from "react";

import type {ChatCompletionRole} from "openai/resources/index.mjs";

import {ASCII_BLOCK1} from "@commons/constants";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Line from "@ui/Line";

import styles from "@chat/components/Message.module.css";

import {RenderCli} from "@cli/Cli";

const Message = (props: {
  role: ChatCompletionRole;
  content: string;
  hasCaret?: boolean;
  anchor?: ScrollLogicalPosition;
}) => {
  const {role, content, hasCaret, anchor} = props;

  const isUser = Boolean(role === "user");

  return (
    <article className={styles.root}>
      {isUser ? (
        <div className={styles.user}>
          {anchor === "start" && <a id="start" />}
          <div className={styles["user-pill"]}>{">"}</div>
          <h1>
            <RenderCli command={content.split("\n")} line={-1} caret={0} />
          </h1>
        </div>
      ) : (
        <div className={styles.bot}>
          <Line
            variant="vertical"
            char={ASCII_BLOCK1}
            className={styles["bot-line"]}
          />
          <OmnibotSpeak truth={content} hasCaret={hasCaret} />
        </div>
      )}
    </article>
  );
};

export default memo(Message);
