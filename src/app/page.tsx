'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false since window dimensions and drag-and-drop rely on browser client state
const Desktop = dynamic(() => import('@/components/os/Desktop').then((mod) => mod.Desktop), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-center font-mono text-cyan-400 space-y-4">
      <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      <div className="text-xs tracking-widest uppercase">Загрузка PressOS Kernel v2.4...</div>
    </div>
  ),
});

export default function Home() {
  return <Desktop />;
}
