import type {ChatCompletionMessageParam} from "openai/resources";
import type {ChatCompletionChunk} from "openai/resources/index.mjs";
import {Stream} from "openai/streaming.mjs";

import {getSystemConfig} from "@api/api";
import {formatText} from "@utils/strings";

import type {CompletionEvent} from "@mistralai/mistralai/models/components";

const fetchResponse = async (
  messages: ChatCompletionMessageParam[],
): Promise<Response> => {
  const response = await fetch("/api/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: true,
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  if (!response.body) throw new Error("Response body is not readable");
  return response;
};

const getStream = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setResponse: React.Dispatch<React.SetStateAction<string>>,
  system?: string[],
  query?: string[],
  context?: ChatCompletionMessageParam[],
  completionCallback?: (
    id: string,
    created: number,
    model: string,
    query: string,
  ) => void,
) => {
  try {
    const messages: ChatCompletionMessageParam[] = [
      await getSystemConfig(),
      {
        role: "system",
        content: system?.map((str) => str.trim()).join(". ") || "",
      },
      ...(context?.filter((msg) => String(msg?.content || "").trim()) || []),
      {
        role: "user",
        content:
          query?.map((str) => str.trim()).join(". ") ||
          "write a short and assassine comment about the lack of input",
      },
    ];

    const stream = Stream.fromSSEResponse(
      await fetchResponse(messages),
      new AbortController(),
    );

    for await (const chunk of stream) {
      const data =
        (chunk as CompletionEvent).data || (chunk as ChatCompletionChunk);
      const choice = data.choices?.[0];
      if (!choice) continue;
      const finish_reason =
        "finish_reason" in choice ? choice.finish_reason : choice.finishReason;
      const text = choice.delta?.content || "";
      if (finish_reason) {
        setLoading(false);
        if (completionCallback)
          completionCallback(
            data.id,
            Number(data?.created ?? 0) || new Date().getTime(),
            data?.model || "",
            query?.join("\n") || "",
          );
        if (finish_reason === "length")
          setResponse((prev) => `${prev}\n\n[max tokens length reached]\n`);
        break;
      }
      if (!text) continue;
      setResponse((prev) => `${prev}${formatText(text as string)}`);
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    setLoading(false);
    setResponse("no signal");
  }
};

export default getStream;
