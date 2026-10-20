import { TextureRenderer } from "../types";

export const renderPaper: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const color = String(values.color ?? "#e7deca");
    const roughness = Number(values.roughness ?? 45);
    const grain = Number(values.grain ?? 40);
    const opacity = Number(values.opacity ?? 70);

    if (opacity === 0) return;

    let seed = ((options.seed ?? 1) * 7919 + 31337) % 233280;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    // 1. Apply paper base color tint using multiply
    if (color) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = (opacity / 100) * 0.65;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    if (roughness === 0 && grain === 0) return;

    // 2. Build paper surface texture (tooth, pulp fibers, grain) on offscreen canvas
    const texWidth = Math.min(width, 1024);
    const texHeight = Math.min(height, 1024);

    const texCanvas = document.createElement("canvas");
    texCanvas.width = texWidth;
    texCanvas.height = texHeight;

    const texCtx = texCanvas.getContext("2d");
    if (!texCtx) return;

    // 2a. Neutral gray base (128) with micro-grain noise (paper tooth)
    const imgData = texCtx.createImageData(texWidth, texHeight);
    const grainAmp = (grain / 100) * 24;
    const roughnessFactor = roughness / 100;

    for (let i = 0; i < imgData.data.length; i += 4) {
        const noise = grainAmp > 0 ? (random() - 0.5) * 2 * grainAmp : 0;
        const val = Math.max(0, Math.min(255, 128 + noise));
        imgData.data[i] = val;
        imgData.data[i + 1] = val;
        imgData.data[i + 2] = val;
        imgData.data[i + 3] = 255;
    }
    texCtx.putImageData(imgData, 0, 0);

    // 2b. Draw organic paper fibers and pulp flecks
    if (roughness > 0) {
        const fiberCount = Math.floor(roughnessFactor * 350 + 60);

        for (let i = 0; i < fiberCount; i++) {
            const x0 = random() * texWidth;
            const y0 = random() * texHeight;
            const len = 4 + random() * 18;

            // Natural fiber alignment: primarily horizontal with slight drift or cross fibers
            const isCross = random() > 0.82;
            const baseAngle = isCross ? Math.PI / 2 : 0;
            const angle = baseAngle + (random() - 0.5) * 0.6;

            const midX = x0 + Math.cos(angle) * (len / 2) + (random() - 0.5) * 3;
            const midY = y0 + Math.sin(angle) * (len / 2) + (random() - 0.5) * 3;
            const x1 = x0 + Math.cos(angle) * len;
            const y1 = y0 + Math.sin(angle) * len;

            const isDark = random() > 0.45;
            const fiberAlpha = roughnessFactor * (0.12 + random() * 0.22);

            texCtx.beginPath();
            texCtx.moveTo(x0, y0);
            texCtx.quadraticCurveTo(midX, midY, x1, y1);
            texCtx.strokeStyle = isDark
                ? `rgba(60, 52, 45, ${fiberAlpha})`
                : `rgba(220, 215, 205, ${fiberAlpha})`;
            texCtx.lineWidth = 0.5 + random() * 1.1;
            texCtx.lineCap = "round";
            texCtx.stroke();
        }

        // 2c. Faint laid-paper horizontal ribs / pulp lines
        const ribSpacing = 10;
        texCtx.lineWidth = 0.75;
        for (let y = 0; y < texHeight; y += ribSpacing) {
            const ribAlpha = roughnessFactor * 0.05 * (0.8 + random() * 0.4);
            texCtx.strokeStyle = `rgba(100, 95, 85, ${ribAlpha})`;
            texCtx.beginPath();
            texCtx.moveTo(0, y + (random() - 0.5));
            texCtx.lineTo(texWidth, y + (random() - 0.5));
            texCtx.stroke();
        }
    }

    // 3. Composite paper texture overlay onto canvas
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = "overlay";
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(texCanvas, 0, 0, width, height);
    ctx.restore();

    // 4. Subtle soft-light pass for deeper fiber tactility when roughness is high
    if (roughness > 50) {
        ctx.save();
        ctx.globalAlpha = (opacity / 100) * ((roughness - 50) / 100) * 0.45;
        ctx.globalCompositeOperation = "soft-light";
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(texCanvas, 0, 0, width, height);
        ctx.restore();
    }
};
