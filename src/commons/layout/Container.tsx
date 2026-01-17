import {memo, ReactNode, useEffect, useLayoutEffect, useRef} from "react";

import styles from "@layout/Container.module.css";
import ScrollSnap from "@ui/ScrollSnap";
import {clamp} from "@utils/math";
import {getCharWidth} from "@utils/strings";

export const Container = ({children}: {children: ReactNode}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blankRef = useRef<HTMLDivElement>(null);

  const update = () => {
    const root = rootRef.current;
    if (!root) return;
    const body = root.parentElement?.parentElement;
    if (!body) return;
    const content = contentRef.current;
    if (!content) return;
    const blank = blankRef.current;
    if (!blank) return;

    const bodyWidth = body.offsetWidth ?? 0;
    const contentWidth = content.offsetWidth ?? 0;
    const contentHeight = content.offsetHeight ?? 0;

    const cw = getCharWidth();

    const n = Math.floor((bodyWidth - contentWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;

    const start = document.getElementById("start");
    if (start) {
      const sy = start.getBoundingClientRect().top;
      const ry = root.getBoundingClientRect().top;
      blank.style.height = `${clamp(sy - ry, 0, contentHeight)}px`;
      start.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(update);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const start = document.getElementById("start");
    if (start) {
      start.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [children]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.container}>
        <ScrollSnap content={contentRef} className={styles.snap} />
        <main ref={contentRef} className={styles.content}>
          {children}
        </main>
      </div>
      <div ref={blankRef} className={styles.blank}></div>
    </div>
  );
};

export default memo(Container);
