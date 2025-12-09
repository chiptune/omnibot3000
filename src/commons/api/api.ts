import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

import getStream from "@api/openAI";
import persona from "@commons/persona.txt?raw";
import {getVariableFromCSS} from "@utils/styles";

export const getSystemConfig = (): ChatCompletionMessageParam => {
  const size = getVariableFromCSS("base-size");
  const height = getVariableFromCSS("base-height");
  const systemConfig = `\
current date: ${new Date().toLocaleDateString()}.\
current time: ${new Date().toLocaleDateString()}.\
current unix EPOCH time: ${Math.floor(Date.now() / 1000)}.\
a list of random number: ${Array.from({length: 32}, () =>
    Math.round(Math.random() * 100),
  ).join(", ")}.\
current user agent: ${navigator.userAgent}.\
current color hue: ${getVariableFromCSS("h")}°.\
current color saturation: ${getVariableFromCSS("s")}%.\
current color lightness: ${getVariableFromCSS("l")}%.\
current font base size: ${getVariableFromCSS("BASE-SIZE")}.\
user can change the color with the "/color [h|s|l] number" command.\
user can change the font size with the "/size number" command.\
the "/size" command without parameter will reset the value to ${size}.\
user can change the line height with the "/height number" command.\
the "/height" command without parameter will reset the value to ${height}.\
user can reset the settings with the "/reset" command.\
${formatting}\
${persona}`;
  return {role: "developer", content: systemConfig};
};

export const formatting = `\
generate markdown text only, no HTML please! never!\
use only the 256 first ASCII character in your answers, no unicode!\
do not use any special characters or emojis or unicode > 0x00ff.\
make all links you provide clickable, give them a human readable name.\
very important: output only markdown text, no HTML please!\
answer with the language used the most by the user in the chat.`;

export const smallQueryFormatting = (max: number): string => `\
no more than ${max} characters (including spaces)! NO MORE!\
do not add any comments or punctuations.\
there is no need to capitalize the first letter of every words.\
do not add any bullet point or numbered list, just plain text.\
it's not an answer to a query, make it compact and catchy!`;

export const getChatTitle = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const updatedMessages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    ...messages,
    {
      role: "developer",
      content: `\
make a title for this chat, excluding this request.\
keep it as simple, short and descriptive as possible.\
do not mention your name in the result.\`
${smallQueryFormatting(28)}`,
    },
  ];
  const response = (await getStream(updatedMessages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};

export const getSubtitle = async (): Promise<string> => {
  const messages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    {
      role: "developer",
      content: `\
make a list of 5 catch phrase to present you to the user.\
do not mention your name in the result, it's a motto.\
emphasize on your infinite source of knowledge.\
boast yourself to the maximum, demonstrate that your are the best.\
${smallQueryFormatting(32)}`,
    },
  ];
  const response = (await getStream(messages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};

export const getPromptPlaceholder = async (): Promise<string> => {
  const messages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    {
      role: "developer",
      content: `\
make a list of 10 imperatives input placeholder.\
this input is where the user is asking you question.\
you are not inviting, you are imposing, user must comply.\
${smallQueryFormatting(25)}`,
    },
  ];
  const response = (await getStream(messages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};

export const getStartButton = async (): Promise<string> => {
  const messages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    {
      role: "developer",
      content: `\
make a name for a button that start a chat in few words.\
this button bring users to the page where they can make a query.\
you are not inviting, you are imposing, user must comply.\
${smallQueryFormatting(25)}`,
    },
  ];
  const response = (await getStream(messages, false)) as ChatCompletion;
  return response.choices[0].message.content || "?";
};
