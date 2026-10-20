"use client";

import { type Texture, type TexturePreset, type TextureValue, type TextureValues } from "./types";
import { TEXTURES, getDefaultTextureValues } from "./constants";
import { TEXTURE_RENDERERS } from "./textures";
import CanvasArea from "./CanvasArea";
import TextureSidebar from "./TextureSidebar";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";
import { ImagePlus } from "lucide-react";

const getInitialTextureValues = (): Record<string, TextureValues> => {
    const initial: Record<string, TextureValues> = {};
    for (const texture of TEXTURES) {
        if (texture.inputs) {
            initial[texture.id] = getDefaultTextureValues(texture);
        }
    }
    const grainTexture = TEXTURES.find((t) => t.id === "grain");
    const filmPreset = grainTexture?.presets?.find((p) => p.name === "Film");
    if (filmPreset && initial["grain"]) {
        initial["grain"] = { ...initial["grain"], ...filmPreset.values };
    }
    return initial;
};

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(null);
    const seedRef = useRef(1);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [textureValues, setTextureValues] = useState<
        Record<string, TextureValues>
    >(getInitialTextureValues);

    const [selectedTexture, setSelectedTexture] = useState<string | null>("grain");
    const [activePresets, setActivePresets] = useState<Record<string, string>>({
        grain: "Film",
        dust: "Aged Film",
        paper: "Parchment",
        halftone: "Newspaper",
        vhs: "VCR Play",
        marble: "Carrara",
        chromatic: "Prism Fringe",
        noise: "High ISO",
        gradient: "Sunset Wash",
    });

    const [showOriginal, setShowOriginal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [zoom, setZoom] = useState(100);

    const currentValues =
        (selectedTexture && textureValues[selectedTexture]) || {};
    const activePreset =
        (selectedTexture && activePresets[selectedTexture]) || "";

    const loadImage = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) return;

        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;

        const image = new Image();

        image.onload = () => {
            imageRef.current = image;
            setImageUrl(url);
            setFileName(file.name);
            setShowOriginal(false);
            seedRef.current += 1;
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            objectUrlRef.current = null;
        };

        image.src = url;
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) loadImage(file);
        event.target.value = "";
    };

    const handleDrop = (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = Array.from(event.dataTransfer.files).find((item) =>
            item.type.startsWith("image/")
        );

        if (file) loadImage(file);
    };

    const updateSetting = (key: string, value: TextureValue) => {
        if (!selectedTexture) return;
        setTextureValues((prev) => ({
            ...prev,
            [selectedTexture]: {
                ...prev[selectedTexture],
                [key]: value,
            },
        }));
        setActivePresets((prev) => ({
            ...prev,
            [selectedTexture]: "",
        }));
    };

    const applyPreset = (preset: TexturePreset) => {
        if (!selectedTexture) return;
        setTextureValues((prev) => ({
            ...prev,
            [selectedTexture]: {
                ...prev[selectedTexture],
                ...preset.values,
            },
        }));
        setActivePresets((prev) => ({
            ...prev,
            [selectedTexture]: preset.name,
        }));
    };

    const resetSettings = () => {
        if (!selectedTexture) return;
        const texture = TEXTURES.find((t) => t.id === selectedTexture);
        if (!texture) return;
        setTextureValues((prev) => ({
            ...prev,
            [selectedTexture]: getDefaultTextureValues(texture),
        }));
        setActivePresets((prev) => ({
            ...prev,
            [selectedTexture]: texture.presets?.[0]?.name ?? "",
        }));
        setShowOriginal(false);
    };

    const renderTexture = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (!canvas || !image) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = image.naturalWidth;
        const height = image.naturalHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        if (!selectedTexture) return;

        const renderer = TEXTURE_RENDERERS[selectedTexture];
        if (!renderer) return;

        const values = textureValues[selectedTexture] || {};
        renderer(ctx, width, height, values, { seed: seedRef.current });
    }, [selectedTexture, textureValues]);

    useEffect(() => {
        if (!imageRef.current) return;

        setIsProcessing(true);

        const frame = requestAnimationFrame(() => {
            renderTexture();
            setIsProcessing(false);
        });

        return () => cancelAnimationFrame(frame);
    }, [renderTexture, imageUrl]);

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageUrl) return;

        canvas.toBlob((blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const baseName = fileName.replace(/\.[^/.]+$/, "");

            link.href = url;
            link.download = `${baseName || "image"}-${selectedTexture || "texture"}.png`;
            link.click();

            URL.revokeObjectURL(url);
        }, "image/png");
    };

    const removeImage = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        imageRef.current = null;
        setImageUrl(null);
        setFileName("");
    };

    const chooseTexture = (texture: Texture) => {
        if (!texture.implemented) return;
        setSelectedTexture(texture.id);
        setShowOriginal(false);
    };

    return (
        <main
            className="texture-page relative min-h-screen overflow-hidden bg-background text-foreground"
            onDragEnter={(event) => {
                event.preventDefault();
                if (event.dataTransfer.types.includes("Files")) {
                    setIsDragging(true);
                }
            }}
            onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setIsDragging(false);
                }
            }}
        >
            <div className="min-h-screen flex">
                <CanvasArea
                    canvasRef={canvasRef}
                    imageRef={imageRef}
                    fileInputRef={fileInputRef}
                    imageUrl={imageUrl}
                    fileName={fileName}
                    showOriginal={showOriginal}
                    zoom={zoom}
                    isDragging={isDragging}
                    isProcessing={isProcessing}
                    setShowOriginal={setShowOriginal}
                    setZoom={setZoom}
                    handleFileChange={handleFileChange}
                    handleDrop={handleDrop}
                    removeImage={removeImage}
                    downloadImage={downloadImage}
                />

                <TextureSidebar
                    selectedTexture={selectedTexture}
                    activePreset={activePreset}
                    values={currentValues}
                    imageUrl={imageUrl}
                    isProcessing={isProcessing}
                    chooseTexture={chooseTexture}
                    setSelectedTexture={setSelectedTexture}
                    resetSettings={resetSettings}
                    applyPreset={applyPreset}
                    updateSetting={updateSetting}
                    downloadImage={downloadImage}
                />
            </div>

            {isDragging && (
                <div className="pointer-events-none fixed inset-3 z-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-background/90 backdrop-blur-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                            <ImagePlus className="size-7" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Drop to open
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your image will open in the canvas.
                        </p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .texture-preview {
                    isolation: isolate;
                    background-size: cover;
                    background-position: center;
                }
                .texture-page {
                    -webkit-tap-highlight-color: transparent;
                }
                .texture-page ::selection {
                    background: var(--foreground);
                    color: var(--background);
                }
            `}</style>
        </main>
    );
}
