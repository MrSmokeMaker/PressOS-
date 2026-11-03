// store.ts – Zustand store for game state
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type WindowId = 'Desktop' | 'Terminal' | 'NexusBoard' | 'Chat' | 'DocsViewer';
export type Phase = 1 | 2 | 3 | 'final';

export interface Evidence {
  id: string; // UUID
  title: string;
  type: 'document' | 'commit' | 'image' | 'vibePrompt';
  meta: Record<string, any>;
}

export interface GameState {
  openedWindows: Record<WindowId, boolean>;
  currentPhase: Phase;
  inventory: Evidence[];
  pressureLevel: number; // 0‑100
  // actions
  toggleWindow: (id: WindowId) => void;
  setPhase: (p: Phase) => void;
  addEvidence: (e: Evidence) => void;
  increasePressure: (delta: number) => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        openedWindows: { Desktop: true, Terminal: false, NexusBoard: false, Chat: false, DocsViewer: false },
        currentPhase: 1,
        inventory: [],
        pressureLevel: 0,
        toggleWindow: (id) =>
          set(state => ({ openedWindows: { ...state.openedWindows, [id]: !state.openedWindows[id] } })),
        setPhase: (p) => set({ currentPhase: p }),
        addEvidence: (e) => set(state => ({ inventory: [...state.inventory, e] })),
        increasePressure: (d) =>
          set(state => ({ pressureLevel: Math.min(100, state.pressureLevel + d) })),
      }),
      { name: 'aion-game-state' }
    ),
    { name: 'GameStore' }
  )
);
