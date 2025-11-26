import {memo, useEffect, useRef, useState} from "react";

import {NAME} from "@commons/constants";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";
import VERSION from "@utils/version";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import styles from "@help/Help.module.css";

import cls from "classnames";

const API_PATH = "/api";
const API_PORT = 3001;

interface Package {
  name: string;
  version: [number, number, number];
  size: number;
}

export const PACKAGES_API = `${window.location.origin}:${API_PORT}${API_PATH}/packages`;

const Version = () => {
  const chatStore = useChatCompletionStore();

  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getResponse = async () => {
    const response = await fetch(PACKAGES_API);

    const packages: Package[] = await response.json();

    const list = packages
      .map((pkg) => {
        return `${pkg.name} **${pkg.version.join(".")}**  \n`;
      })
      .join("");

    const text = `# __${NAME}__ version **${VERSION.join(".")}**\n${list}`;
    setLoading(false);
    setResponse(text);
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    chatStore.resetChat();
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

export default memo(Version);
