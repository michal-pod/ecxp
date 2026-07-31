import { resistanceUnits, type ResistanceUnitId } from "./voltageDividerTypes";

function trimNumber(value: number, maximumFractionDigits = 6) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

export function formatVoltage(value: number): string {
  return trimNumber(value);
}

export function formatResistanceForUnit(
  valueInOhms: number,
  unit: ResistanceUnitId,
): string {
  const unitDefinition = resistanceUnits.find((item) => item.id === unit) ?? resistanceUnits[0];
  return trimNumber(valueInOhms / unitDefinition.multiplier);
}

export function chooseReadableResistanceUnit(valueInOhms: number): ResistanceUnitId {
  const absoluteValue = Math.abs(valueInOhms);

  if (absoluteValue >= 1_000_000) {
    return "mohm";
  }

  if (absoluteValue >= 1_000) {
    return "kohm";
  }

  return "ohm";
}

export function formatResistanceReadable(valueInOhms: number): string {
  const unit = chooseReadableResistanceUnit(valueInOhms);
  const unitDefinition = resistanceUnits.find((item) => item.id === unit) ?? resistanceUnits[0];
  return `${formatResistanceForUnit(valueInOhms, unit)} ${unitDefinition.label}`;
}
