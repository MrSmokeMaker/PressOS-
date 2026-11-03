import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

interface AIONRequest {
  userMessage: string;
  systemPrompt: string;
  role?: 'assistant' | 'creator';
  phase?: number | string;
}

const DEFAULT_SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

/**
 * Шлюз запросов к Gemini API с экспоненциальным backoff (повторами)
 * и официальными настройками safetySettings для детективного контекста.
 */
export async function fetchAION({
  userMessage,
  systemPrompt,
  role = 'assistant',
}: AIONRequest): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.AION_API_KEY;

  if (geminiKey && !geminiKey.startsWith('your_')) {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];

    for (const model of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: userMessage,
            config: {
              systemInstruction: systemPrompt,
              temperature: role === 'creator' ? 0.9 : 0.7,
              maxOutputTokens: 500,
              safetySettings: DEFAULT_SAFETY_SETTINGS,
            },
          });

          if (response?.text) {
            return response.text.trim();
          }
          break;
        } catch (err: any) {
          attempts++;
          const isRateLimit = err?.status === 429 || err?.message?.includes('429');
          if (isRateLimit && attempts < maxAttempts) {
            // Экспоненциальная задержка перед повторной попыткой
            await new Promise((resolve) => setTimeout(resolve, 800 * attempts));
            continue;
          }
          console.warn(`[AION Gateway] Model ${model} attempt ${attempts} failed:`, err?.message || err);
          break; // Пробуем следующую модель
        }
      }
    }
  }

  // Fallback к кастомному AION HTTP endpoint, если настроен
  const legacyEndpoint = process.env.AION_API_ENDPOINT;
  if (legacyEndpoint && !legacyEndpoint.includes('aion.xyz') && geminiKey) {
    try {
      const resp = await fetch(legacyEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${geminiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'aion-base',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        return data.choices?.[0]?.message?.content ?? '';
      }
    } catch (e) {
      console.warn('[AION Gateway] Legacy endpoint error:', e);
    }
  }

  return '';
}
