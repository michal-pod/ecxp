import type { AppIconId } from "../registry/appRegistry";
import styles from "./DesktopIcon.module.css";

type DesktopIconProps = {
  icon: AppIconId;
  label: string;
  testId: string;
  onDoubleClick: () => void;
};

export function getIconGlyph(icon: AppIconId) {
  return icon === "resistor"
    ? "Ω"
    : icon === "e-series"
      ? "E"
      : icon === "divider"
        ? "V"
        : icon === "about"
          ? "?"
          : "▣";
}

export function DesktopIcon({ icon, label, testId, onDoubleClick }: DesktopIconProps) {
  return (
    <button
      className={styles.icon}
      data-testid={testId}
      type="button"
      onDoubleClick={onDoubleClick}
    >
      <span className={`${styles.glyph} ${styles[icon]}`}>
        {getIconGlyph(icon)}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
