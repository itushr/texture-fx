"use client";

import { Slider } from "@/components/ui/slider"

type SliderControlProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
};

export default function SliderControl({
    label,
    value,
    min,
    max,
    step = 1,
    unit = "",
    onChange,
}: SliderControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">
                    {value}
                    {unit}
                </span>
            </div>
            <Slider
                value={value}
                min={min}
                max={max}
                step={step}
                onValueChange={(val: number | readonly number[]) =>
                    onChange(typeof val === "number" ? val : val[0])}
                className="w-full cursor-pointer mt-4" />
        </div>
    );
}
