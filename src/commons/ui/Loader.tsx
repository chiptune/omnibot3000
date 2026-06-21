import {memo, useEffect, useState} from "react";

const LOADER_FRAMES = ["-", "\\", "|", "/"];

const Loader = (props: {className?: string; interval?: number}) => {
  const interval = props.interval ?? 80;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % LOADER_FRAMES.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval]);

  return <span className={props.className}>({LOADER_FRAMES[index]})</span>;
};

export default memo(Loader);
