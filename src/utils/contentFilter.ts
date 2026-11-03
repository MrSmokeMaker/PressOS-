import { supabase } from './supabaseClient';

const DEFAULT_ALLOWED_TOPICS = [
  'pressos',
  'aether',
  'aion',
  'чистая идея',
  'книга',
  'вибкодер',
  'вайбкодер',
  'vibe_sloth',
  'артем',
  'артём',
  'майя лин',
  'майя',
  'hex_weaver',
  'итан',
  'эхо',
  'типография',
  'нейропринт',
  'tx-9041-aether',
  'tx-9041',
  'спецслужбы',
  'директива 99-b',
  'директива',
  'изоляция',
  'терминал',
  'decrypt-core',
  'trace-aether',
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

/**
 * Проверяет, относится ли сообщение к игровому контексту расследования «Проект AETHER».
 */
export async function isMessageAllowed(userId: string, message: string): Promise<boolean> {
  if (!message || !message.trim()) return false;

  const lowered = message.toLowerCase().trim();

  // 1. Проверка явных посторонних тем
  const OFF_TOPIC_KEYWORDS = [
    'погода', 'погоде', 'погоду', 'рецепт', 'пирог', 'футбол',
    'биткоин', 'гороскоп', 'кулинар', 'кино', 'музыка', 'выборы',
    'президент', 'политик'
  ];

  const hasOffTopicKeyword = OFF_TOPIC_KEYWORDS.some((kw) => lowered.includes(kw));
  const hasGameKeyword = cachedTopics.some((t) => lowered.includes(t));

  if (hasOffTopicKeyword && !hasGameKeyword) {
    return false;
  }

  // Если есть постороннее слово и при этом нет явного игрового ядра расследования
  if (hasOffTopicKeyword) {
    const isCoreGame = /(чистая идея|aether|aion|vibe_sloth|типографи|genesis|спецслужб)/i.test(lowered);
    if (!isCoreGame) return false;
  }

  if (hasGameKeyword) {
    return true;
  }

  // 2. Обновление топиков из Supabase в фоне с быстрым таймаутом
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

  // Если сообщение короткий вопрос по игре (например "что делать?", "кто ты?")
  if (lowered.length < 50 && /(что делать|куда идти|кто ты|как играть|помоги)/i.test(lowered)) {
    return true;
  }

  return false;
}
