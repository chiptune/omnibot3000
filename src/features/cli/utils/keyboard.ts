import {getVariableFromCSS} from "@utils/styles";

const KEYS: string[] = [
  "Escape",
  "Control",
  "Meta",
  "Shift",
  "Alt",
  "CapsLock",
  "Insert",
];

const KEYMAP: {[key: string]: string[]} = {
  Quote: ["'", '"'],
  Backquote: ["`", "~"],
  Digit6: ["6", "^"],
};

export const handleKeyboardInput = (
  event: KeyboardEvent | undefined,
  input: string[],
  line: number,
  caret: number,
  submit: (input: string[]) => void,
): {input: string[]; line: number; caret: number} => {
  if (!event) return {input, line, caret};

  const {key, code, shiftKey, ctrlKey, metaKey} = event || {};
  if (!key || KEYS.includes(key)) return {input, line, caret};

  const tabSize = parseInt(getVariableFromCSS("tab-size")) || 2;

  let p = [...input];
  let l = line;
  let c = caret;

  switch (key) {
    case "Enter":
      if (shiftKey) {
        l++;
        p.splice(l, 0, p[l - 1].substring(c));
        p[l - 1] = p[l - 1].substring(0, c);
      } else {
        submit(p);
        p = [""];
        l = 0;
      }
      c = 0;
      break;
    case "Tab":
      p[l] += " ".repeat(tabSize);
      c += tabSize;
      break;
    case "Backspace":
      if (c > 0) {
        p[l] = `${p[l].substring(0, c - 1)}${p[l].substring(c)}`;
        c--;
      } else if (l > 0) {
        l--;
        p[l] += p[l + 1];
        c = p[l].length - p[l + 1].length;
        p.splice(l + 1, 1);
      }
      break;
    case "Delete":
      if (c < p[l].length) {
        p[l] = `${p[l].substring(0, c)}${p[l].substring(c + 1)}`;
      } else if (l < p.length - 1) {
        p[l] += p[l + 1];
        c = p[l].length - p[l + 1].length;
        p.splice(l + 1, 1);
      }
      break;
    case "ArrowLeft":
      c--;
      if (c < 0) {
        if (l > 0) {
          l--;
          c = p[l].length;
        } else {
          c = 0;
        }
      }
      break;
    case "ArrowRight":
      c++;
      if (c > p[l].length) {
        if (l < input.length - 1) {
          l++;
          c = 0;
        } else {
          c = p[l].length;
        }
      }
      break;
    case "ArrowUp":
      l--;
      if (l < 0) {
        l = 0;
        c = 0;
      } else {
        c = Math.min(c, p[l].length);
      }
      break;
    case "ArrowDown":
      l++;
      if (l > input.length - 1) {
        l = input.length - 1;
        c = p[l].length;
      } else {
        c = Math.min(c, p[l].length);
      }
      break;
    case "PageUp":
      c = 0;
      break;
    case "PageDown":
      c = p[l].length;
      break;
    case "Home":
      l = 0;
      c = 0;
      break;
    case "End":
      l = input.length - 1;
      c = p[l].length;
      break;
    default:
      if (!ctrlKey && !metaKey) {
        let k = key;
        if (code && KEYMAP[code]) k = KEYMAP[code][shiftKey ? 1 : 0] || k;
        p[l] = `${p[l].substring(0, c)}${k}${p[l].substring(c)}`;
        c++;
      }
  }

  if (ctrlKey) {
    switch (key) {
      case "a":
        c = 0;
        break;
      case "e":
        c = p[l].length;
        break;
      case "u":
        p[l] = p[l].substring(c);
        c = 0;
        break;
      case "k":
        p[l] = p[l].substring(0, c);
        break;
    }
  }

  return {input: p, line: l, caret: c};
};
