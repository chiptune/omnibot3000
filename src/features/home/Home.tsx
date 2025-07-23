import {memo, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {getStartButton, getSystemConfig} from "@api/api";
import {getStream} from "@api/openAI";
import Container from "@layout/Container";
import {formatText} from "@utils/strings";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [startButton, setStartButton] = useState<string>("");

  const updateStartButton = async () => {
    const data = await getStartButton();
    setStartButton(formatText(data));
  };

  const getResponse = async () => {
    const messages: ChatCompletionMessageParam[] = [getSystemConfig()];

    messages.push({
      role: "system",
      content: `\
        write an intro message for the user. keep it short and to the point.\
        explain who are you, why you are here and why the user is miserable.\
        separate each element with an empty line.`,
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
      setResponse((prev) => `${prev}${formatText(text)}`);
    }
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    displayPackageVersion();
    setLoading(true);
    getResponse();
    updateStartButton();
  }, []);

  return (
    <div className={styles.root}>
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotIsSpeaking truth={response} hasCaret={loading} />
          {!loading && startButton && (
            <div className={styles.button}>
              <Link to="/chat" replace>
                {startButton}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default memo(Home);
