import { getAppDefinition } from "../registry/appRegistry";
import { useWindowStore } from "../store/windowStore";
import { XpWindow } from "../../components/XpWindow/XpWindow";

export function WindowManagerView() {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);

  return (
    <>
      {windows.map((window) => {
        const app = getAppDefinition(window.appId);
        if (!app) {
          return null;
        }

        const AppComponent = app.component;
        return (
          <XpWindow
            key={window.id}
            windowId={window.id}
            title={window.title}
            icon={window.icon}
            x={window.x}
            y={window.y}
            width={window.width}
            height={window.height}
            minWidth={window.minWidth}
            minHeight={window.minHeight}
            zIndex={window.zIndex}
            active={activeWindowId === window.id}
            minimized={window.minimized}
            maximized={window.maximized}
          >
            <AppComponent windowId={window.id} />
          </XpWindow>
        );
      })}
    </>
  );
}
