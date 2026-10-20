import { TextureRenderer } from "../types";

export const renderMarble: TextureRenderer = (
    ctx,
    width,
    height,
    values,
    options = {}
) => {
    const veinColor = String(values.veinColor ?? "#3d3935");
    const scale = Number(values.scale ?? 45);
    const veinDensity = Number(values.veinDensity ?? 50);
    const contrast = Number(values.contrast ?? 60);
    const opacity = Number(values.opacity ?? 65);

    if (opacity === 0 || veinDensity === 0) return;

    let seed = ((options.seed ?? 1) * 5441 + 22171) % 233280;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const marbleCanvas = document.createElement("canvas");
    marbleCanvas.width = width;
    marbleCanvas.height = height;
    const mCtx = marbleCanvas.getContext("2d");
    if (!mCtx) return;

    // Helper to parse hex/color to rgba
    const hexToRgba = (hexColor: string, a: number) => {
        const hex = hexColor.replace("#", "");
        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
        }
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
        }
        return hexColor;
    };

    const contrastFactor = contrast / 50;
    const veinCount = Math.floor((veinDensity / 100) * 8 + 3);
    const stepCount = Math.max(15, Math.floor(25 * (scale / 50)));

    // Generate flowing organic marble veins along natural diagonal flow
    const drawVein = (
        startX: number,
        startY: number,
        angle: number,
        length: number,
        thickness: number,
        depth: number
    ) => {
        if (depth > 2 || length < 20) return;

        const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
        let curX = startX;
        let curY = startY;
        let curAngle = angle;
        const segLen = length / stepCount;

        for (let i = 0; i < stepCount; i++) {
            curAngle += (random() - 0.5) * 0.35;
            curX += Math.cos(curAngle) * segLen;
            curY += Math.sin(curAngle) * segLen;
            points.push({ x: curX, y: curY });

            // Branch secondary capillaries
            if (depth < 2 && random() < 0.18) {
                const branchAngle = curAngle + (random() > 0.5 ? 1 : -1) * (0.6 + random() * 0.4);
                drawVein(curX, curY, branchAngle, length * 0.45, thickness * 0.6, depth + 1);
            }
        }

        // Draw soft outer halo for depth
        const haloAlpha = 0.12 * contrastFactor;
        mCtx.beginPath();
        mCtx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            mCtx.lineTo(points[i].x, points[i].y);
        }
        mCtx.strokeStyle = hexToRgba(veinColor, haloAlpha);
        mCtx.lineWidth = thickness * 3.5;
        mCtx.lineCap = "round";
        mCtx.lineJoin = "round";
        mCtx.stroke();

        // Draw core vein line
        const coreAlpha = 0.45 * contrastFactor;
        mCtx.beginPath();
        mCtx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            mCtx.lineTo(points[i].x, points[i].y);
        }
        mCtx.strokeStyle = hexToRgba(veinColor, coreAlpha);
        mCtx.lineWidth = Math.max(0.7, thickness);
        mCtx.stroke();
    };

    // Draw main veins across the diagonal
    const diag = Math.sqrt(width * width + height * height);
    for (let i = 0; i < veinCount; i++) {
        const startX = (random() - 0.2) * width * 1.2;
        const startY = (random() - 0.2) * height * 0.4;
        const baseAngle = Math.PI / 4 + (random() - 0.5) * 0.4;
        const mainLen = diag * (0.5 + random() * 0.6);
        const thickness = (1.2 + random() * 2.2) * (scale / 50);

        drawVein(startX, startY, baseAngle, mainLen, thickness, 0);
    }

    // Determine blend mode based on vein brightness
    const hex = veinColor.replace("#", "");
    const cr = parseInt(hex.slice(0, 2) || "0", 16);
    const cg = parseInt(hex.slice(2, 4) || "0", 16);
    const cb = parseInt(hex.slice(4, 6) || "0", 16);
    const isBright = (cr * 299 + cg * 587 + cb * 114) / 1000 > 130;

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = isBright ? "screen" : "multiply";
    ctx.drawImage(marbleCanvas, 0, 0);
    ctx.restore();
};
