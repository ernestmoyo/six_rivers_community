"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PhotoInputProps {
  value: File[];
  onChange: (files: File[]) => void;
  label?: string;
  maxFiles?: number;
}

export function PhotoInput({ value, onChange, label = "Photos", maxFiles = 4 }: PhotoInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = value.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [value]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next = [...value, ...Array.from(files)].slice(0, maxFiles);
    onChange(next);
  }

  function remove(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {previews.map((url, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove photo"
              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {value.length < maxFiles && (
          <Button
            type="button"
            variant="secondary"
            className="h-20 w-20 gap-1 flex-col"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="h-5 w-5" />
            <span className="text-[10px]">Add</span>
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {value.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {value.length} photo{value.length === 1 ? "" : "s"} attached
          {typeof navigator !== "undefined" && !navigator.onLine && " — will upload on next sync"}
        </span>
      )}
    </div>
  );
}
