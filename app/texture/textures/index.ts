import { TextureRenderer } from "../types";
import { renderGrain } from "./grain";
import { renderPaper } from "./paper";
import { renderDust } from "./dust";
import { renderHalftone } from "./halftone";
import { renderVhs } from "./vhs";
import { renderMarble } from "./marble";
import { renderChromatic } from "./chromatic";
import { renderNoise } from "./noise";
import { renderGradient } from "./gradient";

export { renderGrain } from "./grain";
export { renderPaper } from "./paper";
export { renderDust } from "./dust";
export { renderHalftone } from "./halftone";
export { renderVhs } from "./vhs";
export { renderMarble } from "./marble";
export { renderChromatic } from "./chromatic";
export { renderNoise } from "./noise";
export { renderGradient } from "./gradient";

export const TEXTURE_RENDERERS: Record<string, TextureRenderer> = {
    grain: renderGrain,
    dust: renderDust,
    paper: renderPaper,
    halftone: renderHalftone,
    vhs: renderVhs,
    marble: renderMarble,
    chromatic: renderChromatic,
    noise: renderNoise,
    gradient: renderGradient,
};
