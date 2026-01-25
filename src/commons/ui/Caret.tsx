import {memo} from "react";

import {ASCII_BLOCK3} from "@commons/constants";

const Caret = (props: {hide?: boolean}) => (
  <div
    className={"blink"}
    style={{
      display: "inline",
      width: "var(--font-width)",
      height: "var(--line-height)",
      opacity: "var(--opacity-primary)",
      userSelect: "none",
      cursor: "default !important",
      visibility: props.hide ? "hidden" : "visible",
    }}>
    {ASCII_BLOCK3}
  </div>
);

export default memo(Caret);
