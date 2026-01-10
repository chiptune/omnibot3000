import {memo} from "react";
import Markdown from "react-markdown";

import styles from "@commons/OmnibotSpeak.module.css";
import Box from "@ui/Box";
import Caret from "@ui/Caret";
import Line from "@ui/Line";
import {sanitizeHTML} from "@utils/strings";

import cls from "classnames";

export const OmnibotSpeak = (props: {truth: string; hasCaret?: boolean}) => (
  <div className={styles["has-caret"]}>
    <div className={cls("text", styles["root"])}>
      <Markdown
        components={{
          code(props) {
            const {children, className} = props;
            return (
              <Box className={className}>
                <code>{children}</code>
              </Box>
            );
          },
          hr() {
            return <Line char={"~"} className={styles["hr"]} />;
          },
        }}>
        {sanitizeHTML(props.truth)}
      </Markdown>
    </div>
    {props.hasCaret && <Caret />}
  </div>
);

export default memo(OmnibotSpeak);
