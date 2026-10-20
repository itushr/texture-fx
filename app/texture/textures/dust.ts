import { TextureRenderer } from "../types";

export const renderDust: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const color = String(values.color ?? "#ffffff");
    const dust = Number(values.dust ?? 45);
    const scratches = Number(values.scratches ?? 40);
    const intensity = Number(values.intensity ?? 65);
    const opacity = Number(values.opacity ?? 75);

    if (opacity === 0 || (dust === 0 && scratches === 0)) return;

    let seed = ((options.seed ?? 1) * 6271 + 51131) % 233280;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const dustCanvas = document.createElement("canvas");
    dustCanvas.width = width;
    dustCanvas.height = height;

    const dustCtx = dustCanvas.getContext("2d");
    if (!dustCtx) return;

    const intensityFactor = intensity / 100;

    // Helper to parse hex/color to rgba
    const hexToRgba = (hexColor: string, alpha: number) => {
        const hex = hexColor.replace("#", "");
        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
        }
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
        }
        return hexColor;
    };

    // 1. DUST PARTICLES & HAIRS
    if (dust > 0) {
        const baseCount = Math.floor((dust / 100) * ((width * height) / 3800) + 35);

        for (let i = 0; i < baseCount; i++) {
            const x = random() * width;
            const y = random() * height;
            const particleType = random();

            if (particleType < 0.65) {
                // Micro-speck / pinhole
                const radius = 0.5 + random() * 1.5;
                const alpha = intensityFactor * (0.35 + random() * 0.55);

                dustCtx.beginPath();
                dustCtx.arc(x, y, radius, 0, Math.PI * 2);
                dustCtx.fillStyle = hexToRgba(color, alpha);
                dustCtx.fill();
            } else if (particleType < 0.88) {
                // Irregular fleck / small cluster
                const radiusX = 1.2 + random() * 2.2;
                const radiusY = 0.8 + random() * 1.8;
                const rot = random() * Math.PI;
                const alpha = intensityFactor * (0.4 + random() * 0.5);

                dustCtx.save();
                dustCtx.translate(x, y);
                dustCtx.rotate(rot);
                dustCtx.beginPath();
                dustCtx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
                dustCtx.fillStyle = hexToRgba(color, alpha);
                dustCtx.fill();
                dustCtx.restore();
            } else {
                // Hair / curly fiber strand
                const length = 12 + random() * 28;
                const startAngle = random() * Math.PI * 2;
                const curveFactor = (random() - 0.5) * 16;
                const alpha = intensityFactor * (0.35 + random() * 0.45);

                const midX = x + Math.cos(startAngle) * (length / 2) + curveFactor;
                const midY = y + Math.sin(startAngle) * (length / 2) + curveFactor;
                const endX = x + Math.cos(startAngle) * length;
                const endY = y + Math.sin(startAngle) * length;

                dustCtx.beginPath();
                dustCtx.moveTo(x, y);
                dustCtx.quadraticCurveTo(midX, midY, endX, endY);
                dustCtx.strokeStyle = hexToRgba(color, alpha);
                dustCtx.lineWidth = 0.7 + random() * 1.1;
                dustCtx.lineCap = "round";
                dustCtx.stroke();
            }
        }
    }

    // 2. FILM SCRATCHES
    if (scratches > 0) {
        const scratchCount = Math.floor((scratches / 100) * 14 + 2);

        for (let i = 0; i < scratchCount; i++) {
            const xBase = random() * width;
            const isFullLength = random() > 0.45;
            const startY = isFullLength ? 0 : random() * (height * 0.6);
            const totalLen = isFullLength
                ? height
                : 40 + random() * (height * 0.5);
            const endY = Math.min(height, startY + totalLen);

            const segments = Math.max(3, Math.floor((endY - startY) / 60));
            const segHeight = (endY - startY) / segments;

            const alpha = intensityFactor * (0.35 + random() * 0.5);
            const lineWidth = 0.6 + random() * 1.2;

            dustCtx.beginPath();
            let currentX = xBase;
            dustCtx.moveTo(currentX, startY);

            for (let s = 1; s <= segments; s++) {
                const currentY = startY + s * segHeight;
                // Slight wavering drift in the scratch line
                currentX = xBase + (random() - 0.5) * 3;
                dustCtx.lineTo(currentX, currentY);
            }

            dustCtx.strokeStyle = hexToRgba(color, alpha);
            dustCtx.lineWidth = lineWidth;
            dustCtx.lineCap = "round";

            // Occasional broken / intermittent scratch
            if (random() > 0.6) {
                dustCtx.setLineDash([
                    15 + random() * 30,
                    6 + random() * 14,
                    35 + random() * 60,
                ]);
            } else {
                dustCtx.setLineDash([]);
            }

            dustCtx.stroke();
            dustCtx.setLineDash([]);
        }
    }

    // 3. Composite onto canvas
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(dustCanvas, 0, 0);
    ctx.restore();
};
