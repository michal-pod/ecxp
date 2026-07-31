import type { ReactNode } from "react";
import { Rnd } from "react-rnd";
import styles from "./XpWindow.module.css";
import { useWindowStore } from "../../app/store/windowStore";

type XpWindowProps = {
  windowId: string;
  title: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  zIndex: number;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  children: ReactNode;
};

export function XpWindow({
  windowId,
  title,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  zIndex,
  active,
  minimized,
  children,
}: XpWindowProps) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const resizeWindow = useWindowStore((state) => state.resizeWindow);

  if (minimized) {
    return null;
  }

  return (
    <Rnd
      bounds="parent"
      className={styles.rnd}
      dragHandleClassName="xp-window-drag-handle"
      cancel="button,input,select,textarea,label"
      minWidth={minWidth ?? 420}
      minHeight={minHeight ?? 270}
      position={{ x, y }}
      size={{ width, height }}
      style={{ zIndex }}
      onMouseDown={() => focusWindow(windowId)}
      onDragStop={(_, data) => moveWindow(windowId, data.x, data.y)}
      onResizeStop={(_, __, ref, ___, resizePosition) => {
        resizeWindow(windowId, ref.offsetWidth, ref.offsetHeight);
        moveWindow(windowId, resizePosition.x, resizePosition.y);
      }}
    >
      <section
        className={`window ${styles.window} ${active ? styles.active : styles.inactive}`}
        aria-label={title}
      >
        <div className={`title-bar ${styles.titleBar} xp-window-drag-handle`}>
          <div className="title-bar-text">
            <span className={styles.titleIcon}>▣</span>
            <span className={styles.titleText}>{title}</span>
          </div>
          <div className={`title-bar-controls ${styles.titleButtons}`}>
            <button
              aria-label="Minimize"
              type="button"
              onClick={() => minimizeWindow(windowId)}
            />
            <button
              aria-label="Close"
              type="button"
              onClick={() => closeWindow(windowId)}
            />
          </div>
        </div>
        <div className={`window-body ${styles.body}`}>{children}</div>
      </section>
    </Rnd>
  );
}
