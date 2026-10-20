import { TextureRenderer } from "../types";

export const renderHalftone: TextureRenderer = (
    ctx,
    width,
    height,
    values
) => {
    const dotSize = Math.max(3, Number(values.dotSize ?? 8));
    const angle = Number(values.angle ?? 45);
    const contrast = Number(values.contrast ?? 60);
    const color = String(values.color ?? "#1a1a1a");
    const opacity = Number(values.opacity ?? 80);

    if (opacity === 0) return;

    // Get current image pixel data to sample luminance
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;

    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const cx = width / 2;
    const cy = height / 2;
    const diag = Math.sqrt(width * width + height * height) / 2;

    const contrastFactor = contrast / 50;
    const maxRadius = (dotSize / 2) * 1.2;

    offCtx.fillStyle = color;
    offCtx.beginPath();

    for (let v = -diag; v <= diag; v += dotSize) {
        for (let u = -diag; u <= diag; u += dotSize) {
            const x = Math.round(cx + u * cos - v * sin);
            const y = Math.round(cy + u * sin + v * cos);

            if (x >= 0 && x < width && y >= 0 && y < height) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                // Darker areas -> larger dots
                const adjusted = Math.max(
                    0,
                    Math.min(1, (lum - 0.5) * contrastFactor + 0.5)
                );
                const dotRadius = maxRadius * Math.sqrt(1 - adjusted);

                if (dotRadius > 0.4) {
                    offCtx.moveTo(x + dotRadius, y);
                    offCtx.arc(x, y, dotRadius, 0, Math.PI * 2);
                }
            }
        }
    }

    offCtx.fill();

    // Check if color is bright or dark to choose optimal composite mode
    const hex = color.replace("#", "");
    const cr = parseInt(hex.slice(0, 2) || "0", 16);
    const cg = parseInt(hex.slice(2, 4) || "0", 16);
    const cb = parseInt(hex.slice(4, 6) || "0", 16);
    const isBright = (cr * 299 + cg * 587 + cb * 114) / 1000 > 140;

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = isBright ? "screen" : "multiply";
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
};
