import type { ChangeEvent, FocusEvent } from "react";
import styles from "./HexInput.module.css";

type HexInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
};

export function HexInput({ value, onChange, onBlur, label }: HexInputProps) {
  const inputId = `hex-${label.toLowerCase()}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.toUpperCase();
    if (/^[0-9A-F]{0,2}$/.test(next)) {
      onChange(next);
    }
  };

  const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
    onBlur();
  };

  return (
    <div className={`field-row ${styles.field}`}>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        data-testid={`hex-${label}`}
        aria-label={label}
        className={styles.input}
        inputMode="text"
        maxLength={2}
        spellCheck={false}
        type="text"
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
}
