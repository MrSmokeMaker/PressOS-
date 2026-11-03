import { supabase } from './supabaseClient';

/**
 * Записывает действие игрока в таблицу audit_log.
 * @param userId  UUID пользователя из Supabase auth
 * @param action  Краткое название действия (e.g. 'echo_request')
 * @param payload Данные запроса/ответа (будет сохранено как JSON)
 * @param result  'allowed' | 'blocked' | 'success' | 'error'
 */
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
    // Не бросаем ошибку дальше – аудит не должен ломать основной поток
    console.error('Audit log error:', e);
  }
}
