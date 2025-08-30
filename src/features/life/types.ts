import {vec2} from "@utils/math";

export type Cell = 0 | 1 | 2; /* 0 = dead, 1 = alive, 2 = born */
export type Grid = Cell[][];
export type Lifeform = vec2[];
