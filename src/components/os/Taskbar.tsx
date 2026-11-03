'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Globe, Mail, Network, Terminal, Cpu, Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';
import { AppId } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

export const Taskbar: React.FC = () => {
  const { windows, toggleWindow, phase, pressureLevel, emails, resetGame } = useOSStore();
  const [time, setTime] = useState<string>('10:00:00');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { play, mute, toggleMute } = useAudio();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadMails = emails.filter((e) => !e.read && e.phaseRequired <= (typeof phase === 'number' ? phase : 3)).length;

  const appButtons: { id: AppId; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'netsurf',
      label: 'NetSurf',
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-sky-400 group-hover:text-sky-300',
    },
    {
      id: 'echo',
      label: 'AETHER-Echo',
      icon: <Bot className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-cyan-400 group-hover:text-cyan-300',
    },
    {
      id: 'nexus',
      label: 'Nexus',
      icon: <Network className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-amber-400 group-hover:text-amber-300',
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-purple-400 group-hover:text-purple-300',
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-emerald-400 group-hover:text-emerald-300',
    },
  ];

  const handleAppClick = (id: AppId) => {
    play('click');
    toggleWindow(id);
  };

  const handleReset = () => {
    play('click');
    resetGame();
    setShowResetConfirm(false);
  };

  const getPressureColor = () => {
    if (pressureLevel >= 70) return 'text-rose-400 border-rose-500/50 bg-rose-950/60 animate-pulse';
    if (pressureLevel >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30';
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-14 bg-[#090d16]/95 backdrop-blur-2xl border-t border-cyan-500/20 px-2 sm:px-4 flex items-center justify-between z-50 select-none safe-area-bottom">
      {/* OS Brand (Hidden on extra small screens) */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-cyan-300">PressOS</span>
        </div>
      </div>

      {/* Dock App Launchers */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center sm:justify-start">
        {appButtons.map((app) => {
          const win = windows[app.id];
          const isActive = win?.isOpen && !win?.isMinimized;
          const isMail = app.id === 'mail';

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={`relative group p-2 sm:p-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/25 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                  : win?.isOpen
                  ? 'bg-white/10 border border-white/15'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              title={app.label}
            >
              <div className={`${app.color} transition-transform group-hover:scale-105`}>
                {app.icon}
              </div>

              {/* Unread Mail Badge */}
              {isMail && unreadMails > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-mono flex items-center justify-center animate-bounce shadow-md">
                  {unreadMails}
                </span>
              )}

              {/* Active Indicator pip */}
              {win?.isOpen && (
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-cyan-400 shadow-[0_0_8px_#00f5ff]' : 'bg-slate-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Indicators & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs text-slate-400 shrink-0">
        {/* Pressure Indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] ${getPressureColor()}`}
          title="Уровень давления спецслужб"
        >
          <Activity className="w-3 h-3" />
          <span className="font-bold">{pressureLevel}%</span>
        </div>

        {/* Audio Mute Button */}
        <button
          onClick={toggleMute}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            mute
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40'
          }`}
          title={mute ? 'Включить звук' : 'Выключить звук'}
        >
          {mute ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Game Flow Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="p-1.5 rounded-lg border border-slate-700/60 bg-black/40 hover:bg-rose-950/40 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
          title="Сбросить игру"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Clock */}
        <div className="hidden md:block bg-black/40 px-2.5 py-1 rounded border border-white/5 text-slate-300 font-mono text-[11px]">
          {time}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-rose-500/50 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.3)] font-sans">
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold text-rose-400">СБРОСИТЬ РАССЛЕДОВАНИЕ?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Все собранные улики и связи будут удалены. Вы вернетесь на Фазу 1.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
