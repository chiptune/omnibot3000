import {Lifeform} from "@/features/life/types";

export const BLOCK: Lifeform = [
  [0, 0] /* O O */,
  [1, 0] /* O O */,
  [0, 1],
  [1, 1],
];

export const TUB: Lifeform = [
  [1, 0] /* . O . */,
  [0, 1] /* O . O */,
  [2, 1] /* . O . */,
  [1, 2],
];

export const BOAT: Lifeform = [
  [0, 0] /* O O . */,
  [1, 0] /* O . O */,
  [0, 1] /* . O . */,
  [2, 1],
  [1, 2],
];

export const BEEHIVE: Lifeform = [
  [1, 0] /* . O O . */,
  [2, 0] /* O . . O */,
  [0, 1] /* . O O . */,
  [3, 1],
  [1, 2],
  [2, 2],
];

export const LOAF: Lifeform = [
  [1, 0] /* . O O . */,
  [2, 0] /* O . . O */,
  [0, 1] /* . O . O */,
  [3, 1] /* . . O . */,
  [1, 2],
  [3, 2],
  [2, 3],
];

export const GLIDER: Lifeform = [
  [1, 0] /* . O . */,
  [2, 1] /* . . O */,
  [0, 2] /* O O O */,
  [1, 2],
  [2, 2],
];

export const LWSS: Lifeform = [
  [1, 0] /* . O . . O */,
  [4, 0] /* O . . . . */,
  [0, 1] /* O . . . O */,
  [0, 2] /* O O O O . */,
  [4, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
];

export const MWSS: Lifeform = [
  [2, 0] /* . . O O O O */,
  [3, 0] /* O . . . . O */,
  [4, 0] /* . . . . . O */,
  [5, 0] /* O . . . O . */,
  [0, 1],
  [5, 1],
  [5, 2],
  [0, 3],
  [4, 3],
];

export const HWSS: Lifeform = [
  [3, 0] /* . . . O O O O */,
  [4, 0] /* O . . . . . O */,
  [5, 0] /* . . . . . . O */,
  [6, 0] /* O . . . . O . */,
  [0, 1],
  [6, 1],
  [6, 2],
  [0, 3],
  [5, 3],
];

export const BLINKER: Lifeform = [
  [1, 0] /* . O . */,
  [1, 1] /* . O . */,
  [1, 2] /* . O . */,
];

export const TOAD: Lifeform = [
  [1, 0] /* . O O O */,
  [2, 0] /* O O O . */,
  [3, 0],
  [0, 1],
  [1, 1],
  [2, 1],
];

export const BEACON: Lifeform = [
  [0, 0] /* O O . */,
  [1, 0] /* O O . */,
  [0, 1] /* . O O */,
  [1, 1] /* . O O */,
  [1, 2],
  [2, 2],
  [1, 3],
  [2, 3],
];

const LIFEFORMS: Lifeform[] = [
  //BLOCK,
  //TUB,
  //BOAT,
  //BEEHIVE,
  //LOAF,
  GLIDER,
  LWSS,
  MWSS,
  HWSS,
  //BLINKER,
  //TOAD,
  //BEACON,
];

export default LIFEFORMS;
