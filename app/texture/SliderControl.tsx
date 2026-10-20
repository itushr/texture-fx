"use client";

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
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
            />
        </div>
    );
}
