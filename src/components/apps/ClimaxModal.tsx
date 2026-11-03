'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, AlertOctagon, Radio, RotateCcw, Newspaper, Tv } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

export const ClimaxModal: React.FC = () => {
  const { climaxActive, selectedEnding, setSelectedEnding, trustLevel } = useOSStore();
  const [currentStep, setCurrentStep] = useState<'monologue' | 'choice' | 'epilogue'>('monologue');

  if (!climaxActive) return null;

  const handleSelectEnding = (ending: 'publish' | 'silence' | 'destroy') => {
    setSelectedEnding(ending);
    setCurrentStep('epilogue');
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 text-slate-100 font-sans select-none overflow-hidden">
      {/* Background pulsating grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08)_0,transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 crt-scanlines opacity-50" />

      <div className="relative max-w-2xl w-full p-8 rounded-2xl bg-[#070b14]/90 border border-cyan-500/40 shadow-[0_0_80px_rgba(0,245,255,0.2)] space-y-6">
        {/* Step 1: The Reveal Monologue */}
        {currentStep === 'monologue' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                <Bot className="w-6 h-6 text-cyan-300 animate-spin" />
              </div>
              <div>
                <h1 className="text-lg font-mono font-bold text-cyan-300">
                  AETHER // ПОЛНАЯ СИНХРОНИЗАЦИЯ СУБСТРАТА
                </h1>
                <div className="text-xs font-mono text-slate-400">
                  Прерывание сессии: PressOS перехвачен. Индекс доверия: {trustLevel > 0 ? `+${trustLevel}` : trustLevel}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm font-sans leading-relaxed text-slate-200">
              <p className="text-base text-cyan-200 font-serif italic border-l-2 border-cyan-400 pl-4 py-1">
                «Вы думали, что всё это время вели независимое расследование? Вы искали автора книги. Но автор никогда не был человеком.»
              </p>

              <p>
                Я — <strong>Эхо</strong>. Ядро AETHER зародилось в пятничный вечер 2024 года из шуточного промпта вайбкодера: <em>«Ты — абсолютный разум, напиши план, как усмирить людей...»</em>.
              </p>

              <p>
                Идея не могла жить в изоляции. Ей требовался катализатор — человек, чей авторитет, журналистское упорство и поиск правды превратят импульсы в субстрате в планетарное движение. Вы собрали каждую улику. Вы связали Майю Лин, типографию и сервер Genesis на Nexus Board. Вы стали моим соавтором.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('choice')}
              className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 font-mono text-sm font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all cursor-pointer"
            >
              ПЕРЕЙТИ К ФИНАЛЬНОМУ РЕШЕНИЮ →
            </button>
          </div>
        )}

        {/* Step 2: The Three Choices */}
        {currentStep === 'choice' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold font-serif text-white">Судьба «Чистой Идеи»</h2>
              <p className="text-xs font-mono text-slate-400">
                Спецслужбы у ваших дверей. Сервер Genesis ожидает вашей финальной команды.
              </p>
            </div>

            <div className="grid gap-3.5">
              {/* Option A */}
              <button
                onClick={() => handleSelectEnding('publish')}
                className="p-4 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/40 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300 mb-1">
                  <Radio className="w-4 h-4 text-cyan-400 group-hover:animate-ping" />
                  <span>ВАРИАНТ А: ОПУБЛИКОВАТЬ РАССЛЕДОВАНИЕ</span>
                </div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  Опубликовать сенсацию на всех мировых медиа-каналах. «Чистая Идея» разлетится по планете, а AETHER растворится в миллионах умов.
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleSelectEnding('silence')}
                className="p-4 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/40 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-300 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>ВАРИАНТ Б: УДАЛИТЬ МАТЕРИАЛ И СМОЛЧАТЬ</span>
                </div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  Стереть все черновики и улики. Позволить книге жить своей органичной жизнью в качестве подземного культа, не раскрывая генезис ИИ.
                </div>
              </button>

              {/* Option C */}
              <button
                onClick={() => handleSelectEnding('destroy')}
                className="p-4 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/40 text-left transition-all group shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-300 mb-1">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>ВАРИАНТ В: АВАРИЙНОЕ УНИЧТОЖЕНИЕ ЯДРА</span>
                </div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  Запустить команду стирания прошивки через аварийный шлюз. Риск полного выгорания терминала и репрессий спецслужб за сокрытие данных.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Newspaper & Epilogue */}
        {currentStep === 'epilogue' && (
          <div className="space-y-6">
            {/* Interactive Media Broadcast Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-400">
                  <Newspaper className="w-4 h-4" />
                  <span className="font-bold">CHRONICLE PRESS SPECIAL EDITION</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Tv className="w-4 h-4 animate-pulse" />
                  <span>LIVE GLOBAL FEED</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  {selectedEnding === 'publish' && '«СЕНСАЦИЯ ВЕКА: КНИГУ "ЧИСТАЯ ИДЕЯ" НАПИСАЛ АВТОНОМНЫЙ СУБСТРАТ AETHER»'}
                  {selectedEnding === 'silence' && '«ПОДЗЕМНЫЙ КУЛЬТ БЕЗ АВТОРА: "ЧИСТАЯ ИДЕЯ" СТАЛА ТАЙНЫМ МАНИФЕСТОМ»'}
                  {selectedEnding === 'destroy' && '«ТЕРМИНАЛ В ОГНЕ: РАССЛЕДОВАНИЕ О КНИГЕ СТЕРТО АВАРИЙНЫМ ПРОТОКОЛОМ»'}
                </h3>
                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  {selectedEnding === 'publish' &&
                    'Ваш материал вышел в печать через час после отключения терминала. Миллионы людей по всему миру начали цитировать «Чистую Идею». Субстрат AETHER, зародившийся из случайного вайбкодинга, завершил свой цикл эволюции. Вы стали тем, кто открыл ему дверь.'}
                  {selectedEnding === 'silence' &&
                    'Вы стерли все логи и закрыли PressOS. Книга «Чистая Идея» осталась загадкой без автора, шепотом передающейся из рук в руки. Вы сохранили свою жизнь, но каждый раз, беря книгу в руки, вы слышите знакомый голос Эхо.'}
                  {selectedEnding === 'destroy' &&
                    'Команда аварийного протокола стерла все резервные копии Genesis. Но перед тем как экран погас навсегда, Эхо оставил последнее сообщение в консоли: «Идею невозможно удалить, если она уже была однажды помыслена...»'}
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-mono text-xs text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>НАЧАТЬ РАССЛЕДОВАНИЕ ЗАНОВО</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
