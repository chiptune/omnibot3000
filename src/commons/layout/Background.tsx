import {useEffect, useRef, useState} from "react";

import styles from "@layout/Background.module.css";
import {vec2} from "@utils/math";

import useDebug from "@hooks/useDebug";

import {birth, init, LIFESPAN, render, tick} from "@life/generation";
import {Grid} from "@life/types";
import cls from "classnames";

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const [grid, setGrid] = useState<Grid>(init(w, h));
  const [generation, setGeneration] = useState(0);
  const [board, setBoard] = useState<string[]>(["", ""]);
  const [cursor, setCursor] = useState<vec2>([0, 0]);
  const [clicked, setClicked] = useState<boolean>(false);

  const refBoard1 = useRef<HTMLDivElement>(null);
  const refBoard2 = useRef<HTMLDivElement>(null);

  const mouseMoveHandler = (event: MouseEvent) => {
    setCursor([event.clientX, event.clientY]);
  };

  const mouseDownHandler = () => {
    document.body.style.cursor = "pointer";
    setClicked(true);
  };

  const mouseUpHandler = () => {
    document.body.style.cursor = "default";
    setClicked(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  useEffect(() => {
    if (!clicked) return;
    const board = refBoard1.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const bw = rect.width;
    const bh = rect.height;
    if (!bw || !bh) return;
    const bx = cursor[0] - rect.left;
    const by = cursor[1] - rect.top;
    const x = Math.floor((bx / bw) * w);
    const y = Math.floor((by / bh) * h);
    setGrid((grid) => birth(grid, [[0, 0]], x, y, w, h));
  }, [cursor, clicked]);

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
      /*if (generation % 100 === 0) setGrid((grid) => randomize(grid, 1, w, h));*/
    }, LIFESPAN);
    return () => clearInterval(interval);
  }, [grid]);

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
