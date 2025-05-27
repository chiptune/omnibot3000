import {HALF_PI, PI, TWO_PI} from "@utils/math";

export const squircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, PI, PI + HALF_PI);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, PI + HALF_PI, TWO_PI);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, HALF_PI);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, HALF_PI, PI);
  ctx.closePath();
};
