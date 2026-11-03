'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Mail,
  Bot,
  Network,
  Terminal,
  MapPin,
  FileText,
  Volume2,
  VolumeX,
  RotateCcw,
  Activity,
  Wifi,
  ShieldAlert,
  Search,
  User,
  Power,
  Layers,
} from 'lucide-react';
import { AppId } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

export const Taskbar: React.FC = () => {
  const {
    windows,
    toggleWindow,
    openWindow,
    focusWindow,
    minimizeWindow,
    phase,
    pressureLevel,
    isIsolated,
    emails,
    resetGame,
  } = useOSStore();

  const [time, setTime] = useState<string>('12:00');
  const [dateStr, setDateStr] = useState<string>('03.11.2026');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { play, mute, toggleMute } = useAudio();
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        setIsStartOpen(false);
      }
    };
    if (isStartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartOpen]);

  const unreadMails = emails.filter(
    (e) => !e.read && e.phaseRequired <= (typeof phase === 'number' ? phase : 3)
  ).length;

  const allApps: { id: AppId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'mail',
      label: 'PressMail',
      icon: <Mail className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'netsurf',
      label: 'NetSurf 8.12',
      icon: <Globe className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'echo',
      label: 'AETHER-Echo',
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'nexus',
      label: 'Nexus Board',
      icon: <Network className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'citymap',
      label: 'Карта Доставки',
      icon: <MapPin className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'terminal',
      label: 'Терминал (tty1)',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'notepad',
      label: 'Блокнот',
      icon: <FileText className="w-4 h-4 text-sky-300" />,
    },
  ];

  const handleAppClick = (id: AppId) => {
    play('click');
    toggleWindow(id);
  };

  const handleLaunchFromStart = (id: AppId) => {
    play('click');
    const win = windows[id];
    if (!win?.isOpen) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
    setIsStartOpen(false);
  };

  const handleReset = () => {
    play('click');
    resetGame();
    setShowResetConfirm(false);
    setIsStartOpen(false);
  };

  // Show desktop: minimize all open windows
  const handleShowDesktop = () => {
    play('click');
    const openWins = Object.values(windows).filter((w) => w.isOpen && !w.isMinimized);
    if (openWins.length > 0) {
      openWins.forEach((w) => minimizeWindow(w.id));
    } else {
      Object.values(windows)
        .filter((w) => w.isOpen)
        .forEach((w) => focusWindow(w.id));
    }
  };

  const filteredApps = allApps.filter((a) =>
    a.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Windows 11 / 10 Start Menu */}
      {isStartOpen && (
        <div
          ref={startMenuRef}
          className="fixed bottom-14 left-2 sm:left-4 z-[90] w-[95vw] sm:w-[460px] max-w-[460px] bg-[#1a1f2c]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Start Menu Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск приложений, файлов, улик..."
                className="w-full bg-[#12151e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Pinned Apps Grid */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[340px] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
              <span>Закрепленные приложения</span>
              <span className="text-[11px] font-normal text-slate-400">PressOS Suite</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunchFromStart(app.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-sky-400/50 transition-all shadow-sm">
                    {app.icon}
                  </div>
                  <span className="mt-2 text-xs text-slate-200 group-hover:text-white line-clamp-1 font-medium">
                    {app.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Recommended Dossier Items */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 px-1">Рекомендуемые материалы</div>

              <div
                onClick={() => handleLaunchFromStart('notepad')}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-xs text-slate-200 truncate font-medium">Дело_Чистая_Идея.txt</div>
                  <div className="text-[10px] text-slate-400">Инструкция журналиста // 2 мин назад</div>
                </div>
              </div>

              <div
                onClick={() => handleLaunchFromStart('mail')}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-xs text-slate-200 truncate font-medium">Входящее от Марка: Новая книга</div>
                  <div className="text-[10px] text-slate-400">Почта редакции Chronicle Press</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Account & Power Bottom Bar */}
          <div className="p-3 bg-[#131722] border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Журналист</div>
                <div className="text-[10px] text-slate-400">Chronicle Press • Фаза {phase}</div>
              </div>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
              title="Перезагрузить систему / Сбросить расследование"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Windows 11 Taskbar */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-[#0d111a]/95 backdrop-blur-2xl border-t border-white/10 px-2 sm:px-3 flex items-center justify-between z-50 select-none safe-area-bottom">
        {/* Left Section: Windows "Пуск" Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              play('click');
              setIsStartOpen(!isStartOpen);
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              isStartOpen
                ? 'bg-sky-500/30 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'hover:bg-white/10 text-slate-200'
            }`}
            title="Пуск (Меню приложений)"
          >
            {/* Windows 4-Square Logo */}
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <span className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
            </div>
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">Пуск</span>
          </button>
        </div>

        {/* Center / Running Apps Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full py-1">
          {allApps.map((app) => {
            const win = windows[app.id];
            const isOpen = win?.isOpen;
            const isActive = isOpen && !win?.isMinimized;
            const isMail = app.id === 'mail';

            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`relative group flex items-center gap-2 h-9 px-2 sm:px-3 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : isOpen
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
                title={app.label}
              >
                <div className="group-hover:scale-105 transition-transform">{app.icon}</div>

                <span className="text-xs font-medium truncate max-w-[100px] hidden md:inline">
                  {app.label}
                </span>

                {/* Mail unread badge */}
                {isMail && unreadMails > 0 && (
                  <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-sans font-bold flex items-center justify-center shadow-md">
                    {unreadMails}
                  </span>
                )}

                {/* Windows 11 Active App Underline Indicator */}
                {isOpen && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all ${
                      isActive ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-slate-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section: Windows System Tray & Clock */}
        <div className="flex items-center gap-1 sm:gap-2 text-slate-300 font-sans text-xs shrink-0">
          {/* Pressure / Threat meter */}
          <div
            className={`hidden xs:flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border ${
              pressureLevel >= 70
                ? 'text-rose-400 border-rose-500/50 bg-rose-950/60 animate-pulse'
                : pressureLevel >= 40
                ? 'text-amber-400 border-amber-500/40 bg-amber-950/40'
                : 'text-sky-400 border-sky-500/30 bg-sky-950/30'
            }`}
            title="Давление спецслужб"
          >
            <Activity className="w-3 h-3" />
            <span>{pressureLevel}%</span>
          </div>

          {/* Network State */}
          <div
            className="p-1.5 rounded hover:bg-white/10 cursor-pointer text-slate-300"
            title={isIsolated ? 'Сеть: ИЗОЛЯЦИЯ (Директива 99-B)' : 'Сеть: Подключено'}
          >
            {isIsolated ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
            )}
          </div>

          {/* Audio Volume */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded hover:bg-white/10 cursor-pointer ${
              mute ? 'text-rose-400' : 'text-slate-300'
            }`}
            title={mute ? 'Включить звук' : 'Выключить звук'}
          >
            {mute ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Windows Clock & Date Stack */}
          <div className="flex flex-col items-end px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer text-right leading-none">
            <span className="text-xs font-medium text-slate-200">{time}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{dateStr}</span>
          </div>

          {/* Windows "Show Desktop" line button at the far edge */}
          <div
            onClick={handleShowDesktop}
            className="w-1.5 h-7 border-l border-white/20 hover:bg-white/30 cursor-pointer ml-1 transition-colors"
            title="Свернуть все окна"
          />
        </div>
      </footer>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#181c26] border border-rose-500/50 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.3)] font-sans">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-rose-400">СБРОСИТЬ РАССЛЕДОВАНИЕ?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Все собранные улики и связи будут удалены. Вы вернетесь на Фазу 1.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
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
    </>
  );
};
