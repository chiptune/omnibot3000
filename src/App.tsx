import {useEffect, useRef, useState} from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Background from "@layout/Background";
import Footer from "@layout/Footer";
import Header from "@layout/Header";
import Menu from "@layout/Menu";
import Line from "@ui/Line";
import {getCharHeight, getCharWidth, getLineHeight} from "@utils/strings";
import {isSystemDarkModeOn} from "@utils/system";
import {displayPackageVersion} from "@utils/version";

import styles from "@/App.module.css";

import "@styles/debug.css";
import "@styles/main.css";
import "@styles/vt-220.css";

import Chat from "@chat/Chat";
import useKeyPress from "@hooks/useKeyPress";
import cls from "classnames";

const Layout = () => {
  const debugHotKey = useKeyPress("Escape", {shift: true});
  const [debug, toggleDebug] = useState(false);
  const [darkMode, toggleDarkMode] = useState(isSystemDarkModeOn());

  const themeSwitchHandler = () => {
    toggleDarkMode(!darkMode);
  };

  const rootRef = useRef<HTMLDivElement | null>(null);

  const [cw, setCharWidth] = useState<number>(getCharWidth());
  const [lh, setLineHeight] = useState<number>(getCharHeight());
  const [w, setWidth] = useState<number>(window.innerWidth);
  const [h, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const update = () => {
      const root = rootRef.current;
      if (!root) return;

      setCharWidth(getCharWidth());
      setLineHeight(getLineHeight(root));

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      setWidth(vw - (vw % cw));
      setHeight(vh - (vh % cw));

      console.info(
        `%cresize screen: ${w.toFixed(0)}x${h.toFixed(0)}`,
        "color:#999",
      );
    };

    const resizeObserver = new ResizeObserver(update);
    if (rootRef.current) {
      resizeObserver.observe(rootRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [w, h]);

  useEffect(() => {
    toggleDebug(debugHotKey);
    if (!debug) displayPackageVersion();
  }, [debugHotKey]);

  return (
    <div
      ref={rootRef}
      className={cls(styles.root, !darkMode || "dark", !debug || "debug")}
      style={{padding: `${cw}px`}}>
      <div
        className={cls("ascii", styles.screen)}
        style={{
          padding: `${cw}px`,
          width: `${w - cw * 4}px`,
          height: `${h - cw * 4}px`,
        }}>
        <Background w={Math.floor(w / cw) - 4} h={Math.floor(h / lh) - 2} />
        <div
          className={styles.tty}
          style={{
            top: `${cw * 2}px`,
            width: `${w - cw * 4}px`,
            height: `${h - cw * 4}px`,
          }}>
          <Menu />
          <Line variant="vertical" className={styles["v-line"]} />
          <div className={styles.content}>
            <Header darkMode={darkMode} onThemeToggle={themeSwitchHandler} />
            <Line variant="horizontal" char="-" className={styles["h-line"]} />
            <div className={styles.body} style={{}}>
              <Outlet />
            </div>
            <Line variant="horizontal" char="-" className={styles["h-line"]} />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat/:id?" element={<Chat />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
