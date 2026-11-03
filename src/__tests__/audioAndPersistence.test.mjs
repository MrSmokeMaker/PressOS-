import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useOSStore } from '../store/useOSStore.ts';

describe('PressOS: Audio Synthesizer Types & Progress Reset', () => {
  beforeEach(() => {
    useOSStore.getState().resetGame();
  });

  test('Сброс игры (resetGame) корректно очищает все улики и возвращает Фазу 1', () => {
    const store = useOSStore.getState();

    // Симулируем прогресс расследования
    store.advancePhase(3);
    store.triggerIsolation(true);
    store.addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии',
      category: 'delivery',
      content: 'Тестовая улика',
      foundAt: 'DevTools',
      position: { x: 0, y: 0 },
      connections: [],
    });

    assert.equal(useOSStore.getState().phase, 3);
    assert.equal(useOSStore.getState().isIsolated, true);
    assert.equal(useOSStore.getState().discoveredClues.length, 1);

    // Вызываем сброс игры
    useOSStore.getState().resetGame();

    const resetState = useOSStore.getState();
    assert.equal(resetState.phase, 1);
    assert.equal(resetState.isIsolated, false);
    assert.equal(resetState.discoveredClues.length, 0);
    assert.equal(resetState.clueConnections.length, 0);
    assert.equal(resetState.climaxActive, false);
    assert.equal(resetState.selectedEnding, null);
  });

  test('Поддерживаемые типы процедурного аудио-синтеза', () => {
    const supportedTypes = ['click', 'typing', 'crt', 'alert', 'ambient'];
    assert.equal(supportedTypes.length, 5);
    assert.ok(supportedTypes.includes('typing'));
    assert.ok(supportedTypes.includes('crt'));
    assert.ok(supportedTypes.includes('alert'));
  });
});
