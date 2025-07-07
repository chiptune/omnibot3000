import {memo} from "react";
import Markdown from "react-markdown";

import {ASCII_BLOCK1} from "@commons/constants";
import Line from "@ui/Line";
import {sanitizeHTML} from "@utils/strings";

import styles from "@chat/components/Message.module.css";

import {PromptDisplay} from "@chat/components/Prompt";
import cls from "classnames";
import type {ChatCompletionRole} from "openai/resources/index.mjs";

const Message = (props: {
  role: ChatCompletionRole;
  content: string;
  hasCursor?: boolean;
}) => {
  const {role, content} = props;

  const isUser = Boolean(role === "user");

  return (
    <div className={styles.root}>
      {isUser ? (
        <div className={styles.user}>
          <div className={styles["user-pill"]}>{">"}</div>
          <div>
            <PromptDisplay prompt={content} caret={Infinity} />
          </div>
        </div>
      ) : (
        <div className={styles.bot}>
          <Line
            variant="vertical"
            char={ASCII_BLOCK1}
            className={styles["bot-line"]}
          />
          <div className={cls("text", styles["bot-text"])}>
            <Markdown
              components={{
                code(props) {
                  const {children, className} = props;
                  return <code className={className}>{children}</code>;
                },
              }}>
              {sanitizeHTML(content)}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Message);
