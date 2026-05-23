import {memo, MouseEvent, MouseEventHandler} from "react";

import cls from "classnames";

const Button = (props: {
  name: string;
  handler: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}) => (
  <button
    className={cls("ascii", props.className)}
    onClick={(e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.blur();
      props.handler(e);
    }}
    disabled={props.disabled}>
    {props.name}
  </button>
);

export default memo(Button);
