'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type SoundMap = {
  ambient: HTMLAudioElement;
  click: HTMLAudioElement;
  crt: HTMLAudioElement;
  alert: HTMLAudioElement;
};

interface AudioContextProps {
  play: (name: keyof SoundMap) => void;
  mute: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sounds = useRef<Partial<SoundMap>>({});
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefix = process.env.NODE_ENV === 'production' ? '/PressOS-' : '';
    sounds.current = {
      ambient: new Audio(`${prefix}/sounds/ambient.mp3`),
      click: new Audio(`${prefix}/sounds/click.wav`),
      crt: new Audio(`${prefix}/sounds/crt.mp3`),
      alert: new Audio(`${prefix}/sounds/alert.wav`),
    };

    Object.values(sounds.current).forEach((s) => {
      if (!s) return;
      s.loop = s === sounds.current.ambient || s === sounds.current.crt;
      s.volume = mute ? 0 : 0.4;
    });
  }, []);

  useEffect(() => {
    Object.values(sounds.current).forEach((s) => {
      if (s) s.volume = mute ? 0 : 0.4;
    });
  }, [mute]);

  const play = (name: keyof SoundMap) => {
    if (mute) return;
    const s = sounds.current[name];
    if (s) {
      s.currentTime = 0;
      s.play().catch(() => {
        // Autoplay policy may block before user interaction
      });
    }
  };

  const toggleMute = () => setMute((prev) => !prev);

  return (
    <AudioContext.Provider value={{ play, mute, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextProps => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    return {
      play: () => {},
      mute: true,
      toggleMute: () => {},
    };
  }
  return ctx;
};
