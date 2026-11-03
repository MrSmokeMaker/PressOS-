// supabase/functions/progressEngine/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

/**
 * Edge Function that advances the investigation phase based on game events.
 * Expected payload: { user_id: string, event: string, payload?: any }
 */
export const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user_id, event, payload } = req.body;
  if (!user_id || !event) return res.status(400).json({ error: 'Missing fields' });

  // fetch current progress
  const { data: progress, error: progErr } = await supabase
    .from('player_progress')
    .select('current_phase')
    .eq('user_id', user_id)
    .single();
  if (progErr) return res.status(500).json({ error: progErr.message });
  const currentPhase = progress?.current_phase ?? 1;

  // Find possible transition from current phase
  const { data: transition, error: transErr } = await supabase
    .from('quest_transitions')
    .select('to_quest, condition')
    .eq('from_quest', currentPhase)
    .single();
  if (transErr) return res.status(200).json({ ok: true, message: 'No further transition' });

  // Very simple condition check – extend as needed
  const condition = transition?.condition ?? {};
  let conditionMet = true;
  if (condition.event && condition.event !== event) conditionMet = false;
  if (condition.payloadKey && payload?.[condition.payloadKey] !== condition.payloadValue) conditionMet = false;

  if (!conditionMet) return res.status(200).json({ ok: true, message: 'Condition not met' });

  // Update phase
  await supabase
    .from('player_progress')
    .update({ current_phase: transition.to_quest })
    .eq('user_id', user_id);

  res.status(200).json({ ok: true, message: 'Phase advanced' });
};
