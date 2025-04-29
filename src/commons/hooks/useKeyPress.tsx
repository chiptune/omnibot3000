import {useEffect, useState} from "react";

export type Modifiers = {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
};

function useKeyPress(targetKey: string, modifiers: Modifiers) {
  const [keyPressed, setKeyPressed] = useState(false);

  const getModifiers = (e: KeyboardEvent): Modifiers => ({
    shift: Boolean(e.shiftKey),
    ctrl: Boolean(e.ctrlKey),
    alt: Boolean(e.altKey),
    meta: Boolean(e.metaKey),
  });

  const detectModifiers = (
    sourceMod: Modifiers,
    targetMod: Modifiers,
  ): boolean =>
    Boolean(sourceMod.shift) === Boolean(targetMod.shift) &&
    Boolean(sourceMod.ctrl) === Boolean(targetMod.ctrl) &&
    Boolean(sourceMod.alt) === Boolean(targetMod.alt) &&
    Boolean(sourceMod.meta) === Boolean(targetMod.meta);

  const onKeyDownHandler = (key: string, mod: Modifiers): void => {
    if (detectModifiers(modifiers, mod) && key === targetKey)
      setKeyPressed(true);
  };

  const onKeyUpHandler = (key: string, mod: Modifiers): void => {
    if (
      !detectModifiers(modifiers, mod) ||
      (detectModifiers(modifiers, mod) && key === targetKey)
    )
      setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) =>
      onKeyDownHandler(e.key, getModifiers(e)),
    );
    window.addEventListener("keyup", (e) =>
      onKeyUpHandler(e.key, getModifiers(e)),
    );

    return () => {
      window.removeEventListener("keydown", (e) =>
        onKeyDownHandler(e.key, getModifiers(e)),
      );
      window.removeEventListener("keyup", (e) =>
        onKeyUpHandler(e.key, getModifiers(e)),
      );
    };
  }); // create this event only on first run

  return keyPressed;
}

export default useKeyPress;
