import { TextureRenderer } from "../types";

export const renderNoise: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const amount = Number(values.amount ?? 40);
    const density = Number(values.density ?? 70);
    const mode = String(values.mode ?? "#ffffff");
    const contrast = Number(values.contrast ?? 60);
    const opacity = Number(values.opacity ?? 60);

    if (opacity === 0 || amount === 0) return;

    let seed = ((options.seed ?? 1) * 7333 + 41183) % 233280;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = width;
    noiseCanvas.height = height;

    const nCtx = noiseCanvas.getContext("2d");
    if (!nCtx) return;

    const imgData = nCtx.createImageData(width, height);
    const data = imgData.data;

    const hex = mode.replace("#", "");
    const cr = parseInt(hex.slice(0, 2) || "255", 16);
    const cg = parseInt(hex.slice(2, 4) || "255", 16);
    const cb = parseInt(hex.slice(4, 6) || "255", 16);
    const isMono = mode.toLowerCase() === "#ffffff" || mode.toLowerCase() === "#000000";

    const amplitude = (amount / 100) * 180;
    const contrastFactor = contrast / 50;
    const coverage = density / 100;

    for (let i = 0; i < data.length; i += 4) {
        if (random() <= coverage) {
            const rawNoise = (random() - 0.5) * 2 * amplitude * contrastFactor;
            const val = Math.max(0, Math.min(255, 128 + rawNoise));

            if (isMono) {
                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
                data[i + 3] = 255;
            } else {
                // Tinted colored sensor noise
                const tintRatio = 0.65;
                data[i] = Math.max(0, Math.min(255, val * (1 - tintRatio) + cr * tintRatio));
                data[i + 1] = Math.max(0, Math.min(255, val * (1 - tintRatio) + cg * tintRatio));
                data[i + 2] = Math.max(0, Math.min(255, val * (1 - tintRatio) + cb * tintRatio));
                data[i + 3] = 255;
            }
        } else {
            // Neutral 128 gray (invisible in overlay mode)
            data[i] = 128;
            data[i + 1] = 128;
            data[i + 2] = 128;
            data[i + 3] = 255;
        }
    }

    nCtx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(noiseCanvas, 0, 0);
    ctx.restore();
};
