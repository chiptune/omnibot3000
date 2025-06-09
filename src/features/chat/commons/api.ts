import getStream from "@api/openAI";
import persona from "@commons/persona.txt?raw";

import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

export const getSystemConfig = (): ChatCompletionMessageParam => {
  const systemConfig = `\
    current date: ${new Date().toLocaleDateString()}\
    current time: ${new Date().toLocaleDateString()}\
    current unix EPOCH time: ${Math.floor(Date.now() / 1000)}\
    a list of random number: ${Array.from({length: 32}, () =>
      Math.round(Math.random() * 100),
    ).join(", ")}\
    ${persona}\
    use only the 256 first ASCII character in your answers.\
    do not use any special characters outside the ASCII table.\
    use the same language that is mostly used by the user.`;
  return {role: "system", content: systemConfig};
};

export const getChatTitle = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const updatedMessages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    ...messages,
    {
      role: "user",
      content: `\
      make a title for this chat, excluding this request.\
      keep it as simple, short and descriptive as possible.\
      do not use more than 28 characters including spaces.\
      do not add any comments or punctuations.\
      prefer small words to maximize text wrapping.`,
    },
  ];
  const response = (await getStream(updatedMessages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};

export const getPromptPlaceholder = async (): Promise<string> => {
  const messages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    {
      role: "user",
      content: `\
      write an imperative user input placeholder.\
      your request must be harsh and punitive.\
      do not use more than 25 characters.\
      do not add any comments or punctuations.\
      use small words as far as possible.`,
    },
  ];
  const response = (await getStream(messages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};
