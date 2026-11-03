import { supabase } from '../src/utils/supabaseClient';

export async function logAction(
  userId: string,
  action: string,
  payload: any,
  result: string
): Promise<void> {
  try {
    await supabase.from('audit_log').insert({
      user_id: userId,
      action,
      payload,
      result,
    });
  } catch (e) {
    console.error('Audit log error:', e);
  }
}
