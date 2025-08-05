import {memo} from "react";

import type {ChatCompletionRole} from "openai/resources/index.mjs";

import {ASCII_BLOCK1} from "@commons/constants";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Line from "@ui/Line";

import styles from "@chat/components/Message.module.css";
import {PromptDisplay} from "@chat/components/Prompt";

const Message = (props: {
  role: ChatCompletionRole;
  content: string;
  hasCaret?: boolean;
}) => {
  const {role, content, hasCaret} = props;

  const isUser = Boolean(role === "user");

  return (
    <div className={styles.root}>
      {isUser ? (
        <div className={styles.user}>
          <div className={styles["user-pill"]}>{">"}</div>
          <div>
            <PromptDisplay prompt={content.split("\n")} line={-1} caret={0} />
          </div>
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
    </div>
  );
};

export default memo(Message);
