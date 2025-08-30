import {memo, useEffect, useState} from "react";

import styles from "@layout/Background.module.css";

import useDebug from "@hooks/useDebug";

import {init, randomize, render, tick} from "@life/generation";
import {Grid} from "@life/types";
import cls from "classnames";

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const [grid, setGrid] = useState<Grid>(init(w, h));
  const [generation, setGeneration] = useState(0);
  const [board, setBoard] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((grid) => tick(grid, w, h));
      setBoard(render(grid));
      setGeneration((n) => n + 1);
      if (generation % 100 === 0) setGrid((grid) => randomize(grid, 1, w, h));
    }, 50);
    return () => clearInterval(interval);
  }, [grid]);

  useEffect(() => {
    setGrid(tick(init(w, h), w, h));
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return <div className={cls("ascii", styles.root)}>{board}</div>;
};

export default memo(Background);
