'use client';

import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';
import { StoryPhase } from '@/types/os';

interface PhaseInterludeProps {
  phase: StoryPhase;
  visible: boolean;
  onDismiss: () => void;
}

export const PhaseInterlude: React.FC<PhaseInterludeProps> = ({ phase, visible, onDismiss }) => {
  if (!visible) return null;

  const getInterludeData = () => {
    switch (phase) {
      case 2:
        return {
          tag: 'INTERCEPT // СЕКЦИЯ 4',
          title: 'ФАЗА 2: АРХИВЫ СУБСТРАТА AETHER',
          desc: 'След транзакции типографии вывел на старый репозиторий Genesis 2024 года. В сети зафиксированы следы разработчиков @vibe_sloth и Майи Лин.',
          color: 'text-amber-400 border-amber-500/50 bg-amber-950/90',
        };
      case 3:
        return {
          tag: 'ALERT 99-B // СИСТЕМНАЯ БЛОКИРОВКА',
          title: 'ФАЗА 3: ЦИФРОВАЯ ИЗОЛЯЦИЯ РЭБ',
          desc: 'Спецслужбы перехватили шлюз рабочей станции PressOS. Сетевые порты закрываются. Доступен лишь защищенный Shell (tty1).',
          color: 'text-rose-400 border-rose-500/50 bg-rose-950/90',
        };
      default:
        return null;
    }
  };

  const data = getInterludeData();
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fadeIn">
      <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none" />
      <div className={`relative max-w-lg w-full p-6 rounded-2xl border ${data.color} shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-4 font-mono`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>{data.tag}</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">{data.title}</h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.desc}</p>
        <div className="pt-2 flex justify-end">
          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white border border-white/20 transition-all cursor-pointer font-bold"
          >
            ПРОДОЛЖИТЬ РАССЛЕДОВАНИЕ →
          </button>
        </div>
      </div>
    </div>
  );
};
