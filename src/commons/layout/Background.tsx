import {memo, useEffect, useState} from "react";

import {
  ASCII_BLOCK1,
  ASCII_BLOCK2,
  ASCII_BLOCK3,
  ASCII_SPACE,
} from "@commons/constants";
import styles from "@layout/Background.module.css";
import {getVariableFromCSS} from "@utils/styles";

import useDebug from "@hooks/useDebug";

import cls from "classnames";

const getPos = (x: number, y: number, w: number, h: number): number =>
  (y % h) * w + (x % w);

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const [grid, setGrid] = useState<string>("");

  const mw = parseInt(getVariableFromCSS("menu-width"));

  useEffect(() => {
    setGrid(() => {
      const g = ASCII_SPACE.repeat(w * h).split("");
      g[getPos(w - 3, 1, w, h)] = ASCII_BLOCK1;
      g[getPos(w - 2, 1, w, h)] = ASCII_BLOCK2;
      g[getPos(w - 1, 1, w, h)] = ASCII_BLOCK3;
      g[getPos(mw - 1, 0, w, h)] = ASCII_BLOCK1;
      //g[getPos(mw - 1, 3, w, h)] = ASCII_BLOCK3; /* scrollbar test */
      g[getPos(mw + 2, h - 3, w, h)] = ASCII_BLOCK2;
      g[getPos(w - 1, h - 3, w, h)] = ASCII_BLOCK1;
      g[getPos(0, h - 1, w, h)] = ASCII_BLOCK1;
      return g.join("");
    });
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return <div className={cls("ascii", styles.root)}>{grid}</div>;
};

export default memo(Background);
