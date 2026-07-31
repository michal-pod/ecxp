import { DesktopIcon } from "./DesktopIcon";
import styles from "./Desktop.module.css";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { WindowManagerView } from "./WindowManagerView";
import { appRegistry, type AppDefinition } from "../registry/appRegistry";
import { useWindowStore } from "../store/windowStore";
import { useEffect, useState } from "react";

type DesktopAppDefinition = AppDefinition & {
  icon: NonNullable<AppDefinition["icon"]>;
};

function isDesktopApp(app: AppDefinition): app is DesktopAppDefinition {
  return app.showOnDesktop !== false && app.icon !== undefined;
}

export function Desktop() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStartOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={styles.desktop} onMouseDown={() => setStartOpen(false)}>
      <div className={styles.iconColumn}>
        {appRegistry
          .filter(isDesktopApp)
          .map((app) => (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              label={app.menuTitle ?? app.title}
              testId={`desktop-${app.id}`}
              onDoubleClick={() => openWindow(app.id)}
            />
          ))}
      </div>
      <WindowManagerView />
      {startOpen ? (
        <StartMenu
          onLaunch={(appId) => {
            openWindow(appId);
            setStartOpen(false);
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />
      ) : null}
      <Taskbar
        startOpen={startOpen}
        onStartClick={(event) => {
          event.stopPropagation();
          setStartOpen((open) => !open);
        }}
      />
    </main>
  );
}
