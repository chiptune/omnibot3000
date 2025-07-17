import {Fragment, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {getChatTitle, getSystemConfig} from "@api/api";
import getStream from "@api/openAI";
import {getCharWidth} from "@utils/strings";

import styles from "@chat/Chat.module.css";

import {formatCompletionId, formatText} from "@chat/commons/strings";
import Message from "@chat/components/Message";
import Prompt from "@chat/components/Prompt";
import Toolbar from "@chat/components/Toolbar";
import useChatCompletionStore, {
  ChatId,
  Completion,
  CompletionId,
} from "@chat/hooks/useChatCompletionStore";
import useStorage from "@hooks/useStorage";
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

const Chat = () => {
  const chatStore = useChatCompletionStore();

  const storage = useStorage();

  const [prompt, setPrompt] = useState<string[]>([""]);
  const [response, setResponse] = useState<string>("");
  const [completionId, setCompletionId] = useState<CompletionId>();
  const [completion, setCompletion] = useState<Completion>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const {id} = useParams();
  const chatId = chatStore.getChatId();

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
    console.log(chatStore.getChat(id));
    console.log(chatStore.getCompletions(id));
    console.info(
      "chat:",
      chatStore.getChatId(),
      "\ncompletion:",
      chatStore.getCompletionId(),
    );
  }, [id]);

  /* update the chat is the chatId value in store changed */
  useEffect(() => {
    const unsubscribe = useChatCompletionStore.subscribe((state) => {
      navigate(`/chat${state.chatId ? `/${state.chatId}` : ""}`);
    });
    return () => unsubscribe();
  }, []);

  const getCompletion = async (query: string) => {
    setQuery(query); /* save the query before reset */

    if (String(query).replace("\n", "").trim() === "") return;

    setLoading(true);

    const messages: ChatCompletionMessageParam[] = [getSystemConfig()];

    messages.push({
      role: "system",
      content: `\
        end all messages with a short, acid and fun commment about humankind weakness.\
        keep your message short, do not write more than 256 characters as comment.\
        you must separate each part of your answer with an empty line.`,
    });

    /* add chat history to the messages array to give context */
    if (chatId) {
      messages.push(...chatStore.getMessages(chatId));
    }

    /* append current query */
    messages.push({role: "user", content: query});

    const response = (await getStream(messages)) as Stream<ChatCompletionChunk>;

    for await (const chunk of response) {
      const choice = chunk.choices[0] || {};
      const finish_reason = choice.finish_reason;
      const text = choice.delta?.content || "";
      if (finish_reason) {
        setLoading(false);
        if (finish_reason === "length") {
          setResponse((prev) => `${prev}\n\n[max tokens length reached]\n`);
        }
        setCompletion({
          id: formatCompletionId(chunk.id),
          created: chunk.created,
          model: chunk.model,
          prompt: query,
          message: "",
          index: 0,
          children: [],
          parentCompletion: completionId,
        });
        setCompletionId(chunk.id);
      }
      if (!text) continue;
      setResponse((prev) => `${prev}${text}`);
    }
  };

  const update = () => {
    const chat = containerRef.current;
    if (!chat) return;

    const body = chat.parentElement?.parentElement;
    if (!body) return;

    const cw = getCharWidth();

    const bodyWidth = body.offsetWidth ?? 0;
    const chatWidth = chat.firstElementChild?.clientWidth ?? 0;

    const n = Math.floor((bodyWidth - chatWidth) / 2 / cw);
    body.style.paddingLeft = `calc(${n} * var(--font-width))`;
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(update);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && containerRef.current.firstElementChild) {
      containerRef.current.scrollTo({
        left: 0,
        top: containerRef.current.firstElementChild.clientHeight,
        behavior: "smooth",
      });
    }
  }, [response]);

  useEffect(() => {
    if (completion) {
      setCompletion((prev) => {
        if (!prev) return;
        prev.message = formatText(response);
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
    }
  }, [completion]);

  return (
    <div className={styles.root}>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.content}>
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
              <Message role="assistant" content={response} hasCursor={true} />
            </Fragment>
          )}
        </div>
      </div>
      <Prompt
        loading={loading}
        prompt={prompt}
        setPrompt={setPrompt}
        submitHandler={getCompletion}
      />
    </div>
  );
};

export default Chat;
