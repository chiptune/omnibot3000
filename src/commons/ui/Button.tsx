import {MouseEvent, MouseEventHandler} from "react";

const Button = (props: {
  name: string;
  handler: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className="ascii"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        props.handler(e);
      }}>
      {props.name}
    </button>
  );
};

export default Button;
