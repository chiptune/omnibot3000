import {memo, useEffect, useRef, useState} from "react";

import {API_PATH, NAME, VERSION} from "@commons/constants";
import Container from "@layout/Container";
import Line from "@ui/Line";
import ProgressBar from "@ui/ProgressBar";
import {displayPackageVersion} from "@utils/version";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

import Caret from "@/commons/ui/Caret";

import styles from "@version/Version.module.css";

import cls from "classnames";

interface Package {
  name: string;
  version: [number, number, number];
  size: number;
  error?: string[];
}

const Version = () => {
  const chatStore = useChatCompletionStore();

  const hasRunOnce = useRef(false);
  const [response, setResponse] = useState<Package[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getResponse = async () => {
    const data = await fetch(`${API_PATH}/packages`);

    if (data.status !== 200) {
      const error = JSON.parse(await data.text()).error;
      setLoading(false);
      setResponse([
        {
          name: "ERROR",
          version: [0, 0, 0],
          size: 0,
          error: [`${data.statusText} (${data.status})`, data.url, error],
        },
      ]);
      return;
    }

    const packages: Package[] = await data.json();

    setLoading(false);
    setResponse(packages);
    setTotalSize(packages.reduce((acc, pkg) => acc + pkg.size, 0));
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
        <div className={cls("ascii", styles.body)}>
          <b>{NAME}</b> version <b>{VERSION.join(".")}</b>
          <br />
          <Line char={"~"} className={styles.line} />
          {loading ? (
            <Caret></Caret>
          ) : (
            (response as Package[]).map((pkg, i) => (
              <div key={i}>
                {pkg.error ? (
                  <div>
                    <b>[{pkg.name}]</b>
                    <br />
                    {pkg.error.map((line, j) => (
                      <span key={j}>{line}</span>
                    ))}
                  </div>
                ) : (
                  <div>
                    <b>{pkg.name}</b> version <b>{pkg.version.join(".")}</b>
                    <ProgressBar value={pkg.size} unit="byte" max={totalSize} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
};

export default memo(Version);
