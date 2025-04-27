import {COMPLETION_ID_WILDCARD} from "@commons/constants";

import {ChatId} from "@chat/hooks/useChatCompletionStore";

export const getCharWidth = (): number => {
  const el = document.createElement("span");
  el.className = "ascii";
  el.textContent = "%";
  el.style.visibility = "none";
  document.body.appendChild(el);
  const box = el.getBoundingClientRect();
  document.body.removeChild(el);
  return box.width;
};

export const getLineHeight = (el: HTMLElement): number => parseFloat(getComputedStyle(el).lineHeight);

export const sanitizeHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = new XMLSerializer().serializeToString(doc.body);
  return body.replace(/<body[^>]*>|<\/body>/g, "");
};

export const formatChatId = (id: ChatId): ChatId => id && id.replace(COMPLETION_ID_WILDCARD, "").toLowerCase();
