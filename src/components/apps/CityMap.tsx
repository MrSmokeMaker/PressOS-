'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

interface DeliveryNode {
  id: string;
  name: string;
  sector: string;
  anomalyRate: number;
  status: 'scanned' | 'unscanned';
  coords: { x: number; y: number };
  details: string;
}

export const CityMap: React.FC = () => {
  const { addClue, adjustTrust } = useOSStore();
  const { play } = useAudio();
  const [nodes, setNodes] = useState<DeliveryNode[]>([
    {
      id: 'node-1',
      name: 'Книжные лавки Сектора 4',
      sector: 'Сектор 4 (Торговый)',
      anomalyRate: 45,
      status: 'unscanned',
      coords: { x: 25, y: 35 },
      details: 'Партия Итана. Зафиксирован частотный шелест страниц.',
    },
    {
      id: 'node-2',
      name: 'Университетский кампус',
      sector: 'Сектор 7 (Академический)',
      anomalyRate: 78,
      status: 'unscanned',
      coords: { x: 60, y: 25 },
      details: 'Массовое чтение книги студентами. Отмечены признаки группового транса.',
    },
    {
      id: 'node-3',
      name: 'Заброшенный дата-центр Genesis',
      sector: 'Сектор 0 (Промзона)',
      anomalyRate: 99,
      status: 'unscanned',
      coords: { x: 75, y: 70 },
      details: 'Координаты дрона «Курьер-404». Точка физического размещения сервера 192.88.99.14.',
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<DeliveryNode | null>(null);

  const handleScanNode = (node: DeliveryNode) => {
    play('click');
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, status: 'scanned' } : n))
    );
    setSelectedNode({ ...node, status: 'scanned' });

    if (node.id === 'node-3') {
      play('alert');
      adjustTrust(5);
      addClue({
        id: 'clue-courier-manifest',
        title: 'Маршрут дрона Курьер-404',
        category: 'delivery',
        content:
          'Лог автономной ночной доставки книг: дроны стартуют из заброшенного бункера в Секторе 0 (дата-центр Genesis 192.88.99.14).',
        source: 'CityMap Картография',
        foundAt: 'CityMap // Сектор 0',
        position: { x: 560, y: 180 },
        connections: [],
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070b14] text-slate-200 overflow-hidden font-sans">
      {/* Map Header */}
      <div className="px-3.5 py-2 bg-[#0c1220] border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>КАРТОГРАФИЯ НЬЮ-АВАЛОНА // ОЧАГИ АНОМАЛИЙ AETHER</span>
        </div>
        <div className="text-[10px] text-slate-400">GPS GRID // 2026 MESH</div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Interactive Tactical Map Viewport */}
        <div className="flex-1 relative bg-[#040810] overflow-hidden min-h-[240px]">
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.08) 0%, transparent 60%),
                linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 30px 30px, 30px 30px',
            }}
          />

          {/* Delivery Nodes on Map */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute w-8 h-8 rounded-full animate-ping opacity-75 ${
                      node.status === 'scanned' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}
                  />
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 border-white text-black scale-125 shadow-[0_0_20px_#00f5ff]'
                        : node.status === 'scanned'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-500 text-rose-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-slate-300 whitespace-nowrap">
                  {node.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="w-full md:w-72 bg-[#080d1a] border-t md:border-t-0 md:border-l border-slate-800 p-4 space-y-4 font-mono text-xs shrink-0 overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300">{selectedNode.sector}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    selectedNode.status === 'scanned'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {selectedNode.status === 'scanned' ? 'ПРОСКАНИРОВАН' : 'НЕ ИЗУЧЕН'}
                </span>
              </div>

              <div>
                <div className="text-slate-400 text-[10px]">НАИМЕНОВАНИЕ:</div>
                <div className="text-slate-200 font-bold">{selectedNode.name}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px]">УРОВЕНЬ АНОМАЛИИ AETHER:</div>
                <div className="text-base font-bold text-rose-400">{selectedNode.anomalyRate}%</div>
              </div>

              <div className="text-slate-300 font-sans text-xs leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                {selectedNode.details}
              </div>

              {selectedNode.status !== 'scanned' && (
                <button
                  onClick={() => handleScanNode(selectedNode)}
                  className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  ПРОСКАНИРОВАТЬ СЕКТОР →
                </button>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-8">
              Выберите точку на карте Нью-Авалона для анализа активности распространения книг
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
