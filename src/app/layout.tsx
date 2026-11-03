import type { Metadata } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

export const metadata: Metadata = {
  title: 'PressOS // Проект AION: Чистая Идея',
  description: 'Мета-киберпанк триллер и OS-детектив',
};

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
