import {ReactNode, useState} from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";

const ButtonMenu = (props: {
  type?: "button" | "icon";
  name?: ReactNode;
  tooltip?: string;
  children: ReactNode;
}) => {
  const {type, name, tooltip, children} = props;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const open = Boolean(anchor);

  const openMenuHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };
  const closeMenuHandler = () => {
    setAnchor(null);
  };

  const ButtonProps = {
    onClick: openMenuHandler,
  };

  return (
    <>
      <Tooltip title={tooltip}>
        {type !== "icon" ? (
          <Button {...ButtonProps}>{name}</Button>
        ) : (
          <IconButton {...ButtonProps}>{name}</IconButton>
        )}
      </Tooltip>
      <Menu anchorEl={anchor} open={open} onClose={closeMenuHandler}>
        {children}
      </Menu>
    </>
  );
};

export default ButtonMenu;
