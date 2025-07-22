import {ReactNode, useEffect, useRef} from "react";

import styles from "@layout/Container.module.css";
import {getCharWidth} from "@utils/strings";

export const Container = ({children}: {children: ReactNode}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const update = () => {
    const container = containerRef.current;
    if (!container) return;

    const body = container.parentElement?.parentElement;
    if (!body) return;

    const cw = getCharWidth();

    const bodyWidth = body.offsetWidth ?? 0;
    const contentWidth = container.firstElementChild?.clientWidth ?? 0;

    const n = Math.floor((bodyWidth - contentWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(update);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && containerRef.current.firstElementChild) {
      containerRef.current.scrollTo({
        left: 0,
        top: containerRef.current.firstElementChild.clientHeight,
        behavior: "smooth",
      });
    }
  }, [children]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Container;
