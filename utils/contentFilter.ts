import { supabase } from '../src/utils/supabaseClient';

const DEFAULT_ALLOWED_TOPICS = [
  'pressos',
  'aion',
  'чистая идея',
  'книга',
  'вибкодер',
  'вайбкодер',
  'vibe_sloth',
  'артем',
  'эхо',
  'типография',
  'нейропринт',
  'tx-9041-aion',
  'спецслужбы',
  'директива 99-b',
  'изоляция',
  'терминал',
  'decrypt-core',
  'genesis',
  'коммит',
  'расследовани',
  'улик',
  'сервер',
  'что делать',
  'помощь',
  'кто ты',
];

let cachedTopics: string[] = DEFAULT_ALLOWED_TOPICS;
let lastFetchTime = 0;

export async function isMessageAllowed(userId: string, message: string): Promise<boolean> {
  if (!message || !message.trim()) return false;
  const lowered = message.toLowerCase().trim();

  const isExplicitlyOffTopic =
    /(?:^|\s|[.,!?;:()«»"—-])(погод|рецепт|пирог|футбол|биткоин|крипт|гороскоп|кулинар|кино|музык|выбор|президент|политик)/iu.test(
      lowered
    );

  const hasGameKeyword = cachedTopics.some((t) => lowered.includes(t));

  if (isExplicitlyOffTopic && !hasGameKeyword) {
    return false;
  }

  if (hasGameKeyword) {
    return true;
  }

  const now = Date.now();
  if (now - lastFetchTime > 300000) {
    lastFetchTime = now;
    try {
      const fetchPromise = supabase
        .from('game_rules')
        .select('allowed_topics')
        .limit(1)
        .single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 300));
      const res: any = await Promise.race([fetchPromise, timeoutPromise]);
      if (res?.data?.allowed_topics && Array.isArray(res.data.allowed_topics)) {
        cachedTopics = [...new Set([...DEFAULT_ALLOWED_TOPICS, ...res.data.allowed_topics.map((t: string) => t.toLowerCase())])];
      }
    } catch {}
  }

  if (lowered.length < 50 && /(что|как|где|кто|куда|зачем|почему)/i.test(lowered)) {
    return true;
  }

  return false;
}
