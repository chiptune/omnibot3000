import {memo} from "react";

import {BUTTON_CLEAR} from "@commons/constants";
import Button from "@ui/Button";
import Line from "@ui/Line";

import styles from "@chat/components/Toolbar.module.css";

import useChatCompletionStore, {
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";
import useStorage from "@hooks/useStorage";
import cls from "classnames";

const Toolbar = (props: {completion: Completion}) => {
  //const chatStore = useChatCompletionStore();
  const storage = useStorage();

  const removeCompletion = (id: CompletionId) => {
    //chatStore.removeCompletion(id);
    storage.save();
  };

  const {completion} = props;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.corner}>{"°"}</div>
        <Line variant="horizontal" className={styles["line"]} />
      </div>
      <div className={cls("text", styles.toolbar)}>
        <Button
          name={BUTTON_CLEAR}
          handler={() => {
            removeCompletion(completion.id);
          }}
        />
      </div>
    </div>
  );
};

export default memo(Toolbar);
