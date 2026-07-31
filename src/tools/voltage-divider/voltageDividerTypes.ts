export type CalculateTarget = "vin" | "vout" | "r1" | "r2";

export type VoltageDividerValues = {
  vin: number;
  vout: number;
  r1: number;
  r2: number;
};

export type ResistanceUnitId = "ohm" | "kohm" | "mohm";

export const resistanceUnits = [
  { id: "ohm", label: "Ω", multiplier: 1 },
  { id: "kohm", label: "kΩ", multiplier: 1_000 },
  { id: "mohm", label: "MΩ", multiplier: 1_000_000 },
] as const;

export type PreferredSeriesId = "none" | "E6" | "E12" | "E24" | "E48" | "E96" | "E192";
