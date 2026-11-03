// supabase/functions/validateBoard/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

/**
 * Edge Function: validates a link between two evidence items.
 * Expected body: { fromId: string, toId: string }
 */
export const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { fromId, toId } = req.body;
  if (!fromId || !toId) return res.status(400).json({ error: 'Missing ids' });

  const [{ data: from, error: errFrom }, { data: to, error: errTo }] = await Promise.all([
    supabase.from('evidence').select('type,meta').eq('id', fromId).single(),
    supabase.from('evidence').select('type,meta').eq('id', toId).single(),
  ]);

  if (errFrom) return res.status(404).json({ error: 'From evidence not found' });
  if (errTo) return res.status(404).json({ error: 'To evidence not found' });

  // Define allowed connections
  const allowed: Record<string, string[]> = {
    commit: ['vibePrompt', 'document'],
    document: ['image', 'vibePrompt'],
    vibePrompt: ['document'],
    image: [],
  };

  const ok = allowed[from.type]?.includes(to.type);
  if (!ok) return res.status(400).json({ error: `Invalid link ${from.type} → ${to.type}` });

  // Insert link
  const { error: insertErr } = await supabase.from('evidence_links').insert({
    from_evidence: fromId,
    to_evidence: toId,
    link_type: 'reference',
  });
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  // Increase pressure in player_progress (edge case: invalid link also increases pressure on client side)
  await supabase
    .from('player_progress')
    .update({ pressure_level: supabase.raw('pressure_level + 5') })
    .eq('user_id', req.headers['x-user-id'] as string);

  res.status(200).json({ success: true, message: 'Link created' });
};
