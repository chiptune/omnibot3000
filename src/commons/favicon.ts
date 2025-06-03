import {AVATAR_1, AVATAR_2} from "@layout/Header";
import {squircle} from "@utils/canvas";
import {getColorFromCSS} from "@utils/color";

const favIcon = () => {
  const dpr = window.devicePixelRatio;
  const canvas = document.createElement("canvas");
  const size = 80 * dpr;
  const w = 128 * dpr;
  const h = 128 * dpr;
  const r = 4 * dpr;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", {alpha: true});
  if (!ctx) return;
  squircle(ctx, 0, 0, w, h, r);
  ctx.clip();
  /*
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.fillStyle = getColorFromCSS("background");
  ctx.fill();
  */
  ctx.translate(3 * dpr, -6 * dpr);
  ctx.font = `normal ${size}px tty-vt220`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.shadowColor = getColorFromCSS("primary");
  ctx.shadowBlur = 4 * dpr;
  ctx.lineWidth = 2 * dpr;
  ctx.strokeStyle = getColorFromCSS("tertiary");
  ctx.strokeText(AVATAR_1, w / 2, 0);
  ctx.strokeText(AVATAR_2, w / 2, size * 0.9);
  ctx.shadowBlur = 4 * dpr;
  ctx.fillStyle = getColorFromCSS("primary");
  ctx.fillText(AVATAR_1, w / 2, 0);
  ctx.fillText(AVATAR_2, w / 2, size * 0.9);

  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/png";
  icon.href = canvas.toDataURL();
  document.head.appendChild(icon);

  /*
  const preview = document.createElement("img");
  preview.src = canvas.toDataURL();
  preview.style.position = "absolute";
  preview.style.margin = "2rem";
  preview.style.bottom = "0";
  preview.style.left = "0";
  preview.style.zIndex = "3";
  //preview.style.border = "1px dashed red";
  document.body.appendChild(preview);
  */
};

export default favIcon;
