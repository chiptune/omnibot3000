import {Fragment, memo, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {getChatTitle} from "@api/api";
import type {CompletionCallback} from "@api/utils/getStream";
import Container from "@layout/Container";

import useCli from "@hooks/useCli";
import useStorage from "@hooks/useStorage";

import styles from "@chat/Chat.module.css";
import getQuery from "@chat/commons/getQuery";
import Message from "@chat/components/Message";
import Toolbar from "@chat/components/Toolbar";
import useChatCompletionStore, {
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";

const Chat = () => {
  const chatStore = useChatCompletionStore();

  const storage = useStorage();

  const [response, setResponse] = useState<string>("");
  const [completion, setCompletion] = useState<Completion>();
  const [parentId, setParentId] = useState<CompletionId>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [retry, setRetry] = useState<number>(0);
  const [updateTitle, setUpdateTitle] = useState<boolean>(false);

  const navigate = useNavigate();

  const {id} = useParams();

  const cli = useCli();
  const {blocked} = cli;

  const completionCallback: CompletionCallback = (
    id,
    created,
    model,
    query,
  ) => {
    const completion = chatStore.createCompletion(id, created, model, query);
    setCompletion(completion);
    setQuery("");
    setRetry(0);
    cli.set([""]);
    cli.unblock();
  };

  useEffect(() => {
    setQuery(cli.get() as string);
  }, [cli.get()]);

  /* handle query submission */
  useEffect(() => {
    if (query === "") return;
    setLoading(true);
    cli.block();
    getQuery(
      setLoading,
      setResponse,
      query,
      chatStore.readMessages(id).slice(0, -retry * 2 || undefined),
      undefined, //!retry ? completion?.message : undefined,
      completionCallback,
    );
  }, [query]);

  /* handle chat id url parameter */
  useEffect(() => {
    if (!chatStore.readChat(id)) {
      chatStore.resetChat();
      navigate("/chat");
    } else {
      chatStore.loadChat(id);
    }
    const conversation = chatStore.readConversation(id);
    setParentId(conversation[conversation.length - 1]?.id);
  }, [id]);

  /* update url if the chatId value in store changed */
  useEffect(() => {
    const unsubscribe = useChatCompletionStore.subscribe((state) => {
      navigate(`/chat${state.chatId ? `/${state.chatId}` : ""}`);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!completion) return;
    setCompletion((prev) => {
      if (!prev) return;
      prev.message = response;
      return prev;
    });
    if (!chatStore.readChat(id)) chatStore.createChat(completion);
    else chatStore.updateCompletion(parentId, completion);
    /* reset values once the completion is saved in the store */
    setParentId(completion.id);
    setResponse("");
    setUpdateTitle(true);
  }, [completion]);

  const setTitle = async () => {
    const title = await getChatTitle(chatStore.readMessages(id));
    chatStore.updateChatTitle(id, title);
    if (completion) chatStore.updateCompletionTitle(completion.id, title);
    storage.save();
  };

  useEffect(() => {
    if (!updateTitle) return;
    setTitle();
    setUpdateTitle(false);
  }, [updateTitle]);

  return (
    <section className={styles.root}>
      <Container>
        {chatStore
          .readConversation(id)
          .slice(0, retry ? -retry : undefined)
          .map((completion: Completion, i: number, a: Completion[]) => (
            <Fragment key={`chat-completion-${completion.id}`}>
              <Message
                role="user"
                content={completion.prompt}
                anchor={i === a.length - 1 ? "start" : undefined}
              />
              <div>
                <Message role="assistant" content={completion.message} />
                <Toolbar
                  completion={completion}
                  query={query}
                  number={a.length - i}
                  setQuery={setQuery}
                  setParentId={setParentId}
                  setRetry={setRetry}
                />
              </div>
            </Fragment>
          ))}
        {loading && (
          <Fragment key="chat-completion">
            <Message role="user" content={query || cli.get()} />
            <Message role="assistant" content={response} hasCaret={blocked} />
          </Fragment>
        )}
      </Container>
      <a id="end" role="anchor" />
    </section>
  );
};

export default memo(Chat);
