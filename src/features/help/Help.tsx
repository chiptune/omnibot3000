import {memo, useEffect, useRef, useState} from "react";

import {ChatCompletionMessageParam} from "openai/resources";
import {ChatCompletionChunk} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

import {getSystemConfig} from "@api/api";
import getStream from "@api/openAI";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";

import styles from "@help/Help.module.css";

import cls from "classnames";

const Help = () => {
  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getResponse = async () => {
    const messages: ChatCompletionMessageParam[] = [getSystemConfig()];

    messages.push({
      role: "system",
      content: `\
        make a list of all available config commands.\
        add a description of each command to help the user.\
        you can give a single example for commands that need parameter.\
        highlight the command in bold and keep all comments short.`,
    });

    const response = (await getStream(messages)) as Stream<ChatCompletionChunk>;

    for await (const chunk of response) {
      const choice = chunk.choices[0] || {};
      const finish_reason = choice.finish_reason;
      const text = choice.delta?.content || "";
      if (finish_reason) {
        setLoading(false);
        if (finish_reason === "length")
          setResponse((prev) => `${prev}\n\n[max tokens length reached]\n`);
        break;
      }
      if (!text) continue;
      setResponse((prev) => `${prev}${text}`);
    }
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    setLoading(true);
    getResponse();
  }, []);

  return (
    <div className={styles.root}>
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotSpeak truth={response} hasCaret={loading} />
        </div>
      </Container>
    </div>
  );
};

export default memo(Help);
