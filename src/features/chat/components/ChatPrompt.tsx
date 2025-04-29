import {memo, useEffect, useRef} from "react";

import {BUTTON_SUBMIT} from "@commons/constants";

import styles from "./ChatPrompt.module.css";

import useKeyPress from "@hooks/useKeyPress";
import cls from "classnames";

const ChatPrompt = (props: {
  loading: boolean;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (e: React.FormEvent) => void;
}) => {
  const {loading, prompt} = props;

  const hasRunOnce = useRef(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  const isDisabled = loading || String(prompt).replace("\n", "").trim() === "";

  const submitOnEnter = useKeyPress("Enter", {meta: false}); // true to allow new line
  const backSpace = useKeyPress("Backspace", {meta: false});

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

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
    if (backSpace === true) {
      props.setPrompt((prompt) => prompt.substring(0, prompt.length - 1));
    }
  }, [backSpace]);

  useEffect(() => {
    console.log("update prompt", prompt);
  }, [prompt]);

  /* update the chat when the user submit the prompt using enter */
  useEffect(() => {
    if (submitOnEnter === true) {
      if (inputRef.current) inputRef.current.defaultValue = "";
      if (promptRef.current) promptRef.current.innerHTML = "";
    }
  }, [submitOnEnter]);

  return (
    <form ref={formRef} onSubmit={props.submitHandler} className={styles.form}>
      <div>{">"}</div>
      <div className={cls("ascii", styles.prompt)}>
        <div
          className={styles.placeholder}
          style={{
            visibility: prompt ? "hidden" : "visible",
          }}>
          formulate your query{/* generate random placeholder */}
        </div>
        <div>
          <span ref={promptRef}>
            {prompt.split("\n").map((line, i) => (
              <div key={`prompt-line-${i}`} className={styles["prompt-line"]}>
                {line}
              </div>
            ))}
          </span>
          <span className={cls("ascii", "blink", styles.caret)}>{"_"}</span>
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

export default memo(ChatPrompt);
