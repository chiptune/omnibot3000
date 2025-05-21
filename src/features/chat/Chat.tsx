import React, {Fragment, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import persona from "@commons/persona.txt?raw";

import styles from "./Chat.module.css";

import ChatBubble from "@chat/components/ChatBubble";
import ChatPrompt from "@chat/components/ChatPrompt";
import useChatCompletionStore, {
  Completion,
} from "@chat/hooks/useChatCompletionStore";
import useKeyPress from "@hooks/useKeyPress";
import OpenAI from "openai";
import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.OPENAI_ORG_ID,
  project: import.meta.env.OPENAI_PROJECT_ID,
  dangerouslyAllowBrowser: true,
});

/*const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});*/

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
    if (submitOnEnter === true) getCompletion(prompt);
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
      chatStore.getCompletions(chatId).forEach((completion: Completion) => {
        messages.push(
          {role: "user", content: completion.prompt},
          {role: "assistant", content: completion.message},
        );
      });
    }

    /* append current prompt */
    messages.push({role: "user", content: prompt});

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // "gpt-40" "gpt-4o-mini" -> https://openai.com/api/pricing/
      //model: "deepseek/deepseek-chat-v3-0324:free",
      messages,
      max_tokens: chatStore.getSettings().maxTokens,
      temperature: 0.0, // lower temperature to get stricter completion (good for code)
      stream: true,
    });

    for await (const chunk of stream) {
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
      }
      chatStore.addCompletion(completion);
      if (chatId) {
        chatStore.updateChatCompletions(chatId);
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
