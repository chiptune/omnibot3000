import {memo, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ChatCompletionMessageParam} from "openai/resources";
import {ChatCompletionChunk} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

import getData, {getStartButton, getSystemConfig} from "@api/api";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";
import Button from "@ui/Button";
import {formatText} from "@utils/strings";
import {displayPackageVersion} from "@utils/version";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import styles from "@home/Home.module.css";

import cls from "classnames";

const Home = () => {
  const chatStore = useChatCompletionStore();

  const navigate = useNavigate();

  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [startButton, setStartButton] = useState<string>("");

  const updateStartButton = async () => {
    const data = await getStartButton();
    setStartButton(formatText(data));
  };

  const getResponse = async () => {
    try {
      const messages: ChatCompletionMessageParam[] = [getSystemConfig()];

      messages.push({
        role: "developer",
        content: `\
write an intro message for the user. keep it short and to the point. \
explain who are you, why you are here and how you can help the user. \
separate each element with an empty line.`,
      });

      const response = (await getData(messages)) as Stream<ChatCompletionChunk>;

      for await (const chunk of response) {
        const choice = chunk.choices?.[0] || {};
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
    } catch (error) {
      console.error("Error reading stream:", error);
      setLoading(false);
      setResponse("no signal");
    }
  };

  const newChat = () => {
    chatStore.setChatId();
    chatStore.setCompletionId();
    chatStore.setCompletions();
    navigate("/chat");
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    chatStore.resetChat();
    displayPackageVersion();
    setLoading(true);
    getResponse();
    updateStartButton();
  }, []);

  return (
    <div className={styles.root}>
      <Container>
        <div className={cls("text", styles.body)}>
          <OmnibotSpeak truth={response} hasCaret={loading} />
          {!loading && startButton && (
            <div className={styles.button}>
              <Button name={startButton} handler={newChat} className="text" />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default memo(Home);
