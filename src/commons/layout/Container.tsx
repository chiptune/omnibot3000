import {memo, ReactNode, useEffect, useRef} from "react";

import styles from "@layout/Container.module.css";
import {getCharWidth} from "@utils/strings";

import ScrollSnap from "../ui/ScrollSnap";

export const Container = ({children}: {children: ReactNode}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const cw = getCharWidth();

  const update = () => {
    const content = contentRef.current;
    if (!content) return;

    const body = rootRef.current?.parentElement?.parentElement;
    if (!body) return;

    const bodyWidth = body.offsetWidth ?? 0;
    const contentWidth = content.clientWidth ?? 0;

    const n = Math.floor((bodyWidth - contentWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(update);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const eol = document.getElementById("end-of-line");
    if (eol) {
      eol.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [children]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.container}>
        <ScrollSnap content={contentRef} className={styles.snap} />
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
      <a id="end-of-line" />
    </div>
  );
};

export default memo(Container);
