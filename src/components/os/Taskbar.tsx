'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Globe, Mail, Network, Terminal, ShieldAlert, Cpu, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { AppId } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

export const Taskbar: React.FC = () => {
  const { windows, openWindow, focusWindow, phase, isIsolated, emails, resetGame } = useOSStore();
  const [time, setTime] = useState<string>('10:00:00');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { play, mute, toggleMute } = useAudio();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
      icon: <Globe className="w-5 h-5" />,
      color: 'text-sky-400 group-hover:text-sky-300',
    },
    {
      id: 'echo',
      label: 'AION-Assist',
      icon: <Bot className="w-5 h-5" />,
      color: 'text-cyan-400 group-hover:text-cyan-300',
    },
    {
      id: 'nexus',
      label: 'Nexus Board',
      icon: <Network className="w-5 h-5" />,
      color: 'text-amber-400 group-hover:text-amber-300',
    },
    {
      id: 'mail',
      label: 'PressMail',
      icon: <Mail className="w-5 h-5" />,
      color: 'text-purple-400 group-hover:text-purple-300',
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-5 h-5" />,
      color: 'text-emerald-400 group-hover:text-emerald-300',
    },
  ];

  const handleAppClick = (id: AppId) => {
    play('click');
    const win = windows[id];
    if (!win.isOpen) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const handleReset = () => {
    play('click');
    resetGame();
    setShowResetConfirm(false);
  };

  const getPhaseName = () => {
    if (phase === 1) return 'Фаза 1: Расследование следов AION';
    if (phase === 2) return 'Фаза 2: Поиск Вайбкодера';
    if (phase === 3) return 'Фаза 3: Цифровая изоляция';
    return 'Кульминация: Чистая Идея';
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-[#090d16]/90 backdrop-blur-2xl border-t border-cyan-500/20 px-4 flex items-center justify-between z-50 select-none">
      {/* OS Brand & Story Phase */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300">PressOS 2.4</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1 rounded border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{getPhaseName()}</span>
        </div>

        {isIsolated && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ИЗОЛЯЦИЯ СЕТИ</span>
          </div>
        )}
      </div>

      {/* Dock with application shortcuts */}
      <div className="flex items-center gap-2">
        {appButtons.map((app) => {
          const win = windows[app.id];
          const isActive = win.isOpen && !win.isMinimized;

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={`relative group px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white/10 shadow-[0_0_15px_rgba(0,245,255,0.15)] border border-white/15'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              title={app.label}
            >
              <div className={`${app.color} transition-transform group-hover:scale-110`}>{app.icon}</div>
              <span className="hidden lg:inline text-xs font-mono text-slate-300">{app.label}</span>

              {/* Running LED */}
              {win.isOpen && (
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full ${
                    isActive ? 'bg-cyan-400 shadow-[0_0_8px_#00f5ff]' : 'bg-slate-500'
                  }`}
                />
              )}

              {/* Unread badge for mail */}
              {app.id === 'mail' && unreadMails > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadMails}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Tray, Controls & Clock */}
      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
        {/* Mute Audio Toggle */}
        <button
          onClick={() => {
            toggleMute();
            play('click');
          }}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            mute
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
              : 'bg-black/40 border-white/10 text-cyan-400 hover:border-cyan-500/40'
          }`}
          title={mute ? 'Включить звук' : 'Выключить звук (Mute)'}
        >
          {mute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset Game Button */}
        <div className="relative">
          <button
            onClick={() => setShowResetConfirm(!showResetConfirm)}
            className="p-1.5 rounded bg-black/40 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title="Перезагрузить систему (Сброс расследования)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {showResetConfirm && (
            <div className="absolute bottom-10 right-0 bg-[#0d1322] border border-amber-500/40 rounded-lg p-2.5 shadow-2xl flex flex-col gap-2 z-50 min-w-[200px]">
              <span className="text-[11px] text-amber-300 font-sans">Сбросить расследование?</span>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-1 px-2 rounded bg-rose-600/80 hover:bg-rose-600 text-[11px] text-white font-bold transition-colors cursor-pointer"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-1 px-2 rounded bg-white/10 hover:bg-white/20 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/5">
          <span className="text-[10px] text-slate-500">NODE:</span>
          <span className="text-cyan-400">#NY-AVALON-7</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold tracking-widest">
          {time}
        </div>
      </div>
    </footer>
  );
};
