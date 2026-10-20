import { CSSProperties } from "react";

export type TextureValue = number | string;
export type TextureValues = Record<string, TextureValue>;

export type SliderInputConfig = {
    id: string;
    type: "slider";
    label: string;
    defaultValue: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
};

export type ColorInputConfig = {
    id: string;
    type: "color";
    label: string;
    defaultValue: string;
    suggestedColors: string[];
};

export type TextureInput = SliderInputConfig | ColorInputConfig;

export type TexturePreset = {
    name: string;
    values: TextureValues;
};

export type TextureRendererOptions = {
    seed?: number;
};

export type TextureRenderer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    values: TextureValues,
    options?: TextureRendererOptions
) => void;

export type Texture = {
    id: string;
    name: string;
    description: string;
    category: string;
    implemented?: boolean;
    preview: CSSProperties;
    inputs?: TextureInput[];
    presets?: TexturePreset[];
};

export type GrainSettings = {
    intensity: number;
    size: number;
    contrast: number;
    opacity: number;
};
