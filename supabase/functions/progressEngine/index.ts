// supabase/functions/progressEngine/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://demo-aion-pressos.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'mock_key'
);

/**
 * Edge Function that advances the investigation phase based on game events
 * and evaluates advanced narrative conditions (pressure thresholds, complex links).
 * Expected payload: { user_id: string, event: string, payload?: any }
 */
export const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { user_id, event, payload } = req.body;
  if (!user_id || !event) return res.status(400).json({ error: 'Missing required parameters' });

  // 1. Получаем текущий прогресс игрока
  const { data: progress, error: progErr } = await supabase
    .from('player_progress')
    .select('current_phase, pressure_level, inventory')
    .eq('user_id', user_id)
    .single();

  if (progErr && progErr.code !== 'PGRST116') {
    return res.status(500).json({ error: progErr.message });
  }

  const currentPhase = progress?.current_phase ?? 1;
  const currentPressure = progress?.pressure_level ?? 0;

  // 2. Ищем доступный переход для текущей фазы
  const { data: transitions, error: transErr } = await supabase
    .from('quest_transitions')
    .select('to_quest, condition')
    .eq('from_quest', currentPhase);

  if (transErr || !transitions || transitions.length === 0) {
    return res.status(200).json({ ok: true, message: 'No transitions defined for current phase' });
  }

  // 3. Проверка сложных составных условий (событие, уровень давления, связи)
  let matchedTransition: any = null;

  for (const trans of transitions) {
    const condition = trans.condition || {};
    let isMatch = true;

    if (condition.event && condition.event !== event) {
      isMatch = false;
    }
    if (condition.payloadKey && payload?.[condition.payloadKey] !== condition.payloadValue) {
      isMatch = false;
    }
    // Проверка порога давления спецслужб (например, pressure_level >= 50)
    if (condition.pressure_level_gte && currentPressure < condition.pressure_level_gte) {
      isMatch = false;
    }

    if (isMatch) {
      matchedTransition = trans;
      break;
    }
  }

  if (!matchedTransition) {
    return res.status(200).json({
      ok: true,
      message: 'Transition conditions not fully satisfied yet',
      currentPhase,
      currentPressure,
    });
  }

  // 4. Переход на следующую фазу и обновление давления
  const nextPhase = matchedTransition.to_quest;
  await supabase
    .from('player_progress')
    .update({
      current_phase: nextPhase,
      pressure_level: Math.min(100, currentPressure + 15),
    })
    .eq('user_id', user_id);

  return res.status(200).json({
    ok: true,
    message: `Phase successfully advanced to ${nextPhase}`,
    newPhase: nextPhase,
  });
};
