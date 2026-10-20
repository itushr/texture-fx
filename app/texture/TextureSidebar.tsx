"use client";

import { TEXTURES } from "./constants";
import { Texture, TexturePreset, TextureValues, TextureValue } from "./types";
import SliderControl from "./SliderControl";
import ColorControl from "./ColorControl";
import {
    ArrowDownToLine,
    Check,
    Ban,
} from "lucide-react";

type TextureSidebarProps = {
    selectedTexture: string | null;
    activePreset: string;
    values: TextureValues;
    imageUrl: string | null;
    isProcessing: boolean;
    chooseTexture: (texture: Texture) => void;
    setSelectedTexture: (id: string | null) => void;
    resetSettings: () => void;
    applyPreset: (preset: TexturePreset) => void;
    updateSetting: (key: string, value: TextureValue) => void;
    downloadImage: () => void;
};

export default function TextureSidebar({
    selectedTexture,
    activePreset,
    values,
    imageUrl,
    isProcessing,
    chooseTexture,
    setSelectedTexture,
    applyPreset,
    updateSetting,
    downloadImage,
}: TextureSidebarProps) {
    const currentTexture = TEXTURES.find((t) => t.id === selectedTexture);

    return (
        <aside className="flex flex-row-reverse min-w-0 bg-card">
            {/* TEXTURES GRID */}
            <div className="p-3 h-dvh overflow-auto border-l">
                <div className="flex flex-col gap-3 items-center">
                    <button
                        onClick={() => setSelectedTexture(null)}
                        className="group min-w-0 text-left cursor-pointer w-fit flex flex-col items-center"
                    >
                        <div
                            className={`p-1 border-3 border-border/70 ${
                                selectedTexture === null
                                    ? "border-primary"
                                    : "border-border/70"
                            } rounded-xl`}
                        >
                            <div className="texture-preview w-12 relative aspect-square overflow-hidden transition-all border-border/70 flex justify-center items-center">
                                <Ban className="size-10  text-foreground/80" nonScalingStroke strokeWidth={2} />
                            </div>
                        </div>
                        <div className="mt-1 flex items-start justify-between gap-1.5">
                            <div className="min-w-0">
                                <h3 className="truncate text-xs font-medium">None</h3>
                            </div>
                        </div>
                    </button>
                    {TEXTURES.map((texture) => (
                        <button
                            key={texture.id}
                            onClick={() => chooseTexture(texture)}
                            className="group min-w-0 text-left cursor-pointer w-fit flex flex-col items-center"
                        >
                            <div
                                className={`p-1 border-3 border-border/70 ${
                                    texture.id === selectedTexture
                                        ? "border-primary"
                                        : "border-border/70"
                                } rounded-xl`}
                            >
                                <div
                                    className="texture-preview w-12 relative aspect-square overflow-hidden rounded-lg border transition-all border-border/70"
                                    style={texture.preview}
                                />
                            </div>
                            <div className="mt-1 flex items-start justify-between gap-1.5">
                                <div className="min-w-0">
                                    <h3 className="truncate text-xs font-medium">
                                        {texture.name}
                                    </h3>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* TEXTURE Controls */}
            {selectedTexture && currentTexture && (
                <div className="flex flex-col h-dvh w-80 overflow-y-auto border-l border-border/60">
                    <div className="flex-1 px-5">
                        {/* Presets */}
                        {currentTexture.presets && currentTexture.presets.length > 0 && (
                            <div className="mt-8">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-xs font-medium">Presets</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {currentTexture.presets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => applyPreset(preset)}
                                            className={`relative flex flex-col justify-between items-center overflow-hidden rounded-sm border p-3 text-left transition-colors cursor-pointer ${
                                                activePreset === preset.name
                                                    ? "border-foreground/50 bg-muted/70"
                                                    : "border-border bg-background hover:bg-muted/40"
                                            }`}
                                        >
                                            <div
                                                className="pointer-events-none absolute inset-0 opacity-20"
                                                style={currentTexture.preview}
                                            />
                                            <span className="relative flex items-center justify-between text-xs font-medium w-full">
                                                {preset.name}
                                                {activePreset === preset.name && (
                                                    <Check className="size-3.5" />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="my-7 h-px bg-border/70" />
                            </div>
                        )}

                        {/* Adjustment controls */}
                        <div
                            className={`space-y-7 ${
                                !currentTexture.presets || currentTexture.presets.length === 0
                                    ? "mt-8"
                                    : ""
                            }`}
                        >
                            {currentTexture.inputs?.map((input) => {
                                if (input.type === "slider") {
                                    return (
                                        <SliderControl
                                            key={input.id}
                                            label={input.label}
                                            value={Number(
                                                values[input.id] ?? input.defaultValue
                                            )}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            unit={input.unit}
                                            onChange={(val) =>
                                                updateSetting(input.id, val)
                                            }
                                        />
                                    );
                                }

                                if (input.type === "color") {
                                    return (
                                        <ColorControl
                                            key={input.id}
                                            label={input.label}
                                            value={String(
                                                values[input.id] ?? input.defaultValue
                                            )}
                                            suggestedColors={input.suggestedColors}
                                            onChange={(val) =>
                                                updateSetting(input.id, val)
                                            }
                                        />
                                    );
                                }

                                return null;
                            })}
                        </div>
                    </div>

                    <div className="border-t border-border/60 px-5 mt-auto py-2">
                        <button
                            onClick={downloadImage}
                            disabled={!imageUrl || isProcessing}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <ArrowDownToLine className="size-4" />
                            Export image
                        </button>

                        <p className="mt-3 text-center text-[10px] text-muted-foreground">
                            PNG · Original resolution · Lossless
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
