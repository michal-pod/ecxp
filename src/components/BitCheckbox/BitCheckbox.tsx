import type { ChangeEvent } from "react";

type BitCheckboxProps = {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function BitCheckbox({ name, checked, onChange }: BitCheckboxProps) {
  const inputId = `bit-${name.toLowerCase()}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="field-row">
      <input
        id={inputId}
        data-testid={`bit-${name}`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={inputId}>{name}</label>
    </div>
  );
}
