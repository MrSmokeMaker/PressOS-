// supabaseClient.ts – единый клиент Supabase для проекта
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-aion-pressos.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_anon_key_pressos';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: подписка на изменения таблицы player_progress
export function subscribeProgress(userId: string, callback: (data: any) => void) {
  try {
    return supabase
      .channel(`public:player_progress:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_progress',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('Realtime subscription fallback:', err);
    return null;
  }
}
