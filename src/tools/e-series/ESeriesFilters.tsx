import { XpGroupBox } from "../../components/XpGroupBox/XpGroupBox";
import { eSeriesNames } from "../../domain/e-series/eSeriesData";
import type { ESeriesName } from "../../domain/e-series/eSeriesTypes";
import styles from "./ESeriesApp.module.css";

type ESeriesFiltersProps = {
  selectedSeries: ESeriesName[];
  searchText: string;
  onSelectedSeriesChange: (series: ESeriesName[]) => void;
  onSearchTextChange: (text: string) => void;
};

function isSeriesName(value: string): value is ESeriesName {
  return eSeriesNames.includes(value as ESeriesName);
}

export function ESeriesFilters({
  selectedSeries,
  searchText,
  onSelectedSeriesChange,
  onSearchTextChange,
}: ESeriesFiltersProps) {
  const allSelected = selectedSeries.length === eSeriesNames.length;

  function setAll(checked: boolean) {
    onSelectedSeriesChange(checked ? eSeriesNames : ["E6"]);
  }

  function setSeries(seriesName: ESeriesName, checked: boolean) {
    if (checked) {
      onSelectedSeriesChange(
        eSeriesNames.filter((name) => name === seriesName || selectedSeries.includes(name)),
      );
      return;
    }

    if (selectedSeries.length === 1 && selectedSeries[0] === seriesName) {
      return;
    }

    onSelectedSeriesChange(selectedSeries.filter((name) => name !== seriesName));
  }

  return (
    <div className={styles.filters}>
      <XpGroupBox title="Series">
        <div className={styles.seriesChecks}>
          <div className="field-row">
            <input
              id="e-series-all"
              type="checkbox"
              checked={allSelected}
              onChange={(event) => setAll(event.target.checked)}
            />
            <label htmlFor="e-series-all">All</label>
          </div>
          {eSeriesNames.map((seriesName) => (
            <div className="field-row" key={seriesName}>
              <input
                id={`e-series-${seriesName}`}
                type="checkbox"
                checked={selectedSeries.includes(seriesName)}
                onChange={(event) => {
                  if (isSeriesName(seriesName)) {
                    setSeries(seriesName, event.target.checked);
                  }
                }}
              />
              <label htmlFor={`e-series-${seriesName}`}>{seriesName}</label>
            </div>
          ))}
        </div>
      </XpGroupBox>

      <XpGroupBox title="Search value">
        <div className={`field-row ${styles.searchRow}`}>
          <label htmlFor="e-series-search">Value</label>
          <input
            id="e-series-search"
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={searchText}
            onChange={(event) => {
              const next = event.target.value;
              if (/^\d{0,3}$/.test(next)) {
                onSearchTextChange(next);
              }
            }}
          />
        </div>
      </XpGroupBox>
    </div>
  );
}
