import {ASCII_CURRENCY, ASCII_SPACE} from "@commons/constants";
import {vec2} from "@utils/math";

import LIFEFORMS from "@life/lifeforms";
import {Cell, Grid, Lifeform} from "@life/types";

export const init = (w: number, h: number): Grid =>
  Array.from({length: h}, () => Array.from({length: w}, () => 0));

export const birth = (
  grid: Grid,
  lifeform: Lifeform,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  lifeform.forEach((v: vec2): void => {
    grid[(y + h + v[1]) % h][(x + w + v[0]) % w] = 1;
  });
  return grid;
};

export const randomize = (
  grid: Grid,
  n: number,
  w: number,
  h: number,
): Grid => {
  for (let i = 0; i < n; i++) {
    birth(
      grid,
      LIFEFORMS[Math.round(Math.random() * (LIFEFORMS.length - 1))],
      Math.round(Math.random() * w),
      Math.round(Math.random() * h),
      w,
      h,
    );
  }
  return grid;
};

const getCell = (
  grid: Grid,
  x: number,
  y: number,
  w: number,
  h: number,
): Cell => grid[(y + h) % h][(x + w) % w];

const countNeighbours = (
  grid: Grid,
  x: number,
  y: number,
  w: number,
  h: number,
): number => {
  let count = 0;
  if (getCell(grid, x - 1, y - 1, w, h) === 1) count++;
  if (getCell(grid, x, y - 1, w, h) === 1) count++;
  if (getCell(grid, x + 1, y - 1, w, h) === 1) count++;
  if (getCell(grid, x - 1, y, w, h) === 1) count++;
  if (getCell(grid, x + 1, y, w, h) === 1) count++;
  if (getCell(grid, x - 1, y + 1, w, h) === 1) count++;
  if (getCell(grid, x, y + 1, w, h) === 1) count++;
  if (getCell(grid, x + 1, y + 1, w, h) === 1) count++;
  return count;
};

export const tick = (grid: Grid, w: number, h: number): Grid => {
  const g: Grid = [];
  let population = 0;
  for (let y = 0; y < h; y++) {
    g[y] = [];
    for (let x = 0; x < w; x++) {
      const alive = grid[y][x] === 1;
      const neighbours = countNeighbours(grid, x, y, w, h);
      if (alive) {
        g[y][x] = neighbours < 2 || neighbours > 3 ? 2 : 1;
      } else {
        g[y][x] = neighbours === 3 ? 1 : 0;
      }
      if (g[y][x] === 1) population++;
    }
  }
  if (population === 0) randomize(g, 16, w, h);
  return g;
};

export const render = (grid: Grid): string =>
  grid
    .flat()
    .map((v) => (v === 1 ? ASCII_CURRENCY : ASCII_SPACE))
    .join("");
