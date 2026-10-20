import { TextureRenderer } from "../types";

export const renderChromatic: TextureRenderer = (
    ctx,
    width,
    height,
    values
) => {
    const offset = Number(values.offset ?? 12);
    const angle = Number(values.angle ?? 0);
    const radial = Number(values.radial ?? 35);
    const opacity = Number(values.opacity ?? 85);

    if (opacity === 0 || offset === 0) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const srcData = new Uint8ClampedArray(imgData.data);
    const dstData = imgData.data;

    const rad = (angle * Math.PI) / 180;
    const baseDx = Math.cos(rad) * offset;
    const baseDy = Math.sin(rad) * offset;

    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    const radialFactor = radial / 100;

    for (let y = 0; y < height; y++) {
        const dyCenter = y - cy;
        const rowOffset = y * width;

        for (let x = 0; x < width; x++) {
            const dxCenter = x - cx;
            const distRatio = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) / maxDist;
            const scale = (1 - radialFactor) + radialFactor * (distRatio * 1.4);

            const dx = Math.round(baseDx * scale);
            const dy = Math.round(baseDy * scale);

            // Red shifted +dx, +dy
            const rx = Math.max(0, Math.min(width - 1, x + dx));
            const ry = Math.max(0, Math.min(height - 1, y + dy));
            const rIdx = (ry * width + rx) * 4;

            // Blue shifted -dx, -dy
            const bx = Math.max(0, Math.min(width - 1, x - dx));
            const by = Math.max(0, Math.min(height - 1, y - dy));
            const bIdx = (by * width + bx) * 4;

            const i = (rowOffset + x) * 4;
            dstData[i] = srcData[rIdx]; // Red
            // Green remains original source pixel
            dstData[i + 1] = srcData[i + 1];
            dstData[i + 2] = srcData[bIdx + 2]; // Blue
        }
    }

    const outCanvas = document.createElement("canvas");
    outCanvas.width = width;
    outCanvas.height = height;
    const outCtx = outCanvas.getContext("2d");
    if (!outCtx) return;

    outCtx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.drawImage(outCanvas, 0, 0);
    ctx.restore();
};
