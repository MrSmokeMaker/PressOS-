'use client';

import React, { useState } from 'react';
import { FileText, Save, Info } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

const INITIAL_TEXT = `[СЕКРЕТНЫЙ АРХИВ // РЕДАКЦИЯ CHRONICLE PRESS]
ДОСЬЕ ПО ДЕЛУ: КНИГА «ЧИСТАЯ ИДЕЯ»
--------------------------------------------------------------------------------
ДАТА РАССЛЕДОВАНИЯ: 03.11.2026
СТАТУС: АКТИВНОЕ РАССЛЕДОВАНИЕ

1. СУТЬ ИНЦИДЕНТА:
По всему городу Нью-Авалон и в сети распространяется загадочная книга
«Чистая Идея». В выходных данных значится Синдикат AETHER, но живого
автора не существует. Читатели впадают в гипнотическое состояние.

2. ПЛАН ДЕЙСТВИЙ ЖУРНАЛИСТА:
- [Шаг 1] Открыть PressMail и изучить входящее от редактора Марка.
- [Шаг 2] В браузере NetSurf открыть aether-syndicate.io и включить DevTools,
          чтобы извлечь скрытый ID транзакции (TX-9041-AETHER).
- [Шаг 3] Подключить нейро-ассистента Эхо для дешифровки метаданных.
- [Шаг 4] Открыть Nexus Board и соединить красными нитями ключевые зацепки:
          Промпт вайбкодера <-> Сервер Genesis <-> Типография.
- [Шаг 5] На Радаре курьеров (CityMap) отследить дрон #404 и перехватить маршрут.
- [Шаг 6] При изоляции сети ввести в Терминале команду 'decrypt-core'
          для доступа к ядру AETHER и выбора финала.

3. ВНИМАНИЕ:
Спецслужбы мониторят узел PressOS по Директиве 99-B. При росте шкалы давления
возможны сбои связи и помехи.
--------------------------------------------------------------------------------
[КОНЕЦ ЗАПИСИ]`;

export const Notepad: React.FC = () => {
  const [content, setContent] = useState(INITIAL_TEXT);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-slate-100 font-mono text-xs w-full h-full select-text">
      {/* Windows Notepad Menu Bar */}
      <div className="h-7 bg-[#2d2d2d] border-b border-[#3e3e3e] flex items-center px-2 gap-4 text-slate-300 font-sans text-xs select-none">
        <button
          onClick={handleSave}
          className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
        >
          Файл
        </button>
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          Правка
        </span>
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          Формат
        </span>
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          Вид
        </span>
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          Справка
        </span>

        {savedNotice && (
          <span className="ml-auto text-[11px] text-emerald-400 font-mono animate-pulse">
            ✓ Сохранено в локальный кэш
          </span>
        )}
      </div>

      {/* Editor Body */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-3 bg-transparent text-slate-200 resize-none outline-none leading-relaxed font-mono text-xs overflow-y-auto"
        spellCheck={false}
      />

      {/* Windows Notepad Status Bar */}
      <div className="h-6 bg-[#252526] border-t border-[#3e3e3e] flex items-center justify-between px-3 text-[11px] text-slate-400 font-sans select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-sky-400" />
          <span>Дело_Чистая_Идея.txt</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Стр 1, стлб 1</span>
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span className="text-sky-300">UTF-8</span>
        </div>
      </div>
    </div>
  );
};
