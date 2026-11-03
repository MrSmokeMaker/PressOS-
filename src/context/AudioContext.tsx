import React, { createContext, useContext, useEffect, useRef } from 'react';

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

export const AudioProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const sounds = useRef<SoundMap>({
    ambient: new Audio('/sounds/ambient.mp3'),
    click: new Audio('/sounds/click.wav'),
    crt: new Audio('/sounds/crt.mp3'),
    alert: new Audio('/sounds/alert.wav'),
  });
  const [mute, setMute] = React.useState(false);

  useEffect(() => {
    Object.values(sounds.current).forEach(s => { s.loop = s === sounds.current.ambient || s === sounds.current.crt; s.volume = mute ? 0 : 1; });
  }, [mute]);

  const play = (name: keyof SoundMap) => {
    if (mute) return;
    const s = sounds.current[name];
    s.currentTime = 0;
    s.play();
  };

  const toggleMute = () => setMute(prev => !prev);

  return (
    <AudioContext.Provider value={{play, mute, toggleMute}}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextProps => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('AudioContext not found');
  return ctx;
};
