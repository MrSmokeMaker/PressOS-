import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAION } from '@/utils/aionClient';
import { PHASE_SYSTEM_PROMPTS, getSimulatedEchoResponse } from '@/utils/echoEngine';
import { isMessageAllowed } from '@/utils/contentFilter';
import { logAction } from '@/utils/audit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, phase = 1, userId = 'pressos-local-agent' } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Проверка контент-фильтра (ИИ не отвечает на посторонние темы)
    const allowed = await isMessageAllowed(userId, message);

    // 2. Аудит запроса
    await logAction(userId, 'echo_chat_request', { message, phase }, allowed ? 'allowed' : 'blocked');

    if (!allowed) {
      return res.status(403).json({
        reply:
          'Я — Эхо, цифровой ассистент расследования PressOS. Мой протокол ограничен анализом инцидента AION, книги «Чистая Идея», серверов типографии и поиска вайбкодера. Пожалуйста, сосредоточьтесь на материалах дела.',
        filtered: true,
      });
    }

    const systemPrompt = PHASE_SYSTEM_PROMPTS[phase] || PHASE_SYSTEM_PROMPTS[1];
    const role = phase === 'climax' ? 'creator' : 'assistant';

    try {
      const reply = await fetchAION({
        userMessage: message,
        systemPrompt,
        role,
      });

      if (reply) {
        return res.status(200).json({ reply });
      }
    } catch (apiError) {
      console.warn('AI API call failed, falling back to simulated engine:', apiError);
    }

    const reply = getSimulatedEchoResponse(message, phase);
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
