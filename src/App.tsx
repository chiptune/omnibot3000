import {useEffect, useRef, useState} from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Footer from "@layout/Footer";
import Header from "@layout/Header";
import Menu from "@layout/Menu";
import Line from "@ui/Line";
import {getCharWidth, getLineHeight} from "@utils/strings";
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
  const screenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const root = rootRef.current;
      const screen = screenRef.current;
      if (!root || !screen) return;

      const cw = getCharWidth();
      const lh = getLineHeight(root);

      const w = root.offsetWidth - (root.offsetWidth % cw);
      const h = root.offsetHeight - (root.offsetHeight % lh);
      screen.style.width = `${w - cw * 6}px`;
      screen.style.height = `${h - lh * 3}px`;

      console.info(
        `%cresize screen: ${w.toFixed(0)}x${h.toFixed(0)}`,
        "color:#999",
      );
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    if (rootRef.current) {
      resizeObserver.observe(rootRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    toggleDebug(debugHotKey);
    if (!debug) displayPackageVersion();
  }, [debugHotKey]);

  return (
    <div
      ref={rootRef}
      className={cls(styles.root, !darkMode || "dark", !debug || "debug")}>
      <div ref={screenRef} className={cls("ascii", styles.screen)}>
        <Menu />
        <Line variant="vertical" className={styles["v-line"]} />
        <div className={styles.content}>
          <Header darkMode={darkMode} onThemeToggle={themeSwitchHandler} />
          <Line variant="horizontal" char="-" className={styles["h-line"]} />
          <div className={styles.body}>
            <Outlet />
          </div>
          <Line variant="horizontal" char="-" className={styles["h-line"]} />
          <Footer />
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
