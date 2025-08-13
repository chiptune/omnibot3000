import {memo} from "react";

import {ASCII_BLOCK3} from "@commons/constants";

const Caret = () => (
  <div
    className={"blink"}
    style={{
      display: "inline",
      width: "var(--font-width)",
      height: "var(--line-height)",
      opacity: "var(--opacity-primary)",
      userSelect: "none",
      cursor: "default !important",
    }}>
    {ASCII_BLOCK3}
  </div>
);

export default memo(Caret);
