import {COMPLETION_ID_WILDCARD} from "@commons/constants";

import {ChatId} from "@chat/hooks/useChatCompletionStore";

export const formatChatId = (id: ChatId): ChatId => id && id.replace(COMPLETION_ID_WILDCARD, "").toLowerCase();
