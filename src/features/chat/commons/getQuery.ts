import {ChatCompletionMessageParam} from "openai/resources/index.mjs";

import type {CompletionCallback} from "@api/utils/getStream";
import getStream from "@api/utils/getStream";

const getQuery = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setResponse: React.Dispatch<React.SetStateAction<string>>,
  query?: string,
  context?: ChatCompletionMessageParam[],
  message?: string,
  completionCallback?: CompletionCallback,
) => {
  getStream(
    setLoading,
    setResponse,
    [
      "keep your message short and concise, do not repeat yourself",
      "do not present yourself again, focus on answering the user prompt",
      "end your answer with a final thought where you roast humankind",
      "this last thought length must be less than 128 characters long",
      "you must separate each part with a line or empty line",
    ],
    query?.split("\n") || [],
    [
      ...(context || []),
      message &&
        ({role: "assistant", content: message} as ChatCompletionMessageParam),
    ].filter(Boolean) as ChatCompletionMessageParam[],
    completionCallback,
  );
};

export default getQuery;
