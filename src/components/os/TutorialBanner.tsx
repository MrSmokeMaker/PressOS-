'use client';

import React from 'react';
import { Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

export const TutorialBanner: React.FC = () => {
  const { tutorialStep, openWindow } = useOSStore();

  const getStepInfo = () => {
    switch (tutorialStep) {
      case 'read_mail':
        return {
          title: 'ЗАДАНИЕ 1: ВХОДЯЩАЯ ДЕПЕША',
          desc: 'Откройте PressMail и ознакомьтесь с экстренным письмом редактора о книге «Чистая Идея».',
          appId: 'mail' as const,
          actionText: 'Открыть почту',
        };
      case 'inspect_site':
        return {
          title: 'ЗАДАНИЕ 2: ЦИФРОВОЙ СЛЕД',
          desc: 'Перейдите в NetSurf (aether-syndicate.io) и откройте DevTools для поиска метаданных печати.',
          appId: 'netsurf' as const,
          actionText: 'Открыть браузер',
        };
      case 'connect_nexus':
        return {
          title: 'ЗАДАНИЕ 3: КОРРЕЛЯЦИЯ УЛИК',
          desc: 'Откройте Nexus Board и соедините нитью найденную транзакцию с кластером Genesis.',
          appId: 'nexus' as const,
          actionText: 'Открыть доску',
        };
      case 'terminal_hack':
        return {
          title: 'ЗАДАНИЕ 4: СИСТЕМНЫЙ ПРОРЫВ',
          desc: 'Спецслужбы глушат сеть! Откройте Terminal и выполните команду decrypt-core.',
          appId: 'terminal' as const,
          actionText: 'Открыть терминал',
        };
      default:
        return null;
    }
  };

  const info = getStepInfo();
  if (!info) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto px-4 py-2.5 rounded-2xl bg-[#090d18]/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,245,255,0.15)] flex items-center justify-between gap-3 text-xs font-mono select-none">
      <div className="flex items-center gap-2.5 truncate">
        <Target className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
        <div className="truncate">
          <div className="font-bold text-cyan-300 text-[11px] tracking-wide">{info.title}</div>
          <div className="text-[10px] text-slate-300 truncate font-sans max-w-[280px] sm:max-w-md">
            {info.desc}
          </div>
        </div>
      </div>

      <button
        onClick={() => openWindow(info.appId)}
        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-[11px] font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer"
      >
        <span>{info.actionText}</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
