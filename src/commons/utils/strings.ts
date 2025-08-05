import {ASCII_BLOCK1} from "@commons/constants";

export const getTextBoundingBox = (text: string): DOMRect => {
  const el = document.createElement("span");
  el.className = "text ascii";
  el.textContent = text;
  el.style.visibility = "none";
  document.body.appendChild(el);
  const box = el.getBoundingClientRect();
  document.body.removeChild(el);
  return box;
};

export const getCharWidth = (): number =>
  getTextBoundingBox(ASCII_BLOCK1).width;
export const getCharHeight = (): number =>
  getTextBoundingBox(ASCII_BLOCK1).height;

export const getLineHeight = (): number => {
  const el = document.createElement("span");
  el.className = "text ascii";
  el.textContent = ASCII_BLOCK1;
  el.style.visibility = "none";
  document.body.appendChild(el);
  const lh = parseFloat(getComputedStyle(el).lineHeight);
  document.body.removeChild(el);
  return lh;
};

export const formatText = (text: string): string =>
  text
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("→", "->");

export const sanitizeHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = new XMLSerializer().serializeToString(doc.body);
  const text = body.replace(/<body[^>]*>|<\/body>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
