import type { CalculateTarget, VoltageDividerValues } from "./voltageDividerTypes";

export type { CalculateTarget, VoltageDividerValues };

function isPositive(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value) && value > 0;
}

function isNonNegative(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value) && value >= 0;
}

export function parseNonNegativeNumber(text: string): number | null {
  const normalized = text.trim().replace(",", ".");

  if (normalized === "") {
    return null;
  }

  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function parsePositiveNumber(text: string): number | null {
  const value = parseNonNegativeNumber(text);
  return value !== null && value > 0 ? value : null;
}

export function calculateVoltageDivider(
  target: CalculateTarget,
  values: Partial<VoltageDividerValues>,
): number | null {
  const { vin, vout, r1, r2 } = values;

  switch (target) {
    case "vout":
      if (!isPositive(vin) || !isPositive(r1) || !isPositive(r2)) {
        return null;
      }
      return vin * r2 / (r1 + r2);

    case "vin":
      if (!isNonNegative(vout) || !isPositive(r1) || !isPositive(r2)) {
        return null;
      }
      return vout * (r1 + r2) / r2;

    case "r1":
      if (!isPositive(vin) || !isPositive(vout) || !isPositive(r2) || vout >= vin) {
        return null;
      }
      return r2 * (vin - vout) / vout;

    case "r2":
      if (!isPositive(vin) || !isPositive(vout) || !isPositive(r1) || vout >= vin) {
        return null;
      }
      return r1 * vout / (vin - vout);
  }
}
