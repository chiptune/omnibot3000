import {memo} from "react";

import Caret from "@ui/Caret";

import styles from "@cli/Cli.module.css";

import cls from "classnames";

export const RenderCli = (props: {
  command: string[];
  line: number;
  caret: number;
  blocked?: boolean;
}) => {
  const {command, line, caret} = props;
  return (
    <div
      style={{
        height: `calc(${command.length} * var(--line-height))`,
      }}>
      {command.map((text: string, i: number) => {
        return (
          <div
            key={`command-line-${i}`}
            className={styles["command-line"]}
            style={{clear: i > 0 ? "both" : "none"}}>
            {text}
            {i === line ? (
              <div className={cls("blink", styles.caret)}>
                <span
                  style={{
                    clear: i === 0 ? "none" : "both",
                    visibility: "hidden",
                  }}>
                  {command[line].substring(0, caret)}
                </span>
                <Caret hide={props.blocked} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default memo(RenderCli);
