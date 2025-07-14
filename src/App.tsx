import type {ProfilerOnRenderCallback} from "react";
import {Profiler, useEffect, useRef, useState} from "react";
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

import styles from "@/App.module.css";

import "@styles/debug.css";
import "@styles/main.css";
import "@styles/vt220.css";

import Chat from "@chat/Chat";
import Home from "@home/Home";
import useDebug from "@hooks/useDebug";
import useStorage from "@hooks/useStorage";
import cls from "classnames";

export interface RenderTime {
  phase: string;
  duration: number;
}

const Layout = () => {
  const debug = useDebug();
  const storage = useStorage();

  const beforeUnloadHandler = () => {
    storage.save();
  };

  useEffect(() => {
    storage.load();

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [darkMode, toggleDarkMode] = useState(isSystemDarkModeOn());

  const themeSwitchHandler = () => {
    toggleDarkMode(!darkMode);
  };

  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const [cw, setCharWidth] = useState<number>(getCharWidth());
  const [lh, setLineHeight] = useState<number>(getCharHeight());
  const [w, setWidth] = useState<number>(window.innerWidth);
  const [h, setHeight] = useState<number>(window.innerHeight);

  const update = () => {
    const root = rootRef.current;
    if (!root) return;

    setCharWidth(getCharWidth());
    setLineHeight(getLineHeight());

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setWidth(vw - (vw % cw));
    setHeight(vh - (vh % lh));

    if (debug)
      console.info(
        `%cresize screen: ${w.toFixed(0)} x ${h.toFixed(0)}`,
        "color:#999",
      );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(update);
    if (rootRef.current) resizeObserver.observe(rootRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  });

  const renderTime = useRef<RenderTime>({
    phase: "none",
    duration: 0,
  });

  const profilerCallback: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
  ) => {
    renderTime.current = {phase, duration: actualDuration};
    const favicon = document.getElementById("favicon");
    if (favicon) favicon.style.display = debug ? "block" : "none";
    if (debug)
      console.info(
        `%c${id} ${phase}: ${Math.round(actualDuration)} ms / ${Math.round(baseDuration)} ms`,
        "color:#999",
      );
  };

  return (
    <Profiler id="app" onRender={profilerCallback}>
      <div
        ref={rootRef}
        className={cls(styles.root, !darkMode || "dark", !debug || "debug")}
        style={{
          marginTop: `calc((100vh - (${h - cw * 2}px)) / 2)`,
          marginLeft: `calc((100vw - (${w - cw * 2}px)) / 2)`,
        }}>
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
              top: `${cw}px`,
              width: `${w - cw * 4}px`,
              height: `${h - cw * 4}px`,
            }}>
            <Menu />
            <Line variant="vertical" className={styles["v-line"]} />
            <div className={styles.content}>
              <Header darkMode={darkMode} onThemeToggle={themeSwitchHandler} />
              <Line variant="horizontal" className={styles["h-line"]} />
              <div ref={bodyRef} className={styles.body}>
                <Outlet />
              </div>
              <Line variant="horizontal" className={styles["h-line"]} />
              <Footer renderTime={renderTime.current} />
            </div>
          </div>
        </div>
      </div>
    </Profiler>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:id?" element={<Chat />} />
        <Route path="/help" element={<>HELP</>} />
      </Route>
    </Routes>
  </Router>
);

export default App;
