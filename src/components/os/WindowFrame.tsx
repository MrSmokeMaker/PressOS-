'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { AppId, WindowState } from '@/types/os';
import { useOSStore } from '@/store/useOSStore';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updateWindowPosition,
  } = useOSStore();

  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: win.position.x,
    initY: win.position.y,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePointerDown = () => {
    focusWindow(win.id);
  };

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized || isMobile) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: win.position.x,
      initY: win.position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isMobile) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.initX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.initY + deltaY));
    updateWindowPosition(win.id, { x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // App-specific styling classes
  const getAppStyle = (id: AppId) => {
    switch (id) {
      case 'echo':
        return 'border-cyan-500/40 shadow-[0_12px_45px_rgba(0,245,255,0.18)] bg-[#091122]/95 backdrop-blur-2xl';
      case 'netsurf':
        return 'border-sky-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] bg-[#0b101e]/95 backdrop-blur-2xl';
      case 'nexus':
        return 'border-amber-500/40 shadow-[0_12px_45px_rgba(245,158,11,0.15)] bg-[#10131d]/95 backdrop-blur-2xl';
      case 'terminal':
        return 'border-emerald-500/50 shadow-[0_12px_45px_rgba(16,185,129,0.2)] bg-[#040d07]/95 backdrop-blur-2xl';
      case 'mail':
        return 'border-purple-500/40 shadow-[0_12px_45px_rgba(168,85,247,0.15)] bg-[#100d1c]/95 backdrop-blur-2xl';
      default:
        return 'border-slate-700/60 shadow-2xl bg-[#0b0f19]/95 backdrop-blur-2xl';
    }
  };

  const getHeaderAccent = (id: AppId) => {
    switch (id) {
      case 'echo':
        return 'from-cyan-950/60 to-transparent border-cyan-500/30 text-cyan-300';
      case 'netsurf':
        return 'from-sky-950/60 to-transparent border-sky-500/30 text-sky-300';
      case 'nexus':
        return 'from-amber-950/60 to-transparent border-amber-500/30 text-amber-300';
      case 'terminal':
        return 'from-emerald-950/60 to-transparent border-emerald-500/30 text-emerald-300';
      case 'mail':
        return 'from-purple-950/60 to-transparent border-purple-500/30 text-purple-300';
      default:
        return 'from-slate-900 to-transparent border-slate-700/40 text-slate-300';
    }
  };

  // Mobile layout styles: take 100% width and fit above taskbar
  const mobileStyles: React.CSSProperties = {
    zIndex: win.zIndex,
    left: 0,
    top: 0,
    width: '100vw',
    height: 'calc(100vh - 56px)',
    position: 'absolute',
    borderRadius: 0,
  };

  const desktopStyles: React.CSSProperties = {
    zIndex: win.zIndex,
    left: win.isMaximized ? 0 : win.position.x,
    top: win.isMaximized ? 0 : win.position.y,
    width: win.isMaximized ? '100vw' : win.size.width,
    height: win.isMaximized ? 'calc(100vh - 48px)' : win.size.height,
    position: 'absolute',
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={isMobile ? mobileStyles : desktopStyles}
      className={`border flex flex-col overflow-hidden transition-shadow duration-300 ${
        isMobile ? 'rounded-none border-b-0' : 'rounded-2xl'
      } ${getAppStyle(win.id)}`}
    >
      {/* Titlebar Header */}
      <div
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`h-9 bg-gradient-to-r ${getHeaderAccent(
          win.id
        )} border-b px-3 flex items-center justify-between select-none ${
          isMobile ? '' : 'cursor-move'
        } shrink-0`}
      >
        {/* Left: Window Title and Cyber Indicator */}
        <div className="flex items-center gap-2 truncate pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-wider truncate">
            {win.title}
          </span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Свернуть"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {!isMobile && (
            <button
              onClick={() => toggleMaximizeWindow(win.id)}
              className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Развернуть"
            >
              <Square className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => closeWindow(win.id)}
            className="w-6 h-6 rounded-md hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0 w-full">{children}</div>
    </div>
  );
};
