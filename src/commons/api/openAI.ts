import {COMPLETION_MAX_TOKENS} from "@commons/constants";

import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

export const getStream = async (
  messages: ChatCompletionMessageParam[],
  stream: boolean = true,
): Promise<ChatCompletion | Stream<ChatCompletionChunk>> => {
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

  return openai.chat.completions.create({
    /* https://openai.com/api/pricing/ */
    //model: "gpt-4.1-nano",
    model: "gpt-4.1-mini-2025-04-14",
    //model: "gpt-4o-mini-2024-07-18",
    //model: "deepseek/deepseek-chat-v3-0324:free",
    messages,
    max_tokens: COMPLETION_MAX_TOKENS,
    temperature: 0.0, // lower temperature to get stricter completion (good for code)
    stream,
  });
};

export default getStream;
