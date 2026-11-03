// supabaseClient.ts – единый клиент Supabase для проекта
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: подписка на изменения таблицы player_progress
export function subscribeProgress(userId: string, callback: (data: any) => void) {
  return supabase
    .channel('public:player_progress')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'player_progress', filter: `user_id=eq.${userId}` }, payload => {
      callback(payload.new);
    })
    .subscribe();
}
