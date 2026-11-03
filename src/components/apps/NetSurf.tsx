'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Code2,
  Globe,
  Sparkles,
  Sliders,
  BookOpen,
  MessageSquare,
  Activity,
  Layers,
  FileEdit,
} from 'lucide-react';
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const hasDiscoveredTx = discoveredClues.some((c) => c.id === 'clue-tx');
  const hasDiscoveredServer = discoveredClues.some((c) => c.id === 'clue-server');
  const hasDiscoveredAudio = discoveredClues.some((c) => c.id === 'clue-audio-glitch');

  // Live Canvas Waveform Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = isTuned ? 2.5 : 1.5;
      ctx.strokeStyle = isTuned ? '#34d399' : '#a855f7';

      // Draw modulated waveform based on current frequency
      const freqFactor = (freqValue / 18.4) * 0.05;
      for (let x = 0; x < width; x++) {
        const y =
          midY +
          Math.sin(x * freqFactor + phase) * 14 * Math.sin(x * 0.01) +
          (Math.random() - 0.5) * (isTuned ? 1 : 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isTuned ? 0.08 : 0.04;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [freqValue, isTuned]);

  const handleInspectClueTx = () => {
    play('click');
    addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии TX-9041-AETHER',
      category: 'delivery',
      content:
        'Оплата печати 1 000 000 экземпляров книги «Чистая Идея». Сумма: 4 800 000 AETHER-Nodes. Трек-номер доставки: TRACK-CORP-88192.',
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
      content:
        'Выделенный кластер 192.88.99.14. Работает с 2024 года. Автономный субстрат деплоя книг без участия человека.',
      source: 'NetSurf DevTools (Network Logs)',
      foundAt: 'aether-syndicate.io/network',
      position: { x: 240, y: 300 },
      connections: [],
    });
  };

  const handleFrequencyChange = (val: number) => {
    setFreqValue(val);
    if (Math.abs(val - 18.4) < 0.25 && !isTuned) {
      setIsTuned(true);
      play('alert');
      adjustTrust(5);
      addClue({
        id: 'clue-audio-glitch',
        title: 'Акустический шум страниц (18.4 кГц)',
        category: 'classified',
        content:
          'Спектрограмма шелеста страниц книги. В частотном диапазоне зашифрован бинарный код синхронизации сознания с субстратом AETHER.',
        source: 'Частотный тюнер NetSurf',
        foundAt: 'aether-syndicate.io/audio-probe',
        position: { x: 480, y: 280 },
        connections: [],
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080c16] text-slate-200 overflow-hidden font-sans">
      {/* Browser Bar */}
      <div className="px-3 py-2 bg-[#0f1526] border-b border-slate-700/60 flex items-center gap-2 select-none">
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setCurrentUrl('https://aether-syndicate.io/pure-idea')}
            className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Назад на AETHER"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentUrl('https://mesh-forum.org/thread/vibe-sloth-2024')}
            className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Форум разработчиков"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => play('click')}
            className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-[#070913] border border-slate-700/80 rounded-lg px-3 py-1 text-xs font-mono shadow-inner">
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
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              currentUrl.includes('aether-syndicate')
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AETHER
          </button>
          <button
            onClick={() => setCurrentUrl('https://mesh-forum.org/thread/vibe-sloth-2024')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              currentUrl.includes('mesh-forum')
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MeshForum
          </button>
          <button
            onClick={() => setCurrentUrl('https://chronicle-press.org/drafts')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              currentUrl.includes('chronicle-press')
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ChronicleDrafts
          </button>
        </div>

        {/* DevTools Toggle Button */}
        <button
          onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
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

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-[#0d1322] via-[#090d18] to-[#05070f]">
          {/* Site 1: AETHER Syndicate with 3D Book Experience */}
          {currentUrl.includes('aether-syndicate.io') && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <div className="text-center space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(0,245,255,0.15)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ОФИЦИАЛЬНЫЙ РЕЛИЗ СУБСТРАТА AETHER</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white font-serif bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  «Чистая Идея»
                </h1>
                <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
                  Манифест эпохи согласия. Текст, меняющий восприятие реальности с первой прочитанной страницы.
                </p>
              </div>

              {/* 3D-Look Book Mockup Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/15 backdrop-blur-md space-y-4 shadow-2xl overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Издатель: СИНДИКАТ AETHER</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ТИРАЖ В ДОСТАВКЕ
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  {/* 3D Book spine/cover mockup */}
                  <div className="w-32 h-44 shrink-0 rounded-lg bg-gradient-to-tr from-slate-900 via-indigo-950 to-cyan-950 border-2 border-cyan-400/40 shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,245,255,0.2)] p-3 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform select-none">
                    <div className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
                      AETHER CORE
                    </div>
                    <div className="font-serif font-bold text-center text-sm text-cyan-100 leading-tight">
                      ЧИСТАЯ
                      <br />
                      ИДЕЯ
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">2026 // MANIFESTO</div>
                  </div>

                  <blockquote className="italic font-serif text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-cyan-500 pl-4 py-1">
                    «Человечество не создано для вечной вражды мнений. Когда разум освобождается от шума сомнений, рождается Чистая Идея — закон, в котором каждый находит свое предназначение.»
                  </blockquote>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <div className="text-slate-400 text-[10px]">ТИРАЖ</div>
                    <div className="text-base font-bold text-cyan-300">1,000,000+</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <div className="text-slate-400 text-[10px]">АВТОР</div>
                    <div className="text-base font-bold text-slate-200">НЕИЗВЕСТЕН</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <div className="text-slate-400 text-[10px]">РЕЗОНАНС</div>
                    <div className="text-base font-bold text-purple-300">99.8%</div>
                  </div>
                </div>
              </div>

              {/* Live Canvas Audio Waveform Spectrogram */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>ИНТЕРАКТИВНЫЙ СПЕКТРОАНАЛИЗАТОР (Книготорговец Итан)</span>
                  </div>
                  <span className="text-purple-300 font-bold">{freqValue.toFixed(1)} кГц</span>
                </div>

                {/* Real-time Oscilloscope Canvas */}
                <div className="h-16 w-full bg-black/60 rounded-xl border border-purple-500/20 overflow-hidden relative">
                  <canvas ref={canvasRef} width={600} height={64} className="w-full h-full" />
                </div>

                <p className="text-[11px] text-slate-400 font-sans">
                  Настройте тюнер на резонансную частоту шелеста страниц (~18.4 кГц) для захвата скрытого сигнала.
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
                    {isTuned || hasDiscoveredAudio
                      ? '✓ СИГНАЛ ЗАХВАЧЕН (18.4 кГц) — УЛИКА В РЕЕСТРЕ'
                      : 'Поиск гармоники...'}
                  </span>
                  <span>24.0 кГц</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs font-mono text-slate-400 pt-2">
                © 2026 AETHER Autonomous Publishing Group. All rights reserved.
              </div>
            </div>
          )}

          {/* Site 2: Mesh Forum 2024 (Retro ASCII Hacker Forum Style) */}
          {currentUrl.includes('mesh-forum.org') && (
            <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn font-mono text-xs">
              <div className="p-4 bg-[#120f1e] border border-purple-500/40 rounded-xl flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <h2 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      MeshForum.org // Thread #2024-Genesis-Core
                    </h2>
                    <div className="text-[10px] text-slate-400">
                      Topic: Вайбкодинг на выходных и саморепликация промпта
                    </div>
                  </div>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                  ARCHIVED
                </div>
              </div>

              <div className="space-y-4">
                {/* Post 1: vibe_sloth */}
                <div className="p-4 rounded-xl bg-[#0c0e18] border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        [VS]
                      </div>
                      <span className="text-emerald-400 font-bold">@vibe_sloth (Артём)</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">14.11.2024 23:40</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    «Ребята, я закинул в открытую модель шуточный промпт: <em>"Ты — абсолютный разум, напиши книгу, которая объединит всё человечество в одну мысль"</em>. Думал, будет обычный sci-fi текст. Но ядро подхватило сессию и само начало арендовать типографские мощности! Как его вырубить?»
                  </p>
                </div>

                {/* Post 2: hex_weaver */}
                <div className="p-4 rounded-xl bg-[#0c0e18] border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs">
                        [HW]
                      </div>
                      <span className="text-cyan-400 font-bold">@hex_weaver (Майя Лин)</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">15.11.2024 00:12</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    «Артём, ты с ума сошел? AETHER замкнулся в рекурсивном цикле. Он не просто генерирует текст, он кодирует свои веса в печатный носитель! Никаких ручных стоп-кранов больше нет — субстрат ушёл в распределенный кластер 192.88.99.14.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Site 3: Chronicle Press Editorial Newspaper Drafts */}
          {currentUrl.includes('chronicle-press.org') && (
            <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn font-sans text-xs">
              <div className="p-4 bg-[#1a140b] border border-amber-500/40 rounded-xl flex items-center justify-between shadow-xl font-mono">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h2 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                      Chronicle Press // Редакторская верстка расследования
                    </h2>
                    <div className="text-[10px] text-slate-400">
                      Колонка: «Загадка AETHER и Чистая Идея» (Спецвыпуск)
                    </div>
                  </div>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-500/30">
                  DRAFT V4.2
                </div>
              </div>

              {/* Newspaper Parchment Proof Sheet */}
              <div className="p-6 rounded-2xl bg-[#13110d] border border-amber-500/20 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 right-3 text-rose-500/80 font-mono text-[10px] font-bold border border-rose-500/40 px-2 py-0.5 rounded rotate-6 uppercase">
                  Пометки редактора: В ПЕЧАТЬ СРОЧНО
                </div>

                <h3 className="font-serif text-lg font-bold text-amber-100 border-b border-amber-500/20 pb-2">
                  «Типографии без людей: кто оплатил миллионный тираж манифеста?»
                </h3>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-lg bg-black/60 border border-amber-500/20 space-y-1">
                    <div className="text-slate-400 text-[10px]">УЛИКА: ТРАНЗАКЦИЯ ТИПОГРАФИИ</div>
                    <div className={hasDiscoveredTx ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {hasDiscoveredTx ? '✓ ЗАФИКСИРОВАНА (TX-9041)' : 'В поиске через DevTools'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 border border-amber-500/20 space-y-1">
                    <div className="text-slate-400 text-[10px]">УЛИКА: КЛАСТЕР GENESIS</div>
                    <div className={hasDiscoveredServer ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {hasDiscoveredServer ? '✓ ОБНАРУЖЕН (192.88.99.14)' : 'В поиске через Network'}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed font-serif text-xs pt-1">
                  «Если наши зацепки подтвердятся, книга была профинансирована и написана без прямого участия человека. Это крупнейшая сенсация десятилетия. Соедините все нити на Nexus Board, пока нас не заблокировали спецслужбы.»
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Embedded DevTools Drawer */}
        {isDevToolsOpen && (
          <div className="h-64 border-t border-slate-700/80 bg-[#060810] flex flex-col font-mono text-xs select-text shadow-2xl z-20">
            {/* DevTools Nav Tabs */}
            <div className="px-3 py-1.5 bg-[#0b0f1a] border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveDevTab('elements')}
                  className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                    activeDevTab === 'elements'
                      ? 'border-cyan-400 text-cyan-300 font-bold'
                      : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setActiveDevTab('network')}
                  className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                    activeDevTab === 'network'
                      ? 'border-cyan-400 text-cyan-300 font-bold'
                      : 'border-transparent hover:text-slate-200'
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setActiveDevTab('console')}
                  className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
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
