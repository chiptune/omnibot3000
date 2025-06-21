import {memo, useEffect, useState} from "react";

import {ASCII_BLOCK1, ASCII_BLOCK2, ASCII_SPACE} from "@commons/constants";
import styles from "@layout/Background.module.css";
import {getVariableFromCSS} from "@utils/styles";

import useDebug from "@hooks/useDebug";
import cls from "classnames";

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const setPixel = (
    grid: string,
    x: number,
    y: number,
    char: string,
  ): string => {
    const n = (y % h) * w + (x % w);
    return grid.slice(0, n) + char + grid.slice(n + 1);
  };

  const [grid, setGrid] = useState<string>("");

  const mw = parseInt(getVariableFromCSS("menu-width"));

  useEffect(() => {
    setGrid(ASCII_SPACE.repeat(w * h));
    setGrid((g) => setPixel(g, w - 1, 1, ASCII_BLOCK1));
    setGrid((g) => setPixel(g, mw - 1, 0, ASCII_BLOCK2));
    setGrid((g) => setPixel(g, mw + 2, h - 3, ASCII_BLOCK2));
    setGrid((g) => setPixel(g, 0, h - 1, ASCII_BLOCK1));
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return <div className={cls("ascii", styles.root)}>{grid}</div>;
};

export default memo(Background);
