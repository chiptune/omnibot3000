import {useEffect, useState} from "react";

import styles from "./Background.module.css";

import cls from "classnames";

const chars = "X";

const Background = (props: {w: number; h: number}) => {
  const {w, h} = props;

  const [grid, setGrid] = useState<string[]>([]);

  useEffect(() => {
    const g = [];
    for (let y = 0; y < h; y++) {
      g[y] = "";
      for (let x = 0; x < w; x++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        g[y] += char;
      }
    }
    setGrid(g);
    console.info(`%cresize grid: ${w}x${h}`, "color:#999");
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

export default Background;
