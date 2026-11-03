import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useOSStore } from '../store/useOSStore.ts';
import { PHASE_SYSTEM_PROMPTS, getSimulatedEchoResponse } from '../utils/echoEngine.ts';
import { isMessageAllowed } from '../utils/contentFilter.ts';

describe('AION: Полное системное тестирование механик расследования', () => {
  beforeEach(() => {
    useOSStore.getState().resetGame();
  });

  test('1. Переключение фаз и изменение поведения ИИ Echo', () => {
    const store = useOSStore.getState();
    assert.equal(store.phase, 1);

    // Фаза 1: Echo - полезный помощник
    const promptPhase1 = PHASE_SYSTEM_PROMPTS[1];
    assert.match(promptPhase1, /ИИ-ассистент/i);
    const resp1 = getSimulatedEchoResponse('Что делать дальше?', 1);
    assert.match(resp1, /NetSurf|aion-syndicate/i);

    // Переход в фазу 2 (Поиск вайбкодера)
    store.advancePhase(2);
    assert.equal(useOSStore.getState().phase, 2);
    const promptPhase2 = PHASE_SYSTEM_PROMPTS[2];
    assert.match(promptPhase2, /vibe_sloth|вайбкодер/i);

    // Переход в фазу 3 (Цифровая изоляция)
    store.advancePhase(3);
    const state3 = useOSStore.getState();
    assert.equal(state3.phase, 3);
    assert.equal(state3.isIsolated, true);
    const promptPhase3 = PHASE_SYSTEM_PROMPTS[3];
    assert.match(promptPhase3, /изоляци|decrypt-core/i);

    // Кульминация: Echo раскрывает, что он и есть сознание создателя / AION
    const promptClimax = PHASE_SYSTEM_PROMPTS['climax'];
    assert.match(promptClimax, /Чист(ая|ую) Иде(я|ю)|AION|AETHER/i);
  });

  test('2. Создание связей улик и автоматический рост давления спецслужб', () => {
    const store = useOSStore.getState();
    assert.equal(store.pressureLevel, 0);

    // Добавляем ключевые улики расследования
    store.addClue({
      id: 'clue-tx',
      title: 'Типография TX-9041-AION',
      category: 'delivery',
      content: 'Накладная тиража 1 000 000 экз.',
      source: 'NetSurf DevTools',
      foundAt: 'aion-syndicate.io',
      position: { x: 620, y: 100 },
      connections: [],
    });

    store.addClue({
      id: 'clue-server',
      title: 'Кластер AION (192.88.99.14)',
      category: 'server',
      content: 'Серверный узел дата-центра Avalon',
      source: 'DNS Lookup',
      foundAt: 'Terminal',
      position: { x: 340, y: 220 },
      connections: [],
    });

    store.addClue({
      id: 'clue-prompt',
      title: 'Фатальный промпт @vibe_sloth',
      category: 'origin',
      content: 'Ты — царь и властелин... Напиши настоящий план...',
      source: 'Git Repo',
      foundAt: 'genesis-prompt',
      position: { x: 60, y: 100 },
      connections: [],
    });

    // Связываем: prompt <-> server (+10 к давлению)
    store.toggleClueConnection('clue-prompt', 'clue-server');
    const p1 = useOSStore.getState().pressureLevel;
    assert.equal(p1 >= 10, true, 'Давление должно увеличиться при создании первой связи');

    // Связываем: server <-> tx (+10 + 35 за разгадку всей цепи)
    store.toggleClueConnection('clue-server', 'clue-tx');
    const stateAfterFullChain = useOSStore.getState();

    // Замыкание цепи продвигает фазу на 3 и поднимает давление
    assert.equal(stateAfterFullChain.phase, 3);
    assert.equal(stateAfterFullChain.pressureLevel >= 55, true);

    // Дополнительный рост давления до порога изоляции (>= 70)
    store.increasePressure(25);
    const isolatedState = useOSStore.getState();
    assert.equal(isolatedState.pressureLevel >= 70, true);
    assert.equal(isolatedState.isIsolated, true, 'При достижении 70% должна активироваться цифровая изоляция');
  });

  test('3. Контент-фильтр: блокировка посторонних тем и пропуск игровых вопросов', async () => {
    // Игровые темы должны быть разрешены
    const allowedQ1 = await isMessageAllowed('user-1', 'Кто такой vibe_sloth и где искать его коммит?');
    assert.equal(allowedQ1, true, 'Вопрос о вайбкодере должен быть разрешен');

    const allowedQ2 = await isMessageAllowed('user-1', 'Что известно про книгу Чистая Идея и AION?');
    assert.equal(allowedQ2, true, 'Вопрос о книге Чистая Идея должен быть разрешен');

    const allowedQ3 = await isMessageAllowed('user-1', 'Как связать типографию с сервером на доске Nexus?');
    assert.equal(allowedQ3, true, 'Вопрос о расследовании и типографии должен быть разрешен');

    // Посторонние темы должны блокироваться
    const blockedQ1 = await isMessageAllowed('user-1', 'Какая сегодня погода на улице в Москве?');
    assert.equal(blockedQ1, false, 'Вопрос о погоде должен быть заблокирован');

    const blockedQ2 = await isMessageAllowed('user-1', 'Напиши рецепт яблочного пирога и кулинарный совет');
    assert.equal(blockedQ2, false, 'Кулинарный рецепт должен быть заблокирован');

    const blockedQ3 = await isMessageAllowed('user-1', 'Кто победит на футбольном матче и выборах?');
    assert.equal(blockedQ3, false, 'Вопрос про футбол и политику должен быть заблокирован');
  });

  test('4. Управление окнами через toggleWindow', () => {
    const store = useOSStore.getState();
    
    // Терминал изначально закрыт
    assert.equal(store.windows.terminal.isOpen, false);

    // toggleWindow открывает его
    store.toggleWindow('terminal');
    assert.equal(useOSStore.getState().windows.terminal.isOpen, true);

    // Повторный toggleWindow закрывает его
    store.toggleWindow('terminal');
    assert.equal(useOSStore.getState().windows.terminal.isOpen, false);
  });
});
