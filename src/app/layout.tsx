import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

export const metadata: Metadata = {
  title: 'PressOS // Проект AETHER: Чистая Идея',
  description: 'Мета-киберпанк триллер и OS-детектив',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-[#070b14] overflow-hidden select-none touch-none">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
