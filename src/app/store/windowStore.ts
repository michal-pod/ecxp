import { create } from "zustand";
import { getAppDefinition } from "../registry/appRegistry";

export type DesktopWindow = {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

type WindowStore = {
  windows: DesktopWindow[];
  activeWindowId?: string;
  nextZIndex: number;
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindow: (windowId: string, x: number, y: number) => void;
  resizeWindow: (windowId: string, width: number, height: number) => void;
  toggleMaximizeWindow: (windowId: string) => void;
};

function cascadeOffset(index: number) {
  return {
    x: 56 + (index % 5) * 28,
    y: 42 + (index % 5) * 24,
  };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: undefined,
  nextZIndex: 10,

  openWindow: (appId) => {
    const app = getAppDefinition(appId);
    if (!app) {
      return;
    }

    const existing = get().windows.find((window) => window.appId === appId);
    if (existing) {
      get().restoreWindow(existing.id);
      return;
    }

    const zIndex = get().nextZIndex + 1;
    const position = cascadeOffset(get().windows.length);
    const window: DesktopWindow = {
      id: `${appId}-${crypto.randomUUID()}`,
      appId,
      title: app.title,
      icon: app.icon,
      x: position.x,
      y: position.y,
      width: app.defaultSize.width,
      height: app.defaultSize.height,
      minWidth: app.minSize?.width,
      minHeight: app.minSize?.height,
      zIndex,
      minimized: false,
      maximized: false,
    };

    set((state) => ({
      windows: [...state.windows, window],
      activeWindowId: window.id,
      nextZIndex: zIndex,
    }));
  },

  closeWindow: (windowId) => {
    set((state) => {
      const windows = state.windows.filter((window) => window.id !== windowId);
      const activeWindowId =
        state.activeWindowId === windowId
          ? windows
              .filter((window) => !window.minimized)
              .slice()
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id
          : state.activeWindowId;

      return { windows, activeWindowId };
    });
  },

  minimizeWindow: (windowId) => {
    set((state) => {
      const windows = state.windows.map((window) =>
        window.id === windowId ? { ...window, minimized: true } : window,
      );
      const activeWindowId =
        state.activeWindowId === windowId
          ? windows
              .filter((window) => !window.minimized)
              .slice()
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id
          : state.activeWindowId;

      return { windows, activeWindowId };
    });
  },

  restoreWindow: (windowId) => {
    const zIndex = get().nextZIndex + 1;
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId
          ? { ...window, minimized: false, zIndex }
          : window,
      ),
      activeWindowId: windowId,
      nextZIndex: zIndex,
    }));
  },

  focusWindow: (windowId) => {
    const target = get().windows.find((window) => window.id === windowId);
    if (!target || target.minimized) {
      return;
    }

    const zIndex = get().nextZIndex + 1;
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId ? { ...window, zIndex } : window,
      ),
      activeWindowId: windowId,
      nextZIndex: zIndex,
    }));
  },

  moveWindow: (windowId, x, y) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId ? { ...window, x, y } : window,
      ),
    }));
  },

  resizeWindow: (windowId, width, height) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId ? { ...window, width, height } : window,
      ),
    }));
  },

  toggleMaximizeWindow: (windowId) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId
          ? { ...window, maximized: !window.maximized, minimized: false }
          : window,
      ),
    }));
  },
}));
