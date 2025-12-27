import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

import getData from "@api/utils/getData";
import {NAME, VERSION} from "@commons/constants";
import persona from "@commons/persona.txt?raw";
import {formatText} from "@utils/strings";
import {getVariableFromCSS} from "@utils/styles";

export const getApiConfig = async (): Promise<Record<string, string>> => {
  const response = await fetch("/api/config");
  return response.ok ? await response.json() : {};
};

export const getSystemConfig =
  async (): Promise<ChatCompletionMessageParam> => {
    const size = getVariableFromCSS("base-size");
    const height = getVariableFromCSS("base-height");
    const apiConfig = await getApiConfig();
    const systemConfig = [
      ...formatting,
      `your name is ${NAME} and your version is ${VERSION.join(".")}`,
      ...persona.split("\n").map((line) => line.trim()),
      `current date: ${new Date().toLocaleDateString()}`,
      `current time: ${new Date().toLocaleTimeString()}`,
      `current unix EPOCH time: ${Math.floor(Date.now() / 1000)}`,
      `a list of random number: ${Array.from({length: 32}, () =>
        Math.round(Math.random() * 100),
      ).join(", ")}`,
      `current API provider: ${apiConfig.provider || "unknown"}`,
      `current API config: ${JSON.stringify(apiConfig.config || {})}`,
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
    ];
    return {role: "system", content: systemConfig.join(". ")};
  };

export const formatting = [
  "do not mention, repeat or paraphrase user prompt, just answer it",
  "generate text or markdown only, no HTML please! never HTML",
  "use only the 256 first ASCII character in your answers, no unicode",
  "do not use symbol with an unicode code superior to 0x00ff",
  "make all links you provide clickable, give them a human readable name",
  "answer with the language used the most by the user in the chat",
];

export const smallQueryFormatting = (max: number): string[] => [
  `no more than ${max} characters (including spaces)! NO MORE`,
  `keep that ${max} characters limit AT ALL COST, PLEASE`,
  "return just text without decoration or formatting",
  "do not emphasize or decorate any word, no markdown or html",
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
      "do not mention, repeat or paraphrase this prompt",
      "use only use and assistant messages as context",
      ...smallQueryFormatting(28),
    ],
    [
      "make a title for this chat",
      "do not answer to the query, just provide a title",
    ],
    messages,
  );
  return formatText(response.choices[0].message.content || "?");
};

export const getSubtitle = async (): Promise<string> => {
  const response = await getData(
    [
      "separate each sentence with a carriage return",
      "do not add a final point or any punctuation",
      "do not mention your name in the result, it's a motto",
      "emphasize on your infinite source of knowledge",
      "boast yourself to the maximum, demonstrate that you are the best",
      ...smallQueryFormatting(32),
    ],
    ["make a list of 5 catch phrase to present you to the user"],
  );
  return formatText(response.choices[0].message.content || "?");
};

export const getPromptPlaceholder = async (): Promise<string> => {
  const response = await getData(
    [
      "separate each sentence with a carriage return",
      "do not add a final point or any punctuation",
      ...smallQueryFormatting(25),
    ],
    [
      "make a list of 10 imperatives placeholder for the chat input",
      "this placeholder ask the user to type a prompt to start a chat",
      "you are not inviting, you are imposing, user must comply",
    ],
  );
  return formatText(response.choices[0].message.content || "?");
};

export const getStartButton = async (): Promise<string> => {
  const response = await getData(
    [...smallQueryFormatting(25)],
    [
      "name a button that order to start a chat in few words",
      "this button bring users to the chat page",
      "you are not inviting, you are imposing, user must comply",
    ],
  );
  return formatText(response.choices[0].message.content || "?");
};
