// components/Terminal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/store';
import { supabase } from '../utils/supabaseClient';

/**
 * Мини‑консоль с задачами (дешифрование, поиск хэшей).
 * При росте pressureLevel > 70 ввод блокируется.
 */
export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const { pressureLevel, increasePressure } = useGameStore();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom on new output
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const handleCommand = async (cmd: string) => {
    // простой парсер команд
    if (cmd.startsWith('decode ')) {
      const b64 = cmd.slice(7).trim();
      try {
        const decoded = atob(b64);
        setOutput((o) => [...o, `> ${cmd}`, decoded]);
      } catch {
        setOutput((o) => [...o, `> ${cmd}`, 'Ошибка декодирования']);
      }
    } else if (cmd.startsWith('hash ')) {
      const hash = cmd.slice(5).trim();
      const { data, error } = await supabase
        .from('evidence')
        .select('title,meta')
        .contains('meta', { hash })
        .single();
      if (error) {
        setOutput((o) => [...o, `> ${cmd}`, 'Хеш не найден']);
      } else {
        setOutput((o) => [...o, `> ${cmd}`, `Найдено: ${data.title}`]);
      }
    } else {
      setOutput((o) => [...o, `> ${cmd}`, 'Неизвестная команда']);
    }
    // каждая команда повышает давление
    increasePressure(2);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pressureLevel >= 70) {
      setOutput((o) => [...o, 'Система блокирует ввод (изоляция)']);
      return;
    }
    handleCommand(input);
    setInput('');
  };

  return (
    <div style={{ background: '#000', color: '#0f0', padding: '12px', fontFamily: 'monospace', height: '300px', overflow: 'hidden' }}>
      <div ref={outputRef} style={{ height: '260px', overflowY: 'auto' }}>
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={onSubmit} style={{ display: 'flex' }}>
        <span>&gt; </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, background: '#000', color: '#0f0', border: 'none' }}
          disabled={pressureLevel >= 70}
        />
      </form>
    </div>
  );
};
