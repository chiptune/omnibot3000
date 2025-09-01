import {memo, useEffect, useRef, useState} from "react";

import styles from "@layout/Background.module.css";

import useDebug from "@hooks/useDebug";

import {GENERATION_TIME, init, randomize, render, tick} from "@life/generation";
import {Grid} from "@life/types";
import cls from "classnames";

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const [grid, setGrid] = useState<Grid>(init(w, h));
  const [generation, setGeneration] = useState(0);
  const [board, setBoard] = useState<string[]>(["", ""]);

  const refBoard1 = useRef<HTMLDivElement>(null);
  const refBoard2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((grid) => tick(grid, w, h));
      setBoard((board) => {
        const b = [...board];
        b[generation % 2] = render(grid, w);
        return b;
      });
      /*
      if (refBoard1.current)
        refBoard1.current.classList[generation % 2 === 0 ? "add" : "remove"](
          "life",
        );
      if (refBoard2.current)
        refBoard2.current.classList[generation % 2 === 1 ? "add" : "remove"](
          "life",
        );*/
      setGeneration((n) => n + 1);
      if (generation % 100 === 0) setGrid((grid) => randomize(grid, 4, w, h));
    }, GENERATION_TIME);
    return () => clearInterval(interval);
  }, [grid]);

  useEffect(() => {
    setGrid(tick(init(w, h), w, h));
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return (
    <div className={cls("ascii", styles.root)}>
      <div ref={refBoard1} className={cls(styles.board, styles.life1)}>
        {board[0]}
      </div>
      <div ref={refBoard2} className={cls(styles.board, styles.life2)}>
        {board[1]}
      </div>
    </div>
  );
};

export default memo(Background);
