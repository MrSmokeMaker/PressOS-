'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Inbox, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { EmailItem } from '@/types/os';

export const MailClient: React.FC = () => {
  const { emails, markEmailRead, phase, isIsolated, pressureLevel, triggerIsolation } = useOSStore();
  const [selectedMailId, setSelectedMailId] = useState<string>(emails[0]?.id || 'mail-1');
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    let active = true;
    const checkMailGateway = async () => {
      try {
        const res = await fetch('/api/mail', {
          headers: {
            'x-pressure-level': String(pressureLevel),
            'x-game-phase': String(phase),
          },
        });
        if (!active) return;
        if (res.status === 503) {
          const data = await res.json().catch(() => ({}));
          setGatewayError(data.message || '503 Service Unavailable: Gateway Jammed');
          if (!isIsolated) triggerIsolation(true);
        } else {
          setGatewayError(null);
        }
      } catch {
        if (active && (pressureLevel >= 70 || isIsolated)) {
          setGatewayError('Сбой соединения со шлюзом PressMail (РЭБ)');
        }
      }
    };
    checkMailGateway();
    return () => {
      active = false;
    };
  }, [pressureLevel, phase, isIsolated, triggerIsolation]);

  const visibleEmails = emails.filter((e) => {
    if (typeof phase === 'number') {
      return e.phaseRequired <= phase;
    }
    return true;
  });

  const selectedMail = visibleEmails.find((e) => e.id === selectedMailId) || visibleEmails[0];

  const handleSelect = (mail: EmailItem) => {
    setSelectedMailId(mail.id);
    setMobileView('detail');
    if (!mail.read) {
      markEmailRead(mail.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#0e1017] text-slate-200 overflow-hidden font-sans w-full h-full">
      {/* Mail Sidebar (Desktop only) */}
      <div className="hidden md:flex w-52 bg-[#090b10] border-r border-slate-800 flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
          <span>PRESSMAIL</span>
          {(isIsolated || pressureLevel >= 70) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Канал связи под глушилкой" />
          )}
        </div>

        <div className="p-2 space-y-1 text-xs font-mono">
          <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200">
            <div className="flex items-center gap-2">
              <Inbox className="w-3.5 h-3.5 text-purple-400" />
              <span>Входящие</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/30 font-bold">
              {visibleEmails.length}
            </span>
          </button>
        </div>

        {(isIsolated || pressureLevel >= 70 || gatewayError) && (
          <div className="m-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-[11px] text-rose-300 font-mono leading-tight animate-pulse">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>СБОЙ ШЛЮЗА (503)</span>
            </div>
            {gatewayError || 'Внешние серверы заблокированы правительственным файрволом.'}
          </div>
        )}
      </div>

      {/* Email List Column */}
      <div
        className={`${
          mobileView === 'detail' ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-72 bg-[#0c0e14] border-r border-slate-800 shrink-0 h-full overflow-hidden`}
      >
        <div className="p-2.5 bg-[#090b10] md:bg-transparent border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Входящие сообщения ({visibleEmails.length})</span>
          <span className="text-[10px] text-purple-400 font-bold md:hidden">PressMail</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {visibleEmails.map((mail) => {
            const isSelected = mail.id === selectedMail?.id;
            return (
              <div
                key={mail.id}
                onClick={() => handleSelect(mail)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-purple-950/30 border-l-2 border-purple-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-mono truncate font-medium text-slate-300 max-w-[180px]">
                    {mail.sender}
                  </span>
                  <span className="text-[10px] shrink-0">{mail.date}</span>
                </div>

                <div
                  className={`text-xs truncate ${
                    !mail.read ? 'font-bold text-slate-100' : 'text-slate-300'
                  }`}
                >
                  {mail.subject}
                </div>

                <div className="text-[11px] text-slate-500 truncate mt-1">
                  {mail.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Detail View */}
      <div
        className={`${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        } flex-1 flex-col bg-[#111420] overflow-y-auto h-full w-full`}
      >
        {/* Mobile Back Button Bar */}
        <div className="md:hidden p-2.5 bg-[#0a0d16] border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setMobileView('list')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 text-xs font-mono text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Назад к списку</span>
          </button>
        </div>

        {selectedMail ? (
          <div className="p-4 md:p-6 space-y-4">
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <h1 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
                {selectedMail.subject}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1 font-mono">
                <div>
                  От: <span className="text-purple-300 font-semibold">{selectedMail.sender}</span>
                </div>
                <div>{selectedMail.date}</div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-line">
              {selectedMail.body}
            </div>

            {selectedMail.corrupted && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono">
                [ВНИМАНИЕ]: Содержимое письма помечено системой мониторинга Директивы 99-B как потенциально опасный контент.
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono">
            Выберите сообщение для чтения
          </div>
        )}
      </div>
    </div>
  );
};
