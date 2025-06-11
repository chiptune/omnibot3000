export const getTextBoundingBox = (text: string): DOMRect => {
  const el = document.createElement("span");
  el.className = "ascii";
  el.textContent = text;
  el.style.visibility = "none";
  document.body.appendChild(el);
  const box = el.getBoundingClientRect();
  document.body.removeChild(el);
  return box;
};

export const getCharWidth = (): number => getTextBoundingBox("%").width;
export const getCharHeight = (): number => getTextBoundingBox("%").height;

export const getLineHeight = (el: HTMLElement): number =>
  parseFloat(getComputedStyle(el).lineHeight);

export const sanitizeHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = new XMLSerializer().serializeToString(doc.body);
  const text = body.replace(/<body[^>]*>|<\/body>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

export const getVariableFromCSS = (variable: string): string =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--${variable}`)
    .trim();
