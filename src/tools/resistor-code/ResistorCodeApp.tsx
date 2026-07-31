import { useState } from "react";
import { useWindowStore } from "../../app/store/windowStore";
import {
  digitBands,
  getBand,
  multiplierBands,
  resistorBands,
  tempcoBands,
  toleranceBands,
} from "./resistorDefinitions";
import type { OptionalColor, ResistorBand, ResistorColor } from "./resistorTypes";
import { calculateResistance, formatResistance } from "./resistorUtils";
import styles from "./ResistorCodeApp.module.css";

type ResistorCodeAppProps = {
  windowId: string;
};

type BandSelectProps = {
  label: string;
  value: OptionalColor;
  bands: ResistorBand[];
  optional?: boolean;
  onChange: (value: OptionalColor) => void;
};

const defaultBands = {
  first: "brown" as ResistorColor,
  second: "black" as ResistorColor,
  third: "none" as OptionalColor,
  multiplier: "red" as ResistorColor,
  tolerance: "gold" as ResistorColor,
  tempco: "none" as OptionalColor,
};

function BandSelect({ label, value, bands, optional = false, onChange }: BandSelectProps) {
  return (
    <div className={`field-row ${styles.selectRow}`}>
      <label htmlFor={`resistor-${label}`}>{label}</label>
      <select
        id={`resistor-${label}`}
        value={value}
        onChange={(event) => onChange(event.target.value as OptionalColor)}
      >
        {optional ? <option value="none">Don't exist</option> : null}
        {bands.map((band) => (
          <option key={band.color} value={band.color}>
            {band.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResistorPreview({
  first,
  second,
  third,
  multiplier,
  tolerance,
  tempco,
}: typeof defaultBands) {
  const visibleBands = [first, second, third, multiplier, tolerance, tempco].filter(
    (color): color is ResistorColor => color !== "none",
  );

  return (
    <div className={styles.preview}>
      <div className={styles.lead} />
      <div className={styles.body}>
        {visibleBands.map((color, index) => {
          const band = getBand(color);
          return (
            <span
              key={`${color}-${index}`}
              className={styles.band}
              style={{ backgroundColor: band?.hex }}
              title={band?.label}
            />
          );
        })}
      </div>
      <div className={styles.lead} />
    </div>
  );
}

function CodesTable() {
  return (
    <div className={styles.reportView}>
      <table>
        <thead>
          <tr>
            <th>Color</th>
            <th>Digit</th>
            <th>Multiplier</th>
            <th>Tolerance</th>
            <th>Temp. Coefficient</th>
          </tr>
        </thead>
        <tbody>
          {resistorBands.map((band) => (
            <tr key={band.color}>
              <td>
                <span className={styles.colorCell}>
                  <span className={styles.swatch} style={{ backgroundColor: band.hex }} />
                  {band.label}
                </span>
              </td>
              <td>{band.digit ?? "-"}</td>
              <td>{band.multiplier ?? "-"}</td>
              <td>{band.tolerance ?? "-"}</td>
              <td>{band.tempco ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResistorCodeApp({ windowId }: ResistorCodeAppProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [activeTab, setActiveTab] = useState<"calculator" | "codes">("calculator");
  const [first, setFirst] = useState(defaultBands.first);
  const [second, setSecond] = useState(defaultBands.second);
  const [third, setThird] = useState<OptionalColor>(defaultBands.third);
  const [multiplier, setMultiplier] = useState(defaultBands.multiplier);
  const [tolerance, setTolerance] = useState(defaultBands.tolerance);
  const [tempco, setTempco] = useState<OptionalColor>(defaultBands.tempco);

  const ohms = calculateResistance(first, second, third, multiplier);
  const toleranceLabel = getBand(tolerance)?.tolerance;
  const tempcoLabel = tempco === "none" ? undefined : getBand(tempco)?.tempco;

  return (
    <div className={styles.app}>
      <menu role="tablist" aria-label="Resistor color code sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "calculator" ? true : undefined}
          aria-controls="resistor-calculator-tab"
          onClick={() => setActiveTab("calculator")}
        >
          Calculator
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "codes" ? true : undefined}
          aria-controls="resistor-codes-tab"
          onClick={() => setActiveTab("codes")}
        >
          Codes
        </button>
      </menu>

      <article
        id="resistor-calculator-tab"
        role="tabpanel"
        className={styles.tabPanel}
        hidden={activeTab !== "calculator"}
      >
        <div className={styles.calculatorPane}>
          <ResistorPreview
            first={first}
            second={second}
            third={third}
            multiplier={multiplier}
            tolerance={tolerance}
            tempco={tempco}
          />
          <div className={styles.result}>
            <span>Resistance</span>
            <strong>{formatResistance(ohms)}</strong>
            <span>
              {toleranceLabel}
              {tempcoLabel ? `, ${tempcoLabel}` : ""}
            </span>
          </div>
          <div className={styles.selectGrid}>
            <BandSelect label="Band 1" value={first} bands={digitBands} onChange={(value) => setFirst(value as ResistorColor)} />
            <BandSelect label="Band 2" value={second} bands={digitBands} onChange={(value) => setSecond(value as ResistorColor)} />
            <BandSelect label="Band 3" value={third} bands={digitBands} optional onChange={setThird} />
            <BandSelect label="Multiplier" value={multiplier} bands={multiplierBands} onChange={(value) => setMultiplier(value as ResistorColor)} />
            <BandSelect label="Tolerance" value={tolerance} bands={toleranceBands} onChange={(value) => setTolerance(value as ResistorColor)} />
            <BandSelect label="Tempco" value={tempco} bands={tempcoBands} optional onChange={setTempco} />
          </div>
        </div>
      </article>

      <article
        id="resistor-codes-tab"
        role="tabpanel"
        className={styles.tabPanel}
        hidden={activeTab !== "codes"}
      >
        <CodesTable />
      </article>

      <div className={`field-row ${styles.actions}`}>
        <button
          type="button"
          onClick={() => {
            setFirst(defaultBands.first);
            setSecond(defaultBands.second);
            setThird(defaultBands.third);
            setMultiplier(defaultBands.multiplier);
            setTolerance(defaultBands.tolerance);
            setTempco(defaultBands.tempco);
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
  );
}
