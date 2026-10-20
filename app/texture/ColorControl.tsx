"use client";

import { useRef } from "react";
import { Check, Plus } from "lucide-react";

type ColorControlProps = {
    label: string;
    value: string;
    suggestedColors: string[];
    onChange: (value: string) => void;
};

function isLightColor(colorStr: string): boolean {
    const hex = colorStr.replace("#", "");
    if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
    }
    if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
    }
    return true;
}

export default function ColorControl({
    label,
    value,
    suggestedColors,
    onChange,
}: ColorControlProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const isCustom = !suggestedColors.some(
        (c) => c.toLowerCase() === value.toLowerCase()
    );

    const handleCustomClick = () => {
        const input = inputRef.current;
        if (!input) return;
        if ("showPicker" in input && typeof input.showPicker === "function") {
            try {
                input.showPicker();
                return;
            } catch {
                // Fallback to click
            }
        }
        input.click();
    };

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                    {value}
                </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {suggestedColors.map((color) => {
                    const isSelected =
                        value.toLowerCase() === color.toLowerCase();
                    const light = isLightColor(color);

                    return (
                        <button
                            key={color}
                            type="button"
                            onClick={() => onChange(color)}
                            title={color}
                            className={`relative size-7 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                                isSelected
                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card border-transparent scale-105"
                                    : "border-border/80 hover:scale-105 hover:border-foreground/30"
                            }`}
                            style={{ backgroundColor: color }}
                        >
                            {isSelected && (
                                <Check
                                    className={`size-3.5 ${
                                        light ? "text-neutral-900" : "text-white"
                                    }`}
                                    strokeWidth={2.5}
                                />
                            )}
                        </button>
                    );
                })}

                {/* Plus button to set custom color */}
                <button
                    type="button"
                    onClick={handleCustomClick}
                    title={isCustom ? `Custom color: ${value}` : "Choose custom color"}
                    className={`relative size-7 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                        isCustom
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-card border-transparent scale-105"
                            : "border-dashed border-border/80 hover:border-foreground/40 bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                    }`}
                    style={isCustom ? { backgroundColor: value } : undefined}
                >
                    <Plus
                        className={`size-3.5 ${
                            isCustom
                                ? isLightColor(value)
                                    ? "text-neutral-900"
                                    : "text-white"
                                : ""
                        }`}
                        strokeWidth={2.5}
                    />
                    <input
                        ref={inputRef}
                        type="color"
                        value={value.startsWith("#") ? value : "#e7deca"}
                        onChange={(e) => onChange(e.target.value)}
                        className="sr-only pointer-events-none"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    );
}
