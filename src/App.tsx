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
import {getCharWidth, getLineHeight} from "@utils/strings";
import {isSystemDarkModeOn} from "@utils/system";

import useDebug from "@hooks/useDebug";
import useStorage from "@hooks/useStorage";

import Chat from "@chat/Chat";
import Help from "@help/Help";
import Home from "@home/Home";

import styles from "@/App.module.css";

import "@styles/debug.css";
import "@styles/main.css";
import "@styles/vt220.css";

import Life from "@life/Life";
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
  const [lh, setLineHeight] = useState<number>(getLineHeight());
  const [w, setWidth] = useState<number>(window.innerWidth);
  const [h, setHeight] = useState<number>(window.innerHeight);

  const update = () => {
    const root = rootRef.current;
    if (!root) return;

    setCharWidth(getCharWidth());
    setLineHeight(getLineHeight());

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setWidth(Math.floor((vw - cw * 2) / cw) * cw);
    setHeight(Math.floor((vh - cw * 4) / lh) * lh + cw * 2);

    let el = document.getElementById("debug-screen-size");
    if (!el) {
      el = document.createElement("div");
      el.id = "debug-screen-size";
      el.className = "debug-info";
      document.body.appendChild(el);
    }
    el.innerHTML = `screen: ${vw}x${vh} | char: ${cw}x${lh} | w: ${w} | h: ${h}`;
    el.style.visibility = debug ? "visible" : "hidden";
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
          marginTop: `${(window.innerHeight - h) / 2}px`,
          marginLeft: `${(window.innerWidth - w) / 2}px`,
        }}>
        <div
          className={cls("ascii", styles.screen)}
          style={{
            width: `${w - cw * 2}px`,
            height: `${h - cw * 2}px`,
          }}>
          <Background
            w={Math.floor((w - cw * 2) / cw)}
            h={Math.floor((h - cw * 2) / lh)}
          />
          <div
            className={styles.tty}
            style={{
              width: `${w - cw * 2}px`,
              height: `${h - cw * 2}px`,
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
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:id?" element={<Chat />} />
        <Route path="/help" element={<Help />} />
        <Route path="/life" element={<Life />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
