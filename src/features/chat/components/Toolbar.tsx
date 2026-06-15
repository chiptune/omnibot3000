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
import {lead} from "@utils/math";

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
  number: number;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setParentId: React.Dispatch<React.SetStateAction<CompletionId>>;
  setRetry: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const chatStore = useChatCompletionStore();
  const storage = useStorage();

  const {setQuery, setParentId, setRetry} = props;

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
    setRetry(number);
  };

  const loadCompletion = (id: CompletionId, index: number) => {
    log(`load ${id} (index: ${index})`, "chat");
    const c = chatStore.findCompletion(id, index);
    if (!c) return;
    chatStore.updateIndex(c.parentId, index);
    storage.save();
    const conversation = chatStore.readConversation(chatStore.chatId);
    setParentId(conversation[conversation.length - 1]?.id);
  };

  const {completion, number} = props;

  let parent;
  if (completion.parentId === chatStore.chatId) {
    const chat = chatStore.readChat(chatStore.chatId);
    parent = {
      id: chat?.id,
      children: chatStore.completions.filter((c) => c.parentId === chat?.id),
      index: chat?.index ?? 0,
    };
  } else {
    parent = chatStore.readCompletion(completion.parentId);
  }

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
            <span>{`${lead(parent.index + 1, parent.children.length)}/${parent.children.length}`}</span>
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
