"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface ComparisonContextValue {
  value: number;
  setValue: (val: number) => void;
  orientation: "horizontal" | "vertical";
  mode: "drag" | "hover";
  disabled?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ComparisonContext = React.createContext<ComparisonContextValue | null>(null);

export function useComparison() {
  const context = React.useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a <Comparison />");
  }
  return context;
}

export interface ComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (val: number) => void;
  orientation?: "horizontal" | "vertical";
  mode?: "drag" | "hover";
  disabled?: boolean;
  before?: React.ReactNode;
  after?: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

export function Comparison({
  value: controlledValue,
  defaultValue = 50,
  onValueChange,
  orientation = "horizontal",
  mode = "drag",
  disabled = false,
  before,
  after,
  beforeLabel,
  afterLabel,
  className,
  children,
  ...props
}: ComparisonProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateValue = React.useCallback(
    (newValue: number) => {
      const clamped = Math.max(0, Math.min(100, newValue));
      if (controlledValue === undefined) {
        setInternalValue(clamped);
      }
      onValueChange?.(clamped);
    },
    [controlledValue, onValueChange]
  );

  const handlePointer = React.useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (orientation === "horizontal") {
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        updateValue(percentage);
      } else {
        const y = clientY - rect.top;
        const percentage = (y / rect.height) * 100;
        updateValue(percentage);
      }
    },
    [disabled, orientation, updateValue]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || mode === "hover") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    handlePointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (mode === "hover" || e.buttons === 1) {
      handlePointer(e.clientX, e.clientY);
    }
  };

  const contextValue = React.useMemo<ComparisonContextValue>(
    () => ({
      value,
      setValue: updateValue,
      orientation,
      mode,
      disabled,
      containerRef,
    }),
    [value, updateValue, orientation, mode, disabled]
  );

  return (
    <ComparisonContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        data-slot="comparison"
        data-orientation={orientation}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className={cn(
          "relative overflow-hidden select-none isolate touch-none",
          !disabled &&
            (orientation === "horizontal"
              ? "cursor-ew-resize"
              : "cursor-ns-resize"),
          disabled && "select-auto touch-auto cursor-default",
          className
        )}
        {...props}
      >
        {before || after ? (
          <>
            {after && (
              <ComparisonItem position="after" label={afterLabel}>
                {after}
              </ComparisonItem>
            )}
            {before && (
              <ComparisonItem position="before" label={beforeLabel}>
                {before}
              </ComparisonItem>
            )}
            <ComparisonHandle />
          </>
        ) : (
          children
        )}
      </div>
    </ComparisonContext.Provider>
  );
}

export interface ComparisonItemProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "before" | "after" | "left" | "right";
  label?: string;
  labelPosition?: "top" | "bottom";
}

export function ComparisonItem({
  position = "before",
  label,
  labelPosition = "bottom",
  className,
  children,
  style,
  ...props
}: ComparisonItemProps) {
  const { value, orientation } = useComparison();
  const isBefore = position === "before" || position === "left";

  const clipStyle: React.CSSProperties = isBefore
    ? {
        clipPath:
          orientation === "horizontal"
            ? `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`
            : `polygon(0 0, 100% 0, 100% ${value}%, 0 ${value}%)`,
      }
    : {};

  return (
    <div
      data-slot={`comparison-${position}`}
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden pointer-events-none",
        isBefore ? "z-10" : "z-0",
        className
      )}
      style={{ ...clipStyle, ...style }}
      {...props}
    >
      {children}

      {label && (
        <span
          className={cn(
            "pointer-events-none absolute z-20 rounded-md border border-border/70 bg-background/85 px-2 py-0.5 text-[11px] font-medium tracking-tight text-foreground shadow-sm backdrop-blur-md",
            labelPosition === "bottom" ? "bottom-3" : "top-3",
            isBefore ? "left-3" : "right-3"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export interface ComparisonHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export function ComparisonHandle({
  showIcon = true,
  icon,
  className,
  style,
  ...props
}: ComparisonHandleProps) {
  const { value, setValue, orientation, disabled } = useComparison();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 2;
    if (orientation === "horizontal") {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setValue(value - step);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setValue(value + step);
      }
    } else {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setValue(value - step);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setValue(value + step);
      }
    }
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="slider"
      aria-label="Comparison divider"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      data-slot="comparison-handle"
      className={cn(
        "absolute z-20 transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isHorizontal
          ? "top-0 bottom-0 w-0.5 -translate-x-1/2 bg-foreground/75 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          : "left-0 right-0 h-0.5 -translate-y-1/2 bg-foreground/75 shadow-[0_0_12px_rgba(0,0,0,0.4)]",
        className
      )}
      style={{
        [isHorizontal ? "left" : "top"]: `${value}%`,
        ...style,
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95",
          isHorizontal
            ? "top-1/2 -translate-y-1/2 -translate-x-1/2 size-7"
            : "left-1/2 -translate-x-1/2 -translate-y-1/2 size-7"
        )}
      >
        {showIcon &&
          (icon || (
            <GripVertical
              className={cn(
                "size-3.5 text-muted-foreground",
                !isHorizontal && "rotate-90"
              )}
            />
          ))}
      </div>
    </div>
  );
}
