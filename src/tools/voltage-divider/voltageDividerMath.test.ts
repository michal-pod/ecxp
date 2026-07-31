import { describe, expect, it } from "vitest";
import { eSeriesValues } from "../../domain/e-series/eSeriesData";
import { roundToPreferredValue } from "../../domain/e-series/eSeriesUtils";
import {
  calculateVoltageDivider,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "./voltageDividerMath";

describe("calculateVoltageDivider", () => {
  it("calculates every divider target", () => {
    expect(calculateVoltageDivider("vout", { vin: 5, r1: 10_000, r2: 10_000 })).toBe(2.5);
    expect(calculateVoltageDivider("vin", { vout: 2.5, r1: 10_000, r2: 10_000 })).toBe(5);
    expect(calculateVoltageDivider("r1", { vin: 5, vout: 2.5, r2: 10_000 })).toBe(10_000);
    expect(calculateVoltageDivider("r2", { vin: 5, vout: 2.5, r1: 10_000 })).toBe(10_000);
  });

  it("calculates an asymmetric divider", () => {
    expect(calculateVoltageDivider("r1", { vin: 5, vout: 3.3, r2: 10_000 })).toBeCloseTo(
      5151.515,
      3,
    );
  });

  it("returns null for invalid values", () => {
    expect(calculateVoltageDivider("vout", { vin: 5, r1: 0, r2: 10_000 })).toBeNull();
    expect(calculateVoltageDivider("vout", { vin: 5, r1: 10_000, r2: 0 })).toBeNull();
    expect(calculateVoltageDivider("r1", { vin: 5, vout: 5, r2: 10_000 })).toBeNull();
    expect(calculateVoltageDivider("r2", { vin: 5, vout: 5, r1: 10_000 })).toBeNull();
    expect(calculateVoltageDivider("vout", { vin: -5, r1: 10_000, r2: 10_000 })).toBeNull();
    expect(calculateVoltageDivider("vin", { vout: 2.5, r1: 10_000 })).toBeNull();
  });
});

describe("number parsing", () => {
  it("accepts decimal separators and scientific notation", () => {
    expect(parsePositiveNumber("3,3")).toBe(3.3);
    expect(parsePositiveNumber("1e3")).toBe(1000);
    expect(parsePositiveNumber("2.2e-3")).toBe(0.0022);
    expect(parseNonNegativeNumber("0")).toBe(0);
  });

  it("rejects invalid and negative values", () => {
    expect(parsePositiveNumber("")).toBeNull();
    expect(parsePositiveNumber("0")).toBeNull();
    expect(parsePositiveNumber("-1")).toBeNull();
    expect(parseNonNegativeNumber("Infinity")).toBeNull();
    expect(parseNonNegativeNumber("1abc")).toBeNull();
  });
});

describe("preferred value rounding", () => {
  it("rounds to E-series examples", () => {
    expect(roundToPreferredValue(4680, eSeriesValues.E12.map((item) => item.value))).toBe(4700);
    expect(roundToPreferredValue(5151.515, eSeriesValues.E24.map((item) => item.value))).toBe(5100);
    expect(roundToPreferredValue(995, eSeriesValues.E24.map((item) => item.value))).toBe(1000);
    expect(roundToPreferredValue(95, eSeriesValues.E12.map((item) => item.value))).toBe(100);
    expect(roundToPreferredValue(1000, eSeriesValues.E96.map((item) => item.value))).toBe(1000);
  });

  it("chooses the higher value on tie", () => {
    expect(roundToPreferredValue(110, [1, 1.2])).toBe(120);
  });
});
