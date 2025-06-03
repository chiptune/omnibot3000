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
    ${persona}`;
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
      please sum up this conversation as title.\
      keep it as simple, short and descriptive as possible.\
      do not include this last message in the result.\
      do not mention this request for a title in the result.\
      do not use more than 25 characters (counting spaces).\
      do not add any comments or punctuations.\
      use small words as far as possible to maximize text wrapping.`,
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
      write an imperative input placeholder\
      you request must be harsh and punitive\
      do not use more than 25 characters\
      do not add any comments or punctuations\
      use small words as far as possible`,
    },
  ];
  const response = (await getStream(messages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};
