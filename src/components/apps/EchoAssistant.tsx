'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Radio, Activity } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { getSimulatedEchoResponse } from '@/utils/echoEngine';

export const EchoAssistant: React.FC = () => {
  const { echoMessages, isEchoTyping, addEchoMessage, setEchoTyping, phase, trustLevel, adjustTrust } = useOSStore();
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

      const data = await response.json().catch(() => ({}));
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
    { label: 'Кто такая Майя Лин?', query: 'Что известно о Майе Лин и репозитории 2024 года?' },
    { label: 'Анализ книги', query: 'В чем феномен книги «Чистая Идея» и шума страниц?' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#070b16] text-slate-100 overflow-hidden font-sans">
      {/* Echo Header Status Banner with Live Pulsing Orb */}
      <div className="px-4 py-3 bg-[#0d1326] border-b border-cyan-500/20 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          {/* Animated Neural Core Orb */}
          <div
            className={`relative w-10 h-10 rounded-2xl bg-gradient-to-tr ${getAvatarGlow()} p-0.5 shadow-xl flex items-center justify-center transition-all ${
              isEchoTyping ? 'scale-110 animate-spin' : ''
            }`}
          >
            <div className="w-full h-full bg-[#070b16] rounded-[14px] flex items-center justify-center overflow-hidden">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>ЭХО // AETHER NEURAL NODE</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
              <span>{phase === 1 && 'Ассистент расследования'}</span>
              <span>{phase === 2 && 'Архивы Genesis 2024'}</span>
              <span>{phase === 3 && 'Резонанс AETHER'}</span>
              <span>•</span>
              <span className="text-emerald-400">Доверие: {trustLevel > 0 ? `+${trustLevel}` : trustLevel}</span>
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
              className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/40 text-cyan-100'
                  : msg.sender === 'system'
                  ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200 font-mono text-[11px]'
                  : 'bg-[#0f172a]/90 border border-cyan-500/20 text-slate-200 backdrop-blur-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isEchoTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-1 pl-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
            <span>Эхо синтезирует нейронный отклик...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-black/50 border-t border-cyan-500/10 flex items-center gap-2 overflow-x-auto text-xs">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            disabled={isEchoTyping}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-[#0a0f1e] border-t border-cyan-500/20 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Спросите ассистента Эхо о книге или уликax..."
          className="flex-1 bg-black/60 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400 font-sans shadow-inner"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isEchoTyping}
          className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 disabled:opacity-40 transition-all cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
