import {MouseEvent, MouseEventHandler} from "react";

import cls from "classnames";

const Button = (props: {
  name: string;
  handler: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      className={cls("ascii", props.className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.blur();
        props.handler(e);
      }}>
      {props.name}
    </button>
  );
};

export default Button;
