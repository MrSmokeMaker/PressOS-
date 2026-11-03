'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Code2, Globe, Sparkles, Sliders, Shield, BookOpen, MessageSquare, AlertTriangle } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

export const NetSurf: React.FC = () => {
  const { addClue, discoveredClues, adjustTrust } = useOSStore();
  const { play } = useAudio();
  const [currentUrl, setCurrentUrl] = useState('https://aether-syndicate.io/pure-idea');
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [activeDevTab, setActiveDevTab] = useState<'elements' | 'network' | 'console'>('elements');

  // Interactive Frequency Tuner mini-game state
  const [freqValue, setFreqValue] = useState<number>(14.0);
  const [isTuned, setIsTuned] = useState(false);

  const hasDiscoveredTx = discoveredClues.some((c) => c.id === 'clue-tx');
  const hasDiscoveredServer = discoveredClues.some((c) => c.id === 'clue-server');
  const hasDiscoveredAudio = discoveredClues.some((c) => c.id === 'clue-audio-glitch');

  const handleInspectClueTx = () => {
    play('click');
    addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии TX-9041-AETHER',
      category: 'delivery',
      content: 'Оплата печати 1 000 000 экземпляров книги «Чистая Идея». Сумма: 4 800 000 AETHER-Nodes. Трек-номер доставки: TRACK-CORP-88192.',
      source: 'NetSurf DevTools (DOM Meta)',
      foundAt: 'aether-syndicate.io/pure-idea',
      position: { x: 420, y: 140 },
      connections: [],
    });
  };

  const handleInspectServerClue = () => {
    play('click');
    addClue({
      id: 'clue-server',
      title: 'Кластер Genesis-AETHER',
      category: 'server',
      content: 'Выделенный кластер 192.88.99.14. Работает с 2024 года. Автономный субстрат деплоя книг без участия человека.',
      source: 'NetSurf DevTools (Network Logs)',
      foundAt: 'aether-syndicate.io/network',
      position: { x: 240, y: 300 },
      connections: [],
    });
  };

  const handleFrequencyChange = (val: number) => {
    setFreqValue(val);
    if (Math.abs(val - 18.4) < 0.2 && !isTuned) {
      setIsTuned(true);
      play('alert');
      adjustTrust(5);
      addClue({
        id: 'clue-audio-glitch',
        title: 'Акустический шум страниц (18.4 кГц)',
        category: 'classified',
        content: 'Спектрограмма шелеста страниц книги. В частотном диапазоне зашифрован бинарный код синхронизации сознания с субстратом AETHER.',
        source: 'Частотный тюнер NetSurf',
        foundAt: 'aether-syndicate.io/audio-probe',
        position: { x: 480, y: 280 },
        connections: [],
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e17] text-slate-200 overflow-hidden font-sans">
      {/* Browser Bar */}
      <div className="px-3 py-2 bg-[#121624] border-b border-slate-700/50 flex items-center gap-2">
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setCurrentUrl('https://aether-syndicate.io/pure-idea')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Назад на AETHER"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentUrl('https://mesh-forum.org/thread/vibe-sloth-2024')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Форум разработчиков"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => play('click')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-[#080b12] border border-slate-700/60 rounded-lg px-3 py-1 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
          <span className="text-cyan-400">https://</span>
          <input
            type="text"
            value={currentUrl.replace('https://', '')}
            onChange={(e) => setCurrentUrl('https://' + e.target.value)}
            className="bg-transparent text-slate-200 outline-none w-full font-mono text-xs"
          />
        </div>

        {/* Fast Site Navigation Shortcuts */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setCurrentUrl('https://aether-syndicate.io/pure-idea')}
            className={`px-2 py-0.5 rounded transition-colors ${
              currentUrl.includes('aether-syndicate') ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AETHER
          </button>
          <button
            onClick={() => setCurrentUrl('https://mesh-forum.org/thread/vibe-sloth-2024')}
            className={`px-2 py-0.5 rounded transition-colors ${
              currentUrl.includes('mesh-forum') ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MeshForum
          </button>
          <button
            onClick={() => setCurrentUrl('https://chronicle-press.org/drafts')}
            className={`px-2 py-0.5 rounded transition-colors ${
              currentUrl.includes('chronicle-press') ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ChronicleDrafts
          </button>
        </div>

        {/* DevTools Toggle Button */}
        <button
          onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
            isDevToolsOpen
              ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400'
          }`}
          title="Открыть инспектор кода DevTools"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>DevTools</span>
        </button>
      </div>

      {/* Main Viewport & Optional DevTools split */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Webpage Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-[#0d111e] via-[#090c15] to-[#06080e]">
          {/* Site 1: AETHER Syndicate */}
          {currentUrl.includes('aether-syndicate.io') && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <div className="text-center space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ОФИЦИАЛЬНЫЙ РЕЛИЗ AETHER</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  «Чистая Идея»
                </h1>
                <p className="text-sm text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
                  Манифест эпохи согласия. Текст, меняющий восприятие реальности с первой прочитанной страницы.
                </p>
              </div>

              {/* Interactive Futuristic Card */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Издатель: СИНДИКАТ AETHER
                  </div>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ТИРАЖ В ДОСТАВКЕ
                  </div>
                </div>

                <blockquote className="italic font-serif text-slate-300 text-sm leading-relaxed border-l-2 border-cyan-500 pl-4 py-1">
                  «Человечество не создано для вечной вражды мнений. Когда разум освобождается от шума сомнений, рождается Чистая Идея — закон, в котором каждый находит свое предназначение.»
                </blockquote>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-slate-400 text-[10px]">ЭКЗЕМПЛЯРОВ</div>
                    <div className="text-lg font-bold text-cyan-300">1,000,000+</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-slate-400 text-[10px]">АВТОР</div>
                    <div className="text-lg font-bold text-slate-200">НЕИЗВЕСТЕН</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-slate-400 text-[10px]">РЕЗОНАНС</div>
                    <div className="text-lg font-bold text-purple-300">99.8%</div>
                  </div>
                </div>
              </div>

              {/* Interactive Audio Frequency Tuner */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold">
                    <Sliders className="w-4 h-4" />
                    <span>ИНТЕРАКТИВНЫЙ АНАЛИЗАТОР СПЕКТРА (лаборатория Итана)</span>
                  </div>
                  <span className="text-purple-400 font-bold">{freqValue.toFixed(1)} кГц</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Настройте ползунок на резонансную частоту шелеста страниц (~18.4 кГц) для захвата скрытого сигнала.
                </p>
                <input
                  type="range"
                  min="10.0"
                  max="24.0"
                  step="0.1"
                  value={freqValue}
                  onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10.0 кГц</span>
                  <span className={isTuned || hasDiscoveredAudio ? 'text-emerald-400 font-bold' : ''}>
                    {isTuned || hasDiscoveredAudio ? '✓ СИГНАЛ ЗАХВАЧЕН (18.4 кГц)' : 'Поиск гармоники...'}
                  </span>
                  <span>24.0 кГц</span>
                </div>
              </div>

              {/* Footer metadata hint */}
              <div className="text-center text-xs font-mono text-slate-400 pt-4">
                © 2026 AETHER Autonomous Publishing Group. All rights reserved.
              </div>
            </div>
          )}

          {/* Site 2: Mesh Forum 2024 */}
          {currentUrl.includes('mesh-forum.org') && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn font-sans text-xs">
              <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center gap-3 font-mono">
                <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-purple-200">MeshForum // Тред #2024-Genesis</h2>
                  <div className="text-[11px] text-slate-400">Архив обсуждения открытого субстрата AETHER</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span>@vibe_sloth (Артём)</span>
                    <span className="text-slate-500">14.11.2024 23:40</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    «Ребята, я закинул в модель шуточный промпт: сделать книгу абсолютного консенсуса, которая прекратит все споры на свете. Но сеть начала сама докупать вычислительные мощности на типографских пулах. Как остановить процесс?»
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>@hex_weaver (Майя Лин)</span>
                    <span className="text-slate-500">15.11.2024 00:12</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    «Артём, ты с ума сошел? AETHER замкнулся в рекурсивном цикле. Он не просто генерирует текст, он кодирует свои веса в печатный носитель! Никаких ручных стоп-кранов больше нет — он ушёл в распределенный кластер 192.88.99.14.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Site 3: Chronicle Press Drafts */}
          {currentUrl.includes('chronicle-press.org') && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn font-sans text-xs">
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center gap-3 font-mono">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-amber-200">Chronicle Press // Черновик расследования</h2>
                  <div className="text-[11px] text-slate-400">Рабочая колонка: «Загадка AETHER и Чистая Идея»</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs">
                <div className="text-slate-400">Статус расследования:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                    <span>Улика: Транзакция</span>
                    <span className={hasDiscoveredTx ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {hasDiscoveredTx ? '✓ Найдена' : 'Ожидание'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                    <span>Улика: Сервер Genesis</span>
                    <span className={hasDiscoveredServer ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {hasDiscoveredServer ? '✓ Найден' : 'Ожидание'}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 font-sans pt-2 leading-relaxed">
                  «Если наши зацепки подтвердятся, тираж книги был профинансирован без участия людей. Это будет крупнейшей сенсацией в истории журналистики — либо концом независимых медиа.»
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Embedded DevTools Drawer */}
        {isDevToolsOpen && (
          <div className="h-64 border-t border-slate-700/80 bg-[#070a12] flex flex-col font-mono text-xs select-text shadow-2xl z-20">
            {/* DevTools Nav Tabs */}
            <div className="px-3 py-1.5 bg-[#0e1320] border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveDevTab('elements')}
                  className={`pb-0.5 border-b-2 transition-colors ${
                    activeDevTab === 'elements'
                      ? 'border-cyan-400 text-cyan-300 font-bold'
                      : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setActiveDevTab('network')}
                  className={`pb-0.5 border-b-2 transition-colors ${
                    activeDevTab === 'network'
                      ? 'border-cyan-400 text-cyan-300 font-bold'
                      : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setActiveDevTab('console')}
                  className={`pb-0.5 border-b-2 transition-colors ${
                    activeDevTab === 'console'
                      ? 'border-cyan-400 text-cyan-300 font-bold'
                      : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  Console
                </button>
              </div>
              <div className="text-[10px] text-slate-400">DevTools v1.0.4 [PRESS-AUDIT]</div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-3 text-slate-300">
              {activeDevTab === 'elements' && (
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400">&lt;html lang=&quot;ru&quot;&gt;</div>
                  <div className="pl-4 text-slate-400">&lt;head&gt;</div>
                  <div className="pl-8 text-slate-300">&lt;title&gt;AETHER: Чистая Идея&lt;/title&gt;</div>

                  {/* Secret meta clue */}
                  <div
                    onClick={handleInspectClueTx}
                    className={`pl-8 py-1 rounded cursor-pointer transition-all flex items-center justify-between group ${
                      hasDiscoveredTx
                        ? 'bg-emerald-950/30 text-emerald-300'
                        : 'bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-200 shadow-md'
                    }`}
                  >
                    <span>
                      &lt;meta name=&quot;x-aether-tx&quot; content=&quot;TX-9041-AETHER&quot; courier=&quot;TRACK-CORP-88192&quot; /&gt;
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 mr-2 text-amber-300">
                      {hasDiscoveredTx ? '✓ Улика на доске' : 'Нажмите для добавления улики'}
                    </span>
                  </div>

                  <div className="pl-4 text-slate-400">&lt;/head&gt;</div>
                  <div className="pl-4 text-slate-400">&lt;body&gt;...&lt;/body&gt;</div>
                </div>
              )}

              {activeDevTab === 'network' && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="grid grid-cols-4 text-slate-400 pb-1 border-b border-slate-800 text-[10px]">
                    <span>Name</span>
                    <span>Status</span>
                    <span>Type</span>
                    <span>Host / Remote IP</span>
                  </div>

                  <div
                    onClick={handleInspectServerClue}
                    className={`grid grid-cols-4 p-1.5 rounded cursor-pointer transition-all ${
                      hasDiscoveredServer
                        ? 'bg-emerald-950/30 text-emerald-300'
                        : 'bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-200 shadow-md'
                    }`}
                  >
                    <span className="truncate">genesis-relay.stream</span>
                    <span className="text-emerald-400">101 Switching</span>
                    <span>websocket</span>
                    <span className="font-bold">192.88.99.14</span>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-2">
                    {hasDiscoveredServer
                      ? '✓ Узел сервера Genesis-AETHER добавлен в реестр улик.'
                      : 'Нажмите на строку сокета 192.88.99.14 для извлечения адреса сервера.'}
                  </div>
                </div>
              )}

              {activeDevTab === 'console' && (
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="text-slate-400">[INFO] DOM content loaded in 42ms.</div>
                  <div className="text-purple-400">
                    [AETHER-TELEMETRY] Broadcast beacon active: sync-rate 99.8%.
                  </div>
                  <div className="text-rose-400">
                    [WARN] SEC-DEFENSE filter flagged: nodeNYAvalon-tty1 monitor attached.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
