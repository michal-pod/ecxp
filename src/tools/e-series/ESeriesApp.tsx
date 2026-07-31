import { useMemo, useState } from "react";
import { useWindowStore } from "../../app/store/windowStore";
import { eSeriesNames, eSeriesValues } from "../../domain/e-series/eSeriesData";
import { ESeriesFilters } from "./ESeriesFilters";
import { ESeriesTable } from "./ESeriesTable";
import type { ESeriesName } from "../../domain/e-series/eSeriesTypes";
import { buildESeriesRows, prepareRows } from "../../domain/e-series/eSeriesUtils";
import styles from "./ESeriesApp.module.css";

type ESeriesAppProps = {
  windowId: string;
};

const allRows = buildESeriesRows(eSeriesValues);

export function ESeriesApp({ windowId }: ESeriesAppProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [selectedSeries, setSelectedSeries] = useState<ESeriesName[]>(eSeriesNames);
  const [searchText, setSearchText] = useState("");

  const rows = useMemo(
    () => prepareRows(allRows, selectedSeries, searchText),
    [searchText, selectedSeries],
  );

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <ESeriesFilters
          selectedSeries={selectedSeries}
          searchText={searchText}
          onSelectedSeriesChange={setSelectedSeries}
          onSearchTextChange={setSearchText}
        />
        <ESeriesTable rows={rows} />
      </div>
      <div className={`field-row ${styles.actions}`}>
        <span className={styles.count}>{rows.length} values</span>
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
