import {memo, useEffect, useRef, useState} from "react";

import {NAME, VERSION} from "@commons/constants";
import OmnibotSpeak from "@commons/OmnibotSpeak";
import Container from "@layout/Container";
import {displayPackageVersion} from "@utils/version";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import styles from "@help/Help.module.css";

import cls from "classnames";

const API_PORT = Number(import.meta.env.API_PORT) || 3001;
const API_PATH = import.meta.env.API_PATH || "/api";

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

    const text = [
      `# __${NAME}__ version **${VERSION.join(".")}**`,
      "---",
      list,
    ];
    setLoading(false);
    setResponse(text.join("\n"));
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    chatStore.resetChat();
    setLoading(true);
    getResponse();
    displayPackageVersion();
    console.info(
      `%c${JSON.stringify(import.meta.env, null, 2)}`,
      "color: #999",
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

export default memo(Version);
