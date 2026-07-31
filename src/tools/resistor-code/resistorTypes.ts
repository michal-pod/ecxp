export type ResistorColor =
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "violet"
  | "gray"
  | "white"
  | "gold"
  | "silver";

export type OptionalColor = ResistorColor | "none";

export type ResistorBand = {
  color: ResistorColor;
  label: string;
  digit?: number;
  multiplier?: number;
  tolerance?: string;
  tempco?: string;
  hex: string;
  textColor?: string;
};
