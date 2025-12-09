export const PI = Math.PI; /* 180° in radians */
export const HALF_PI = Math.PI / 2; /* 90° in radians */
export const TWO_PI = Math.PI * 2; /* 360° in radians */
export const PHI = (Math.sqrt(5) + 1) / 2; /* golden ratio */
export const EULER = Math.E;

export type vec2 = [number, number];

export const format = (n: number = 0, d: number = 1): number =>
  parseFloat(n.toFixed(d));

export const clamp = (
  n: number = 0,
  min: number = 0,
  max: number = 1,
): number => Math.max(min, Math.min(n, max));

const ROMAN_SYMBOLS = [
  {value: 1000, symbol: "M"},
  {value: 900, symbol: "CM"},
  {value: 500, symbol: "D"},
  {value: 400, symbol: "CD"},
  {value: 100, symbol: "C"},
  {value: 90, symbol: "XC"},
  {value: 50, symbol: "L"},
  {value: 40, symbol: "XL"},
  {value: 10, symbol: "X"},
  {value: 9, symbol: "IX"},
  {value: 5, symbol: "V"},
  {value: 4, symbol: "IV"},
  {value: 1, symbol: "I"},
];

export const numberToRoman = (n: number = 0): string => {
  let string = "";
  for (const {value, symbol} of ROMAN_SYMBOLS) {
    while (n >= value && n !== 0) {
      string += symbol;
      n -= value;
    }
  }
  return string;
};
