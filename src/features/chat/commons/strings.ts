import {COMPLETION_WILDCARD} from "@commons/constants";

import type {CompletionId} from "@chat/hooks/useChatCompletionStore";

export const getRandomToken = (length: number = 16): string => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    {length},
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

export const getCompletionId = (id?: CompletionId): CompletionId =>
  String(id || getRandomToken())
    .replaceAll(COMPLETION_WILDCARD, "")
    .toLowerCase();
