import styles from "./VoltageDividerApp.module.css";

type VoltageDividerDiagramProps = {
  vinLabel: string;
  voutLabel: string;
  voutSecondaryLabel?: string;
  r1Label: string;
  r2Label: string;
};

export function VoltageDividerDiagram({
  vinLabel,
  voutLabel,
  voutSecondaryLabel,
  r1Label,
  r2Label,
}: VoltageDividerDiagramProps) {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 280 214"
      role="img"
      aria-label="Voltage divider circuit"
    >
      <path className={styles.wire} d="M50 20 H136 V44" />
      <path className={styles.wire} d="M136 92 V112" />
      <path className={styles.wire} d="M136 112 H214" />
      <path className={styles.wire} d="M136 112 V128" />
      <path className={styles.wire} d="M136 176 V188" />

      <rect className={styles.resistorBox} x="122" y="44" width="28" height="48" />
      <rect className={styles.resistorBox} x="122" y="128" width="28" height="48" />

      <path className={styles.ground} d="M114 188 H158 M122 197 H150 M130 206 H142" />

      <circle className={styles.node} cx="136" cy="112" r="3.5" />
      <circle className={styles.node} cx="50" cy="20" r="3.5" />
      <circle className={styles.node} cx="214" cy="112" r="3.5" />

      <text className={styles.diagramText} x="16" y="25">Vin</text>
      <text className={styles.diagramValue} x="16" y="41">{vinLabel}</text>

      <text className={styles.diagramText} x="224" y="116">Vout</text>
      <text className={styles.diagramValue} x="224" y="132">{voutLabel}</text>
      {voutSecondaryLabel ? (
        <text className={styles.diagramValue} x="224" y="147">{voutSecondaryLabel}</text>
      ) : null}

      <text className={styles.diagramText} x="162" y="64">R1</text>
      <text className={styles.diagramValue} x="162" y="80">{r1Label}</text>

      <text className={styles.diagramText} x="162" y="148">R2</text>
      <text className={styles.diagramValue} x="162" y="164">{r2Label}</text>

    </svg>
  );
}
