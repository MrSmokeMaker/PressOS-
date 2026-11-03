export type AppId = 'echo' | 'netsurf' | 'nexus' | 'terminal' | 'mail' | 'citymap';

export type StoryPhase = 1 | 2 | 3 | 'climax';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface ClueItem {
  id: string;
  title: string;
  category: 'origin' | 'server' | 'delivery' | 'classified';
  content: string;
  source: string;
  foundAt: string;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected clues
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'echo' | 'system';
  text: string;
  timestamp: string;
  phase?: StoryPhase;
}

export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  phaseRequired: 1 | 2 | 3;
  corrupted?: boolean;
}
