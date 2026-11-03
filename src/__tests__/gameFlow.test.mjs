import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useOSStore } from '../store/useOSStore.ts';

describe('PressOS: AETHER Game Full Playthrough Flow', () => {
  beforeEach(() => {
    useOSStore.setState({
      phase: 1,
      discoveredClues: [],
      clueConnections: [],
      isIsolated: false,
      glitchLevel: 0,
      climaxActive: false,
      selectedEnding: null,
    });
  });

  test('Фаза 1: Стартовое состояние и окна', () => {
    const state = useOSStore.getState();
    assert.equal(state.phase, 1);
    assert.equal(state.windows.echo.isOpen, true);
    assert.equal(state.windows.netsurf.isOpen, true);
  });

  test('Фаза 1 -> Фаза 2: Нахождение транзакции типографии (clue-tx) открывает Фазу 2', () => {
    const store = useOSStore.getState();
    store.addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии TX-9041-AETHER',
      category: 'delivery',
      content: 'Оплата печати книги...',
      source: 'NetSurf DevTools',
      foundAt: 'aether-syndicate.io [DevTools]',
      position: { x: 620, y: 100 },
      connections: [],
    });

    const state = useOSStore.getState();
    assert.equal(state.phase, 2);
    assert.equal(state.discoveredClues.some((c) => c.id === 'clue-tx'), true);
  });

  test('Фаза 2 -> Фаза 3: Корреляция Вайбкодер + Сервер + Типография запускает Изоляцию и Терминал', () => {
    const store = useOSStore.getState();

    // В фазе 1 нашли типографию
    store.addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии TX-9041-AETHER',
      category: 'delivery',
      content: 'Оплата печати книги...',
      source: 'NetSurf DevTools',
      foundAt: 'aether-syndicate.io [DevTools]',
      position: { x: 620, y: 100 },
      connections: [],
    });
    assert.equal(useOSStore.getState().phase, 2);

    // В фазе 2 находим вайбкодера и сервер
    store.addClue({
      id: 'clue-prompt',
      title: 'Коммит @vibe_sloth',
      category: 'origin',
      content: 'Шуточный промпт 2024 года',
      source: 'GitHub Archive',
      foundAt: 'github.com',
      position: { x: 60, y: 100 },
      connections: [],
    });

    store.addClue({
      id: 'clue-server',
      title: 'Кластер Genesis-AETHER',
      category: 'server',
      content: '192.88.99.14',
      source: 'NetSurf Network',
      foundAt: 'DevTools Network',
      position: { x: 340, y: 220 },
      connections: [],
    });

    // Связываем нитями: Prompt <-> Server и Server <-> Tx
    store.toggleClueConnection('clue-prompt', 'clue-server');
    store.toggleClueConnection('clue-server', 'clue-tx');

    const state = useOSStore.getState();
    assert.equal(state.phase, 3);
    assert.equal(state.isIsolated, true);
    assert.equal(state.windows.terminal.isOpen, true);
    assert.equal(state.discoveredClues.some((c) => c.id === 'clue-core'), true);
  });

  test('Фаза 3 -> Кульминация: Дешифровка манифеста перехватывает управление и предлагает концовки', () => {
    const store = useOSStore.getState();
    store.setClimaxActive(true);

    assert.equal(useOSStore.getState().climaxActive, true);

    // Игрок выбирает концовку
    store.setSelectedEnding('publish');
    assert.equal(useOSStore.getState().selectedEnding, 'publish');
  });
});
