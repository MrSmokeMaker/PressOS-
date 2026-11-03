'use client';

import React from 'react';
import { Bot, Globe, Mail, Network, Terminal, FileText, FolderGit2 } from 'lucide-react';
import { AppId } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

interface DesktopShortcut {
  id: AppId;
  label: string;
  icon: React.ReactNode;
  color: string;
  badge?: number;
}

export const DesktopShortcuts: React.FC = () => {
  const { openWindow, focusWindow, windows, emails, phase } = useOSStore();
  const { play } = useAudio();

  const unreadMails = emails.filter(
    (e) => !e.read && e.phaseRequired <= (typeof phase === 'number' ? phase : 3)
  ).length;

  const shortcuts: DesktopShortcut[] = [
    {
      id: 'mail',
      label: 'PressMail',
      icon: <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 group-hover:scale-110 transition-transform" />,
      color: 'from-purple-900/40 via-purple-950/20 to-transparent border-purple-500/30',
      badge: unreadMails,
    },
    {
      id: 'netsurf',
      label: 'NetSurf 8.12',
      icon: <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400 group-hover:scale-110 transition-transform" />,
      color: 'from-sky-900/40 via-sky-950/20 to-transparent border-sky-500/30',
    },
    {
      id: 'echo',
      label: 'AETHER-Echo',
      icon: <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 group-hover:scale-110 transition-transform" />,
      color: 'from-cyan-900/40 via-cyan-950/20 to-transparent border-cyan-500/30',
    },
    {
      id: 'nexus',
      label: 'Nexus Board',
      icon: <Network className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 group-hover:scale-110 transition-transform" />,
      color: 'from-amber-900/40 via-amber-950/20 to-transparent border-amber-500/30',
    },
    {
      id: 'terminal',
      label: 'Kernel Shell',
      icon: <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 group-hover:scale-110 transition-transform" />,
      color: 'from-emerald-900/40 via-emerald-950/20 to-transparent border-emerald-500/30',
    },
  ];

  const handleOpen = (id: AppId) => {
    play('click');
    const win = windows[id];
    if (!win.isOpen) {
      openWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="absolute top-16 left-4 sm:left-6 z-0 flex flex-col gap-3 sm:gap-4 select-none max-w-[80px] sm:max-w-[90px]">
      {shortcuts.map((sc) => (
        <button
          key={sc.id}
          onDoubleClick={() => handleOpen(sc.id)}
          onClick={() => handleOpen(sc.id)}
          className="group relative flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-all cursor-pointer focus:outline-none"
        >
          {/* Cyberpunk Holographic Icon Backplate */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b ${sc.color} border flex items-center justify-center shadow-lg backdrop-blur-md group-hover:shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all`}
          >
            {sc.icon}
          </div>

          {/* Badge count */}
          {sc.badge && sc.badge > 0 ? (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white flex items-center justify-center animate-bounce shadow-md">
              {sc.badge}
            </span>
          ) : null}

          {/* Label */}
          <span className="mt-1 text-[10px] sm:text-[11px] font-mono text-slate-200 text-center font-medium tracking-tight drop-shadow-md truncate max-w-[76px] sm:max-w-[86px] group-hover:text-cyan-300 transition-colors">
            {sc.label}
          </span>
        </button>
      ))}
    </div>
  );
};
