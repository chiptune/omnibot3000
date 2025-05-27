import {AVATAR_1, AVATAR_2} from "@layout/Header";
import {squircle} from "@utils/canvas";
import {getColorFromCSS} from "@utils/color";

const favIcon = () => {
  const dpr = window.devicePixelRatio;
  const canvas = document.createElement("canvas");
  const size = 64 * dpr;
  const w = 128 * dpr;
  const h = 128 * dpr;
  const r = 24 * dpr;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", {alpha: true});
  if (!ctx) return;
  squircle(ctx, 0, 0, w, h, r);
  ctx.clip();
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.fillStyle = getColorFromCSS("background");
  ctx.fill();
  ctx.font = `normal ${size}px tty-vt220`;
  ctx.textAlign = "center";

  ctx.shadowColor = getColorFromCSS("secondary");
  ctx.shadowBlur = 32 * dpr;
  ctx.fillStyle = getColorFromCSS("primary");
  ctx.fillText(AVATAR_1, w / 2, h / 2 - r / 4);
  ctx.fillText(AVATAR_2, w / 2, h / 2 + size - r / 2);
  ctx.shadowBlur = 8 * dpr;
  ctx.fillStyle = getColorFromCSS("primary");
  ctx.fillText(AVATAR_1, w / 2, h / 2 - r / 4);
  ctx.fillText(AVATAR_2, w / 2, h / 2 + size - r / 2);

  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/png";
  icon.href = canvas.toDataURL();

  document.head.appendChild(icon);
};

export default favIcon;
