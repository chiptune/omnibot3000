import {useEffect, useRef, useState} from "react";

import {getSystemConfig} from "@api/api";
import {getStream} from "@api/openAI";
import Container from "@layout/Container";
import Caret from "@ui/Caret";
import {displayPackageVersion} from "@utils/version";

import styles from "@home/Home.module.css";

import {OmnibotIsSpeaking} from "@chat/components/Message";
import cls from "classnames";
import {ChatCompletionMessageParam} from "openai/resources";
import {ChatCompletionChunk} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

const Home = () => {
  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<string>("");

  const getResponse = async () => {
    const messages: ChatCompletionMessageParam[] = [getSystemConfig()];

    messages.push({
      role: "system",
      content: `\
      as welcoming message to the user, explain who you are and your purpose.\
      keep your message short and seperate each element by an empty line.\
      add a link to "/chat" to help users to start a conversation.`,
    });

    const response = (await getStream(messages)) as Stream<ChatCompletionChunk>;

    for await (const chunk of response) {
      const choice = chunk.choices[0] || {};
      const finish_reason = choice.finish_reason;
      const text = choice.delta?.content || "";
      if (finish_reason) {
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

    displayPackageVersion();
    getResponse();
  }, []);

  return (
    <div className={styles.root}>
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotIsSpeaking truth={response} />
          <Caret />
        </div>
      </Container>
    </div>
  );
};

export default Home;
