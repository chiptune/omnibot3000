import {memo, useEffect, useRef, useState} from "react";

import {getPromptPlaceholder} from "@api/api";
import {BUTTON_SUBMIT} from "@commons/constants";

import styles from "@chat/components/Prompt.module.css";

import useKeyPress from "@hooks/useKeyPress";
import cls from "classnames";

export const PromptDisplay = (props: {prompt: string; caret?: boolean}) => {
  const lines: string[] = String(props.prompt || "").split("\n");
  return lines.map((line: string, i: number) => (
    <span
      key={`prompt-line-${i}`}
      className={cls("text", styles["prompt-line"])}
      style={{clear: i > 0 ? "both" : "none"}}>
      {line}
      {props.caret && i === lines.length - 1 && (
        <span className={cls("ascii", "blink", styles.caret)}>{"_"}</span>
      )}
    </span>
  ));
};

const Prompt = (props: {
  loading: boolean;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (e: React.FormEvent) => void;
}) => {
  const {loading, prompt} = props;

  const hasRunOnce = useRef(false);

  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDisabled = loading || String(prompt).replace("\n", "").trim() === "";

  const backSpace = useKeyPress("Backspace", {meta: false});

  const updatePlaceholder = async () => {
    const data = await getPromptPlaceholder();
    setPlaceholders(
      data
        .split("\n")
        .filter((v) => v.trim() !== "")
        .map((v) => v.trim()),
    );
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    updatePlaceholder();

    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        if (e.shiftKey) props.setPrompt((prompt) => prompt + "\n");
        return;
      }
      props.setPrompt((prompt) => prompt + e.key);
    };

    window.addEventListener("keypress", (e) => handleKeyPress(e));
    return window.removeEventListener("keypress", (e) => handleKeyPress(e));
  }, []);

  useEffect(() => {
    if (backSpace === 1)
      props.setPrompt((prompt) => prompt.substring(0, prompt.length - 1));
  }, [backSpace]);

  useEffect(() => {
    if (prompt.length === 0)
      setCount(Math.round(Math.random() * (placeholders.length - 1)));
  }, [prompt, placeholders]);

  return (
    <form ref={formRef} onSubmit={props.submitHandler} className={styles.form}>
      <div>{">"}</div>
      <div className={cls("ascii", styles.prompt)}>
        <div className={cls("text", styles.placeholder)}>
          <div className={styles[prompt ? "hide" : "show"]}>
            {placeholders[count]}
          </div>
        </div>
        <div>
          <PromptDisplay prompt={prompt} caret />
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
          className={cls("ascii", styles.submit)}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}>
          {BUTTON_SUBMIT}
        </button>
      </div>
    </form>
  );
};

export default memo(Prompt);
