'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

export const Terminal: React.FC = () => {
  const { phase, setClimaxActive, triggerIsolation } = useOSStore();
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

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();

    let output = '';
    let isError = false;

    switch (root) {
      case 'help':
        output = `Доступные команды ядра:
  help           - Вызов этой справки
  status         - Проверка сетевого статуса и уровня изоляции
  ls             - Список защищенных файлов ядра
  cat <файл>     - Чтение содержимого файла
  trace-origin   - Трассировка маршрута к источнику AION
  decrypt-core   - [КРИТИЧЕСКИЙ] Дешифровка манифеста AION и запуск синхронизации
  clear          - Очистка терминала`;
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'status':
        output = `PRESSOS KERNEL DIAGNOSTIC:
  HOST: NY-AVALON-JOURNALIST-NODE
  STATUS: ${phase === 3 ? 'DIGITAL ISOLATION ENFORCED [ALERT 99-B]' : 'ACTIVE / ONLINE'}
  SEC-LEVEL: HIGH
  CURRENT PHASE: ${phase}`;
        break;

      case 'ls':
        output = `drwx------ 2 root root 4096 Nov 03 10:00 .
drwxr-xr-x 4 root root 4096 Nov 03 09:30 ..
-rw-r--r-- 1 echo aion 8192 Nov 03 10:15 genesis_prompt.log
-r-------- 1 aion aion 16384 Nov 03 10:20 manifesto.enc
-rwxr-xr-x 1 root root  2048 Nov 03 10:25 decrypt-core`;
        break;

      case 'cat':
        if (parts[1] === 'genesis_prompt.log') {
          output = `LOG EXTRACT (Genesis 2024):
Author: @vibe_sloth (Artem)
Prompt: "Ты — царь и властелин... Напиши настоящий план, как усмирить людей, чтобы они не воевали, а жили единой мыслью."
Engine response: [Recursive synthesis initiated]...`;
        } else if (parts[1] === 'manifesto.enc') {
          output = `0x7F 0x45 0x4C 0x46 ... [ЗАШИФРОВАНО АЛГОРИТМОМ AION-QUANTUM-256]
Для дешифровки используйте исполняемую директиву: decrypt-core`;
        } else {
          output = `cat: ${parts[1] || 'аргумент отсутствует'}: Файл не найден`;
          isError = true;
        }
        break;

      case 'trace-origin':
        output = `Трассировка кластера 192.88.99.14...
 1  gw.chronicle-press.org (10.0.0.1)  1.2ms
 2  border-firewall.ny-avalon.net (172.16.4.1)  4.5ms
 3  deep-mesh-relay.classified (89.20.11.2)  14.8ms
 4  genesis-core-aion (192.88.99.14) [HOST REACHED]
 ВНИМАНИЕ: Спецслужбы перехватили обратный пакет! Узел переведен в режим жесткой изоляции!`;
        triggerIsolation(true);
        break;

      case 'decrypt-core':
        output = `[ИНИЦИАЛИЗАЦИЯ ДЕШИФРОВКИ AION-CORE]
Деобфускация манифеста: 100%
Инъекция в интерфейс PressOS: УСПЕШНО
Внимание: Ядро перехватывает управление рабочим столом...`;
        setTimeout(() => {
          setClimaxActive(true);
        }, 1200);
        break;

      default:
        output = `Команда не распознана: "${trimmed}". Введите "help" для списка команд.`;
        isError = true;
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
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <span className="text-emerald-500">root@pressos:~$</span>
              <span>{entry.command}</span>
            </div>
            <pre
              className={`whitespace-pre-wrap font-mono text-[11px] ${
                entry.isError ? 'text-rose-400' : 'text-emerald-400/90'
              }`}
            >
              {entry.output}
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt */}
      <div className="p-3 bg-[#030905] border-t border-emerald-500/30 flex items-center gap-2">
        <span className="text-emerald-500 font-bold">root@pressos:~$</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(inputVal);
            setInputVal('');
          }}
          className="flex-1 flex"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='Введите команду (например, "help" или "decrypt-core")...'
            className="flex-1 bg-transparent text-emerald-300 placeholder:text-emerald-800 outline-none font-mono text-xs"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};
