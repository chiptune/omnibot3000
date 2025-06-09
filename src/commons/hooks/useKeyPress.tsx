import {useEffect, useState} from "react";

import {clamp} from "@utils/math";

export type Modifiers = {
  shft?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
};

export type Detection = "all" | "keydown" | "keyup";

function useKeyPress(
  targetKey: string,
  modifiers: Modifiers,
  detection: Detection = "all",
): number {
  const [keyCount, setKeyCount] = useState(0);

  const getModifiers = (e: KeyboardEvent): Modifiers => ({
    shft: Boolean(e.shiftKey),
    ctrl: Boolean(e.ctrlKey),
    alt: Boolean(e.altKey),
    meta: Boolean(e.metaKey),
  });

  const detectModifiers = (
    sourceMod: Modifiers,
    targetMod: Modifiers,
  ): boolean =>
    Boolean(sourceMod.shft) === Boolean(targetMod.shft) &&
    Boolean(sourceMod.ctrl) === Boolean(targetMod.ctrl) &&
    Boolean(sourceMod.alt) === Boolean(targetMod.alt) &&
    Boolean(sourceMod.meta) === Boolean(targetMod.meta);

  const onKeyDownHandler = (key: string, mod: Modifiers): void => {
    if (detectModifiers(modifiers, mod) && key === targetKey)
      setKeyCount((n) => clamp(n + 1, 0, 16));
    else setKeyCount(0);
  };

  const onKeyUpHandler = (key: string, mod: Modifiers): void => {
    if (
      !detectModifiers(modifiers, mod) ||
      (detectModifiers(modifiers, mod) && key === targetKey)
    )
      setKeyCount(0);
  };

  useEffect(() => {
    if (detection === "all" || detection === "keydown")
      window.addEventListener("keydown", (e) =>
        onKeyDownHandler(e.key, getModifiers(e)),
      );
    if (detection === "all" || detection === "keyup")
      window.addEventListener("keyup", (e) =>
        onKeyUpHandler(e.key, getModifiers(e)),
      );

    return () => {
      if (detection === "all" || detection === "keydown")
        window.removeEventListener("keydown", (e) =>
          onKeyDownHandler(e.key, getModifiers(e)),
        );
      if (detection === "all" || detection === "keyup")
        window.removeEventListener("keyup", (e) =>
          onKeyUpHandler(e.key, getModifiers(e)),
        );
    };
  }); // create this event only on first run

  return keyCount;
}

export default useKeyPress;
