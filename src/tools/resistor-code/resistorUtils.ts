import { getBand } from "./resistorDefinitions";
import type { OptionalColor, ResistorColor } from "./resistorTypes";

export function formatResistance(ohms: number) {
  const units = [
    { suffix: "GΩ", value: 1_000_000_000 },
    { suffix: "MΩ", value: 1_000_000 },
    { suffix: "kΩ", value: 1_000 },
    { suffix: "Ω", value: 1 },
  ];
  const unit = units.find((candidate) => ohms >= candidate.value) ?? units.at(-1)!;
  const value = ohms / unit.value;
  const formatted =
    value >= 100 || Number.isInteger(value)
      ? value.toFixed(0)
      : value >= 10
        ? value.toFixed(1)
        : value.toFixed(2);

  return `${formatted.replace(/\.0+$/, "").replace(/(\.\d)0$/, "$1")} ${unit.suffix}`;
}

export function calculateResistance(
  first: ResistorColor,
  second: ResistorColor,
  third: OptionalColor,
  multiplier: ResistorColor,
) {
  const firstDigit = getBand(first)?.digit ?? 0;
  const secondDigit = getBand(second)?.digit ?? 0;
  const thirdDigit = third === "none" ? undefined : getBand(third)?.digit;
  const multiplierValue = getBand(multiplier)?.multiplier ?? 1;
  const significant =
    thirdDigit === undefined
      ? firstDigit * 10 + secondDigit
      : firstDigit * 100 + secondDigit * 10 + thirdDigit;

  return significant * multiplierValue;
}
