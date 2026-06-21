import React, {FormEvent, memo, useEffect, useRef, useState} from "react";

import Button from "@root/src/commons/ui/Button";

import {getInputPlaceholder} from "@api/api";
import {BUTTON_SUBMIT} from "@commons/constants";
import {formatText} from "@utils/strings";

import useCli from "@hooks/useCli";

import {handleKeyboardInput} from "./utils/keyboard";

import styles from "@cli/Cli.module.css";

import RenderCli from "@cli/components/RenderCli";
import cls from "classnames";

const Cli = () => {
  const keyEvent = useRef<KeyboardEvent>(undefined);
  const hasRunOnce = useRef<boolean>(false);

  const [input, setInput] = useState<string[]>([""]);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [line, setLine] = useState<number>(0);
  const [caret, setCaret] = useState<number>(0);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const cli = useCli();
  const {blocked} = cli;

  const isDisabled = blocked || input.join("").trim() === "";

  const updatePlaceholder = async () => {
    const data = await getInputPlaceholder();
    setPlaceholders(
      data
        .split("\n")
        .filter((v) => v.trim() !== "")
        .map((v) => formatText(v.trim())),
    );
  };

  const handleInput = (e: KeyboardEvent): void => {
    keyEvent.current = e;
    setForceUpdate((n) => (n + 1) % 256);
  };

  useEffect(() => {
    if (blocked) return;
    const {
      input: p,
      line: l,
      caret: c,
    } = handleKeyboardInput(keyEvent.current, input, line, caret, cli.submit);
    setInput(p);
    setLine(l);
    setCaret(c);
  }, [forceUpdate]);

  const pasteQuery = (e: ClipboardEvent) => {
    const data = e.clipboardData;
    if (!data) return;
    const text = data.getData("text/plain");
    if (text.trim() === "") return;
    const query = text.split("\n");
    setInput(query);
    setLine(query.length - 1);
    setCaret(query[query.length - 1].length);
  };

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    updatePlaceholder();

    window.addEventListener("paste", (e) => pasteQuery(e));
    window.addEventListener("keydown", (e) => handleInput(e));
    return () => {
      window.removeEventListener("keydown", (e) => handleInput(e));
      window.removeEventListener("paste", (e) => pasteQuery(e));
    };
  }, []);

  useEffect(() => {
    if (input[input.length - 1].length === 0)
      setCount(Math.round(Math.random() * (placeholders.length - 1)));
  }, [input[input.length - 1], placeholders]);

  return (
    <div ref={rootRef} className={styles.root}>
      <form
        ref={formRef}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          cli.submit(input);
          setInput([""]);
          setLine(0);
          setCaret(0);
        }}
        onPaste={(e: React.ClipboardEvent) => {
          e.preventDefault();
          pasteQuery(e.nativeEvent);
        }}
        className={styles.form}>
        <div className={styles.pill}>{">"}</div>
        <div className={styles.command}>
          <div className={cls("text", styles.placeholder)}>
            <div
              className={
                styles[
                  input.join() || placeholders.length === 0 ? "hide" : "show"
                ]
              }>
              {placeholders[count]}
            </div>
          </div>
          <RenderCli
            command={input}
            line={line}
            caret={caret}
            blocked={blocked}
          />
        </div>
        <input
          name="command"
          className={styles.input}
          defaultValue={!isDisabled && input ? input.join("\n") : ""}
          autoComplete="off"
        />
        <div>
          <Button
            name={BUTTON_SUBMIT}
            handler={() => formRef.current?.requestSubmit()}
            className={styles.submit}
            disabled={isDisabled}
          />
        </div>
        <div className={styles.pill}></div>
      </form>
    </div>
  );
};

export default memo(Cli);
