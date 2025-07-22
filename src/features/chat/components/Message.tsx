import {memo} from "react";
import Markdown from "react-markdown";

import {ASCII_BLOCK1} from "@commons/constants";
import Line from "@ui/Line";
import {sanitizeHTML} from "@utils/strings";

import styles from "@chat/components/Message.module.css";

import {PromptDisplay} from "@chat/components/Prompt";
import cls from "classnames";
import type {ChatCompletionRole} from "openai/resources/index.mjs";

export const OmnibotIsSpeaking = (props: {
  truth: string;
  hasCaret?: boolean;
}) => (
  <div className={styles.bot}>
    <div className={cls("text", styles["bot-text"])}>
      <Markdown
        components={{
          code(props) {
            const {children, className} = props;
            return <code className={className}>{children}</code>;
          },
        }}>
        {sanitizeHTML(props.truth)}
      </Markdown>
    </div>
  </div>
);

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
          <OmnibotIsSpeaking truth={content} hasCaret={hasCaret} />
        </div>
      )}
    </div>
  );
};

export default memo(Message);
