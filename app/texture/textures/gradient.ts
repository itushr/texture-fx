import { TextureRenderer } from "../types";

export const renderGradient: TextureRenderer = (
    ctx,
    width,
    height,
    values
) => {
    const color1 = String(values.color1 ?? "#f7a58c");
    const color2 = String(values.color2 ?? "#8c84e8");
    const angle = Number(values.angle ?? 135);
    const intensity = Number(values.intensity ?? 60);
    const opacity = Number(values.opacity ?? 65);

    if (opacity === 0) return;

    const gradCanvas = document.createElement("canvas");
    gradCanvas.width = width;
    gradCanvas.height = height;
    const gCtx = gradCanvas.getContext("2d");
    if (!gCtx) return;

    const cx = width / 2;
    const cy = height / 2;
    const diag = Math.sqrt(width * width + height * height) / 2;
    const rad = (angle * Math.PI) / 180;

    const x0 = cx - Math.cos(rad) * diag;
    const y0 = cy - Math.sin(rad) * diag;
    const x1 = cx + Math.cos(rad) * diag;
    const y1 = cy + Math.sin(rad) * diag;

    // 1. Directional linear color wash
    const linearGrad = gCtx.createLinearGradient(x0, y0, x1, y1);
    linearGrad.addColorStop(0, color1);
    linearGrad.addColorStop(1, color2);

    gCtx.fillStyle = linearGrad;
    gCtx.fillRect(0, 0, width, height);

    // 2. Corner radial atmospheric blooms (matching the preview style)
    const bloomRadius = Math.max(width, height) * 0.7;

    // Bloom 1 (color1 highlight leak at top-left / start corner)
    const bloom1 = gCtx.createRadialGradient(
        width * 0.2,
        height * 0.2,
        0,
        width * 0.2,
        height * 0.2,
        bloomRadius
    );
    bloom1.addColorStop(0, color1);
    bloom1.addColorStop(0.65, "transparent");

    gCtx.save();
    gCtx.globalCompositeOperation = "screen";
    gCtx.globalAlpha = (intensity / 100) * 0.55;
    gCtx.fillStyle = bloom1;
    gCtx.fillRect(0, 0, width, height);
    gCtx.restore();

    // Bloom 2 (color2 atmosphere at bottom-right / opposite corner)
    const bloom2 = gCtx.createRadialGradient(
        width * 0.8,
        height * 0.8,
        0,
        width * 0.8,
        height * 0.8,
        bloomRadius
    );
    bloom2.addColorStop(0, color2);
    bloom2.addColorStop(0.65, "transparent");

    gCtx.save();
    gCtx.globalCompositeOperation = "screen";
    gCtx.globalAlpha = (intensity / 100) * 0.45;
    gCtx.fillStyle = bloom2;
    gCtx.fillRect(0, 0, width, height);
    gCtx.restore();

    // 3. Composite gradient wash onto the main canvas
    ctx.save();
    ctx.globalAlpha = (opacity / 100) * 0.85;
    ctx.globalCompositeOperation = "soft-light";
    ctx.drawImage(gradCanvas, 0, 0);

    // Subtle overlay pass for extra pop if intensity is high
    if (intensity > 50) {
        ctx.globalAlpha = (opacity / 100) * ((intensity - 50) / 100) * 0.4;
        ctx.globalCompositeOperation = "overlay";
        ctx.drawImage(gradCanvas, 0, 0);
    }
    ctx.restore();
};
