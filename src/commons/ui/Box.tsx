import {HTMLAttributes, memo, useEffect, useRef} from "react";

import {ASCII_CORNER, ASCII_HLINE, ASCII_VLINE} from "@commons/constants";
import styles from "@ui/Box.module.css";
import {getCharWidth, getLineHeight} from "@utils/strings";

import cls from "classnames";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  hline?: string;
  vline?: string;
  corner?: string;
}

const Box = (props: BoxProps) => {
  const {hline, vline, corner, className, children, ...rest} = props;

  const boxRef = useRef<HTMLDivElement | null>(null);
  const boxTopRef = useRef<HTMLDivElement | null>(null);
  const boxBottomRef = useRef<HTMLDivElement | null>(null);
  const boxLeftRef = useRef<HTMLDivElement | null>(null);
  const boxRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateBox = () => {
      const boxTop = boxTopRef.current;
      const boxBottom = boxBottomRef.current;
      const boxLeft = boxLeftRef.current;
      const boxRight = boxRightRef.current;

      if (!boxTop || !boxBottom || !boxLeft || !boxRight) return;

      const cw = getCharWidth();
      const lh = getLineHeight();

      const w = boxTop.offsetWidth;
      const hborder = [
        corner || ASCII_CORNER,
        (hline || ASCII_HLINE).repeat(Math.round(w / cw) - 2),
        corner || ASCII_CORNER,
      ].join("");
      boxTop.innerHTML = hborder;
      boxBottom.innerHTML = hborder;

      const h = boxLeft.offsetHeight;
      const vborder = (vline || ASCII_VLINE).repeat(Math.round(h / lh));
      boxLeft.innerHTML = vborder;
      boxRight.innerHTML = vborder;
    };

    updateBox();

    const resizeObserver = new ResizeObserver(updateBox);
    if (boxRef.current) {
      resizeObserver.observe(boxRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [hline, vline, corner]);

  return (
    <div
      ref={boxRef}
      className={cls("ascii", styles["root"], className)}
      {...rest}>
      <div
        ref={boxTopRef}
        className={cls(styles["border"], styles["hline"])}></div>
      <div className={styles["center"]}>
        <div
          ref={boxLeftRef}
          className={cls(styles["border"], styles["vline"])}></div>
        <div className={styles["content"]}>{children}</div>
        <div
          ref={boxRightRef}
          className={cls(styles["border"], styles["vline"])}></div>
      </div>
      <div
        ref={boxBottomRef}
        className={cls(styles["border"], styles["hline"])}></div>
    </div>
  );
};

export default memo(Box);
