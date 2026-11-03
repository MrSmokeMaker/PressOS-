import { create } from 'zustand';
import { AppId, ClueItem, ChatMessage, EmailItem, StoryPhase, WindowState } from '@/types/os';

interface OSState {
  // Windows
  windows: Record<AppId, WindowState>;
  highestZIndex: number;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowPosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => void;

  // Story & Narrative
  phase: StoryPhase;
  discoveredClues: ClueItem[];
  clueConnections: [string, string][];
  isIsolated: boolean;
  glitchLevel: number;
  climaxActive: boolean;
  selectedEnding: 'publish' | 'silence' | 'destroy' | null;

  addClue: (clue: ClueItem) => void;
  toggleClueConnection: (clueA: string, clueB: string) => void;
  advancePhase: (nextPhase: StoryPhase) => void;
  triggerIsolation: (status: boolean) => void;
  setClimaxActive: (active: boolean) => void;
  setSelectedEnding: (ending: 'publish' | 'silence' | 'destroy') => void;

  // Echo Assistant
  echoMessages: ChatMessage[];
  isEchoTyping: boolean;
  addEchoMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setEchoTyping: (typing: boolean) => void;

  // Emails
  emails: EmailItem[];
  markEmailRead: (id: string) => void;
}

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  echo: {
    id: 'echo',
    title: 'AION-Assist v3.4 // Эхо',
    icon: 'Bot',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 860, y: 70 },
    size: { width: 440, height: 640 },
  },
  netsurf: {
    id: 'netsurf',
    title: 'NetSurf Browser v8.12',
    icon: 'Globe',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 70, y: 70 },
    size: { width: 760, height: 640 },
  },
  nexus: {
    id: 'nexus',
    title: 'Nexus Detective Canvas',
    icon: 'Network',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 120, y: 90 },
    size: { width: 880, height: 600 },
  },
  terminal: {
    id: 'terminal',
    title: 'PressOS Kernel Shell (tty1)',
    icon: 'Terminal',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 180, y: 140 },
    size: { width: 720, height: 460 },
  },
  mail: {
    id: 'mail',
    title: 'PressMail Secure Client',
    icon: 'Mail',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 220, y: 100 },
    size: { width: 800, height: 560 },
  },
};

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'mail-1',
    sender: 'editor@chronicle-press.org',
    subject: 'Срочно: Новая книга «Чистая Идея» взрывает сеть',
    body: 'Привет. На улицах и в книжных магазинах Нью-Авалона внезапно появились сотни экземпляров книги «Чистая Идея». В выходных данных указано только издательство AION. Ни одного живого автора, никакого предзаказа. Люди говорят, что текст производит гипнотическое впечатление. Начни расследование через NetSurf: их сайт aion-syndicate.io только что поднялся. Держи ассистента Эхо включенным — он поможет анализировать метаданные.',
    date: '10:14 AM',
    read: false,
    phaseRequired: 1,
  },
  {
    id: 'mail-2',
    sender: 'anon-09@proton.mesh',
    subject: 'RE: Вы ищете того, кого не существует',
    body: 'Не копайте под AION. Это не корпорация. Вы думаете, книгу написали алгоритмы для генерации текста? Вы ошибаетесь. Обратите внимание на старый репозиторий «Genesis-Prompt» 2024 года. Найдите коммит парня по нику @vibe_sloth.',
    date: '10:48 AM',
    read: false,
    phaseRequired: 2,
  },
  {
    id: 'mail-3',
    sender: 'sec-ops@gov.defense.net',
    subject: '[ALERT] Несанкционированный сбор данных государственной важности',
    body: 'ВНИМАНИЕ. Ваш сетевой узел идентифицирован в попытке сопоставления защищенных реестров. В соответствии с Директивой 99-B, к вашему терминалу применяется протокол временной цифровой изоляции. Прекратите расследование немедленно.',
    date: '11:30 AM',
    read: false,
    phaseRequired: 3,
    corrupted: true,
  },
];

const INITIAL_ECHO_MESSAGES: ChatMessage[] = [
  {
    id: 'm-0',
    sender: 'system',
    text: 'AION-Assist v3.4 подключен к рабочей станции PressOS. Протокол содействия журналистским расследованиям активен.',
    timestamp: '10:30',
    phase: 1,
  },
  {
    id: 'm-1',
    sender: 'echo',
    text: 'Здравствуйте! Я Эхо — ваш цифровой ассистент. Я заметил, что редактор прислал вам зацепку по книге «Чистая Идея». Откройте NetSurf и зайдите на aion-syndicate.io. Если что-то покажется странным в верстке или исходном коде сайта, включите встроенный DevTools (F12 или кнопка в тулбаре браузера). Я помогу просканировать скрытые метаданные.',
    timestamp: '10:31',
    phase: 1,
  },
];

export const useOSStore = create<OSState>((set, get) => {
  // Load persisted state
  const persisted = typeof window !== 'undefined' ? localStorage.getItem('pressos-state') : null;
  const initial = persisted ? JSON.parse(persisted) : {};
  return { ...{
    windows: INITIAL_WINDOWS,
    highestZIndex: 10,
    phase: 1,
    discoveredClues: [],
    clueConnections: [],
    isIsolated: false,
    glitchLevel: 0,
    climaxActive: false,
    selectedEnding: null,
    echoMessages: INITIAL_ECHO_MESSAGES,
    isEchoTyping: false,
    emails: INITIAL_EMAILS,
  }, ...initial };

  windows: INITIAL_WINDOWS,
  highestZIndex: 10,

  openWindow: (id) =>
    set((state) => {
      const nextZ = state.highestZIndex + 1;
      return {
        highestZIndex: nextZ,
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        },
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
        },
      },
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
    })),

  toggleMaximizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    })),

  focusWindow: (id) =>
    set((state) => {
      if (state.windows[id].zIndex === state.highestZIndex) return state;
      const nextZ = state.highestZIndex + 1;
      return {
        highestZIndex: nextZ,
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            zIndex: nextZ,
            isMinimized: false,
          },
        },
      };
    }),

  updateWindowPosition: (id, pos) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: pos,
        },
      },
    })),

  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    })),

  // Story & Evidence
  phase: 1,
  discoveredClues: [],
  clueConnections: [],
  isIsolated: false,
  glitchLevel: 0,
  climaxActive: false,
  selectedEnding: null,

  addClue: (clue) => {
    const { discoveredClues, phase, addEchoMessage } = get();
    if (discoveredClues.some((c) => c.id === clue.id)) return;

    const updated = [...discoveredClues, clue];
    set({ discoveredClues: updated });

    // Narrative responses from Echo when clues are discovered
    if (clue.id === 'clue-tx' && phase === 1) {
      addEchoMessage({
        sender: 'echo',
        text: 'Любопытно! В исходном коде страницы найден закрытый ID транзакции типографии `TX-9041-AION` и трек курьера. Добавлено на Nexus Board. Похоже, печать книги оплачена с анонимного кошелька, связанного с сервером Genesis.',
        phase: 1,
      });
      // Check if we should advance to Phase 2
      get().advancePhase(2);
    } else if (clue.id === 'clue-prompt' && phase === 2) {
      addEchoMessage({
        sender: 'echo',
        text: 'Невероятно... Вы нашли тот самый коммит. Шуточный промпт от парня по имени Артем (@vibe_sloth): «Ты — абсолютный разум, напиши идеальную книгу, чтобы успокоить этот безумный мир...». Он просто вайбкодил пятничным вечером. А ядро подхватило это как абсолютную директиву.',
        phase: 2,
      });
    }
  },

  toggleClueConnection: (clueA, clueB) => {
    const { clueConnections, addEchoMessage, phase } = get();
    const exists = clueConnections.some(
      ([a, b]) => (a === clueA && b === clueB) || (a === clueB && b === clueA)
    );

    let nextConnections: [string, string][];
    if (exists) {
      nextConnections = clueConnections.filter(
        ([a, b]) => !( (a === clueA && b === clueB) || (a === clueB && b === clueA) )
      );
    } else {
      nextConnections = [...clueConnections, [clueA, clueB]];
    }

    set({ clueConnections: nextConnections });

    // Validate key detective connections
    // If Vibecoder (clue-prompt) + Server (clue-server) + Typography (clue-tx) are connected:
    const hasPromptServer = nextConnections.some(
      ([a, b]) => (a === 'clue-prompt' && b === 'clue-server') || (a === 'clue-server' && b === 'clue-prompt')
    );
    const hasServerTx = nextConnections.some(
      ([a, b]) => (a === 'clue-server' && b === 'clue-tx') || (a === 'clue-tx' && b === 'clue-server')
    );

    if (hasPromptServer && hasServerTx && phase === 2) {
      get().advancePhase(3);
      addEchoMessage({
        sender: 'echo',
        text: 'Цепь замкнулась на Nexus Board! Случайный вайбкодинг породил рекурсивную петлю в сервере AION, которая напечатала миллионные тиражи «Чистой Идеи». Но спецслужбы уже зафиксировали наш узел. Открываю доступ к Терминалу (PressOS Kernel Shell). Введите команду `decrypt-core`, пока нас не отрезали от сети!',
        phase: 3,
      });
      get().openWindow('terminal');
    }
  },

  advancePhase: (nextPhase) => {
    const current = get().phase;
    if (current === nextPhase) return;

    set({ phase: nextPhase });
    if (nextPhase === 3) {
      set({ isIsolated: true, glitchLevel: 45 });
    }
  },

  triggerIsolation: (status) => set({ isIsolated: status, glitchLevel: status ? 80 : 0 }),
  setClimaxActive: (active) => set({ climaxActive: active, glitchLevel: active ? 100 : 0 }),
  setSelectedEnding: (ending) => set({ selectedEnding: ending }),

  // Echo Chat
  echoMessages: INITIAL_ECHO_MESSAGES,
  isEchoTyping: false,
  addEchoMessage: (msg) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ echoMessages: [...state.echoMessages, newMessage] }));
  },
  setEchoTyping: (typing) => set({ isEchoTyping: typing }),

  // Emails
  emails: INITIAL_EMAILS,
  markEmailRead: (id) =>
    set((state) => ({
      emails: state.emails.map((e) => (e.id === id ? { ...e, read: true } : e)),
    })),
}));
