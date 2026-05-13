"use client";

/**
 * Local-only officer profile + PIN gate.
 *
 * Officers are stored in IndexedDB on the device (no server account). Each
 * submission carries the officer's `id` and `name` so back-office can attribute
 * the work, but there is no server auth — this is a trusted-device model
 * suitable for field officers who own the install.
 */

import { del, get, set } from "idb-keyval";
import { useCallback, useEffect, useState } from "react";

export type OfficerRole =
  | "field_officer"
  | "trainer"
  | "me_specialist"
  | "manager";

export const OFFICER_ROLES: Record<OfficerRole, string> = {
  field_officer: "Field Officer",
  trainer: "Trainer / Instructor",
  me_specialist: "M&E Specialist",
  manager: "Programme Manager",
};

export interface Officer {
  id: string;
  name: string;
  role: OfficerRole;
  phone?: string;
  pinHash: string;
  salt: string;
  createdAt: number;
}

const KEY_ACTIVE = "sr-officer:active";
const KEY_LIST = "sr-officer:list";
const KEY_UNLOCKED = "sr-officer:unlocked"; // session flag

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const enc = new TextEncoder().encode(`${salt}:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function listOfficers(): Promise<Officer[]> {
  return (await get<Officer[]>(KEY_LIST)) ?? [];
}

export async function getActiveOfficer(): Promise<Officer | null> {
  return (await get<Officer>(KEY_ACTIVE)) ?? null;
}

export async function setActiveOfficer(officer: Officer | null): Promise<void> {
  if (officer === null) {
    await del(KEY_ACTIVE);
    await del(KEY_UNLOCKED);
    return;
  }
  await set(KEY_ACTIVE, officer);
}

export async function createOfficer(input: {
  name: string;
  role: OfficerRole;
  phone?: string;
  pin: string;
}): Promise<Officer> {
  const salt = randomSalt();
  const pinHash = await hashPin(input.pin, salt);
  const officer: Officer = {
    id: randomId(),
    name: input.name.trim(),
    role: input.role,
    phone: input.phone?.trim() || undefined,
    pinHash,
    salt,
    createdAt: Date.now(),
  };
  const list = await listOfficers();
  list.push(officer);
  await set(KEY_LIST, list);
  await setActiveOfficer(officer);
  await markUnlocked();
  return officer;
}

export async function verifyPin(officer: Officer, pin: string): Promise<boolean> {
  const candidate = await hashPin(pin, officer.salt);
  return candidate === officer.pinHash;
}

export async function changePin(officer: Officer, newPin: string): Promise<Officer> {
  const salt = randomSalt();
  const pinHash = await hashPin(newPin, salt);
  const updated: Officer = { ...officer, salt, pinHash };
  const list = await listOfficers();
  const next = list.map((o) => (o.id === officer.id ? updated : o));
  await set(KEY_LIST, next);
  await setActiveOfficer(updated);
  return updated;
}

export async function removeOfficer(id: string): Promise<void> {
  const list = await listOfficers();
  const next = list.filter((o) => o.id !== id);
  await set(KEY_LIST, next);
  const active = await getActiveOfficer();
  if (active?.id === id) {
    await setActiveOfficer(null);
  }
}

export async function markUnlocked(): Promise<void> {
  await set(KEY_UNLOCKED, { at: Date.now() });
}

export async function isUnlocked(): Promise<boolean> {
  const v = await get<{ at: number }>(KEY_UNLOCKED);
  return Boolean(v?.at);
}

export async function lock(): Promise<void> {
  await del(KEY_UNLOCKED);
}

export interface UseOfficerState {
  officer: Officer | null;
  loading: boolean;
  unlocked: boolean;
  refresh: () => Promise<void>;
}

/**
 * React hook for reading the active officer + unlock state.
 * Subscribes to a custom "sr-officer-changed" event for cross-component updates.
 */
export function useOfficer(): UseOfficerState {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [active, unl] = await Promise.all([getActiveOfficer(), isUnlocked()]);
      setOfficer(active);
      setUnlocked(unl);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const handler = () => {
      void refresh();
    };
    window.addEventListener("sr-officer-changed", handler);
    return () => window.removeEventListener("sr-officer-changed", handler);
  }, [refresh]);

  return { officer, loading, unlocked, refresh };
}

export function emitOfficerChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sr-officer-changed"));
  }
}
