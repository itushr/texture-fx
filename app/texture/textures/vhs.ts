import { TextureRenderer } from "../types";

export const renderVhs: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const distortion = Number(values.distortion ?? 45);
    const scanlines = Number(values.scanlines ?? 50);
    const colorBleed = Number(values.colorBleed ?? 60);
    const tint = String(values.tint ?? "#00ffff");
    const opacity = Number(values.opacity ?? 85);

    if (opacity === 0) return;

    let seed = ((options.seed ?? 1) * 8191 + 17389) % 233280;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const vhsCanvas = document.createElement("canvas");
    vhsCanvas.width = width;
    vhsCanvas.height = height;
    const vhsCtx = vhsCanvas.getContext("2d");
    if (!vhsCtx) return;

    // Draw base image onto vhs canvas
    vhsCtx.drawImage(ctx.canvas, 0, 0);

    // 1. Horizontal slice glitches & tracking error band
    if (distortion > 0) {
        const sliceCount = Math.floor((distortion / 100) * 8 + 2);
        for (let i = 0; i < sliceCount; i++) {
            const sliceY = Math.floor(random() * height);
            const sliceH = Math.floor(random() * 28 + 4);
            const shift = Math.floor((random() - 0.5) * (distortion / 100) * 50);

            if (shift !== 0 && sliceY + sliceH <= height) {
                vhsCtx.drawImage(
                    vhsCanvas,
                    0,
                    sliceY,
                    width,
                    sliceH,
                    shift,
                    sliceY,
                    width,
                    sliceH
                );
            }
        }

        // Bottom tape tracking noise band
        const trackingHeight = Math.floor((distortion / 100) * 35 + 10);
        const trackingY = height - trackingHeight;
        for (let y = trackingY; y < height; y += 2) {
            const shift = Math.floor((random() - 0.5) * (distortion / 100) * 30);
            vhsCtx.drawImage(vhsCanvas, 0, y, width, 2, shift, y, width, 2);
        }
    }

    // 2. Chromatic RGB tape bleed (channel shift)
    if (colorBleed > 0) {
        const imgData = vhsCtx.getImageData(0, 0, width, height);
        const srcData = new Uint8ClampedArray(imgData.data);
        const dstData = imgData.data;
        const shift = Math.max(1, Math.round((colorBleed / 100) * 7));

        for (let y = 0; y < height; y++) {
            const rowOffset = y * width;
            for (let x = 0; x < width; x++) {
                const i = (rowOffset + x) * 4;
                const rX = Math.max(0, x - shift);
                const bX = Math.min(width - 1, x + shift);
                const rIdx = (rowOffset + rX) * 4;
                const bIdx = (rowOffset + bX) * 4;

                dstData[i] = srcData[rIdx]; // Red shifted left
                dstData[i + 2] = srcData[bIdx + 2]; // Blue shifted right
            }
        }
        vhsCtx.putImageData(imgData, 0, 0);
    }

    // 3. Scanlines
    if (scanlines > 0) {
        const scanlineAlpha = (scanlines / 100) * 0.32;
        vhsCtx.save();
        vhsCtx.fillStyle = `rgba(0, 0, 0, ${scanlineAlpha})`;
        for (let y = 0; y < height; y += 3) {
            vhsCtx.fillRect(0, y, width, 1.5);
        }
        vhsCtx.restore();
    }

    // 4. Phosphor tint glow
    if (tint) {
        vhsCtx.save();
        vhsCtx.globalCompositeOperation = "color-dodge";
        vhsCtx.globalAlpha = (opacity / 100) * 0.12;
        vhsCtx.fillStyle = tint;
        vhsCtx.fillRect(0, 0, width, height);
        vhsCtx.restore();
    }

    // 5. Composite back onto main canvas
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.drawImage(vhsCanvas, 0, 0);
    ctx.restore();
};
