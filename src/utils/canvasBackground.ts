import type { CanvasBackground } from "../types/drawing";

export function drawCanvasBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  background: CanvasBackground
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (background === "plain") return;

  ctx.strokeStyle = "#e5e7eb";
  ctx.fillStyle = "#d1d5db";
  ctx.lineWidth = 1;

  const spacing = 24;

  if (background === "grid") {
    for (let x = 0; x <= width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  if (background === "dots") {
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}