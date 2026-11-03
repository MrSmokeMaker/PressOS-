'use client';

import React, { useState } from 'react';
import { Mail, AlertTriangle, ShieldCheck, Inbox, Send, Archive, ShieldAlert } from 'lucide-react';
import { useOSStore } from '@/store/useOSStore';
import { EmailItem } from '@/types/os';

export const MailClient: React.FC = () => {
  const { emails, markEmailRead, phase, isIsolated } = useOSStore();
  const [selectedMailId, setSelectedMailId] = useState<string>(emails[0]?.id || 'mail-1');

  const visibleEmails = emails.filter((e) => {
    if (typeof phase === 'number') {
      return e.phaseRequired <= phase;
    }
    return true;
  });

  const selectedMail = visibleEmails.find((e) => e.id === selectedMailId) || visibleEmails[0];

  const handleSelect = (mail: EmailItem) => {
    setSelectedMailId(mail.id);
    if (!mail.read) {
      markEmailRead(mail.id);
    }
  };

  return (
    <div className="flex-1 flex bg-[#0e1017] text-slate-200 overflow-hidden font-sans">
      {/* Mail Sidebar */}
      <div className="w-56 bg-[#090b10] border-r border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
          <span>PRESSMAIL ENCRYPTED</span>
          {isIsolated && (
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

        {isIsolated && (
          <div className="m-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-[11px] text-rose-300 font-mono leading-tight">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>СБОЙ ШЛЮЗА</span>
            </div>
            Внешние серверы заблокированы правительственным файрволом.
          </div>
        )}
      </div>

      {/* Email List Column */}
      <div className="w-72 bg-[#0c0e14] border-r border-slate-800 flex flex-col">
        <div className="p-2.5 border-b border-slate-800 text-xs font-mono text-slate-400">
          Сообщения ({visibleEmails.length})
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
                  <span className="font-mono truncate font-medium text-slate-300">
                    {mail.sender}
                  </span>
                  <span className="text-[10px]">{mail.date}</span>
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
      <div className="flex-1 flex flex-col bg-[#111420] overflow-y-auto">
        {selectedMail ? (
          <div className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-100 font-sans">
                  {selectedMail.subject}
                </h2>
                <span className="text-xs font-mono text-slate-400">{selectedMail.date}</span>
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">От:</span>
                <span className="text-purple-300 font-medium">{selectedMail.sender}</span>
              </div>
            </div>

            <div
              className={`text-xs leading-relaxed font-sans text-slate-200 whitespace-pre-wrap ${
                selectedMail.corrupted ? 'font-mono text-rose-300 bg-black/40 p-4 rounded-lg border border-rose-500/30' : ''
              }`}
            >
              {selectedMail.body}
            </div>

            {selectedMail.id === 'mail-3' && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold font-mono">ДИРЕКТИВА БЕЗОПАСНОСТИ 99-B</div>
                  <div className="mt-1 text-[11px] text-rose-300/80">
                    Трассировка входящего трафика подтверждает перехват. Немедленно завершите расследование через защищенный терминал ядра.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs font-mono text-slate-500">
            Выберите письмо для чтения
          </div>
        )}
      </div>
    </div>
  );
};
