import type { ComponentType } from "react";
import { AboutApp } from "../../tools/about/AboutApp";
import { AvrFuseApp } from "../../tools/avr-fuses/AvrFuseApp";
import { ESeriesApp } from "../../tools/e-series/ESeriesApp";
import { ResistorCodeApp } from "../../tools/resistor-code/ResistorCodeApp";
import { VoltageDividerApp } from "../../tools/voltage-divider/VoltageDividerApp";

export type AppIconId = "chip" | "resistor" | "e-series" | "divider" | "about";

export type AppDefinition = {
  id: string;
  title: string;
  menuTitle?: string;
  icon?: AppIconId;
  component: ComponentType<{ windowId: string }>;
  defaultSize: {
    width: number;
    height: number;
  };
  minSize?: {
    width: number;
    height: number;
  };
  showOnDesktop?: boolean;
  showInToolsMenu?: boolean;
};

export const appRegistry: AppDefinition[] = [
  {
    id: "avr-fuses",
    title: "AVR Fuse / Lock Bits",
    icon: "chip",
    component: AvrFuseApp,
    defaultSize: {
      width: 760,
      height: 335,
    },
  },
  {
    id: "resistor-code",
    title: "Resistor Color Code",
    icon: "resistor",
    component: ResistorCodeApp,
    defaultSize: {
      width: 520,
      height: 445,
    },
  },
  {
    id: "e-series",
    title: "E-Series Values",
    icon: "e-series",
    component: ESeriesApp,
    defaultSize: {
      width: 620,
      height: 520,
    },
    minSize: {
      width: 460,
      height: 340,
    },
  },
  {
    id: "voltage-divider",
    title: "Voltage Divider Calculator",
    menuTitle: "Voltage Divider",
    icon: "divider",
    component: VoltageDividerApp,
    defaultSize: {
      width: 620,
      height: 340,
    },
    minSize: {
      width: 540,
      height: 305,
    },
  },
  {
    id: "about",
    title: "About ElectroCalc XP",
    menuTitle: "About",
    icon: "about",
    component: AboutApp,
    defaultSize: {
      width: 470,
      height: 260,
    },
    minSize: {
      width: 410,
      height: 240,
    },
    showOnDesktop: false,
    showInToolsMenu: false,
  },
];

export function getAppDefinition(appId: string) {
  return appRegistry.find((app) => app.id === appId);
}
