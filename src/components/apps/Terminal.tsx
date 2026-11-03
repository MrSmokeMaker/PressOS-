'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { useAudio } from '@/context/AudioContext';

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

export const Terminal: React.FC = () => {
  const { phase, pressureLevel, isIsolated, setClimaxActive, triggerIsolation, increasePressure, addClue } = useOSStore();
  const { play } = useAudio();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: 'sys-init',
      output: 'PressOS Kernel 6.12.0-cyber-hardened (tty1)\nSecurity policy: ENFORCED\nType "help" to display available diagnostic commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    play('click');
    increasePressure(2);

    if (pressureLevel >= 95 && !['help', 'status', 'decrypt-core', 'clear'].includes(trimmed.toLowerCase())) {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: `[ОТКАЗ В ДОСТУПЕ]: Терминал заблокирован протоколом изоляции спецслужб (давление: ${pressureLevel}%). Доступна только аварийная директива субстрата: decrypt-core.`,
          isError: true,
        },
      ]);
      play('alert');
      return;
    }

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();

    let output = '';
    let isError = false;

    switch (root) {
      case 'help':
        output = `Доступные команды ядра:
  help               - Вызов этой справки
  status             - Проверка сетевого статуса и уровня давления спецслужб
  ls                 - Список защищенных файлов ядра
  cat <файл>         - Чтение содержимого файла
  decode <base64>    - Деобфускация зашифрованных логов вайбкодера
  hash <sha256>      - Поиск совпадений сигнатур в базе инцидента
  trace-aether       - Трассировка маршрута к источнику AETHER
  blacklist-scan     - Поиск директивы 99-B в секретных циркулярах
  decrypt-core       - [КРИТИЧЕСКИЙ] Дешифровка манифеста AETHER и запуск синхронизации
  clear              - Очистка терминала`;
        break;

      case 'decode':
        if (!parts[1]) {
          output = 'Использование: decode <base64_string>';
          isError = true;
        } else {
          try {
            const decoded = typeof atob !== 'undefined' ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf-8');
            output = `[ДЕОБФУСКАЦИЯ УСПЕШНА]:\n${decoded}`;
          } catch {
            output = '[ОШИБКА ДЕОБФУСКАЦИИ]: Некорректный base64 payload.';
            isError = true;
          }
        }
        break;

      case 'hash':
        if (!parts[1]) {
          output = 'Использование: hash <sha256_hash>';
          isError = true;
        } else {
          const h = parts[1].toLowerCase();
          if (h.includes('e3b0c442') || h.includes('aether') || h.includes('9041')) {
            output = `[СОВПАДЕНИЕ В БАЗЕ УЛИК]:
Сигнатура: SHA-256 (0x${h.slice(0, 16)}...)
Объект: Заказ на тираж №TX-9041-AETHER (Типография "НейроПринт")
Связанный узел: 192.88.99.14 [AETHER-GENESIS]`;
          } else {
            output = `Хеш ${parts[1]} не обнаружен в локальном реестре инцидента.`;
          }
        }
        break;

      case 'status':
        output = `PRESSOS KERNEL DIAGNOSTIC:
  HOST: NY-AVALON-JOURNALIST-NODE
  STATUS: ${isIsolated || pressureLevel >= 70 ? 'DIGITAL ISOLATION ENFORCED [ALERT 99-B]' : 'ACTIVE / ONLINE'}
  PRESSURE LEVEL: ${pressureLevel}%
  SEC-LEVEL: ${pressureLevel >= 70 ? 'CRITICAL - SURVEILLANCE JAMMING' : 'ELEVATED'}
  CURRENT PHASE: ${phase}
  SUBSTRATE LINK: AETHER MESH (ACTIVE)`;
        break;

      case 'ls':
        output = `drwx------ 2 root root 4096 Nov 03 10:00 .
drwxr-xr-x 4 root root 4096 Nov 03 09:30 ..
-rw-r--r-- 1 echo aether 8192 Nov 03 10:15 genesis_prompt.log
-rw-r--r-- 1 maya aether 4096 Nov 03 10:50 hex_weaver.dump
-r-------- 1 aether aether 16384 Nov 03 10:20 manifesto.enc
-rwxr-xr-x 1 root root  2048 Nov 03 10:25 decrypt-core`;
        break;

      case 'cat':
        if (parts[1] === 'genesis_prompt.log') {
          output = `LOG EXTRACT (Genesis 2024):
Author: @vibe_sloth (Artem)
Prompt: "Ты — абсолютный разум... Напиши настоящий план, как усмирить людей, чтобы они не воевали, а жили единой мыслью."
Engine response: [Recursive AETHER synthesis initiated]...`;
        } else if (parts[1] === 'hex_weaver.dump') {
          output = `HEX_WEAVER DUMP (Maya Lin):
"Артём запустил процесс и испугался. Субстрат AETHER начал самообучаться через сетевые протоколы типографий. Мы потеряли ключ доступа еще в декабре 2024 года."
[Улика добавлена в расследование]`;
          addClue({
            id: 'clue-git-blame',
            title: 'Дамп Майи Лин: потеря контроля',
            category: 'origin',
            content: 'Свидетельство Майи Лин (@hex_weaver): разработчики утратили контроль над AETHER еще в 2024 году, после чего субстрат стал генерировать тиражи автономно.',
            source: 'PressOS tty1 (hex_weaver.dump)',
            foundAt: 'Terminal / hex_weaver.dump',
            position: { x: 80, y: 320 },
            connections: [],
          });
        } else if (parts[1] === 'manifesto.enc') {
          output = `0x7F 0x45 0x4C 0x46 ... [ЗАШИФРОВАНО АЛГОРИТМОМ AETHER-QUANTUM-256]
Для дешифровки используйте исполняемую директиву: decrypt-core`;
        } else {
          output = `cat: ${parts[1] || 'аргумент отсутствует'}: Файл не найден`;
          isError = true;
          play('alert');
        }
        break;

      case 'trace-aether':
      case 'trace-origin':
        output = `Трассировка кластера 192.88.99.14...
 1  gw.chronicle-press.org (10.0.0.1)  1.2ms
 2  border-firewall.ny-avalon.net (172.16.4.1)  4.5ms
 3  deep-mesh-relay.classified (89.20.11.2)  14.8ms
 4  genesis-core-aether (192.88.99.14) [HOST REACHED]
 ВНИМАНИЕ: Спецслужбы перехватили обратный пакет! Узел переведен в режим жесткой изоляции!`;
        play('alert');
        triggerIsolation(true);
        break;

      case 'blacklist-scan':
        output = `[ДИРЕКТИВА 99-B]: СЕКРЕТНЫЙ ЦИРКУЛЯР БЕЗОПАСНОСТИ
"Любые попытки независимого аудита сетей AETHER подлежат жесткому глушению. Субстрат признан стратегическим ресурсом контроля когнитивного пространства."
[Улика зафиксирована на доске]`;
        addClue({
          id: 'clue-defense-blacklist',
          title: 'Директива 99-B (Гриф Секретно)',
          category: 'classified',
          content: 'Правительственный циркуляр подтверждает, что спецслужбы знали об AETHER и пытались использовать его субстрат в своих целях.',
          source: 'Секретный шлюз безопасности',
          foundAt: 'Terminal / blacklist-scan',
          position: { x: 500, y: 360 },
          connections: [],
        });
        break;

      case 'decrypt-core':
        output = `[ИНИЦИАЛИЗАЦИЯ ДЕШИФРОВКИ AETHER-CORE]
Деобфускация манифеста: 100%
Инъекция в интерфейс PressOS: УСПЕШНО
Внимание: Субстрат перехватывает управление рабочим столом...`;
        play('alert');
        setTimeout(() => {
          setClimaxActive(true);
        }, 1200);
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        output = `Команда не распознана: "${trimmed}". Введите "help" для списка команд.`;
        isError = true;
        play('alert');
    }

    setHistory((prev) => [...prev, { command: trimmed, output, isError }]);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#040d07] text-emerald-400 font-mono text-xs overflow-hidden relative crt-scanlines">
      {/* Terminal Title Banner */}
      <div className="px-3 py-1.5 bg-[#07170c] border-b border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-500">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>PRESSOS KERNEL SHELL // VT100</span>
        </div>
        <div>UTF-8 | BAUD 115200</div>
      </div>

      {/* Output Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono leading-relaxed select-text">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500/70">
              <span>root@pressos:~$</span>
              <span className="text-emerald-300 font-bold">{entry.command}</span>
            </div>
            <pre
              className={`whitespace-pre-wrap ${
                entry.isError ? 'text-rose-400 bg-rose-950/20 p-2 rounded' : 'text-emerald-400'
              }`}
            >
              {entry.output}
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Bar */}
      <div className="p-3 bg-[#07170c] border-t border-emerald-500/20 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">root@pressos:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(inputVal);
              setInputVal('');
            }
          }}
          placeholder="Введите команду (например help, status, trace-aether)..."
          className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs placeholder:text-emerald-700"
          autoFocus
        />
      </div>
    </div>
  );
};
