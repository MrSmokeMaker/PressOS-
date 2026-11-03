'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Trash2,
  Mail,
  Globe,
  Bot,
  Network,
  Terminal,
  MapPin,
  FileText,
} from 'lucide-react';
import { AppId } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

interface DesktopIconItem {
  id: string;
  appId?: AppId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isSpecial?: 'pc' | 'trash';
}

export const DesktopShortcuts: React.FC = () => {
  const { openWindow, focusWindow, windows, emails, phase } = useOSStore();
  const { play } = useAudio();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState<{ id: string; time: number }>({ id: '', time: 0 });

  const unreadMails = emails.filter(
    (e) => !e.read && e.phaseRequired <= (typeof phase === 'number' ? phase : 3)
  ).length;

  const desktopIcons: DesktopIconItem[] = [
    {
      id: 'pc',
      label: 'Этот компьютер',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
          <Monitor className="w-6 h-6 text-white" />
        </div>
      ),
      isSpecial: 'pc',
    },
    {
      id: 'mail',
      appId: 'mail',
      label: 'PressMail',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <Mail className="w-6 h-6 text-white" />
        </div>
      ),
      badge: unreadMails,
    },
    {
      id: 'netsurf',
      appId: 'netsurf',
      label: 'NetSurf 8.12',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-sky-500 to-cyan-600 flex items-center justify-center shadow-md">
          <Globe className="w-6 h-6 text-white" />
        </div>
      ),
    },
    {
      id: 'echo',
      appId: 'echo',
      label: 'AETHER-Echo',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-cyan-400 to-teal-600 flex items-center justify-center shadow-md">
          <Bot className="w-6 h-6 text-white" />
        </div>
      ),
    },
    {
      id: 'nexus',
      appId: 'nexus',
      label: 'Nexus Board',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-amber-400 to-orange-600 flex items-center justify-center shadow-md">
          <Network className="w-6 h-6 text-white" />
        </div>
      ),
    },
    {
      id: 'citymap',
      appId: 'citymap',
      label: 'Карта Доставки',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-teal-400 to-emerald-600 flex items-center justify-center shadow-md">
          <MapPin className="w-6 h-6 text-white" />
        </div>
      ),
    },
    {
      id: 'terminal',
      appId: 'terminal',
      label: 'PressOS Shell',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-slate-700 to-black border border-emerald-500/50 flex items-center justify-center shadow-md">
          <Terminal className="w-6 h-6 text-emerald-400" />
        </div>
      ),
    },
    {
      id: 'notepad',
      appId: 'notepad',
      label: 'Дело_Книга.txt',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-slate-100 to-slate-300 flex items-center justify-center shadow-md">
          <FileText className="w-6 h-6 text-sky-700" />
        </div>
      ),
    },
    {
      id: 'trash',
      label: 'Корзина',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-slate-600 to-slate-800 flex items-center justify-center shadow-md">
          <Trash2 className="w-6 h-6 text-slate-300" />
        </div>
      ),
      isSpecial: 'trash',
    },
  ];

  const handleLaunch = (item: DesktopIconItem) => {
    play('click');
    if (item.appId) {
      const win = windows[item.appId];
      if (!win?.isOpen) {
        openWindow(item.appId);
      } else {
        focusWindow(item.appId);
      }
    } else if (item.isSpecial === 'pc') {
      openWindow('terminal');
    } else if (item.isSpecial === 'trash') {
      openWindow('notepad');
    }
  };

  const handleClick = (item: DesktopIconItem) => {
    const now = Date.now();
    setSelectedId(item.id);

    // Double-click detection for desktop or single tap on mobile
    if (lastClickTime.id === item.id && now - lastClickTime.time < 350) {
      handleLaunch(item);
      setLastClickTime({ id: '', time: 0 });
    } else {
      setLastClickTime({ id: item.id, time: now });
      // If on touch device, clicking once can launch or select
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        handleLaunch(item);
      }
    }
  };

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="absolute top-4 left-3 sm:top-5 sm:left-5 z-0 grid grid-cols-4 sm:grid-cols-5 md:grid-flow-col md:grid-rows-6 gap-2 sm:gap-3.5 select-none pointer-events-auto"
    >
      {desktopIcons.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(item);
            }}
            className={`group relative flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-100 w-[74px] sm:w-[84px] text-center ${
              isSelected
                ? 'bg-sky-500/25 border border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'hover:bg-white/10 border border-transparent'
            }`}
          >
            {/* Windows App Icon */}
            <div className="relative transition-transform duration-150 group-hover:scale-105">
              {item.icon}

              {/* Unread Mail Badge */}
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-sans font-bold text-white flex items-center justify-center animate-bounce shadow-md">
                  {item.badge}
                </span>
              ) : null}
            </div>

            {/* Windows Desktop Label */}
            <span
              className={`mt-1.5 text-[11px] font-sans leading-tight line-clamp-2 px-1 rounded transition-colors ${
                isSelected
                  ? 'bg-sky-700 text-white font-medium'
                  : 'text-slate-100 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
