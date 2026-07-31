import type { ResistorBand } from "./resistorTypes";

export const resistorBands: ResistorBand[] = [
  {
    color: "black",
    label: "Black",
    digit: 0,
    multiplier: 1,
    hex: "#050505",
    textColor: "#ffffff",
  },
  {
    color: "brown",
    label: "Brown",
    digit: 1,
    multiplier: 10,
    tolerance: "±1%",
    tempco: "100 ppm/K",
    hex: "#7b3f18",
    textColor: "#ffffff",
  },
  {
    color: "red",
    label: "Red",
    digit: 2,
    multiplier: 100,
    tolerance: "±2%",
    tempco: "50 ppm/K",
    hex: "#c3272b",
    textColor: "#ffffff",
  },
  {
    color: "orange",
    label: "Orange",
    digit: 3,
    multiplier: 1_000,
    tempco: "15 ppm/K",
    hex: "#f47c20",
  },
  {
    color: "yellow",
    label: "Yellow",
    digit: 4,
    multiplier: 10_000,
    tempco: "25 ppm/K",
    hex: "#f6d32d",
  },
  {
    color: "green",
    label: "Green",
    digit: 5,
    multiplier: 100_000,
    tolerance: "±0.5%",
    hex: "#2ca24d",
    textColor: "#ffffff",
  },
  {
    color: "blue",
    label: "Blue",
    digit: 6,
    multiplier: 1_000_000,
    tolerance: "±0.25%",
    tempco: "10 ppm/K",
    hex: "#2369d1",
    textColor: "#ffffff",
  },
  {
    color: "violet",
    label: "Violet",
    digit: 7,
    multiplier: 10_000_000,
    tolerance: "±0.1%",
    tempco: "5 ppm/K",
    hex: "#7f49b6",
    textColor: "#ffffff",
  },
  {
    color: "gray",
    label: "Gray",
    digit: 8,
    multiplier: 100_000_000,
    tolerance: "±0.05%",
    tempco: "1 ppm/K",
    hex: "#8c8c8c",
    textColor: "#ffffff",
  },
  {
    color: "white",
    label: "White",
    digit: 9,
    multiplier: 1_000_000_000,
    hex: "#f4f4f4",
  },
  {
    color: "gold",
    label: "Gold",
    multiplier: 0.1,
    tolerance: "±5%",
    hex: "#c8a840",
  },
  {
    color: "silver",
    label: "Silver",
    multiplier: 0.01,
    tolerance: "±10%",
    hex: "#c0c0c0",
  },
];

export const digitBands = resistorBands.filter((band) => band.digit !== undefined);
export const multiplierBands = resistorBands.filter((band) => band.multiplier !== undefined);
export const toleranceBands = resistorBands.filter((band) => band.tolerance !== undefined);
export const tempcoBands = resistorBands.filter((band) => band.tempco !== undefined);

export function getBand(color: string) {
  return resistorBands.find((band) => band.color === color);
}
