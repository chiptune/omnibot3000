import {useEffect, useRef, useState} from "react";

import styles from "@layout/Background.module.css";

import useDebug from "@hooks/useDebug";

import {init, LIFESPAN, randomize, render, tick} from "@life/generation";
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
    const board1 = refBoard1.current;
    const board2 = refBoard2.current;
    if (!board1 || !board2) return;
    const interval = setInterval(() => {
      setGrid((grid) => tick(grid, w, h));
      setBoard((board) => {
        const b = [...board];
        b[generation % 2] = render(grid, w);
        return b;
      });
      if (generation % 2 === 0) {
        board1.classList.add(styles.life);
        board2.classList.add(styles.death);
        board1.classList.remove(styles.death);
        board2.classList.remove(styles.life);
      } else {
        board1.classList.add(styles.death);
        board2.classList.add(styles.life);
        board1.classList.remove(styles.life);
        board2.classList.remove(styles.death);
      }
      setGeneration((n) => n + 1);
      if (generation % 100 === 0) setGrid((grid) => randomize(grid, 1, w, h));
    }, LIFESPAN);
    return () => clearInterval(interval);
  }, [grid]);

  useEffect(() => {
    setGrid(tick(init(w, h), w, h));
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  useEffect(() => {
    setGrid(tick(init(w, h), w, h));
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return (
    <div className={cls("ascii", styles.root)}>
      <div ref={refBoard1} className={styles.board}>
        {board[0]}
      </div>
      <div ref={refBoard2} className={styles.board}>
        {board[1]}
      </div>
    </div>
  );
};

export default Background;
