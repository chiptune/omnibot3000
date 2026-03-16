import {memo} from "react";

import {scale, Unit} from "@utils/math";

import cls from "classnames";

const Number = (props: {
  value: number;
  decimal?: number;
  unit?: Unit;
  className?: string;
}) => {
  const nbr = scale(props.value, props.decimal, props.unit);
  return (
    <div
      className={cls("ascii", props.className)}
      style={{
        display: "inline-block",
        userSelect: "none",
        wordWrap: "break-word",
        cursor: "default",
      }}>
      <b>{nbr.value}</b>
      {nbr.unit && <i>{nbr.unit}</i>}
    </div>
  );
};

export default memo(Number);
