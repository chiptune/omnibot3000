import type {ChatCompletionMessageParam} from "openai/resources";
import type {ChatCompletion} from "openai/resources/index.mjs";

import {getSystemConfig} from "@api/api";

export const getData = async (
  system?: string[],
  query?: string[],
  context?: ChatCompletionMessageParam[],
): Promise<ChatCompletion> => {
  const messages: ChatCompletionMessageParam[] = [
    await getSystemConfig(),
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

export default getData;
