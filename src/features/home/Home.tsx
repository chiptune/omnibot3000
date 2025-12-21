import {memo, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import {getStartButton} from "@api/api";
import getStream from "@api/getStream";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";
import Button from "@ui/Button";
import {formatText} from "@utils/strings";

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
    setLoading(true);
    getStream(
      setLoading,
      setResponse,
      [
        "keep it short and straight to the point",
        "do not repeat yourself",
        "do not exceed 512 characters",
        "separate each element with an empty line",
      ],
      [
        "write an intro message for the user",
        "explain who are you, why you are here and what you can do",
        "it's not a help or documentation page",
      ],
    );
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
