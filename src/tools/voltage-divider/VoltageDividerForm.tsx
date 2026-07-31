import type { KeyboardEvent } from "react";
import { eSeriesNames } from "../../domain/e-series/eSeriesData";
import type {
  CalculateTarget,
  PreferredSeriesId,
  ResistanceUnitId,
} from "./voltageDividerTypes";
import { resistanceUnits } from "./voltageDividerTypes";
import styles from "./VoltageDividerApp.module.css";

type VoltageDividerFormProps = {
  calculateTarget: CalculateTarget;
  preferredSeries: PreferredSeriesId;
  values: Record<CalculateTarget, string>;
  r1Unit: ResistanceUnitId;
  r2Unit: ResistanceUnitId;
  message: string;
  onCalculateTargetChange: (target: CalculateTarget) => void;
  onPreferredSeriesChange: (series: PreferredSeriesId) => void;
  onValueChange: (field: CalculateTarget, value: string) => void;
  onResistanceCommit: (field: "r1" | "r2") => void;
  onResistanceUnitChange: (field: "r1" | "r2", unit: ResistanceUnitId) => void;
};

const targetOptions: { id: CalculateTarget; label: string }[] = [
  { id: "vin", label: "Vin" },
  { id: "vout", label: "Vout" },
  { id: "r1", label: "R1" },
  { id: "r2", label: "R2" },
];

const preferredOptions: { id: PreferredSeriesId; label: string }[] = [
  { id: "none", label: "None" },
  ...eSeriesNames.map((seriesName) => ({ id: seriesName, label: seriesName })),
];

export function VoltageDividerForm({
  calculateTarget,
  preferredSeries,
  values,
  r1Unit,
  r2Unit,
  message,
  onCalculateTargetChange,
  onPreferredSeriesChange,
  onValueChange,
  onResistanceCommit,
  onResistanceUnitChange,
}: VoltageDividerFormProps) {
  function handleEnter(event: KeyboardEvent<HTMLInputElement>, field: "r1" | "r2") {
    if (event.key === "Enter") {
      event.currentTarget.blur();
      onResistanceCommit(field);
    }
  }

  return (
    <div className={styles.form}>
      <div className={`field-row ${styles.valueRow}`}>
        <label htmlFor="divider-vin">Vin:</label>
        <input
          id="divider-vin"
          className={calculateTarget === "vin" ? styles.readOnlyInput : ""}
          type="text"
          value={values.vin}
          readOnly={calculateTarget === "vin"}
          onChange={(event) => onValueChange("vin", event.target.value)}
        />
        <span className={styles.unitText}>V</span>
      </div>

      <div className={`field-row ${styles.valueRow}`}>
        <label htmlFor="divider-vout">Vout:</label>
        <input
          id="divider-vout"
          className={calculateTarget === "vout" ? styles.readOnlyInput : ""}
          type="text"
          value={values.vout}
          readOnly={calculateTarget === "vout"}
          onChange={(event) => onValueChange("vout", event.target.value)}
        />
        <span className={styles.unitText}>V</span>
      </div>

      <div className={`field-row ${styles.valueRow}`}>
        <label htmlFor="divider-r1">R1:</label>
        <input
          id="divider-r1"
          className={calculateTarget === "r1" ? styles.readOnlyInput : ""}
          type="text"
          value={values.r1}
          readOnly={calculateTarget === "r1"}
          onBlur={() => onResistanceCommit("r1")}
          onChange={(event) => onValueChange("r1", event.target.value)}
          onKeyDown={(event) => handleEnter(event, "r1")}
        />
        <select
          aria-label="R1 unit"
          value={r1Unit}
          onChange={(event) => onResistanceUnitChange("r1", event.target.value as ResistanceUnitId)}
        >
          {resistanceUnits.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`field-row ${styles.valueRow}`}>
        <label htmlFor="divider-r2">R2:</label>
        <input
          id="divider-r2"
          className={calculateTarget === "r2" ? styles.readOnlyInput : ""}
          type="text"
          value={values.r2}
          readOnly={calculateTarget === "r2"}
          onBlur={() => onResistanceCommit("r2")}
          onChange={(event) => onValueChange("r2", event.target.value)}
          onKeyDown={(event) => handleEnter(event, "r2")}
        />
        <select
          aria-label="R2 unit"
          value={r2Unit}
          onChange={(event) => onResistanceUnitChange("r2", event.target.value as ResistanceUnitId)}
        >
          {resistanceUnits.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectStack}>
        <div className={`field-row ${styles.selectRow}`}>
          <label htmlFor="divider-calculate">Calculate:</label>
          <select
            id="divider-calculate"
            value={calculateTarget}
            onChange={(event) => onCalculateTargetChange(event.target.value as CalculateTarget)}
          >
            {targetOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`field-row ${styles.selectRow}`}>
          <label htmlFor="divider-series">Preferred series:</label>
          <select
            id="divider-series"
            value={preferredSeries}
            onChange={(event) => onPreferredSeriesChange(event.target.value as PreferredSeriesId)}
          >
            {preferredOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className={styles.message}>{message}</p>
    </div>
  );
}
