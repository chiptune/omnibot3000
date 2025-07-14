import {Fragment, memo, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

import {NAME} from "@commons/constants";
import styles from "@layout/Breadcrumb.module.css";

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    console.log("Breadcrumb", location);
    const path = location.pathname.split("/").filter((v) => v.trim() !== "");
    switch (path[0]) {
      case "chat":
        if (path[1]) path[1] = "<id>";
        break;
    }
    setPath(path);
    document.title = `${NAME} /${path.join("/")}`;
  }, [location]);

  return (
    <div className={styles.root}>
      {path.map((v, i) => {
        return (
          <Fragment key={`breadcrumb-${i}`}>
            <span className={styles.separator}>/</span>
            {i < path.length - 1 ? (
              <Link
                className={styles.path}
                to={`/${path.slice(0, i + 1).join("/")}`}
                replace={true}>
                {v}
              </Link>
            ) : (
              <span className={styles.path}>{v}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default memo(Breadcrumb);
