'use client';

import React, { useState, useRef } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { ClueItem } from '@/types/os';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Network, GitBranch, Server, FileText, Link2, Radio, Shield } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const CARD_POSITIONS: Record<string, { x: number; y: number }> = {
  'clue-prompt': { x: 50, y: 80 },
  'clue-server': { x: 320, y: 190 },
  'clue-tx': { x: 600, y: 80 },
  'clue-audio-glitch': { x: 600, y: 280 },
  'clue-git-blame': { x: 50, y: 280 },
  'clue-defense-blacklist': { x: 320, y: 390 },
  'clue-core': { x: 320, y: 20 },
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
        opacity: 0.9,
        zIndex: 9999,
        width: 250,
        padding: '0.85rem',
        background: 'rgba(20, 26, 43, 0.96)',
        border: '2px dashed #ef4444',
        borderRadius: '0.75rem',
        color: '#fca5a5',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
      }}
    >
      <div className="font-bold mb-1">🔗 Соединение с карточкой</div>
      <div className="text-[11px] text-slate-300">Наведите на вторую улику для замыкания цепи</div>
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
  onSelect: (id: string) => void;
  onDropConnection: (sourceId: string, targetId: string) => void;
}

const ClueCard: React.FC<CardProps> = ({ clue, isSelected, onSelect, onDropConnection }) => {
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

  const pos = CARD_POSITIONS[clue.id] || { x: 100, y: 100 };

  return (
    <div
      ref={elementRef}
      onClick={() => onSelect(clue.id)}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`absolute w-64 p-4 rounded-xl backdrop-blur-md cursor-pointer transition-all duration-200 z-10 select-none ${
        isSelected
          ? 'ring-2 ring-amber-400 bg-amber-950/80 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
          : isOver
          ? 'ring-2 ring-rose-500 bg-rose-950/90 shadow-[0_0_35px_rgba(244,63,94,0.6)] drop-target-active'
          : 'bg-[#181d2f]/90 hover:bg-[#1f263d] border border-white/10 hover:border-amber-500/40 shadow-xl'
      } ${isDragging ? 'opacity-25 scale-95' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {getCategoryIcon(clue.category)}
        <span className="text-xs font-mono font-bold text-amber-300 truncate">
          {clue.title}
        </span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3 line-clamp-3">
        {clue.content}
      </p>
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="truncate max-w-[170px]">{clue.foundAt}</span>
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
      <div className="flex-1 flex flex-col bg-[#0f121d] text-slate-100 overflow-hidden font-sans relative">
        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-[#171b2b] border-b border-amber-500/20 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">
              NEXUS DETECTIVE CANVAS // КОРРЕЛЯЦИЯ УЛИК
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            {selectedClueId ? (
              <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                Выберите вторую улику для соединения
              </span>
            ) : (
              <span className="text-slate-400">Кликните или перетащите карточки друг на друга</span>
            )}
            {(phase === 2 || phase === 3 || phase === 'climax') && !hasPromptClue && (
              <button
                onClick={handleDiscoverPromptClue}
                className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Сканировать git-архив 2024 (@vibe_sloth)</span>
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative overflow-auto p-8"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* SVG connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {clueConnections.map(([idA, idB], idx) => {
              const posA = CARD_POSITIONS[idA] || { x: 100, y: 100 };
              const posB = CARD_POSITIONS[idB] || { x: 300, y: 300 };
              return (
                <g key={idx}>
                  <line
                    x1={posA.x + 130}
                    y1={posA.y + 60}
                    x2={posB.x + 130}
                    y2={posB.y + 60}
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                  <circle cx={posA.x + 130} cy={posA.y + 60} r="4" fill="#ef4444" />
                  <circle cx={posB.x + 130} cy={posB.y + 60} r="4" fill="#ef4444" />
                </g>
              );
            })}
          </svg>

          {/* Evidence cards */}
          {discoveredClues.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 pointer-events-none">
              <Network className="w-12 h-12 text-slate-600 animate-pulse" />
              <div className="text-sm font-mono">Доска пуста. Найдите улики через NetSurf DevTools.</div>
            </div>
          ) : (
            discoveredClues.map((clue) => (
              <ClueCard
                key={clue.id}
                clue={clue}
                isSelected={selectedClueId === clue.id}
                onSelect={handleCardClick}
                onDropConnection={handleDropConnection}
              />
            ))
          )}
        </div>

        {/* Summary */}
        <div className="px-4 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Улик собрано: <span className="text-amber-300 font-bold">{discoveredClues.length}</span>
          </div>
          <div>
            Связей протянуто: <span className="text-cyan-400 font-bold">{clueConnections.length}</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
