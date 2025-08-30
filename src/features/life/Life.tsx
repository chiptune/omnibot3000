import {memo, useEffect, useRef} from "react";

import styles from "@life/life.module.css";

const Life = () => {
  const hasRunOnce = useRef(false);

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;
  }, []);

  return <div className={styles.root}></div>;
};

export default memo(Life);
