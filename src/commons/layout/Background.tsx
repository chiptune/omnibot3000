import {memo, useEffect, useState} from "react";

import {ASCII_SPACE} from "@commons/constants";
import styles from "@layout/Background.module.css";

import useDebug from "@hooks/useDebug";
import cls from "classnames";

const chars = ASCII_SPACE;

const Background = (props: {w: number; h: number}) => {
  const debug = useDebug();
  const {w, h} = props;

  const [grid, setGrid] = useState<string[]>([]);

  useEffect(() => {
    const g = [];
    //let n = 0;
    for (let y = 0; y < h; y++) {
      g[y] = "";
      for (let x = 0; x < w; x++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        //const char = String.fromCharCode(n % 256);
        //n++;
        g[y] += char;
      }
    }
    setGrid(g);
    if (debug) console.info(`%cresize grid: ${w} x ${h}`, "color:#999");
  }, [w, h]);

  return (
    <div className={cls("ascii", styles.root)}>
      {grid.map((char, y) => (
        <div key={`grid-${y}`} className={styles.line}>
          {char}
        </div>
      ))}
    </div>
  );
};

export default memo(Background);
