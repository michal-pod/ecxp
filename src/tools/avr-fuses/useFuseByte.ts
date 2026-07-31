import { useEffect, useState } from "react";
import type { FuseBitDefinition } from "./fuseTypes";
import { formatHexByte, parseHexByte } from "./fuseUtils";

export function useFuseByte(
  initialValue: number,
  _bitDefinitions: readonly FuseBitDefinition[],
) {
  const [value, setValue] = useState(initialValue & 0xff);
  const [hex, setHexState] = useState(formatHexByte(initialValue));

  useEffect(() => {
    setHexState(formatHexByte(value));
  }, [value]);

  function setHex(nextHex: string) {
    const normalized = nextHex.toUpperCase();
    setHexState(normalized);
    const parsed = parseHexByte(normalized);
    if (parsed !== undefined) {
      setValue(parsed);
    }
  }

  function normalizeHex() {
    const parsed = parseHexByte(hex);
    setHexState(formatHexByte(parsed ?? value));
  }

  function setBitProgrammed(mask: number, programmed: boolean) {
    setValue((current) => (programmed ? current & ~mask : current | mask) & 0xff);
  }

  function isBitProgrammed(mask: number) {
    return (value & mask) === 0;
  }

  function reset(nextValue = initialValue) {
    setValue(nextValue & 0xff);
  }

  return {
    value,
    hex,
    setHex,
    normalizeHex,
    setBitProgrammed,
    isBitProgrammed,
    reset,
  };
}
