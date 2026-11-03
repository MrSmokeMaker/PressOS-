'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type SoundType = 'click' | 'typing' | 'crt' | 'alert' | 'ambient';

interface AudioContextProps {
  play: (type: SoundType) => void;
  mute: boolean;
  toggleMute: () => void;
}

const AudioCtx = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mute, setMute] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const crtOscRef = useRef<OscillatorNode | null>(null);
  const crtGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize AudioContext
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (!audioCtxRef.current) {
      const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioClass) {
        const ctx = new AudioClass();
        const master = ctx.createGain();
        master.gain.setValueAtTime(mute ? 0 : 0.6, ctx.currentTime);
        master.connect(ctx.destination);

        audioCtxRef.current = ctx;
        masterGainRef.current = master;
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    return audioCtxRef.current;
  }, [mute]);

  // Ambient CRT Hum Loop
  const startCrtHum = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current || crtOscRef.current) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime); // 60Hz CRT hum

      gain.gain.setValueAtTime(0.015, ctx.currentTime); // Low background volume

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start();

      crtOscRef.current = osc;
      crtGainRef.current = gain;
    } catch {
      // Ignore audio start errors if blocked by browser
    }
  }, [getAudioContext]);

  // Sync mute with master gain
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(mute ? 0 : 0.6, audioCtxRef.current.currentTime);
    }
  }, [mute]);

  // Start background hum on user interaction or mount
  useEffect(() => {
    const handleFirstInteraction = () => {
      startCrtHum();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      if (crtOscRef.current) {
        try {
          crtOscRef.current.stop();
          crtOscRef.current.disconnect();
        } catch {}
      }
    };
  }, [startCrtHum]);

  const play = useCallback((type: SoundType) => {
    if (mute) return;
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current) return;

    try {
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'typing') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        // Slight random variation in key pitch
        const freq = 650 + Math.random() * 200;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start(now);
        osc.stop(now + 0.025);
      } else if (type === 'alert') {
        // Dual-tone alarm
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.12);
        osc.frequency.setValueAtTime(880, now + 0.24);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'crt' || type === 'ambient') {
        startCrtHum();
      }
    } catch {
      // Audio playback failsafe
    }
  }, [mute, getAudioContext, startCrtHum]);

  const toggleMute = () => {
    setMute((prev) => !prev);
  };

  return (
    <AudioCtx.Provider value={{ play, mute, toggleMute }}>
      {children}
    </AudioCtx.Provider>
  );
};

export const useAudio = (): AudioContextProps => {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    return {
      play: () => {},
      mute: false,
      toggleMute: () => {},
    };
  }
  return ctx;
};
