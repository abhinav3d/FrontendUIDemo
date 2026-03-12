export interface BaseState {
  version: number;
  lastUpdated: number;
  hydrated: boolean;
  needsServerSnapshot: boolean;
  isSyncing: boolean;
}
