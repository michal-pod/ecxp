export type ESeriesName = "E6" | "E12" | "E24" | "E48" | "E96" | "E192";

export type ESeriesValue = {
  value: number;
  label: string;
};

export type ESeriesRow = {
  value: number;
  label: string;
  series: ESeriesName[];
};

export type ESeriesDisplayRow = ESeriesRow & {
  distance: number | null;
};
