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
  return body.replace(/<body[^>]*>|<\/body>/g, "");
};

export const getVariableFromCSS = (variable: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
