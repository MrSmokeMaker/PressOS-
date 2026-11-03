'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { ClueItem } from '@/types/os';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Network, GitBranch, Server, FileText, Link2, Shield } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const CARD_POSITIONS: Record<string, { x: number; y: number }> = {
  'clue-prompt': { x: 40, y: 80 },
  'clue-server': { x: 300, y: 180 },
  'clue-tx': { x: 560, y: 80 },
  'clue-audio-glitch': { x: 560, y: 280 },
  'clue-git-blame': { x: 40, y: 280 },
  'clue-defense-blacklist': { x: 300, y: 380 },
  'clue-core': { x: 300, y: 20 },
};

// Custom drag layer for preview
const DragPreview = () => {
  const { isDragging, item, clientOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem() as { id: string } | null,
    clientOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !clientOffset || !item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        left: clientOffset.x,
        top: clientOffset.y,
        transform: 'translate(-50%, -50%)',
        opacity: 0.95,
        zIndex: 9999,
        width: 220,
        padding: '0.75rem',
        background: 'rgba(20, 26, 43, 0.96)',
        border: '2px dashed #ef4444',
        borderRadius: '0.75rem',
        color: '#fca5a5',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)',
      }}
    >
      <div className="font-bold mb-1">🔗 Натянуть нить</div>
      <div className="text-[10px] text-slate-300">Нажмите на вторую карточку для связи</div>
    </div>
  );
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'origin':
      return <GitBranch className="w-4 h-4 text-emerald-400" />;
    case 'server':
      return <Server className="w-4 h-4 text-cyan-400" />;
    case 'delivery':
      return <FileText className="w-4 h-4 text-amber-400" />;
    case 'classified':
      return <Shield className="w-4 h-4 text-rose-400" />;
    default:
      return <Network className="w-4 h-4 text-purple-400" />;
  }
};

interface CardProps {
  clue: ClueItem;
  isSelected: boolean;
  isMobile: boolean;
  onSelect: (id: string) => void;
  onDropConnection: (sourceId: string, targetId: string) => void;
}

const ClueCard: React.FC<CardProps> = ({ clue, isSelected, isMobile, onSelect, onDropConnection }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'CLUE',
    item: { id: clue.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'CLUE',
    drop: (item: { id: string }) => {
      if (item.id !== clue.id) {
        onDropConnection(item.id, clue.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const elementRef = useRef<HTMLDivElement>(null);
  dragRef(dropRef(elementRef));

  const pos = CARD_POSITIONS[clue.id] || { x: 50, y: 100 };

  const inlineStyle = isMobile
    ? {}
    : { transform: `translate(${pos.x}px, ${pos.y}px)` };

  return (
    <div
      ref={elementRef}
      onClick={() => onSelect(clue.id)}
      style={inlineStyle}
      className={`${
        isMobile ? 'relative w-full' : 'absolute w-60'
      } p-3.5 rounded-xl cursor-pointer transition-all duration-200 z-10 select-none polaroid-card ${
        isSelected
          ? 'ring-2 ring-amber-400 bg-[#1e2538] shadow-[0_0_25px_rgba(245,158,11,0.45)]'
          : isOver
          ? 'ring-2 ring-rose-500 bg-rose-950/90 shadow-[0_0_35px_rgba(244,63,94,0.6)] drop-target-active'
          : 'bg-[#151a2a]/95 hover:bg-[#1a2238] border border-white/10 hover:border-amber-500/40'
      } ${isDragging ? 'opacity-25 scale-95' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1.5 pt-1">
        {getCategoryIcon(clue.category)}
        <span className="text-xs font-mono font-bold text-amber-300 truncate">
          {clue.title}
        </span>
      </div>
      <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2 line-clamp-3">
        {clue.content}
      </p>
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="truncate max-w-[150px]">{clue.foundAt}</span>
        <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />
      </div>
    </div>
  );
};

export const NexusBoard: React.FC = () => {
  const {
    discoveredClues,
    clueConnections,
    toggleClueConnection,
    addClue,
    phase,
  } = useOSStore();
  const { play } = useAudio();

  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const hasPromptClue = discoveredClues.some((c) => c.id === 'clue-prompt');

  const handleDiscoverPromptClue = () => {
    play('click');
    addClue({
      id: 'clue-prompt',
      title: 'Коммит @vibe_sloth: «Genesis-Prompt»',
      category: 'origin',
      content:
        'Git commit #89b4a1 от 14.11.2024: «Шуточный промпт на пятницу. Промпт: Ты — абсолютный разум. Напиши настоящую книгу, которая успокоит человечество…»',
      source: 'GitHub Archive / Вайбкодинг',
      foundAt: 'github.com/vibe-sloth/genesis',
      position: { x: 70, y: 140 },
      connections: [],
    });
  };

  const handleCardClick = (id: string) => {
    play('click');
    if (!selectedClueId) {
      setSelectedClueId(id);
    } else if (selectedClueId === id) {
      setSelectedClueId(null);
    } else {
      toggleClueConnection(selectedClueId, id);
      setSelectedClueId(null);
    }
  };

  const handleDropConnection = (sourceId: string, targetId: string) => {
    play('click');
    toggleClueConnection(sourceId, targetId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DragPreview />
      <div className="flex-1 flex flex-col bg-[#0b0e17] text-slate-100 overflow-hidden font-sans relative h-full w-full">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-[#121624] border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-amber-300">
              NEXUS BOARD
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            {selectedClueId ? (
              <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                Коснитесь 2-й улики для связи
              </span>
            ) : (
              <span className="text-slate-400 hidden sm:inline">Кликните улики по очереди для связи</span>
            )}
            {(phase === 2 || phase === 3 || phase === 'climax') && !hasPromptClue && (
              <button
                onClick={handleDiscoverPromptClue}
                className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Сканировать git-архив</span>
              </button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className={`flex-1 relative ${
            isMobile ? 'overflow-y-auto p-4 flex flex-col gap-3' : 'overflow-auto p-8'
          }`}
          style={{
            backgroundColor: '#0a0d16',
            backgroundImage: `
              radial-gradient(circle, rgba(245, 158, 11, 0.05) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px, 64px 64px, 64px 64px',
          }}
        >
          {/* SVG red yarn strings (Desktop view) */}
          {!isMobile && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {clueConnections.map(([idA, idB], idx) => {
                const posA = CARD_POSITIONS[idA] || { x: 100, y: 100 };
                const posB = CARD_POSITIONS[idB] || { x: 300, y: 300 };
                return (
                  <g key={idx}>
                    <line
                      x1={posA.x + 120}
                      y1={posA.y + 4}
                      x2={posB.x + 120}
                      y2={posB.y + 4}
                      stroke="rgba(0, 0, 0, 0.6)"
                      strokeWidth="3.5"
                    />
                    <line
                      x1={posA.x + 120}
                      y1={posA.y + 2}
                      x2={posB.x + 120}
                      y2={posB.y + 2}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                    <circle cx={posA.x + 120} cy={posA.y + 2} r="5" fill="#f43f5e" />
                    <circle cx={posB.x + 120} cy={posB.y + 2} r="5" fill="#f43f5e" />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Evidence cards */}
          {discoveredClues.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2 py-10 pointer-events-none">
              <Network className="w-10 h-10 text-slate-600 animate-pulse" />
              <div className="text-xs font-mono text-center">Доска пуста. Найдите улики в браузере NetSurf.</div>
            </div>
          ) : (
            discoveredClues.map((clue) => (
              <ClueCard
                key={clue.id}
                clue={clue}
                isSelected={selectedClueId === clue.id}
                isMobile={isMobile}
                onSelect={handleCardClick}
                onDropConnection={handleDropConnection}
              />
            ))
          )}
        </div>

        {/* Summary Footer */}
        <div className="px-3 py-2 bg-black/70 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div>
            Улик: <span className="text-amber-300 font-bold">{discoveredClues.length}</span>
          </div>
          <div>
            Связей: <span className="text-rose-400 font-bold">{clueConnections.length}</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
