import {useEffect, useRef} from "react";

import {ASCII_VBAR} from "@commons/constants";
import {getCharWidth, getLineHeight} from "@utils/strings";

import cls from "classnames";

export type LineVariant = "horizontal" | "vertical";

const Line = (props: {
  variant?: LineVariant;
  char?: string;
  className?: string;
}) => {
  const {variant, char} = props;
  const isVertical = Boolean(variant === "vertical");

  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateLine = () => {
      const el = lineRef.current;
      if (!el) return;

      const cw = getCharWidth();
      const lh = getLineHeight(el);

      if (isVertical) {
        el.style.width = "var(--margin)";
        const h = el.offsetHeight;
        el.innerHTML = (char || ASCII_VBAR).repeat(Math.round(h / lh));
      } else {
        el.style.height = `${lh}px`;
        const w = el.offsetWidth;
        el.innerHTML = (char || "-").repeat(Math.round(w / cw));
      }
    };

    updateLine();

    const resizeObserver = new ResizeObserver(updateLine);
    if (lineRef.current) {
      resizeObserver.observe(lineRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={lineRef}
      className={cls("ascii", props.className)}
      style={{wordWrap: "break-word", overflow: "hidden"}}></div>
  );
};

export default Line;
