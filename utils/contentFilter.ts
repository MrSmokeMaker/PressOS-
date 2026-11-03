import { supabase } from '../src/utils/supabaseClient';

export async function isMessageAllowed(userId: string, message: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('game_rules')
    .select('allowed_topics')
    .limit(1)
    .single();
  if (error) return true; // fail-open in local development
  const topics: string[] = data?.allowed_topics ?? [];
  if (topics.length === 0) return true;
  const lowered = message.toLowerCase();
  return topics.some((t) => lowered.includes(t.toLowerCase()));
}
