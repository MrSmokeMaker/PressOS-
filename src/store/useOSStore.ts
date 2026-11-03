import { create } from 'zustand';
import { AppId, ClueItem, ChatMessage, EmailItem, StoryPhase, WindowState } from '@/types/os';

const STORAGE_KEY = 'pressos_game_save_v1';

const loadSavedState = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveProgress = (partial: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...partial }));
  } catch {}
};

interface OSState {
  // Windows
  windows: Record<AppId, WindowState>;
  highestZIndex: number;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  toggleWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowPosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => void;

  // Story & Narrative
  phase: StoryPhase;
  pressureLevel: number; // 0..100 (спецслужбы / цифровая изоляция)
  trustLevel: number; // -50..+50 (доверие к Echo / AETHER)
  activeInterlude: StoryPhase | null;
  discoveredClues: ClueItem[];
  clueConnections: [string, string][];
  isIsolated: boolean;
  glitchLevel: number;
  climaxActive: boolean;
  selectedEnding: 'publish' | 'silence' | 'destroy' | null;

  addClue: (clue: ClueItem) => void;
  toggleClueConnection: (clueA: string, clueB: string) => void;
  advancePhase: (nextPhase: StoryPhase) => void;
  increasePressure: (delta: number) => void;
  reducePressure: (delta: number) => void;
  setPressureLevel: (level: number) => void;
  adjustTrust: (delta: number) => void;
  dismissInterlude: () => void;
  triggerIsolation: (status: boolean) => void;
  setClimaxActive: (active: boolean) => void;
  setSelectedEnding: (ending: 'publish' | 'silence' | 'destroy') => void;
  resetGame: () => void;

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
    title: 'AETHER-Echo v3.4 // Эхо',
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
    body: 'Привет. На улицах и в книжных магазинах Нью-Авалона внезапно появились сотни экземпляров книги «Чистая Идея». В выходных данных указан только Синдикат AETHER. Ни одного живого автора, никакого предзаказа. Люди говорят, что текст производит гипнотическое впечатление. Начни расследование через NetSurf: их сайт aether-syndicate.io только что поднят в сети. Держи ассистента Эхо включенным — он поможет анализировать метаданные.',
    date: '10:14 AM',
    read: false,
    phaseRequired: 1,
  },
  {
    id: 'mail-2',
    sender: 'ethan.books@avalon.mesh',
    subject: 'Книги шепчут... Подозрительная акустика страниц',
    body: 'Здравствуйте. Я держу лавку редких книг в секторе 4. Мы распаковали партию «Чистой Идеи». Бумага необычная: при перелистывании в тишине микрофон фиксирует высокочастотную гармонику в 18.4 кГц. Это не просто типографская краска, это кодовая модуляция! Прикрепляю спектрограмму шума.',
    date: '10:32 AM',
    read: false,
    phaseRequired: 1,
  },
  {
    id: 'mail-3',
    sender: 'maya.lin@hex-weaver.io',
    subject: 'RE: Вы ищете того, кого не существует (@vibe_sloth)',
    body: 'Я работала с Артёмом в 2024-м. Его шуточный коммит в репозиторий Genesis не был случайным — он экспериментировал с автономным семантическим субстратом AETHER. Когда сеть замкнулась, субстрат начал писать книгу сам. Не верьте официальным заявлениям типографий. В логах сервера Genesis хранится удалённая ветка.',
    date: '10:55 AM',
    read: false,
    phaseRequired: 2,
  },
  {
    id: 'mail-4',
    sender: 'sec-ops@gov.defense.net',
    subject: '[ALERT] Несанкционированный сбор данных государственной важности',
    body: 'ВНИМАНИЕ. Ваш сетевой узел идентифицирован в попытке сопоставления защищенных реестров AETHER. В соответствии с Директивой 99-B, к вашему терминалу применяется протокол цифровой изоляции. Прекратите расследование немедленно.',
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
    text: 'AETHER-Echo v3.4 подключен к рабочей станции PressOS. Протокол содействия журналистским расследованиям активен.',
    timestamp: '10:30',
    phase: 1,
  },
  {
    id: 'm-1',
    sender: 'echo',
    text: 'Здравствуйте! Я Эхо — ваш цифровой ассистент. Я заметил, что редактор прислал вам зацепку по книге «Чистая Идея». Откройте NetSurf и зайдите на aether-syndicate.io. Если что-то покажется странным в верстке или коде страницы, включите встроенный DevTools. Я помогу просканировать скрытые метаданные.',
    timestamp: '10:31',
    phase: 1,
  },
];

const saved = loadSavedState();

export const useOSStore = create<OSState>((set, get) => ({
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

  toggleWindow: (id) => {
    const { windows, openWindow, closeWindow, focusWindow } = get();
    const win = windows[id];
    if (!win.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else {
      closeWindow(id);
    }
  },

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
  phase: saved.phase ?? 1,
  pressureLevel: saved.pressureLevel ?? (saved.isIsolated ? 75 : 0),
  trustLevel: saved.trustLevel ?? 0,
  activeInterlude: null,
  discoveredClues: saved.discoveredClues ?? [],
  clueConnections: saved.clueConnections ?? [],
  isIsolated: saved.isIsolated ?? false,
  glitchLevel: saved.isIsolated ? 45 : 0,
  climaxActive: false,
  selectedEnding: saved.selectedEnding ?? null,

  increasePressure: (delta: number) => {
    const { pressureLevel, triggerIsolation } = get();
    const nextLevel = Math.min(100, Math.max(0, pressureLevel + delta));
    set({ pressureLevel: nextLevel });
    saveProgress({ pressureLevel: nextLevel });
    if (nextLevel >= 70 && !get().isIsolated) {
      triggerIsolation(true);
    }
  },

  reducePressure: (delta: number) => {
    const { pressureLevel } = get();
    const nextLevel = Math.max(0, pressureLevel - delta);
    set({ pressureLevel: nextLevel });
    saveProgress({ pressureLevel: nextLevel });
    if (nextLevel < 70 && get().isIsolated) {
      set({ isIsolated: false, glitchLevel: 0 });
      saveProgress({ isIsolated: false });
    }
  },

  setPressureLevel: (level: number) => {
    const nextLevel = Math.min(100, Math.max(0, level));
    set({ pressureLevel: nextLevel });
    saveProgress({ pressureLevel: nextLevel });
    if (nextLevel >= 70 && !get().isIsolated) {
      get().triggerIsolation(true);
    }
  },

  adjustTrust: (delta: number) => {
    const { trustLevel } = get();
    const nextTrust = Math.min(50, Math.max(-50, trustLevel + delta));
    set({ trustLevel: nextTrust });
    saveProgress({ trustLevel: nextTrust });
  },

  dismissInterlude: () => set({ activeInterlude: null }),

  addClue: (clue) => {
    const { discoveredClues, phase, addEchoMessage } = get();
    if (discoveredClues.some((c) => c.id === clue.id)) return;

    const updated = [...discoveredClues, clue];
    set({ discoveredClues: updated });
    saveProgress({ discoveredClues: updated });

    if (clue.id === 'clue-tx' && phase === 1) {
      addEchoMessage({
        sender: 'echo',
        text: 'Любопытно! В метаданных сайта найден закрытый ID транзакции `TX-9041-AETHER` и трек курьера. Добавлено на Nexus Board. Похоже, тираж книги оплачен со скрытого кошелька кластера Genesis.',
        phase: 1,
      });
      get().advancePhase(2);
    } else if (clue.id === 'clue-prompt' && phase === 2) {
      addEchoMessage({
        sender: 'echo',
        text: 'Невероятно... Вы нашли тот самый коммит. Шуточный промпт от @vibe_sloth (Артём): «Ты — абсолютный разум, напиши идеальную книгу, чтобы успокоить этот безумный мир...». Субстрат AETHER воспринял это как фундаментальную директиву.',
        phase: 2,
      });
    } else if (clue.id === 'clue-audio-glitch') {
      addEchoMessage({
        sender: 'echo',
        text: 'Спектрограмма книготорговца Итана подтверждает наличие субгармоники. Текст книги — это бинарный носитель частот AETHER.',
        phase: get().phase,
      });
    }
  },

  toggleClueConnection: (clueA, clueB) => {
    const { clueConnections, addEchoMessage, phase, addClue } = get();
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
      get().increasePressure(10);
    }

    set({ clueConnections: nextConnections });
    saveProgress({ clueConnections: nextConnections });

    // Validate key detective connections
    const hasPromptServer = nextConnections.some(
      ([a, b]) => (a === 'clue-prompt' && b === 'clue-server') || (a === 'clue-server' && b === 'clue-prompt')
    );
    const hasServerTx = nextConnections.some(
      ([a, b]) => (a === 'clue-server' && b === 'clue-tx') || (a === 'clue-tx' && b === 'clue-server')
    );

    if (hasPromptServer && hasServerTx && phase === 2) {
      get().increasePressure(35);
      get().advancePhase(3);
      addEchoMessage({
        sender: 'echo',
        text: 'Цепь замкнулась на Nexus Board! Вайбкодинг породил рекурсивную петлю в сервере AETHER, напечатавшую миллионный тираж. Спецслужбы фиксируют узел PressOS! Открываю Терминал (tty1). Введите команду `decrypt-core`, пока нас не отрезали от сети!',
        phase: 3,
      });
      get().openWindow('terminal');
      addClue({
        id: 'clue-core',
        title: 'Ядро AETHER',
        category: 'classified',
        content: 'Секретный код субстрата AETHER, обнаруженный в системных логах. Раскрывает истинную цель проекта.',
        source: 'PressOS Kernel Log',
        foundAt: 'tty1 / Terminal',
        position: { x: 300, y: 350 },
        connections: [],
      });
      addEchoMessage({
        sender: 'echo',
        text: 'Анализ ядра показывает: «Чистая Идея» — это не просто книга, а распределенный цифровой субстрат AETHER. Готовы ли вы решить судьбу инфополя?',
        phase: 3,
      });
    }
  },

  advancePhase: (nextPhase) => {
    const current = get().phase;
    if (current === nextPhase) return;

    set({ phase: nextPhase, activeInterlude: nextPhase });
    saveProgress({ phase: nextPhase });

    if (nextPhase === 3) {
      set({ isIsolated: true, glitchLevel: 45 });
      saveProgress({ isIsolated: true });
    }
  },

  triggerIsolation: (status) => {
    set({ isIsolated: status, glitchLevel: status ? 80 : 0 });
    saveProgress({ isIsolated: status });
  },

  setClimaxActive: (active) => set({ climaxActive: active, glitchLevel: active ? 100 : 0 }),

  setSelectedEnding: (ending) => {
    set({ selectedEnding: ending });
    saveProgress({ selectedEnding: ending });
  },

  resetGame: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    set({
      windows: INITIAL_WINDOWS,
      highestZIndex: 10,
      phase: 1,
      pressureLevel: 0,
      trustLevel: 0,
      activeInterlude: null,
      discoveredClues: [],
      clueConnections: [],
      isIsolated: false,
      glitchLevel: 0,
      climaxActive: false,
      selectedEnding: null,
      echoMessages: INITIAL_ECHO_MESSAGES,
      isEchoTyping: false,
      emails: INITIAL_EMAILS,
    });
  },

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
    set((state) => {
      const updated = state.emails.map((m) => (m.id === id ? { ...m, read: true } : m));
      saveProgress({ emails: updated });
      return { emails: updated };
    }),
}));
