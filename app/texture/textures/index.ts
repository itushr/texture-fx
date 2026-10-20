import { TextureRenderer } from "../types";
import { renderGrain } from "./grain";
import { renderPaper } from "./paper";

export { renderGrain } from "./grain";
export { renderPaper } from "./paper";

export const TEXTURE_RENDERERS: Record<string, TextureRenderer> = {
    grain: renderGrain,
    paper: renderPaper,
};
