import {memo, ReactNode, useEffect, useLayoutEffect, useRef} from "react";

import styles from "@layout/Container.module.css";
import ScrollSnap from "@ui/ScrollSnap";
import {getCharWidth} from "@utils/strings";

export const Container = ({children}: {children: ReactNode}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const update = () => {
    const root = rootRef.current;
    if (!root) return;
    const body = root.parentElement?.parentElement;
    if (!body) return;
    const content = contentRef.current;
    if (!content) return;

    const bodyWidth = body.offsetWidth ?? 0;
    //const rootHeight = root.offsetHeight ?? 0;
    const contentWidth = content.offsetWidth ?? 0;
    //const contentHeight = content.offsetHeight ?? 0;

    const cw = getCharWidth();

    const n = Math.floor((bodyWidth - contentWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;

    /*const start = document.getElementById("start");
    if (start) {
      const cy = content.getBoundingClientRect().top;
      const sy = start.getBoundingClientRect().top;
      console.log("start y:", sy, rootHeight, contentHeight);
      //content.style.height = `${contentHeight + (cy + cy)}px`;
    }*/

    //root.style.border = `0.125rem dashed red`;
    //root.style.borderRadius = "0.5rem";
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
    const nearest = document.getElementById("nearest");
    const end = document.getElementById("end");
    if (start) {
      start.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else if (nearest) {
      nearest.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    } else if (end) {
      end.scrollIntoView({
        behavior: "smooth",
        block: "end",
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
        <a id="end" />
      </div>
    </div>
  );
};

export default memo(Container);
