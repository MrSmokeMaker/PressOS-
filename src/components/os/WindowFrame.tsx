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

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: win.position.x,
    initY: win.position.y,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    focusWindow(win.id);
  };

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized) return;
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
    if (!isDragging) return;
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

  // App-specific styling classes for unique visual language
  const getAppStyle = (id: AppId) => {
    switch (id) {
      case 'echo':
        return 'border-cyan-500/40 shadow-[0_0_30px_rgba(0,245,255,0.12)] bg-[#0c1220]/95';
      case 'netsurf':
        return 'border-slate-700/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] bg-[#0f172a]/95';
      case 'nexus':
        return 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.08)] bg-[#121217]/95';
      case 'terminal':
        return 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] bg-[#051109]/95';
      case 'mail':
        return 'border-rose-900/40 shadow-[0_0_30px_rgba(244,63,94,0.1)] bg-[#130f1a]/95';
      default:
        return 'border-slate-800 bg-[#0b0f19]/90';
    }
  };

  const isMax = win.isMaximized;

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        zIndex: win.zIndex,
        transform: isMax ? 'none' : `translate(${win.position.x}px, ${win.position.y}px)`,
        width: isMax ? '100vw' : `${win.size.width}px`,
        height: isMax ? 'calc(100vh - 48px)' : `${win.size.height}px`,
        top: isMax ? 0 : 0,
        left: isMax ? 0 : 0,
      }}
      className={`fixed flex flex-col rounded-xl overflow-hidden backdrop-blur-xl border transition-shadow duration-200 select-none ${getAppStyle(
        win.id
      )}`}
    >
      {/* Titlebar */}
      <div
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="h-10 px-3 bg-black/40 border-b border-white/5 flex items-center justify-between cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wide text-slate-300">
            {win.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
            title="Свернуть"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleMaximizeWindow(win.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
            title="Развернуть"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
            title="Закрыть"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>
    </div>
  );
};
