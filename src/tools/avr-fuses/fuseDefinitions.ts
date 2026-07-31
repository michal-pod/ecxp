import type { FuseBitDefinition, FuseByteKey } from "./fuseTypes";

export const lowFuseBits = [
  { name: "CKDIV8", mask: 0x80 },
  { name: "CKOUT", mask: 0x40 },
  { name: "SUT1", mask: 0x20 },
  { name: "SUT0", mask: 0x10 },
  { name: "CKSEL3", mask: 0x08 },
  { name: "CKSEL2", mask: 0x04 },
  { name: "CKSEL1", mask: 0x02 },
  { name: "CKSEL0", mask: 0x01 },
] as const satisfies readonly FuseBitDefinition[];

export const highFuseBits = [
  { name: "RSTDISBL", mask: 0x80 },
  { name: "DWEN", mask: 0x40 },
  { name: "SPIEN", mask: 0x20 },
  { name: "WDTON", mask: 0x10 },
  { name: "EESAVE", mask: 0x08 },
  { name: "BOOTSZ1", mask: 0x04 },
  { name: "BOOTSZ0", mask: 0x02 },
  { name: "BOOTRST", mask: 0x01 },
] as const satisfies readonly FuseBitDefinition[];

export const extendedFuseBits = [
  { name: "BODLEVEL2", mask: 0x04 },
  { name: "BODLEVEL1", mask: 0x02 },
  { name: "BODLEVEL0", mask: 0x01 },
] as const satisfies readonly FuseBitDefinition[];

export const lockBits = [
  { name: "BLB12", mask: 0x20 },
  { name: "BLB11", mask: 0x10 },
  { name: "BLB02", mask: 0x08 },
  { name: "BLB01", mask: 0x04 },
  { name: "LB2", mask: 0x02 },
  { name: "LB1", mask: 0x01 },
] as const satisfies readonly FuseBitDefinition[];

export const defaultFuseValues: Record<FuseByteKey, number> = {
  low: 0x62,
  high: 0xd9,
  extended: 0xff,
  lock: 0xff,
};
