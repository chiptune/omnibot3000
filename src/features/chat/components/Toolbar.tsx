import {memo} from "react";

import {BUTTON_DELETE} from "@commons/constants";
import Button from "@ui/Button";
import Line from "@ui/Line";

import useStorage from "@hooks/useStorage";

import styles from "@chat/components/Toolbar.module.css";
import useChatCompletionStore, {
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";

import cls from "classnames";

const Toolbar = (props: {completion: Completion}) => {
  const chatStore = useChatCompletionStore();
  const storage = useStorage();

  const deleteCompletion = (id: CompletionId) => {
    chatStore.deleteCompletion(id);
    storage.save();
  };

  const {completion} = props;

  return (
    <footer className={styles.root}>
      <div className={styles.corner}>+</div>
      <Line variant="horizontal" className={styles["line"]} />
      <div className={cls("text", styles.toolbar)}>
        <Button
          name={BUTTON_DELETE}
          handler={() => {
            deleteCompletion(completion.id);
          }}
        />
      </div>
    </footer>
  );
};

export default memo(Toolbar);
