import React, {Fragment, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import getStream from "@api/openAI";
import persona from "@commons/persona.txt?raw";

import styles from "./Chat.module.css";

import ChatBubble from "@chat/components/ChatBubble";
import ChatPrompt from "@chat/components/ChatPrompt";
import useChatCompletionStore, {
  ChatId,
  Completion,
} from "@chat/hooks/useChatCompletionStore";
import useKeyPress from "@hooks/useKeyPress";
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

const Chat: React.FC = () => {
  const chatStore = useChatCompletionStore();

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [completion, setCompletion] = useState<Completion>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const submitOnEnter = useKeyPress("Enter", {meta: false}); // true to allow new line

  const {id} = useParams();
  const chatId = chatStore.getChatId();

  /* update the chat when the user submit the prompt using meta+enter */
  useEffect(() => {
    if (submitOnEnter === true) {
      getCompletion(prompt);
      setPrompt("");
    }
  }, [submitOnEnter]);

  /* handle chat id url parameter */
  useEffect(() => {
    if (!chatStore.getChat(id)) {
      chatStore.resetCompletions();
      navigate("/chat");
    } else {
      chatStore.setChatId(id);
      chatStore.setCompletions(id);
    }
  }, [id]);

  /* update the chat is the chatId value in store changed */
  useEffect(() => {
    const unsubscribe = useChatCompletionStore.subscribe((state) => {
      navigate(`/chat${state.chatId ? `/${state.chatId}` : ""}`);
    });
    return () => unsubscribe();
  }, []);

  const getCompletion = async (prompt: string) => {
    setQuery(prompt); /* save the prompt before reset */

    if (String(prompt).replace("\n", "").trim() === "") return;

    setLoading(true);

    const systemConfig = `\
    current date: ${new Date().toLocaleDateString()}\
    current time: ${new Date().toLocaleDateString()}\
    current unix EPOCH time: ${Math.floor(Date.now() / 1000)}\
    ${persona}`;
    const messages: ChatCompletionMessageParam[] = [
      {role: "system", content: systemConfig},
    ];

    /* add chat history to the messages array to give context */
    if (chatId) {
      messages.push(...chatStore.getMessages(chatId));
    }

    /* append current prompt */
    messages.push({role: "user", content: prompt});

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
          id: chunk.id,
          created: chunk.created,
          model: chunk.model,
          prompt,
          message: "",
          previousCompletion: undefined,
        });
      }
      if (!text) continue;
      setResponse((prev) => `${prev}${text}`);
    }
  };

  const getTitle = async (id: ChatId) => {
    const messages: ChatCompletionMessageParam[] = [
      ...chatStore.getMessages(id),
      {
        role: "user",
        content: `please sum up all this conversation.
           exclude this last message from the summary.
           as a simple, short and descriptive title.
           do not use more than 28 characters.
           do not add comments or any punctuations.
           use small words as far as possible.
           `,
      },
    ];
    const response = (await getStream(messages, false)) as ChatCompletion;
    chatStore.updateChatTitle(id, response.choices[0].message.content || "?");
  };

  useEffect(() => {
    if (chatRef.current && chatRef.current.firstElementChild) {
      chatRef.current.scrollTo({
        left: 0,
        top: chatRef.current.firstElementChild.clientHeight,
        behavior: "smooth",
      });
    }
  }, [response]);

  useEffect(() => {
    if (completion) {
      setCompletion((prev) => {
        if (!prev) return;
        prev.message = response;
        return prev;
      });
      if (!chatId) {
        chatStore.resetCompletions();
        chatStore.setChat(completion);
        chatStore.setChatId(completion.id);
        getTitle(chatStore.getChatId());
      }
      chatStore.addCompletion(completion);
      if (chatId) {
        chatStore.updateChatCompletions(chatId);
        getTitle(chatId);
      }
      /* reset values once the completion is saved in the store */
      setCompletion(undefined);
      setResponse("");
    }
  }, [completion]);

  return (
    <div className={styles.root}>
      <div ref={chatRef} className={styles.container}>
        <div className={styles.chat}>
          {chatStore.getCompletions(chatId).map((completion: Completion) => (
            <Fragment key={`chat-completion-${completion.id}`}>
              <ChatBubble role="user" content={completion.prompt} />
              <ChatBubble role="assistant" content={completion.message} />
            </Fragment>
          ))}
          {loading && response && (
            <Fragment key="chat-completion">
              <ChatBubble role="user" content={query} />
              <ChatBubble
                role="assistant"
                content={response}
                hasCursor={true}
              />
            </Fragment>
          )}
        </div>
      </div>
      <ChatPrompt
        loading={loading}
        prompt={prompt}
        setPrompt={setPrompt}
        submitHandler={async (e: React.FormEvent) => {
          e.preventDefault();
          getCompletion(prompt);
        }}
      />
    </div>
  );
};

export default Chat;
