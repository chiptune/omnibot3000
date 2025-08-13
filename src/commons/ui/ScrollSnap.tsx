import React, {memo, useEffect, useRef} from "react";

import {ASCII_SPACE} from "@commons/constants";
import {getLineHeight} from "@utils/strings";

const ScrollSnap = (props: {
  content: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) => {
  const lh = getLineHeight();

  const snapRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = snapRef.current;
    const content = props.content.current as HTMLDivElement | null;
    if (!content || !ul) return;

    const update = () => {
      ul.innerHTML = "";
      const h = content.clientHeight;

      for (let i = 0; i < Math.round(h / lh); i++) {
        const li = document.createElement("li");
        li.innerHTML = ASCII_SPACE;
        ul.appendChild(li);
      }
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ul
      ref={snapRef}
      className={props.className}
      style={{
        userSelect: "none",
        cursor: "default",
      }}></ul>
  );
};

export default memo(ScrollSnap);
