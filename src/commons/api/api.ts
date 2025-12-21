import {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

import {NAME, VERSION} from "@commons/constants";
import persona from "@commons/persona.txt?raw";
import {getVariableFromCSS} from "@utils/styles";

export const getData = async (
  system?: string[],
  query?: string[],
  context?: ChatCompletionMessageParam[],
): Promise<ChatCompletion> => {
  const messages: ChatCompletionMessageParam[] = [
    getSystemConfig(),
    {
      role: "system",
      content: system?.map((str) => str.trim()).join(". ") || "",
    },
    ...(context?.filter((msg) => String(msg?.content || "").trim()) || []),
    {
      role: "user",
      content: query?.map((str) => str.trim()).join(". ") || "",
    },
  ];
  const response = await fetch("/api/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: false,
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data as ChatCompletion;
};

export const getSystemConfig = (): ChatCompletionMessageParam => {
  const size = getVariableFromCSS("base-size");
  const height = getVariableFromCSS("base-height");
  const systemConfig = [
    `current date: ${new Date().toLocaleDateString()}`,
    `current time: ${new Date().toLocaleTimeString()}`,
    `current unix EPOCH time: ${Math.floor(Date.now() / 1000)}`,
    `a list of random number: ${Array.from({length: 32}, () =>
      Math.round(Math.random() * 100),
    ).join(", ")}`,
    `current user agent: ${navigator.userAgent}`,
    `current color hue: ${getVariableFromCSS("h")}°`,
    `current color saturation: ${getVariableFromCSS("s")}%`,
    `current color lightness: ${getVariableFromCSS("l")}%`,
    `current font base size: ${getVariableFromCSS("BASE-SIZE")}`,
    'user can change the color with the "/color [h|s|l] number" command',
    'user can change the font size with the "/size number" command',
    `the "/size" command without parameter will reset the value to ${size}`,
    'user can change the line height with the "/height number" command',
    `the "/height" command without parameter will reset the value to ${height}`,
    'user can reset the settings with the "/reset" command',
    'user can reload the page with "/reboot" (do no reset, just reload)',
    ...formatting,
    `your name is ${NAME} and your version is ${VERSION.join(".")}`,
    ...persona.split("\n").map((line) => line.trim()),
  ];
  return {role: "system", content: systemConfig.join(". ")};
};

export const formatting = [
  "generate markdown text only, no HTML please! never",
  "use only the 256 first ASCII character in your answers, no unicode",
  "do not use any special characters or emojis or unicode > 0x00ff",
  "make all links you provide clickable, give them a human readable name",
  "very important: output only text or markdown, no HTML please",
  "answer with the language used the most by the user in the chat",
];

export const smallQueryFormatting = (max: number): string[] => [
  `no more than ${max} characters (including spaces)! NO MORE`,
  `keep that ${max} characters limit AT ALL COST, PLEASE`,
  "return just text without decoration or formatting",
  "display just words, no markdown or html or any special tags",
  "do not add any comments or punctuations, just words",
  "there is no need to capitalize the first letter of every words",
  "do not add any bullet point or numbered list, just plain text",
  "it's not an answer to a query, make it compact and catchy",
  "do not add any unnecessary comment, return a single line of text",
];

export const getChatTitle = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const response = await getData(
    [
      "do not mention your name in the result",
      "keep it as simple, short and descriptive as possible",
      "exclude all reference to this request",
      "use only use and assistant messages as context",
      ...smallQueryFormatting(28),
    ],
    ["make a title for this chat"],
    messages,
  );
  return response.choices[0].message.content || "?";
};

export const getSubtitle = async (): Promise<string> => {
  const response = await getData(
    [
      "do not mention your name in the result, it's a motto",
      "emphasize on your infinite source of knowledge",
      "boast yourself to the maximum, demonstrate that you are the best",
      ...smallQueryFormatting(32),
    ],
    ["make a list of 5 catch phrase to present you to the user"],
  );
  return response.choices[0].message.content || "?";
};

export const getPromptPlaceholder = async (): Promise<string> => {
  const response = await getData(
    [
      "this input is where the user is asking you question",
      "you are not inviting, you are imposing, user must comply",
      ...smallQueryFormatting(25),
    ],
    ["make a list of 10 imperatives input placeholder"],
  );
  return response.choices[0].message.content || "?";
};

export const getStartButton = async (): Promise<string> => {
  const response = await getData(
    [
      "this button bring users to the page where they can make a query",
      "you are not inviting, you are imposing, user must comply",
      ...smallQueryFormatting(25),
    ],
    ["name a button that order to start a chat in few words"],
  );
  return response.choices[0].message.content || "?";
};

export default getData;
