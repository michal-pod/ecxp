import { BitCheckbox } from "../../components/BitCheckbox/BitCheckbox";
import { HexInput } from "../../components/HexInput/HexInput";
import { XpGroupBox } from "../../components/XpGroupBox/XpGroupBox";
import {
  defaultFuseValues,
  extendedFuseBits,
  highFuseBits,
  lockBits,
  lowFuseBits,
} from "./fuseDefinitions";
import type { FuseBitDefinition } from "./fuseTypes";
import { useFuseByte } from "./useFuseByte";
import styles from "./AvrFuseApp.module.css";
import { useWindowStore } from "../../app/store/windowStore";

type FuseController = ReturnType<typeof useFuseByte>;

type FuseGroupProps = {
  title: string;
  hexLabel: string;
  bits: readonly FuseBitDefinition[];
  fuse: FuseController;
};

function FuseGroup({ title, hexLabel, bits, fuse }: FuseGroupProps) {
  return (
    <XpGroupBox title={title}>
      <div className={styles.bitList}>
        {bits.map((bit) => (
          <BitCheckbox
            key={bit.name}
            name={bit.name}
            checked={fuse.isBitProgrammed(bit.mask)}
            onChange={(checked) => fuse.setBitProgrammed(bit.mask, checked)}
          />
        ))}
      </div>
      <HexInput
        label={hexLabel}
        value={fuse.hex}
        onBlur={fuse.normalizeHex}
        onChange={fuse.setHex}
      />
    </XpGroupBox>
  );
}

type AvrFuseAppProps = {
  windowId: string;
};

export function AvrFuseApp({ windowId }: AvrFuseAppProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const low = useFuseByte(defaultFuseValues.low, lowFuseBits);
  const high = useFuseByte(defaultFuseValues.high, highFuseBits);
  const extended = useFuseByte(defaultFuseValues.extended, extendedFuseBits);
  const lock = useFuseByte(defaultFuseValues.lock, lockBits);

  const groups = [
    {
      title: "Fuse Low Byte",
      hexLabel: "Low",
      bits: lowFuseBits,
      fuse: low,
    },
    {
      title: "Fuse High Byte",
      hexLabel: "High",
      bits: highFuseBits,
      fuse: high,
    },
    {
      title: "Extended Fuse Byte",
      hexLabel: "Extended",
      bits: extendedFuseBits,
      fuse: extended,
    },
    {
      title: "Lock Bit Byte",
      hexLabel: "Lock",
      bits: lockBits,
      fuse: lock,
    },
  ];

  return (
    <div className={styles.app}>
      <div className={styles.groups}>
        {groups.map((group) => (
          <FuseGroup
            key={group.title}
            title={group.title}
            hexLabel={group.hexLabel}
            bits={group.bits}
            fuse={group.fuse}
          />
        ))}
      </div>

      <div className={styles.bottom}>
        <p className={styles.hint}>Checked means programmed as 0</p>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => {
              low.reset(defaultFuseValues.low);
              high.reset(defaultFuseValues.high);
              extended.reset(defaultFuseValues.extended);
              lock.reset(defaultFuseValues.lock);
            }}
          >
            Defaults
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              closeWindow(windowId);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
