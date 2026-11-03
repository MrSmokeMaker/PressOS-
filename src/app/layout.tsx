import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PressOS // Проект AION: Чистая Идея',
  description: 'Мета-киберпанк триллер и OS-детектив',
};

import { AudioProvider } from '@/context/AudioContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-[#070b14]">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-[#070b14]">{children}</body>
    </html>
    </AudioProvider>
  );
  );
}
