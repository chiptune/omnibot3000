import {useEffect, useRef, useState} from "react";

import {ASCII_CURRENCY} from "@commons/constants";
import styles from "@layout/Background.module.css";
import {vec2} from "@utils/math";
import {getCharWidth, getLineHeight} from "@utils/strings";

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
  const refCursor = useRef<HTMLDivElement>(null);

  const board1 = refBoard1.current;
  const board2 = refBoard2.current;
  const cur = refCursor.current;

  const mouseMoveHandler = (event: MouseEvent) => {
    setCursor([event.clientX, event.clientY]);
  };

  const mouseDownHandler = () => {
    setGeneration((n) => n + 1);
    setClicked(true);
  };

  const mouseUpHandler = () => {
    setClicked(false);
    setGeneration((n) => n + 1);
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
    const board = refBoard1.current;
    if (!board) return;
    const cw = getCharWidth();
    const lh = getLineHeight();
    const rect = board.getBoundingClientRect();
    const bw = rect.width;
    const bh = rect.height;
    if (!bw || !bh) return;
    const bx = cursor[0] - rect.left;
    const by = cursor[1] - rect.top;
    const x = Math.floor((bx / bw) * w);
    const y = Math.floor((by / bh) * h);
    if (clicked) {
      setGrid((grid) => birth(grid, [[0, 0]], x, y, w, h));
      update();
    }
    if (!cur) return;
    cur.style.left = `${cw + x * cw}px`;
    cur.style.top = `${cw + y * lh}px`;
    cur.style.opacity = `var(--opacity-${clicked ? "tertiary" : "ghosting"})`;
    document.body.style.cursor = clicked ? "pointer" : "default";
    cur.style.visibility =
      x >= 0 && x < bw / cw && y >= 0 && y < bh / lh ? "visible" : "hidden";
  }, [cursor, clicked]);

  const update = () => {
    if (!clicked) setGrid((grid) => tick(grid, w, h));
    setBoard((board) => {
      const b = [...board];
      b[generation % 2] = render(grid, w);
      return b;
    });
    if (!board1 || !board2) return;
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
    /*if (generation % 100 === 0) setGrid((grid) => randomize(grid, 1, w, h));*/
  };

  useEffect(() => {
    update();
  }, [generation]);

  useEffect(() => {
    setGrid(tick(init(w, h), w, h));
    const interval = setInterval(() => {
      setGeneration((n) => n + 1);
    }, LIFESPAN);
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
    return () => clearInterval(interval);
  }, [w, h]);

  return (
    <>
      <div className={cls("ascii", styles.root)}>
        <div ref={refBoard1} className={styles.board}>
          {board[0]}
        </div>
        <div ref={refBoard2} className={styles.board}>
          {board[1]}
        </div>
      </div>
      <div ref={refCursor} className={cls("ascii", styles.cursor)}>
        {ASCII_CURRENCY}
      </div>
    </>
  );
};

export default Background;
