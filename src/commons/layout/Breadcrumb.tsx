import {Fragment, memo, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {NAME} from "@commons/constants";
import styles from "@layout/Breadcrumb.module.css";
import Button from "@ui/Button";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

const Breadcrumb = () => {
  const chatStore = useChatCompletionStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    const path = location.pathname.split("/").filter((v) => v.trim() !== "");
    switch (path[0]) {
      case "chat":
        if (path[1]) path[1] = "id";
        break;
    }
    setPath(path);
    document.title = `${NAME} /${path.join("/")}`;
  }, [location]);

  return (
    <nav className={styles.root}>
      {path.map((v, i) => {
        return (
          <Fragment key={`breadcrumb-${i}`}>
            <span className={styles.separator}>/</span>
            {i < path.length - 1 ? (
              <Button
                className={styles.button}
                name={v}
                handler={() => {
                  if (v === "chat") chatStore.resetChat();
                  navigate(`/${path.slice(0, i + 1).join("/")}`);
                }}
              />
            ) : (
              <span>{v}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default memo(Breadcrumb);
