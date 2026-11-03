'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Code2, Globe, Sparkles, Search, CheckCircle2, Shield } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

export const NetSurf: React.FC = () => {
  const { addClue, discoveredClues, phase } = useOSStore();
  const [currentUrl, setCurrentUrl] = useState('https://aion-syndicate.io/pure-idea');
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [activeDevTab, setActiveDevTab] = useState<'elements' | 'network' | 'console'>('elements');

  const hasDiscoveredTx = discoveredClues.some((c) => c.id === 'clue-tx');
  const hasDiscoveredServer = discoveredClues.some((c) => c.id === 'clue-server');

  const handleInspectClueTx = () => {
    addClue({
      id: 'clue-tx',
      title: 'Транзакция типографии TX-9041-AION',
      category: 'delivery',
      content: 'Оплата печати 1 000 000 экземпляров книги «Чистая Идея». Сумма: 4 800 000 AION-Credits. Трек-номер доставки: TRACK-CORP-88192.',
      source: 'NetSurf DevTools (DOM Meta)',
      foundAt: 'aion-syndicate.io/pure-idea',
      position: { x: 380, y: 160 },
      connections: [],
    });
  };

  const handleInspectServerClue = () => {
    addClue({
      id: 'clue-server',
      title: 'Сервер Genesis-Mainframe',
      category: 'server',
      content: 'Выделенный кластер 192.88.99.14. Работает с 2024 года. Автоматический деплой книг без участия человека.',
      source: 'NetSurf DevTools (Network Logs)',
      foundAt: 'aion-syndicate.io/network',
      position: { x: 220, y: 320 },
      connections: [],
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e17] text-slate-200 overflow-hidden font-sans">
      {/* Browser Bar */}
      <div className="px-3 py-2 bg-[#121624] border-b border-slate-700/50 flex items-center gap-2">
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-[#080b12] border border-slate-700/60 rounded-lg px-3 py-1 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
          <span className="text-cyan-400">https://</span>
          <span className="text-slate-100">aion-syndicate.io</span>
          <span className="text-slate-400">/pure-idea</span>
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
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Hero Banner */}
            <div className="text-center space-y-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ОФИЦИАЛЬНЫЙ РЕЛИЗ AION</span>
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
                  Издатель: СИНДИКАТ AION
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

            {/* Footer metadata hint */}
            <div className="text-center text-xs font-mono text-slate-400 pt-4">
              © 2026 AION Autonomous Publishing Group. All rights reserved.
            </div>
          </div>
        </div>

        {/* Embedded DevTools Drawer */}
        {isDevToolsOpen && (
          <div className="h-64 border-t-2 border-cyan-500/40 bg-[#080b12] flex flex-col font-mono text-xs select-text">
            {/* DevTools Tabs */}
            <div className="h-8 bg-[#101420] border-b border-slate-800 px-3 flex items-center gap-4 text-slate-400">
              <button
                onClick={() => setActiveDevTab('elements')}
                className={`py-1 px-2 border-b-2 font-semibold transition-colors ${
                  activeDevTab === 'elements'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent hover:text-slate-200'
                }`}
              >
                Elements (DOM)
              </button>
              <button
                onClick={() => setActiveDevTab('network')}
                className={`py-1 px-2 border-b-2 font-semibold transition-colors ${
                  activeDevTab === 'network'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent hover:text-slate-200'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setActiveDevTab('console')}
                className={`py-1 px-2 border-b-2 font-semibold transition-colors ${
                  activeDevTab === 'console'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent hover:text-slate-200'
                }`}
              >
                Console
              </button>
            </div>

            {/* DevTools Body */}
            <div className="flex-1 overflow-y-auto p-3 text-slate-300 space-y-1.5 font-mono">
              {activeDevTab === 'elements' && (
                <div className="space-y-1">
                  <div className="text-slate-400">&lt;html lang=&quot;ru&quot;&gt;</div>
                  <div className="pl-4 text-slate-400">&lt;head&gt;</div>
                  <div className="pl-8 text-slate-300">&lt;title&gt;AION: Чистая Идея&lt;/title&gt;</div>
                  
                  {/* Clickable Hidden Clue */}
                  <div
                    onClick={handleInspectClueTx}
                    className={`pl-8 py-1 rounded cursor-pointer transition-all flex items-center justify-between ${
                      hasDiscoveredTx
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-400/50 animate-pulse'
                    }`}
                  >
                    <span>
                      &lt;meta name=&quot;x-aion-tx&quot; content=&quot;TX-9041-AION&quot; courier=&quot;TRACK-CORP-88192&quot; /&gt;
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 mr-2">
                      {hasDiscoveredTx ? '✓ Улика сохранена' : '⚡ Нажмите для сохранения улики'}
                    </span>
                  </div>

                  <div className="pl-4 text-slate-400">&lt;/head&gt;</div>
                  <div className="pl-4 text-slate-400">&lt;body class=&quot;bg-dark text-pure&quot;&gt;...&lt;/body&gt;</div>
                  <div className="text-slate-400">&lt;/html&gt;</div>
                </div>
              )}

              {activeDevTab === 'network' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                    Сетевые шлюзы и кластеры публикации:
                  </div>
                  <div
                    onClick={handleInspectServerClue}
                    className={`p-2 rounded cursor-pointer transition-all flex items-center justify-between ${
                      hasDiscoveredServer
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-400/50'
                    }`}
                  >
                    <div>
                      <span className="text-emerald-400 font-bold">200 OK</span> • POST
                      wss://192.88.99.14/genesis-core
                      <div className="text-[10px] text-slate-400">
                        Сервер-источник AION Genesis Node (Uptime: 742 days)
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60">
                      {hasDiscoveredServer ? '✓ Улика сохранена' : '⚡ Нажмите для сохранения'}
                    </span>
                  </div>
                </div>
              )}

              {activeDevTab === 'console' && (
                <div className="space-y-1 text-slate-400">
                  <div className="text-emerald-400">[info] ServiceWorker registered for background distribution.</div>
                  <div className="text-amber-400">[warn] Genesis prompt weights locked by user @vibe_sloth.</div>
                  <div className="text-slate-400">[debug] Pure Idea resonance wave: 99.8% confirmed.</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
