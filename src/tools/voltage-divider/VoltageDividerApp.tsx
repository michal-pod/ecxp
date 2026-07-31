import { useMemo, useState } from "react";
import { useWindowStore } from "../../app/store/windowStore";
import { XpGroupBox } from "../../components/XpGroupBox/XpGroupBox";
import { eSeriesValues } from "../../domain/e-series/eSeriesData";
import { roundToPreferredValue } from "../../domain/e-series/eSeriesUtils";
import { VoltageDividerDiagram } from "./VoltageDividerDiagram";
import { VoltageDividerForm } from "./VoltageDividerForm";
import styles from "./VoltageDividerApp.module.css";
import {
  calculateVoltageDivider,
  parseNonNegativeNumber,
  parsePositiveNumber,
} from "./voltageDividerMath";
import {
  formatResistanceForUnit,
  formatResistanceReadable,
  formatVoltage,
} from "./voltageDividerFormat";
import {
  resistanceUnits,
  type CalculateTarget,
  type PreferredSeriesId,
  type ResistanceUnitId,
  type VoltageDividerValues,
} from "./voltageDividerTypes";

type VoltageDividerAppProps = {
  windowId: string;
};

type InputValues = Record<CalculateTarget, string>;

const defaultValues: InputValues = {
  vin: "5",
  vout: "",
  r1: "10",
  r2: "10",
};

function getUnitMultiplier(unit: ResistanceUnitId) {
  return resistanceUnits.find((item) => item.id === unit)?.multiplier ?? 1;
}

function getSeriesValues(series: PreferredSeriesId) {
  return series === "none" ? null : eSeriesValues[series].map((item) => item.value);
}

function parseFieldValues(
  inputValues: InputValues,
  r1Unit: ResistanceUnitId,
  r2Unit: ResistanceUnitId,
) {
  const vin = parsePositiveNumber(inputValues.vin);
  const vout = parseNonNegativeNumber(inputValues.vout);
  const r1 = parsePositiveNumber(inputValues.r1);
  const r2 = parsePositiveNumber(inputValues.r2);

  return {
    vin: vin ?? undefined,
    vout: vout ?? undefined,
    r1: r1 === null ? undefined : r1 * getUnitMultiplier(r1Unit),
    r2: r2 === null ? undefined : r2 * getUnitMultiplier(r2Unit),
  };
}

function validationMessage(target: CalculateTarget, values: Partial<VoltageDividerValues>) {
  if (target !== "vin" && (values.vin === undefined || values.vin <= 0)) {
    return "Enter a positive Vin value.";
  }

  if (target !== "vout" && values.vout === undefined) {
    return "Enter a valid Vout value.";
  }

  if ((target === "r1" || target === "r2") && (values.vout === undefined || values.vout <= 0)) {
    return "Vout must be greater than zero when calculating R1 or R2.";
  }

  if (
    (target === "r1" || target === "r2") &&
    values.vin !== undefined &&
    values.vout !== undefined &&
    values.vout >= values.vin
  ) {
    return "Vout must be lower than Vin.";
  }

  if ((target !== "r1" && values.r1 === undefined) || (target !== "r2" && values.r2 === undefined)) {
    return "Enter positive resistor values.";
  }

  return "Unable to calculate with the current values.";
}

function applyPreferredSeries(valueInOhms: number, preferredSeries: PreferredSeriesId) {
  const seriesValues = getSeriesValues(preferredSeries);
  return seriesValues === null ? valueInOhms : roundToPreferredValue(valueInOhms, seriesValues);
}

export function VoltageDividerApp({ windowId }: VoltageDividerAppProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [calculateTarget, setCalculateTarget] = useState<CalculateTarget>("vout");
  const [preferredSeries, setPreferredSeries] = useState<PreferredSeriesId>("none");
  const [inputValues, setInputValues] = useState<InputValues>(defaultValues);
  const [r1Unit, setR1Unit] = useState<ResistanceUnitId>("kohm");
  const [r2Unit, setR2Unit] = useState<ResistanceUnitId>("kohm");

  const parsedValues = useMemo(
    () => parseFieldValues(inputValues, r1Unit, r2Unit),
    [inputValues, r1Unit, r2Unit],
  );

  const idealResult = useMemo(
    () => calculateVoltageDivider(calculateTarget, parsedValues),
    [calculateTarget, parsedValues],
  );

  const result = useMemo(() => {
    if (idealResult === null) {
      return null;
    }

    return calculateTarget === "r1" || calculateTarget === "r2"
      ? applyPreferredSeries(idealResult, preferredSeries)
      : idealResult;
  }, [calculateTarget, idealResult, preferredSeries]);

  const visibleValues = useMemo<InputValues>(() => {
    if (result === null) {
      return {
        ...inputValues,
        [calculateTarget]: "",
      };
    }

    if (calculateTarget === "r1") {
      return {
        ...inputValues,
        r1: formatResistanceForUnit(result, r1Unit),
      };
    }

    if (calculateTarget === "r2") {
      return {
        ...inputValues,
        r2: formatResistanceForUnit(result, r2Unit),
      };
    }

    return {
      ...inputValues,
      [calculateTarget]: formatVoltage(result),
    };
  }, [calculateTarget, inputValues, r1Unit, r2Unit, result]);

  const actualValues = useMemo<Partial<VoltageDividerValues>>(() => {
    const values = { ...parsedValues };
    if (result !== null) {
      values[calculateTarget] = result;
    }
    return values;
  }, [calculateTarget, parsedValues, result]);

  const actualVout = useMemo(() => {
    if (
      actualValues.vin === undefined ||
      actualValues.r1 === undefined ||
      actualValues.r2 === undefined
    ) {
      return null;
    }

    return calculateVoltageDivider("vout", {
      vin: actualValues.vin,
      r1: actualValues.r1,
      r2: actualValues.r2,
    });
  }, [actualValues]);

  const requestedVoutLabel =
    (calculateTarget === "r1" || calculateTarget === "r2") &&
    preferredSeries !== "none" &&
    actualVout !== null &&
    parsedValues.vout !== undefined
      ? `(${formatVoltage(parsedValues.vout)} V)`
      : undefined;

  const message = result === null ? validationMessage(calculateTarget, parsedValues) : "";

  function setFieldValue(field: CalculateTarget, value: string) {
    if (field === calculateTarget) {
      return;
    }

    setInputValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function commitCalculatedTarget() {
    if (result === null) {
      return;
    }

    if (calculateTarget === "r1") {
      setInputValues((current) => ({
        ...current,
        r1: formatResistanceForUnit(result, r1Unit),
      }));
      return;
    }

    if (calculateTarget === "r2") {
      setInputValues((current) => ({
        ...current,
        r2: formatResistanceForUnit(result, r2Unit),
      }));
      return;
    }

    setInputValues((current) => ({
      ...current,
      [calculateTarget]: formatVoltage(result),
    }));
  }

  function changeCalculateTarget(target: CalculateTarget) {
    commitCalculatedTarget();
    setCalculateTarget(target);
  }

  function commitResistance(field: "r1" | "r2") {
    if (field === calculateTarget || preferredSeries === "none") {
      return;
    }

    const unit = field === "r1" ? r1Unit : r2Unit;
    const parsed = parsePositiveNumber(inputValues[field]);
    if (parsed === null) {
      return;
    }

    const rounded = applyPreferredSeries(parsed * getUnitMultiplier(unit), preferredSeries);
    setInputValues((current) => ({
      ...current,
      [field]: formatResistanceForUnit(rounded, unit),
    }));
  }

  function changeResistanceUnit(field: "r1" | "r2", unit: ResistanceUnitId) {
    const currentUnit = field === "r1" ? r1Unit : r2Unit;
    const textValue = visibleValues[field];
    const parsed = parsePositiveNumber(textValue);
    const valueInOhms = parsed === null ? null : parsed * getUnitMultiplier(currentUnit);

    if (field === "r1") {
      setR1Unit(unit);
    } else {
      setR2Unit(unit);
    }

    if (valueInOhms !== null && field !== calculateTarget) {
      setInputValues((current) => ({
        ...current,
        [field]: formatResistanceForUnit(valueInOhms, unit),
      }));
    }
  }

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <XpGroupBox title="Divider values">
          <VoltageDividerForm
            calculateTarget={calculateTarget}
            preferredSeries={preferredSeries}
            values={visibleValues}
            r1Unit={r1Unit}
            r2Unit={r2Unit}
            message={message}
            onCalculateTargetChange={changeCalculateTarget}
            onPreferredSeriesChange={setPreferredSeries}
            onResistanceCommit={commitResistance}
            onResistanceUnitChange={changeResistanceUnit}
            onValueChange={setFieldValue}
          />
        </XpGroupBox>

        <XpGroupBox title="Circuit">
          <VoltageDividerDiagram
            vinLabel={actualValues.vin === undefined ? "" : `${formatVoltage(actualValues.vin)} V`}
            voutLabel={
              actualVout === null
                ? ""
                : `${formatVoltage(actualVout)} V`
            }
            voutSecondaryLabel={requestedVoutLabel}
            r1Label={actualValues.r1 === undefined ? "" : formatResistanceReadable(actualValues.r1)}
            r2Label={actualValues.r2 === undefined ? "" : formatResistanceReadable(actualValues.r2)}
          />
        </XpGroupBox>
      </div>

      <div className={`field-row ${styles.actions}`}>
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
