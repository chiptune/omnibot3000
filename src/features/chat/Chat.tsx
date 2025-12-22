import {Fragment, memo, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {getChatTitle} from "@api/api";
import getStream from "@api/utils/getStream";
import Container from "@layout/Container";

import useStorage from "@hooks/useStorage";

import styles from "@chat/Chat.module.css";
import {formatCompletionId} from "@chat/commons/strings";
import Message from "@chat/components/Message";
import Toolbar from "@chat/components/Toolbar";
import useChatCompletionStore, {
  ChatId,
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";

import Cli from "@cli/Cli";

const Chat = () => {
  const chatStore = useChatCompletionStore();

  const storage = useStorage();

  const [prompt, setPrompt] = useState<string[]>([""]);
  const [response, setResponse] = useState<string>("");
  const [completionId, setCompletionId] = useState<CompletionId>();
  const [completion, setCompletion] = useState<Completion>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const navigate = useNavigate();

  const {id} = useParams();
  const chatId = chatStore.getChatId();

  const completionCallback = (
    id: string,
    created: number,
    model: string,
    query: string,
  ) => {
    setCompletion({
      id: formatCompletionId(id),
      created: created,
      model: model,
      prompt: query,
      message: "",
      index: 0,
      children: [],
      parentCompletion: completionId,
    });
    setCompletionId(id);
  };

  const submitHandler = (input: string) => {
    setLoading(true);
    setQuery(input);
    getStream(
      setLoading,
      setResponse,
      [
        "keep your message short and concise, do not repeat yourself",
        "do not present yourself again, focus on answering the user prompt",
        "end your answer with an acid but funny haiku about humankind",
        "this comment length must be less than 256 characters long",
        "you must separate each part with a line or empty line",
      ],
      prompt,
      chatStore.getMessages(id),
      completionCallback,
    );
  };

  const setTitle = async (id: ChatId) => {
    const title = await getChatTitle(chatStore.getMessages(id));
    chatStore.updateChatTitle(id, title);
    storage.save();
  };

  /* handle chat id url parameter */
  useEffect(() => {
    if (!chatStore.getChat(id)) {
      chatStore.setCompletions();
      navigate("/chat");
    } else {
      chatStore.setChatId(id);
      chatStore.setCompletions(id);
    }
    /*console.log(chatStore.getChat(id));
    console.log(chatStore.getCompletions(id));
    console.info(
      "chat:",
      chatStore.getChatId(),
      "\ncompletion:",
      chatStore.getCompletionId(),
    );*/
  }, [id]);

  /* update the chat is the chatId value in store changed */
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
    if (!chatId) {
      chatStore.setCompletions();
      chatStore.createChat(completion);
      setTitle(chatStore.getChatId());
    }
    chatStore.addCompletion(completion);
    if (chatId) {
      chatStore.updateCompletions(chatId);
      setTitle(chatId);
    }
    /* reset values once the completion is saved in the store */
    setCompletion(undefined);
    setResponse("");
  }, [completion]);

  return (
    <section className={styles.root}>
      <Container>
        {chatStore.getCompletions(chatId).map((completion: Completion) => (
          <Fragment key={`chat-completion-${completion.id}`}>
            <Message role="user" content={completion.prompt} />
            <Message role="assistant" content={completion.message} />
            <Toolbar completion={completion} />
          </Fragment>
        ))}
        {loading && response && (
          <Fragment key="chat-completion">
            <Message role="user" content={query} />
            <Message role="assistant" content={response} hasCaret={loading} />
          </Fragment>
        )}
      </Container>
      <Cli
        loading={loading}
        prompt={prompt}
        setPrompt={setPrompt}
        submitHandler={submitHandler}
      />
    </section>
  );
};

export default memo(Chat);
