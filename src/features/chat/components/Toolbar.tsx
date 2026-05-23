import {memo} from "react";

import {
  BUTTON_DELETE,
  BUTTON_LEFT,
  BUTTON_RETRY,
  BUTTON_RIGHT,
} from "@commons/constants";
import Button from "@ui/Button";
import Line from "@ui/Line";
import {log} from "@utils/debug";

import useStorage from "@hooks/useStorage";

import styles from "@chat/components/Toolbar.module.css";
import useChatCompletionStore, {
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";

import cls from "classnames";

const Toolbar = (props: {
  completion: Completion;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setParentId: React.Dispatch<React.SetStateAction<CompletionId | undefined>>;
}) => {
  const chatStore = useChatCompletionStore();
  const storage = useStorage();

  const {setQuery, setParentId} = props;

  const deleteCompletion = (id: CompletionId) => {
    log(`delete ${id}`, "chat");
    chatStore.deleteCompletion(id);
    storage.save();
  };

  const retryCompletion = (id: CompletionId) => {
    const completion = chatStore.readCompletion(id);
    if (!completion) return;
    log(`retry ${completion.id}`, "chat");
    log(`prompt: ${completion.prompt}`, "chat");
    setQuery(completion.prompt);
    setParentId(completion.parentId);
  };

  const loadCompletion = (id: CompletionId, index: number) => {
    const c = chatStore.findCompletion(id, index);
    if (!c) return;
    log(`${c.id} (index: ${c.index})`, "chat");
    storage.save();
  };

  const {completion} = props;
  const parent = chatStore.readCompletion(completion.parentId);

  return (
    <footer className={styles.root}>
      <div className={styles.corner}>+</div>
      <Line variant="horizontal" className={styles["line"]} />
      <div className={cls("text", styles.toolbar)}>
        {completion.parentId && (
          <Button
            name={BUTTON_DELETE}
            handler={() => {
              deleteCompletion(completion.id);
            }}
          />
        )}
        {parent && parent.children.length > 1 && (
          <>
            <Button
              name={BUTTON_LEFT}
              handler={() => {
                loadCompletion(completion.id, parent.index - 1);
              }}
              disabled={parent.index === 0}
            />
            <span>{`${parent.index + 1}/${parent.children.length}`}</span>
            <Button
              name={BUTTON_RIGHT}
              handler={() => {
                loadCompletion(completion.id, parent.index + 1);
              }}
              disabled={parent.index >= parent.children.length - 1}
            />
          </>
        )}
        <Button
          name={BUTTON_RETRY}
          handler={() => {
            retryCompletion(completion.id);
          }}
        />
      </div>
    </footer>
  );
};

export default memo(Toolbar);
