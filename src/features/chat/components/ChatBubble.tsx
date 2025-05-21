import {memo} from "react";
import Markdown from "react-markdown";

import Line from "@ui/Line";
import {sanitizeHTML} from "@utils/strings";

import styles from "./ChatBubble.module.css";

import {PromptDisplay} from "@chat/components/ChatPrompt";
import type {ChatCompletionRole} from "openai/resources/index.mjs";

const ChatBubble = (props: {
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
          <div className={styles["user-pill"]}>{"#"}</div>
          <div>
            <PromptDisplay prompt={content} />
          </div>
        </div>
      ) : (
        <div className={styles.bot}>
          <Line variant="vertical" char=">" className={styles["bot-line"]} />
          <div className={styles["bot-text"]}>
            <Markdown
              components={{
                code(props) {
                  const {children, className, ...rest} = props;
                  return (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
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

export default memo(ChatBubble);
