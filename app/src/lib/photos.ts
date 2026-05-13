"use client";

/**
 * Photo capture, client-side compression, and Supabase Storage upload.
 *
 * When offline, photos are stashed in IndexedDB as base64 strings and replayed
 * on next sync alongside the form post that referenced them.
 */

import { del, get, set } from "idb-keyval";
import { supabase } from "./supabase";

const BUCKET = "sr-photos";
const QUEUE_PREFIX = "sr-photo:";

interface QueuedPhoto {
  id: string;
  pathPrefix: string;
  base64: string;
  mime: string;
  createdAt: number;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function compressImage(
  file: File,
  maxDim = 1600,
  quality = 0.75,
): Promise<Blob> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return resolve(file);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob ?? file);
        },
        "image/jpeg",
        quality,
      );
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function uploadBlob(blob: Blob, pathPrefix: string): Promise<string | null> {
  if (!supabase) return null;
  const ext = blob.type.includes("png") ? "png" : "jpg";
  const path = `${pathPrefix}/${Date.now()}-${makeId()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "image/jpeg",
    upsert: false,
  });
  if (error) {
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Compress + upload each file, queueing those that fail. Returns the URLs that
 * succeeded synchronously. Queued ones surface in the offline queue and are
 * uploaded on the next sync cycle.
 */
export async function uploadOrQueuePhotos(
  files: File[],
  pathPrefix: string,
): Promise<string[]> {
  if (!files.length) return [];
  const urls: string[] = [];
  for (const file of files) {
    try {
      const compressed = await compressImage(file);
      const online = typeof navigator === "undefined" ? true : navigator.onLine;
      if (online && supabase) {
        const url = await uploadBlob(compressed, pathPrefix);
        if (url) urls.push(url);
        continue;
      }
      const base64 = await blobToBase64(compressed);
      const queued: QueuedPhoto = {
        id: makeId(),
        pathPrefix,
        base64,
        mime: compressed.type || "image/jpeg",
        createdAt: Date.now(),
      };
      await set(`${QUEUE_PREFIX}${queued.id}`, queued);
    } catch {
      // Best-effort — failed photos don't block the submission.
    }
  }
  return urls;
}

export async function drainPhotoQueue(): Promise<{ uploaded: number; failed: number }> {
  if (!supabase) return { uploaded: 0, failed: 0 };
  const keys = await import("idb-keyval").then((m) => m.keys());
  const photoKeys = keys.filter((k): k is string => typeof k === "string" && k.startsWith(QUEUE_PREFIX));
  let uploaded = 0;
  let failed = 0;
  for (const k of photoKeys) {
    const photo = await get<QueuedPhoto>(k);
    if (!photo) continue;
    try {
      const blob = base64ToBlob(photo.base64, photo.mime);
      const url = await uploadBlob(blob, photo.pathPrefix);
      if (url) {
        await del(k);
        uploaded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }
  return { uploaded, failed };
}
