import {memo, useEffect, useRef, useState} from "react";

import {getPromptPlaceholder} from "@api/api";
import {ASCII_BLOCK3, BUTTON_SUBMIT} from "@commons/constants";
import {clamp} from "@utils/math";

import styles from "@chat/components/Prompt.module.css";

import cls from "classnames";

export const KEYS: string[] = [
  "Escape",
  "Control",
  "Meta",
  "Shift",
  "Alt",
  "Dead",
  "CapsLock",
  "ArrowUp",
  "ArrowDown",
  "Insert",
  "Delete",
];

export const PromptDisplay = (props: {prompt: string; caret: number}) => {
  const {prompt, caret} = props;
  const lines: string[] = String(prompt || "").split("\n");
  let count = 0;
  return lines.map((line: string, i: number) => {
    let cp = 0;
    if (caret >= count && caret < count + line.length) cp = caret - count;
    count += line.length;
    return (
      <div
        key={`prompt-line-${i}`}
        className={cls("text", styles["prompt-line"])}
        style={{clear: i > 0 ? "both" : "none"}}>
        {line}
        {cp >= 0 && cp <= line.length ? (
          <div
            className={cls("blink", styles.caret)}
            style={{marginLeft: `calc(var(--font-width) * ${caret})`}}>
            {ASCII_BLOCK3}
          </div>
        ) : null}
      </div>
    );
  });
};

const Prompt = (props: {
  loading: boolean;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (e: React.FormEvent) => void;
}) => {
  const {loading, prompt, setPrompt} = props;

  const keyEvent = useRef<KeyboardEvent>();
  const hasRunOnce = useRef<boolean>(false);

  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [caret, setCaret] = useState<number>(0);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDisabled = loading || String(prompt).replace("\n", "").trim() === "";

  const updatePlaceholder = async () => {
    const data = await getPromptPlaceholder();
    setPlaceholders(
      data
        .split("\n")
        .filter((v) => v.trim() !== "")
        .map((v) => v.trim()),
    );
  };

  function handleInput(e: KeyboardEvent): void {
    keyEvent.current = e;
    setForceUpdate((n) => (n + 1) % 256);
  }

  useEffect(() => {
    const {key, shiftKey} = keyEvent.current || {};

    if (!key || KEYS.includes(key)) return;

    let p = prompt;
    let c = caret;

    switch (key) {
      case "Enter":
        if (shiftKey) setPrompt((p) => p + "\n");
        break;
      case "Tab":
        p += "\t";
        break;
      case "Backspace":
        p = `${p.substring(0, c - 1)}${p.substring(c)}`;
        c--;
        break;
      case "ArrowLeft":
        c--;
        break;
      case "ArrowRight":
        c++;
        break;
      case "PageUp":
        c = 0;
        break;
      case "PageDown":
        c = Infinity;
        break;
      case "Home":
        c = 0;
        break;
      case "End":
        c = Infinity;
        break;
      default:
        p = `${p.substring(0, c)}${key}${p.substring(c)}`;
        c++;
    }
    setPrompt(p);
    setCaret(clamp(c, 0, p.length));
  }, [forceUpdate]);

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    updatePlaceholder();
    window.addEventListener("keydown", (e) => handleInput(e));
    return window.removeEventListener("keydown", (e) => handleInput(e));
  });

  useEffect(() => {
    if (prompt.length === 0)
      setCount(Math.round(Math.random() * (placeholders.length - 1)));
  }, [prompt, placeholders]);

  return (
    <form ref={formRef} onSubmit={props.submitHandler} className={styles.form}>
      <div className={styles.pill}>{">"}</div>
      <div className={cls("ascii", styles.prompt)}>
        <div className={cls("text", styles.placeholder)}>
          <div
            className={
              styles[prompt || placeholders.length === 0 ? "hide" : "show"]
            }>
            {placeholders[count]}
          </div>
        </div>
        <div>
          <PromptDisplay prompt={prompt} caret={caret} />
        </div>
      </div>
      <input
        ref={inputRef}
        name="prompt"
        className={styles.input}
        defaultValue={!loading && prompt ? prompt : ""}
      />
      <div>
        <button
          type="submit"
          disabled={isDisabled}
          className={cls("ascii", styles.submit)}>
          {BUTTON_SUBMIT}
        </button>
      </div>
    </form>
  );
};

export default memo(Prompt);
