import { cn } from "@/lib/utils";

interface DottedBackgroundProps {
  className?: string;
  dotSize?: number;
  gap?: number;
}

export function DottedBackground({
  className,
  dotSize = 1.5,
  gap = 20,
}: DottedBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 -z-50", className)}
      style={{
        backgroundImage: `radial-gradient(circle, var(--border) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  );
}