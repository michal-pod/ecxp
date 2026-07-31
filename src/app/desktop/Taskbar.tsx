import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import cls from "./Taskbar.module.css";
import { useWindowStore } from "../store/windowStore";

type TaskbarProps = {
  startOpen: boolean;
  onStartClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

function formatTime() {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function Taskbar({ startOpen, onStartClick }: TaskbarProps) {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatTime()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const orderedWindows = useMemo(
    () => windows.slice().sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  );

  return (
    <nav className={cls.taskbar} onMouseDown={(event) => event.stopPropagation()}>
      <button
        type="button"
        data-testid="start-button"
        className={`${cls.startButton} ${startOpen ? cls.startActive : ""}`}
        onClick={onStartClick}
      >
        <span className={cls.startLogo}>⊞</span>
        Start
      </button>
      <div className={cls.windowButtons}>
        {orderedWindows.map((window) => {
          const active = activeWindowId === window.id && !window.minimized;
          return (
            <button
              key={window.id}
              type="button"
              data-testid={`taskbar-${window.appId}`}
              className={`${cls.windowButton} ${active ? cls.activeWindow : ""}`}
              onClick={() => {
                if (window.minimized) {
                  restoreWindow(window.id);
                  return;
                }
                if (activeWindowId === window.id) {
                  minimizeWindow(window.id);
                  return;
                }
                focusWindow(window.id);
              }}
            >
              <span className={cls.taskIcon}>▣</span>
              <span className={cls.taskTitle}>{window.title}</span>
            </button>
          );
        })}
      </div>
      <div className={cls.tray}>
        <span>PL</span>
        <span className={cls.clock}>{time}</span>
      </div>
    </nav>
  );
}
