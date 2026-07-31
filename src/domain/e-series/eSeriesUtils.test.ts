import { describe, expect, it } from "vitest";
import { eSeriesValues } from "./eSeriesData";
import {
  buildESeriesRows,
  calculateDistance,
  filterRowsBySeries,
  normalizeSearchValue,
  parseSearchValue,
  roundToPreferredValue,
  sortRows,
} from "./eSeriesUtils";

describe("parseSearchValue", () => {
  it("accepts empty text and one to three digits above zero", () => {
    expect(parseSearchValue("")).toBeNull();
    expect(parseSearchValue("47")).toBe(47);
    expect(parseSearchValue("001")).toBe(1);
  });

  it("rejects invalid values", () => {
    expect(parseSearchValue("0")).toBeNull();
    expect(parseSearchValue("1000")).toBeNull();
    expect(parseSearchValue("4.7")).toBeNull();
    expect(parseSearchValue("abc")).toBeNull();
  });
});

describe("normalizeSearchValue", () => {
  it("normalizes integers to one decade", () => {
    expect(normalizeSearchValue(1)).toBe(1);
    expect(normalizeSearchValue(5)).toBe(5);
    expect(normalizeSearchValue(10)).toBe(1);
    expect(normalizeSearchValue(47)).toBe(4.7);
    expect(normalizeSearchValue(100)).toBe(1);
    expect(normalizeSearchValue(120)).toBe(1.2);
    expect(normalizeSearchValue(999)).toBe(9.99);
  });
});

describe("calculateDistance", () => {
  it("calculates absolute distance from normalized search value", () => {
    expect(calculateDistance(4.7, normalizeSearchValue(47))).toBe(0);
    expect(calculateDistance(4.75, normalizeSearchValue(47))).toBe(0.05);
    expect(calculateDistance(1.2, normalizeSearchValue(120))).toBe(0);
  });
});

describe("E-series rows", () => {
  const rows = buildESeriesRows(eSeriesValues);

  it("filters by selected series", () => {
    expect(filterRowsBySeries(rows, ["E6"]).map((row) => row.label)).toEqual([
      "1.0",
      "1.5",
      "2.2",
      "3.3",
      "4.7",
      "6.8",
    ]);

    const e6AndE12 = filterRowsBySeries(rows, ["E6", "E12"]).map((row) => row.label);
    expect(e6AndE12).toContain("1.2");
    expect(e6AndE12).toContain("4.7");
    expect(e6AndE12).not.toContain("1.1");
  });

  it("sorts by value without search", () => {
    const sorted = sortRows(rows.slice(0, 4), null);
    expect(sorted.map((row) => row.value)).toEqual(
      sorted.map((row) => row.value).slice().sort((a, b) => a - b),
    );
  });

  it("sorts by distance with search and then by value", () => {
    const sorted = sortRows(
      [
        { value: 4.3, label: "4.3", series: ["E24"] },
        { value: 5.1, label: "5.1", series: ["E24"] },
        { value: 4.7, label: "4.7", series: ["E6"] },
      ],
      normalizeSearchValue(47),
    );

    expect(sorted.map((row) => row.label)).toEqual(["4.7", "4.3", "5.1"]);
  });
});

describe("roundToPreferredValue", () => {
  it("rounds values to the nearest preferred value across decades", () => {
    expect(roundToPreferredValue(4680, eSeriesValues.E12.map((item) => item.value))).toBe(4700);
    expect(roundToPreferredValue(5151.515, eSeriesValues.E24.map((item) => item.value))).toBe(5100);
    expect(roundToPreferredValue(995, eSeriesValues.E24.map((item) => item.value))).toBe(1000);
    expect(roundToPreferredValue(95, eSeriesValues.E12.map((item) => item.value))).toBe(100);
    expect(roundToPreferredValue(1000, eSeriesValues.E96.map((item) => item.value))).toBe(1000);
  });

  it("chooses the higher value on an exact tie", () => {
    expect(roundToPreferredValue(110, [1, 1.2])).toBe(120);
  });
});
