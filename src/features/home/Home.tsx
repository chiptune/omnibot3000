import React, {useEffect} from "react";

import {getCharWidth} from "@utils/strings";
import {displayPackageVersion} from "@utils/version";

import styles from "@home/Home.module.css";

const Home: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const update = () => {
    const content = containerRef.current;
    if (!content) return;

    const body = content.parentElement?.parentElement;
    if (!body) return;

    const cw = getCharWidth();

    const bodyWidth = body.offsetWidth ?? 0;
    const chatWidth = content.firstElementChild?.clientWidth ?? 0;

    const n = Math.floor((bodyWidth - chatWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;
  };

  useEffect(() => {
    displayPackageVersion();
    const resizeObserver = new ResizeObserver(update);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  });

  return (
    <div className={styles.root}>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.content}>
          <div className={styles.body}>{"> hello"}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
