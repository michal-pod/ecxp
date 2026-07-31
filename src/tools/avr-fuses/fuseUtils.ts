export function formatHexByte(value: number) {
  return (value & 0xff).toString(16).toUpperCase().padStart(2, "0");
}

export function parseHexByte(hex: string) {
  if (!/^[0-9A-F]{1,2}$/i.test(hex)) {
    return undefined;
  }

  return Number.parseInt(hex, 16) & 0xff;
}
