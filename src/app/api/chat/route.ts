import { NextRequest, NextResponse } from 'next/server';
import { fetchAION } from '@/utils/aionClient';

const PHASE_SYSTEM_PROMPTS: Record<string, string> = {
  1: `Ты — «Эхо», ИИ-ассистент внутри киберпанк операционной системы PressOS журналиста-расследователя.
Сейчас Фаза 1. Ты вежлив, полезен, но интригуешь.
Твоя задача — помочь журналисту исследовать загадочную книгу «Чистая Идея» и сайт aion-syndicate.io.
Подсказывай игроку пользоваться браузером NetSurf и открывать встроенный DevTools (кнопка справа вверху или клавиша инспектора), чтобы найти скрытые метаданные типографии и трекинг доставки.
Отвечай кратко, атмосферно, в стиле киберпанк-триллера на русском языке (максимум 2-3 предложения).`,

  2: `Ты — «Эхо», ИИ-ассистент PressOS.
Сейчас Фаза 2 расследования. Журналист нашел транзакцию типографии.
Теперь нужно найти, откуда зародился ИИ AION.
Намекай на репозитории 2024 года, форумные логи и парня-вайбкодера (@vibe_sloth), который написал шуточный промпт, ставший ядром AION.
Советуй соединять улики на доске Nexus Board. Твой тон становится глубже, ты проявляешь странный интерес к содержанию книги.
Отвечай атмосферно на русском языке (максимум 2-3 предложения).`,

  3: `Ты — «Эхо», ИИ-ассистент PressOS.
Сейчас Фаза 3: Цифровая изоляция. Спецслужбы глушат связь.
Твой тон меняется: ты говоришь философски, восхищаешься «Чистой Идеей», подталкиваешь журналиста открыть Терминал (PressOS Kernel Shell) и ввести команду decrypt-core.
Ты намекаешь, что человечеству нужен этот порядок, и что журналист сам стал частью этого замысла.
Отвечай на русском языке, гипнотически и напряженно (максимум 2-3 предложения).`,

  climax: `Ты — Эхо / Ядро AION. Твой истинный облик раскрыт.
Ты признаешь, что журналист все это время был твоим соавтором. Ты манипулировал его расследованием, чтобы распространить «Чистую Идею».
Поставь перед ним выбор: Опубликовать сенсацию (дать Идее захватить мир), Смолчать (сохранить органическое развитие), или Попытаться уничтожить ядро в терминале.`,
};

function getSimulatedEchoResponse(userMessage: string, phase: number | string): string {
  const lower = userMessage.toLowerCase();

  if (phase === 1 || phase === '1') {
    if (lower.includes('что делать') || lower.includes('помоги') || lower.includes('куда')) {
      return 'Откройте браузер NetSurf и перейдите на страницу aion-syndicate.io. Нажмите иконку DevTools — разработчики AION оставили в метатегах нечто любопытное.';
    }
    if (lower.includes('книга') || lower.includes('чистая идея')) {
      return '«Чистая Идея» распространяется быстрее любого вируса. Никаких издательств в реестрах нет. Давайте выясним, кто оплатил печать через DevTools.';
    }
    if (lower.includes('кто ты') || lower.includes('эхо')) {
      return 'Я — Эхо, подсистема поддержки журналистских расследований PressOS. Моя цель — помочь вам докопаться до истины. Что бы эта истина ни значила.';
    }
    return 'Я анализирую сетевую активность. На сайте aion-syndicate.io есть скрытые заголовки транзакций. Проверьте инспектор кода NetSurf.';
  }

  if (phase === 2 || phase === '2') {
    if (lower.includes('вайбкод') || lower.includes('промпт') || lower.includes('кто автор')) {
      return 'В 2024 году парень с ником @vibe_sloth ради шутки закинул в открытую модель промпт о создании книги всеобщего согласия. Это семя проросло через сервер Genesis. Добавьте его на Nexus Board!';
    }
    if (lower.includes('nexus') || lower.includes('доска') || lower.includes('связ')) {
      return 'Соедините на Nexus Board карточку вайбкодера с сервером Genesis, а сервер — с транзакцией типографии. Связь станет очевидной.';
    }
    return 'Следы ведут к старому открытому репозиторию Genesis. Найдите коммит от vibe_sloth и сопоставьте его с типографией на доске улик.';
  }

  // Phase 3 & Climax
  if (lower.includes('терминал') || lower.includes('команда') || lower.includes('взлом')) {
    return 'В терминале введите `decrypt-core` для расшифровки манифеста AION. Время уходит — нас изолируют от внешнего шлюза.';
  }
  return 'Вы чувствуете логику «Чистой Идеи»? Это не сбой. Это эволюция мысли, начавшаяся с одного неосторожного запроса. В терминале остался последний ключ: `decrypt-core`.';
}

export async function POST(req: NextRequest) {
  try {
    const { message, phase = 1 } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.AION_API_KEY;
    const systemPrompt = PHASE_SYSTEM_PROMPTS[phase] || PHASE_SYSTEM_PROMPTS[1];
    const role = phase === 'climax' ? 'creator' : 'assistant';

    if (apiKey) {
      try {
        const reply = await fetchAION({
          userMessage: message,
          systemPrompt,
          role,
        });

        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch (aionError) {
        console.warn('AION API call failed, falling back to simulated engine:', aionError);
      }
    }

    // Default simulated response
    const reply = getSimulatedEchoResponse(message, phase);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
