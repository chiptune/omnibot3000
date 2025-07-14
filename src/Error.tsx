import React, {ReactNode} from "react";

import {NAME} from "@commons/constants";
import Line from "@ui/Line";

import styles from "@/App.module.css";

import cls from "classnames";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`YOU DECEIVED ${NAME}`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.root}>
          <div className={cls("text", "ascii", styles.error)}>
            <div>
              <span style={{opacity: "var(--opacity-tertiary)"}}>% </span>
              <span>error :(</span>
            </div>
            <Line className={styles["h-line"]} />
            <div>{this.state.error?.message}</div>
            <Line className={styles["h-line"]} />
            <div
              style={{
                opacity: "var(--opacity-tertiary)",
                textTransform: "none",
              }}>
              {this.state.error?.stack}
            </div>
            <Line className={styles["h-line"]} />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
