'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { getSimulatedEchoResponse } from '@/utils/echoEngine';

export const EchoAssistant: React.FC = () => {
  const { echoMessages, isEchoTyping, addEchoMessage, setEchoTyping, phase } = useOSStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [echoMessages, isEchoTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isEchoTyping) return;

    setInputText('');
    addEchoMessage({
      sender: 'user',
      text,
      phase,
    });

    setEchoTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, phase }),
      });

      if (!response.ok) throw new Error('API offline');

      const data = await response.json();
      const reply = data.reply || getSimulatedEchoResponse(text, phase);

      addEchoMessage({
        sender: 'echo',
        text: reply,
        phase,
      });
    } catch {
      // Graceful fallback for static deployment / offline mode
      const simulatedReply = getSimulatedEchoResponse(text, phase);
      addEchoMessage({
        sender: 'echo',
        text: simulatedReply,
        phase,
      });
    } finally {
      setEchoTyping(false);
    }
  };

  const getAvatarGlow = () => {
    if (phase === 1) return 'from-cyan-500 via-sky-400 to-blue-600 shadow-cyan-500/50';
    if (phase === 2) return 'from-purple-500 via-indigo-500 to-cyan-500 shadow-purple-500/50';
    if (phase === 3) return 'from-rose-500 via-amber-500 to-purple-600 shadow-rose-500/50';
    return 'from-amber-400 via-orange-500 to-rose-600 shadow-amber-500/60';
  };

  const quickPrompts = [
    { label: 'Что делать дальше?', query: 'Что делать дальше в расследовании?' },
    { label: 'Кто такой vibe_sloth?', query: 'Кто такой vibe_sloth и что за шуточный промпт?' },
    { label: 'Анализ книги', query: 'В чем феномен книги «Чистая Идея»?' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#080d1a] text-slate-100 overflow-hidden font-sans">
      {/* Echo Header Status Banner */}
      <div className="px-4 py-3 bg-cyan-950/20 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGlow()} p-0.5 shadow-lg flex items-center justify-center animate-pulse`}
          >
            <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>ЭХО // AION SUB-NODE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[11px] text-slate-400">
              {phase === 1 && 'Режим: Ассистент расследования'}
              {phase === 2 && 'Режим: Корреляция архивов 2024'}
              {phase === 3 && 'Режим: Протокол глубокого резонанса'}
              {phase === 'climax' && 'Режим: Синхронизация Чистой Идеи'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-400">
            PHASE {phase}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {echoMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
              <span>{msg.sender === 'user' ? 'Журналист' : msg.sender === 'echo' ? 'Эхо' : 'Система'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed font-sans ${
                msg.sender === 'user'
                  ? 'bg-cyan-600/30 border border-cyan-400/40 text-cyan-100'
                  : msg.sender === 'system'
                  ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200 font-mono text-[11px]'
                  : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isEchoTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Эхо синтезирует ответ...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.query)}
            className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-black/40 border-t border-cyan-500/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Задайте вопрос Эхо..."
            className="flex-1 bg-slate-950/80 border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isEchoTyping}
            className="w-9 h-9 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-cyan-300 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
