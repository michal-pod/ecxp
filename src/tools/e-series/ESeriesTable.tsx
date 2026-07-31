import type { ESeriesDisplayRow } from "../../domain/e-series/eSeriesTypes";
import { formatDistance } from "../../domain/e-series/eSeriesUtils";
import styles from "./ESeriesApp.module.css";

type ESeriesTableProps = {
  rows: ESeriesDisplayRow[];
};

export function ESeriesTable({ rows }: ESeriesTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Value</th>
            <th>Series</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.series.join(", ")}</td>
              <td>{formatDistance(row.distance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
