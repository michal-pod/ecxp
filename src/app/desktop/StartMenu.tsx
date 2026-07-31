import type { MouseEventHandler } from "react";
import { appRegistry } from "../registry/appRegistry";
import { getIconGlyph } from "./DesktopIcon";
import styles from "./StartMenu.module.css";

type StartMenuProps = {
  onLaunch: (appId: string) => void;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
};

export function StartMenu({ onLaunch, onMouseDown }: StartMenuProps) {
  const toolApps = appRegistry.filter((app) => app.showInToolsMenu !== false);
  const aboutApp = appRegistry.find((app) => app.id === "about");

  return (
    <div className={styles.menu} onMouseDown={onMouseDown}>
      <header className={styles.header}>ElectroCalc XP</header>
      <div className={styles.items}>
        {toolApps.map((app) => (
          <button
            key={app.id}
            type="button"
            data-testid={`start-menu-${app.id}`}
            className={styles.item}
            onClick={() => onLaunch(app.id)}
          >
            <span className={`${styles.icon} ${app.icon ? styles[app.icon] : ""}`}>
              {app.icon ? getIconGlyph(app.icon) : "▣"}
            </span>
            <span>{app.menuTitle ?? app.title}</span>
          </button>
        ))}
        {aboutApp ? (
          <>
            <div className={styles.separator} role="separator" />
            <button
              type="button"
              data-testid="start-menu-about"
              className={styles.item}
              onClick={() => onLaunch(aboutApp.id)}
            >
              <span className={`${styles.icon} ${aboutApp.icon ? styles[aboutApp.icon] : ""}`}>
                {aboutApp.icon ? getIconGlyph(aboutApp.icon) : "?"}
              </span>
              <span>{aboutApp.menuTitle ?? aboutApp.title}</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
