import { TextureRenderer } from "../types";

export const renderGrain: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const intensity = Number(values.intensity ?? 35);
    const size = Number(values.size ?? 1);
    const contrast = Number(values.contrast ?? 55);
    const opacity = Number(values.opacity ?? 65);

    if (intensity === 0 || opacity === 0) return;

    const grainWidth = Math.max(1, Math.ceil(width / size));
    const grainHeight = Math.max(1, Math.ceil(height / size));

    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = grainWidth;
    noiseCanvas.height = grainHeight;

    const noiseCtx = noiseCanvas.getContext("2d");
    if (!noiseCtx) return;

    const noiseImage = noiseCtx.createImageData(grainWidth, grainHeight);

    let seed = ((options.seed ?? 1) * 9301 + 49297) % 233280;

    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const amplitude = intensity * 1.65;
    const contrastFactor = contrast / 50;

    for (let i = 0; i < noiseImage.data.length; i += 4) {
        const noise = (random() - 0.5) * 2 * amplitude * contrastFactor;
        const value = Math.max(0, Math.min(255, 128 + noise));

        noiseImage.data[i] = value;
        noiseImage.data[i + 1] = value;
        noiseImage.data[i + 2] = value;
        noiseImage.data[i + 3] = 255;
    }

    noiseCtx.putImageData(noiseImage, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = "overlay";
    ctx.imageSmoothingEnabled = size < 2;
    ctx.drawImage(noiseCanvas, 0, 0, width, height);
    ctx.restore();
};
