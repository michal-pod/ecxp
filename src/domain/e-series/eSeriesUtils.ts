import { eSeriesNames } from "./eSeriesData";
import type { ESeriesDisplayRow, ESeriesName, ESeriesRow, ESeriesValue } from "./eSeriesTypes";

const valueKeyPrecision = 1000;

function keyForValue(value: number) {
  return String(Math.round(value * valueKeyPrecision));
}

export function parseSearchValue(text: string): number | null {
  if (text === "") {
    return null;
  }

  if (!/^\d{1,3}$/.test(text)) {
    return null;
  }

  const value = Number(text);
  return value > 0 ? value : null;
}

export function normalizeSearchValue(value: number) {
  let normalized = value;
  while (normalized >= 10) {
    normalized /= 10;
  }

  return Number(normalized.toFixed(3));
}

export function calculateDistance(rowValue: number, normalizedSearchValue: number) {
  return Number(Math.abs(rowValue - normalizedSearchValue).toFixed(6));
}

export function formatDistance(distance: number | null) {
  if (distance === null) {
    return "--";
  }

  return distance
    .toFixed(3)
    .replace(/\.?0+$/, "");
}

export function buildESeriesRows(
  data: Record<ESeriesName, readonly ESeriesValue[]>,
): ESeriesRow[] {
  const rowsByValue = new Map<string, ESeriesRow>();

  for (const seriesName of eSeriesNames) {
    for (const item of data[seriesName]) {
      const key = keyForValue(item.value);
      const existing = rowsByValue.get(key);
      if (existing) {
        existing.series.push(seriesName);
      } else {
        rowsByValue.set(key, {
          value: item.value,
          label: item.label,
          series: [seriesName],
        });
      }
    }
  }

  return Array.from(rowsByValue.values()).sort((a, b) => a.value - b.value);
}

export function filterRowsBySeries(rows: readonly ESeriesRow[], selectedSeries: readonly ESeriesName[]) {
  const selected = new Set(selectedSeries);
  return rows.filter((row) => row.series.some((seriesName) => selected.has(seriesName)));
}

export function sortRows(
  rows: readonly ESeriesRow[],
  normalizedSearchValue: number | null,
): ESeriesDisplayRow[] {
  const displayRows = rows.map((row) => ({
    ...row,
    distance:
      normalizedSearchValue === null
        ? null
        : calculateDistance(row.value, normalizedSearchValue),
  }));

  if (normalizedSearchValue === null) {
    return displayRows.sort((a, b) => a.value - b.value);
  }

  return displayRows.sort((a, b) => {
    const distanceDelta = (a.distance ?? 0) - (b.distance ?? 0);
    return distanceDelta === 0 ? a.value - b.value : distanceDelta;
  });
}

export function prepareRows(
  rows: readonly ESeriesRow[],
  selectedSeries: readonly ESeriesName[],
  searchText: string,
) {
  const parsedSearch = parseSearchValue(searchText);
  const normalizedSearch = parsedSearch === null ? null : normalizeSearchValue(parsedSearch);
  return sortRows(filterRowsBySeries(rows, selectedSeries), normalizedSearch);
}

export function roundToPreferredValue(
  value: number,
  seriesValues: readonly number[],
): number {
  if (value <= 0 || !Number.isFinite(value) || seriesValues.length === 0) {
    return value;
  }

  const sortedValues = seriesValues
    .filter((seriesValue) => seriesValue > 0 && Number.isFinite(seriesValue))
    .slice()
    .sort((a, b) => a - b);

  if (sortedValues.length === 0) {
    return value;
  }

  const decade = 10 ** Math.floor(Math.log10(value));
  const candidates = new Set<number>();

  for (const factor of [decade / 10, decade, decade * 10]) {
    for (const seriesValue of sortedValues) {
      candidates.add(seriesValue * factor);
    }
  }

  let best: number | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const distance = Math.abs(candidate - value);
    if (
      distance < bestDistance ||
      (distance === bestDistance && best !== null && candidate > best)
    ) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return best ?? value;
}
