import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

import {COMPLETION_MAX_TOKENS} from "@commons/constants";

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

  try {
    const response = await openai.chat.completions.create({
      /* https://openai.com/api/pricing/ */
      model: "gpt-4.1-mini-2025-04-14",
      //model: "gpt-4.1-nano-2025-04-14",
      //model: "deepseek/deepseek-chat-v3-0324:free",
      messages,
      max_tokens: COMPLETION_MAX_TOKENS,
      temperature: 0.0, // lower temperature to get stricter completion (good for code)
      stream,
    });
    return response;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      id: "",
      model: "error",
      created: Math.floor(Date.now() / 1000),
      object: "chat.completion",
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: {
            content: "no signal",
            refusal: "error",
            role: "assistant",
          },
          logprobs: null,
        },
      ],
    };
  }
};

export default getStream;
