/**
 * App-wide state — uses a lightweight hand-rolled store so we avoid
 * adding zustand as a dependency. Swap to zustand or jotai if preferred.
 */

import { createContext, useContext, useReducer, type Dispatch } from "react";

// ─── State shape ──────────────────────────────────────────────────────────────
export interface AppState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeAgentId: string | null;
  notification: { message: string; type: "success" | "error" | "info" } | null;
}

const initialState: AppState = {
  sidebarCollapsed:   false,
  commandPaletteOpen: false,
  activeAgentId:      null,
  notification:       null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────
export type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; collapsed: boolean }
  | { type: "OPEN_COMMAND_PALETTE" }
  | { type: "CLOSE_COMMAND_PALETTE" }
  | { type: "SET_ACTIVE_AGENT"; id: string | null }
  | { type: "SHOW_NOTIFICATION"; message: string; kind: "success" | "error" | "info" }
  | { type: "CLEAR_NOTIFICATION" };

// ─── Reducer ──────────────────────────────────────────────────────────────────
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "SET_SIDEBAR":
      return { ...state, sidebarCollapsed: action.collapsed };
    case "OPEN_COMMAND_PALETTE":
      return { ...state, commandPaletteOpen: true };
    case "CLOSE_COMMAND_PALETTE":
      return { ...state, commandPaletteOpen: false };
    case "SET_ACTIVE_AGENT":
      return { ...state, activeAgentId: action.id };
    case "SHOW_NOTIFICATION":
      return { ...state, notification: { message: action.message, type: action.kind } };
    case "CLEAR_NOTIFICATION":
      return { ...state, notification: null };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
import { createContext as _createContext } from "react";

export interface AppStore {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppStore>({
  state: initialState,
  dispatch: () => undefined,
});

export const useAppStore = () => useContext(AppContext);

// ─── Convenience selectors ────────────────────────────────────────────────────
export const useSidebarCollapsed  = () => useAppStore().state.sidebarCollapsed;
export const useNotification      = () => useAppStore().state.notification;
export const useActiveAgentId     = () => useAppStore().state.activeAgentId;

export { initialState as appInitialState };
