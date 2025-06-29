import {COMPLETION_ID_WILDCARD} from "@commons/constants";

import type {CompletionId} from "@chat/hooks/useChatCompletionStore";

export const formatCompletionId = (id: CompletionId): CompletionId =>
  id && id.replace(COMPLETION_ID_WILDCARD, "").toLowerCase();

export const formatText = (text: string): string =>
  text.replaceAll("—", "-").replaceAll("’", "'");
