import {memo, useEffect, useRef} from "react";

import {ASCII_BLOCK1, ASCII_BLOCK3} from "@commons/constants";
import Number from "@ui/Number";
import styles from "@ui/ProgressBar.module.css";
import {clamp, scale, Unit} from "@utils/math";
import {getCharWidth} from "@utils/strings";

import cls from "classnames";

const ProgressBar = (props: {
  value?: number;
  unit?: Unit;
  min?: number;
  max?: number;
  char1?: string;
  char2?: string;
  className?: string;
}) => {
  let {value, min, max} = props;

  min = min ?? 0;
  max = max ?? 100;
  value = clamp(value ?? 0, min, max);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      let el = rootRef.current;
      if (!el) return;

      const cw = getCharWidth();

      const number = scale(value, 0, props.unit);
      const nw = String(number.value + number.unit).length;

      const w = el.offsetWidth;
      const char1 = props.char1 || ASCII_BLOCK1;
      const char2 = props.char2 || ASCII_BLOCK3;
      const empty = Math.round(w / cw);
      const filled = Math.round(((value - min) / (max - min)) * empty);

      el = barRef.current;
      if (el)
        el.innerHTML =
          `<b>${char2.repeat(filled)}</b>` +
          `<i>${char1.repeat(empty - filled - nw)}</i>`;
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    if (barRef.current) {
      resizeObserver.observe(barRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={cls("ascii", styles.root, props.className)}>
      <div ref={barRef} className={cls(styles.bar, props.className)}></div>
      <Number
        value={value}
        unit={props.unit}
        decimal={0}
        className={cls("text", styles.number)}
      />
    </div>
  );
};

export default memo(ProgressBar);
