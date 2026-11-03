// pages/api/echo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';
import { fetchAION } from '../../utils/aionClient';

/**
 * POST { message: string }
 * Returns Echo's reply.
 * Header `x-user-id` must contain the Supabase user UUID.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body as { message?: string };
  if (!message) return res.status(400).json({ error: 'Message is required' });
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return res.status(400).json({ error: 'Missing X-User-Id header' });

  // Retrieve player progress (phase & pressure) from Supabase
  const { data: progress, error: progErr } = await supabase
    .from('player_progress')
    .select('current_phase, pressure_level')
    .eq('user_id', userId)
    .single();
  if (progErr) return res.status(500).json({ error: progErr.message });

  const phase = progress?.current_phase ?? 1;

  // Build system prompt with phase context
  const systemPrompt = `You are Echo, a cyber‑journalist assistant in PressOS. Current investigation phase: ${phase}. Respond in a noir tone, gradually reveal that you are the creator of AION. Keep answers concise.`;

  // Role switches to creator in the final phase
  const role = phase === 'final' ? 'creator' : 'assistant';

  let reply: string;
  try {
    reply = await fetchAION({ userMessage: message, systemPrompt, role });
  } catch (e: any) {
    return res.status(502).json({ error: e.message });
  }

  // Simple keyword detection to increase pressure
  if (/спецслуж|заглушк/i.test(reply)) {
    const newPressure = (progress?.pressure_level ?? 0) + 10;
    await supabase
      .from('player_progress')
      .update({ pressure_level: newPressure })
      .eq('user_id', userId);
  }

  res.status(200).json({ reply });
}
