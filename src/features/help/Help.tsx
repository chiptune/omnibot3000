import {memo, useEffect, useRef, useState} from "react";

import getStream from "@api/utils/getStream";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";

import useCli from "@hooks/useCli";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import styles from "@help/Help.module.css";

import cls from "classnames";

const Help = () => {
  const chatStore = useChatCompletionStore();

  const cli = useCli();

  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    chatStore.resetChat();
    setLoading(true);
    cli.block();
    getStream(
      setLoading,
      setResponse,
      [
        "you can give a single example for commands that need parameter",
        "highlight the command in bold and keep all comments shorts",
      ],
      [
        "make a list of all available config commands",
        "add a description of each command to help the user",
        "do not include commands that are not provided",
      ],
      [],
      () => {
        cli.unblock();
      },
    );
  }, []);

  return (
    <div className={styles.root}>
      <a id="start" />
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotSpeak truth={response} hasCaret={loading} />
        </div>
      </Container>
    </div>
  );
};

export default memo(Help);
