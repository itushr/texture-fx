"use client";

import { FileImage, Trash, Plus, Minus, Scan, ArrowDownToLine, ImageIcon } from "lucide-react";
import { type ChangeEvent, type DragEvent, RefObject } from "react";

type CanvasAreaProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    imageRef: RefObject<HTMLImageElement | null>;
    fileInputRef: RefObject<HTMLInputElement | null>;
    imageUrl: string | null;
    fileName: string;
    showOriginal: boolean;
    zoom: number;
    isDragging: boolean;
    isProcessing: boolean;
    setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (e: DragEvent<HTMLElement>) => void;
    removeImage: () => void;
};

export default function CanvasArea({
    canvasRef,
    imageRef,
    fileInputRef,
    imageUrl,
    fileName,
    showOriginal,
    zoom,
    isDragging,
    isProcessing,
    setShowOriginal,
    setZoom,
    handleFileChange,
    handleDrop,
    removeImage,
}: CanvasAreaProps) {
    return (
        <section
            className="relative flex flex-1 min-h-[55vh] min-w-0 flex-col border-b border-border/60 lg:min-h-screen lg:border-b-0 lg:border-r"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
            />

            {/* Floating Header */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-4 sm:p-6">
                <div className="pointer-events-auto flex items-center px-5 py-2 invisible gap-1.5 rounded-xl border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur-xl">
                    Pixel FX
                </div>
                {imageUrl && (
                    <div className="pointer-events-auto flex items-center gap-1 rounded-sm border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur-xl">
                        <button
                            onClick={() => setShowOriginal((value) => !value)}
                            className={`rounded-lg px-3 py-2 text-xs transition-colors ${showOriginal
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            Compare
                        </button>

                        <button
                            onClick={removeImage}
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <Trash className="size-4" />
                        </button>

                        <button
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="download textured image"
                        >
                            <ArrowDownToLine className="size-4.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Canvas / upload */}
            <div
                className={`relative flex flex-1 items-center justify-center overflow-hidden p-6 transition-colors ${isDragging ? "bg-primary/4" : ""
                    }`}
                style={{
                    backgroundImage:
                        "radial-gradient(var(--border) 0.7px, transparent 0.7px)",
                    backgroundSize: "18px 18px",
                }}
            >
                {imageUrl ? (
                    <>
                        <canvas
                            ref={canvasRef}
                            className="block h-auto max-w-full rounded-sm shadow-[0_12px_60px_-18px_rgba(0,0,0,0.28)]"
                            style={{
                                maxHeight: "min(78vh, 1000px)",
                                width: "100%",
                                transform: `scale(${zoom}%)`,
                                objectFit: "contain",
                            }}
                        />
                    </>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex w-full max-w-sm flex-col items-center text-center cursor-pointer text-foreground/70"
                    >
                        <div className="relative flex items-center justify-center transition-all duration-300">
                            <ImageIcon className="size-40" strokeWidth={1.5} nonScalingStroke />
                        </div>

                        <span className="text-lg font-light">
                            Drop your image here..
                        </span>

                        <span className="mt-2 max-w-70 text-sm leading-6 text-muted-foreground">
                            Start with an image. Add texture, find your look, and export
                            at full resolution.
                        </span>

                        <span className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity group-hover:opacity-85">
                            <FileImage className="size-4" />
                            Browse files
                        </span>

                        <span className="mt-2 text-[11px] text-muted-foreground">
                            PNG, JPG, WebP and more
                        </span>
                    </button>
                )}
            </div>

            {imageUrl && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 p-6">
                    <div className="pointer-events-auto flex items-center rounded-sm border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur-xl">
                        <button
                            onClick={() =>
                                setZoom(100)
                            }
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Reset Zoom"
                        >
                            <Scan className="size-3.5" />
                        </button>
                    </div>

                    <div className="pointer-events-auto flex items-center rounded-sm border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur-xl">
                        <button
                            onClick={() =>
                                setZoom((value) =>
                                    value - 10
                                )
                            }
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Zoom Down"
                        >
                            <Minus className="size-4" />
                        </button>

                        <button
                            onClick={() =>
                                setZoom(100)
                            }
                            className="flex items-center justify-center w-12 gap-1.5 rounded-lg py-2 text-xs text-muted-foreground transition-colors cursor-default"
                        >
                            {zoom}%
                        </button>

                        <button
                            onClick={() =>
                                setZoom((value) =>
                                    value + 10
                                )
                            }
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Zoom Up"
                        >
                            <Plus className="size-4" />
                        </button>

                    </div>
                </div>
            )}
        </section>
    );
}