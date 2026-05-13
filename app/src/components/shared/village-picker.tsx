"use client";

import { demoVillages } from "@/lib/demo-data";

interface VillagePickerProps {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Restrict to a single sector. Both shown when undefined. */
  sector?: "ifakara" | "mbarali";
  className?: string;
}

/**
 * Standardised village dropdown grouped by operational sector.
 * Replaces the duplicated <optgroup> blocks across submit pages.
 */
export function VillagePicker({
  id = "village",
  value,
  onChange,
  disabled,
  required,
  sector,
  className,
}: VillagePickerProps) {
  const ifakaraVillages = demoVillages.filter((v) => v.sector === "ifakara");
  const mbaraliVillages = demoVillages.filter((v) => v.sector === "mbarali");

  return (
    <select
      id={id}
      required={required}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
      }
    >
      <option value="">Select village...</option>
      {(!sector || sector === "ifakara") && (
        <optgroup label="Msolwa (Ifakara TC)">
          {ifakaraVillages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.wardName})
            </option>
          ))}
        </optgroup>
      )}
      {(!sector || sector === "mbarali") && (
        <optgroup label="Usangu (Mbarali DC)">
          {mbaraliVillages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.wardName})
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
