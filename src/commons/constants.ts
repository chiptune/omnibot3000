import pkg from "@root/package.json";

export const NAME = String(pkg["x-display-name"] || pkg.name);
export const VERSION = String(pkg.version)
  .split(".")
  .map((v) => Number(v));
export const AUTHOR = pkg.author;
export const SOURCE = pkg.repository.url;
export const SESSION_KEY = String(NAME).toLowerCase().replace(/\s/g, "_");

export const COMPLETION_ID_WILDCARD = "chatcmpl-";

export const ASCII_SPACE = "\u0020";
export const ASCII_LOSANGE = "\u00ac";
export const ASCII_BLOCK1 = "\u00fe";
export const ASCII_BLOCK2 = "\u00ae";
export const ASCII_BLOCK3 = "\u00b8";
export const ASCII_RECTANGLE = "\u00ff";
export const ASCII_VLINE = "\u00af";
export const ASCII_HLINE = "-";
export const ASCII_CORNER = "+";
export const ASCII_POINT = "\u00a0";
export const ASCII_PI = "π";
export const ASCII_CURRENCY = "\u00a8";
export const ASCII_COPYRIGHT = "©";
export const ASCII_LDAB = "«";
export const ASCII_RDAB = "»";
export const ASCII_DOT = "·";
export const ASCII_PARAGRAPH = "¶";

export const BUTTON_CREATE = "[+]";
export const BUTTON_DELETE = "[-]";
export const BUTTON_SUBMIT = "[ASK]";
export const BUTTON_PREVIOUS = "<";
export const BUTTON_NEXT = ">";
export const BUTTON_LIFE = `[${ASCII_CURRENCY}]`;
