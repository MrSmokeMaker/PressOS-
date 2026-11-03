'use client';

import React from 'react';
import { useOSStore } from '@/store/useOSStore';
import { WindowFrame } from './WindowFrame';
import { Taskbar } from './Taskbar';
import { EchoAssistant } from '@/components/apps/EchoAssistant';
import { NetSurf } from '@/components/apps/NetSurf';
import { NexusBoard } from '@/components/apps/NexusBoard';
import { Terminal } from '@/components/apps/Terminal';
import { MailClient } from '@/components/apps/MailClient';
import { CityMap } from '@/components/apps/CityMap';
import { Notepad } from '@/components/apps/Notepad';
import { ClimaxModal } from '@/components/apps/ClimaxModal';
import { PhaseInterlude } from './PhaseInterlude';
import { TutorialBanner } from './TutorialBanner';
import { DesktopShortcuts } from './DesktopShortcuts';

export const Desktop: React.FC = () => {
  const { windows, isIsolated, activeInterlude, dismissInterlude } = useOSStore();

  return (
    <main
      className={`fixed inset-0 w-screen h-screen bg-[#070b14] overflow-hidden select-none ${
        isIsolated ? 'glitch-active' : ''
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(0, 245, 255, 0.04) 0%, transparent 45%),
          radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.04) 0%, transparent 45%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
      }}
    >
      {/* Windows Ambient System Watermark */}
      <div className="absolute bottom-16 right-6 pointer-events-none select-none text-right font-sans opacity-25 hidden sm:block">
        <div className="text-sm font-semibold text-slate-300 tracking-wide">PressOS 11 Pro</div>
        <div className="text-[11px] text-slate-400 font-mono">Сборка 26100.2161 (Журналистское издание)</div>
      </div>

      {/* Desktop Application Shortcuts Grid */}
      <DesktopShortcuts />

      {/* Onboarding Objective Banner */}
      <TutorialBanner />

      {/* Cinematic Phase Interlude Overlay */}
      {activeInterlude && (
        <PhaseInterlude
          phase={activeInterlude}
          visible={Boolean(activeInterlude)}
          onDismiss={dismissInterlude}
        />
      )}

      {/* Dynamic Digital Glitch Interference Overlay */}
      {isIsolated && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-rose-500/10 mix-blend-screen opacity-80 crt-scanlines network-isolated-overlay" />
      )}

      {/* OS Windows */}
      {windows.echo.isOpen && (
        <WindowFrame window={windows.echo}>
          <EchoAssistant />
        </WindowFrame>
      )}

      {windows.netsurf.isOpen && (
        <WindowFrame window={windows.netsurf}>
          <NetSurf />
        </WindowFrame>
      )}

      {windows.nexus.isOpen && (
        <WindowFrame window={windows.nexus}>
          <NexusBoard />
        </WindowFrame>
      )}

      {windows.terminal.isOpen && (
        <WindowFrame window={windows.terminal}>
          <Terminal />
        </WindowFrame>
      )}

      {windows.mail.isOpen && (
        <WindowFrame window={windows.mail}>
          <MailClient />
        </WindowFrame>
      )}

      {windows.citymap?.isOpen && (
        <WindowFrame window={windows.citymap}>
          <CityMap />
        </WindowFrame>
      )}

      {windows.notepad?.isOpen && (
        <WindowFrame window={windows.notepad}>
          <Notepad />
        </WindowFrame>
      )}

      {/* Climax Epilogue Modal */}
      <ClimaxModal />

      {/* OS Taskbar Dock */}
      <Taskbar />
    </main>
  );
};
