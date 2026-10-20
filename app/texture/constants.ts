import { GrainSettings, Texture, TextureValues } from "./types";

export const DEFAULT_SETTINGS: GrainSettings = {
    intensity: 35,
    size: 1,
    contrast: 55,
    opacity: 65,
};

export const PRESETS = [
    { name: "Subtle", intensity: 12, size: 1, contrast: 35, opacity: 45 },
    { name: "Film", intensity: 35, size: 1, contrast: 55, opacity: 65 },
    { name: "Vintage", intensity: 48, size: 2, contrast: 72, opacity: 72 },
    { name: "Heavy", intensity: 75, size: 2, contrast: 85, opacity: 85 },
] as const;

export const TEXTURES: Texture[] = [
    {
        id: "grain",
        name: "Film grain",
        description: "Analog noise & character",
        category: "NOISE",
        implemented: true,
        preview: {
            backgroundColor: "#8d8b82",
            backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.55\'/%3E%3C/svg%3E")',
        },
        inputs: [
            {
                id: "intensity",
                type: "slider",
                label: "Intensity",
                defaultValue: 35,
                min: 0,
                max: 100,
                unit: "%",
            },
            {
                id: "size",
                type: "slider",
                label: "Grain size",
                defaultValue: 1,
                min: 1,
                max: 8,
                unit: "px",
            },
            {
                id: "contrast",
                type: "slider",
                label: "Contrast",
                defaultValue: 55,
                min: 0,
                max: 100,
                unit: "%",
            },
            {
                id: "opacity",
                type: "slider",
                label: "Opacity",
                defaultValue: 65,
                min: 0,
                max: 100,
                unit: "%",
            },
        ],
        presets: [
            {
                name: "Subtle",
                values: { intensity: 12, size: 1, contrast: 35, opacity: 45 },
            },
            {
                name: "Film",
                values: { intensity: 35, size: 1, contrast: 55, opacity: 65 },
            },
            {
                name: "Vintage",
                values: { intensity: 48, size: 2, contrast: 72, opacity: 72 },
            },
            {
                name: "Heavy",
                values: { intensity: 75, size: 2, contrast: 85, opacity: 85 },
            },
        ],
    },
    {
        id: "dust",
        name: "Scratches",
        description: "Aged film imperfections",
        category: "ANALOG",
        implemented: false,
        preview: {
            backgroundColor: "#c4b8a1",
            backgroundImage:
                "radial-gradient(circle at 20% 30%, #665b4c 0 1px, transparent 1.5px), radial-gradient(circle at 65% 70%, #f5ead5 0 2px, transparent 2.5px), radial-gradient(circle at 82% 18%, #65594a 0 1px, transparent 1.5px), repeating-linear-gradient(103deg, transparent 0 35px, #8a7c67 36px 37px, transparent 38px 70px)",
            backgroundSize: "43px 37px, 53px 47px, 67px 59px, 100% 100%",
        },
    },
    {
        id: "paper",
        name: "Paper",
        description: "Soft fibrous texture",
        category: "MATERIAL",
        implemented: true,
        preview: {
            backgroundColor: "#e7deca",
            backgroundImage:
                "repeating-linear-gradient(7deg, transparent 0 3px, #b8ab91 3.5px, transparent 4px 8px), repeating-linear-gradient(93deg, transparent 0 7px, #c8baa1 7.5px, transparent 8px 13px)",
            backgroundSize: "100% 100%",
        },
        inputs: [
            {
                id: "color",
                type: "color",
                label: "Paper color",
                defaultValue: "#e7deca",
                suggestedColors: [
                    "#f5f0e6",
                    "#e7deca",
                    "#d9cbba",
                    "#e5e4de",
                    "#cfd5d0",
                    "#2c2925",
                ],
            },
            {
                id: "roughness",
                type: "slider",
                label: "Roughness",
                defaultValue: 45,
                min: 0,
                max: 100,
                unit: "%",
            },
            {
                id: "grain",
                type: "slider",
                label: "Fiber detail",
                defaultValue: 40,
                min: 0,
                max: 100,
                unit: "%",
            },
            {
                id: "opacity",
                type: "slider",
                label: "Opacity",
                defaultValue: 70,
                min: 0,
                max: 100,
                unit: "%",
            },
        ],
        presets: [
            {
                name: "Parchment",
                values: {
                    color: "#e7deca",
                    roughness: 45,
                    grain: 40,
                    opacity: 70,
                },
            },
            {
                name: "Kraft",
                values: {
                    color: "#d9cbba",
                    roughness: 65,
                    grain: 60,
                    opacity: 80,
                },
            },
            {
                name: "Newsprint",
                values: {
                    color: "#e5e4de",
                    roughness: 30,
                    grain: 50,
                    opacity: 60,
                },
            },
            {
                name: "Fine Art",
                values: {
                    color: "#f5f0e6",
                    roughness: 25,
                    grain: 20,
                    opacity: 50,
                },
            },
        ],
    },
    {
        id: "halftone",
        name: "Halftone",
        description: "Classic printed dots",
        category: "PRINT",
        preview: {
            backgroundColor: "#e8e5de",
            backgroundImage:
                "radial-gradient(circle, #242424 1.6px, transparent 2px)",
            backgroundSize: "8px 8px",
        },
    },
    {
        id: "vhs",
        name: "VHS",
        description: "Retro tape distortion",
        category: "GLITCH",
        preview: {
            backgroundColor: "#181923",
            backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 5px, #ffffff18 6px 7px, transparent 8px 12px), linear-gradient(90deg, transparent 0 20%, #ff365e65 23%, transparent 32% 65%, #3c9bff75 70%, transparent 80%)",
        },
    },
    {
        id: "marble",
        name: "Marble",
        description: "Natural flowing veins",
        category: "ORGANIC",
        preview: {
            backgroundColor: "#dedbd5",
            backgroundImage:
                "repeating-radial-gradient(ellipse at 20% 30%, transparent 0 10px, #77746e80 11px 12px, transparent 13px 24px), repeating-linear-gradient(135deg, transparent 0 30px, #ffffff 32px, transparent 34px 55px)",
        },
    },
    {
        id: "chromatic",
        name: "Chromatic",
        description: "Color channel separation",
        category: "DISTORTION",
        preview: {
            backgroundColor: "#171717",
            backgroundImage:
                "radial-gradient(ellipse at 35% 40%, #ff435a 0 18%, transparent 19%), radial-gradient(ellipse at 48% 40%, #48d6c6 0 18%, transparent 19%), radial-gradient(ellipse at 41% 50%, #6267ff 0 18%, transparent 19%)",
        },
    },
    {
        id: "noise",
        name: "Digital noise",
        description: "Raw monochrome static",
        category: "NOISE",
        preview: {
            backgroundColor: "#555",
            backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'1\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        },
    },
    {
        id: "gradient",
        name: "Color wash",
        description: "Soft atmospheric gradients",
        category: "COLOR",
        preview: {
            backgroundColor: "#222",
            backgroundImage:
                "radial-gradient(ellipse at 20% 20%, #f7a58c 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, #8c84e8 0%, transparent 55%), linear-gradient(135deg, #3b6477, #171b30)",
        },
    },
];

export function getDefaultTextureValues(texture: Texture): TextureValues {
    const values: TextureValues = {};
    if (texture.inputs) {
        for (const input of texture.inputs) {
            values[input.id] = input.defaultValue;
        }
    }
    return values;
}
