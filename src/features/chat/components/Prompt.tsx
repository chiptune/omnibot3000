import {FormEvent, memo, useEffect, useRef, useState} from "react";

import {getPromptPlaceholder} from "@api/api";
import {ASCII_BLOCK3, BUTTON_SUBMIT} from "@commons/constants";

import {getVariableFromCSS} from "@/commons/utils/styles";

import styles from "@chat/components/Prompt.module.css";

import cmd from "@console/cmd";
import cls from "classnames";

export const KEYS: string[] = [
  "Escape",
  "Control",
  "Meta",
  "Shift",
  "Alt",
  "Dead",
  "CapsLock",
  "Insert",
  "Delete",
];

export const PromptDisplay = (props: {
  prompt: string[];
  line: number;
  caret: number;
}) => {
  const {prompt, line, caret} = props;
  return (
    <div
      style={{
        height: `calc(${prompt.length} * var(--line-height)`,
      }}>
      {prompt.map((text: string, i: number) => {
        return (
          <div
            key={`prompt-line-${i}`}
            className={cls("text", styles["prompt-line"])}
            style={{clear: i > 0 ? "both" : "none"}}>
            {text}
            {i === line ? (
              <div className={cls("blink", styles.caret)}>
                {`${" ".repeat(caret)}${ASCII_BLOCK3}`}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const Prompt = (props: {
  loading: boolean;
  prompt: string[];
  setPrompt: React.Dispatch<React.SetStateAction<string[]>>;
  submitHandler: (query: string) => void;
}) => {
  const {loading, prompt, setPrompt, submitHandler} = props;

  const keyEvent = useRef<KeyboardEvent>(undefined);
  const hasRunOnce = useRef<boolean>(false);

  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [line, setLine] = useState<number>(0);
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
    const {key, shiftKey, ctrlKey, metaKey} = keyEvent.current || {};

    if (!key || KEYS.includes(key)) return;

    const tabSize = parseInt(getVariableFromCSS("tab-size")) || 2;

    let p = prompt;
    let l = line;
    let c = caret;

    switch (key) {
      case "Enter":
        if (shiftKey) {
          l++;
          p.splice(l, 0, p[l - 1].substring(c));
          p[l - 1] = p[l - 1].substring(0, c);
        } else {
          if (p[0].charAt(0) === "/") {
            cmd(p[0].substring(1));
          } else {
            submitHandler(p.join("\n"));
          }
          p = [""];
          l = 0;
        }
        c = 0;
        break;
      case "Tab":
        p[l] += " ".repeat(tabSize);
        c += tabSize;
        break;
      case "Backspace":
        if (c > 0) {
          p[l] = `${p[l].substring(0, c - 1)}${p[l].substring(c)}`;
          c--;
        } else if (l > 0) {
          l--;
          p[l] += p[l + 1];
          c = p[l].length - p[l + 1].length;
          p.splice(l + 1, 1);
        }
        break;
      case "ArrowLeft":
        c--;
        if (c < 0) {
          if (l > 0) {
            l--;
            c = p[l].length;
          } else {
            c = 0;
          }
        }
        break;
      case "ArrowRight":
        c++;
        if (c > p[l].length) {
          if (l < prompt.length - 1) {
            l++;
            c = 0;
          } else {
            c = p[l].length;
          }
        }
        break;
      case "ArrowUp":
        l--;
        if (l < 0) {
          l = 0;
          c = 0;
        } else {
          c = Math.min(c, p[l].length);
        }
        break;
      case "ArrowDown":
        l++;
        if (l > prompt.length - 1) {
          l = prompt.length - 1;
          c = p[l].length;
        } else {
          c = Math.min(c, p[l].length);
        }
        break;
      case "PageUp":
        c = 0;
        break;
      case "PageDown":
        c = p[l].length;
        break;
      case "Home":
        l = 0;
        c = 0;
        break;
      case "End":
        l = prompt.length - 1;
        c = p[l].length;
        break;
      default:
        if (!ctrlKey && !metaKey) {
          p[l] = `${p[l].substring(0, c)}${key}${p[l].substring(c)}`;
          c++;
        }
    }

    if (ctrlKey) {
      switch (key) {
        case "a":
          c = 0;
          break;
        case "e":
          c = p[l].length;
          break;
        case "u":
          p[l] = p[l].substring(c);
          c = 0;
          break;
        case "k":
          p[l] = p[l].substring(0, c);
          break;
      }
    }

    setPrompt(p);
    setLine(l);
    setCaret(c);
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
    <form
      ref={formRef}
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        submitHandler(prompt.join("\n"));
        setPrompt([""]);
        setLine(0);
        setCaret(0);
      }}
      className={styles.form}>
      <div className={styles.pill}>{">"}</div>
      <div className={cls("ascii", styles.prompt)}>
        <div className={cls("text", styles.placeholder)}>
          <div
            className={
              styles[
                prompt.join() || placeholders.length === 0 ? "hide" : "show"
              ]
            }>
            {placeholders[count]}
          </div>
        </div>
        <PromptDisplay prompt={prompt} line={line} caret={caret} />
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
