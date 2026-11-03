import { GoogleGenAI } from '@google/genai';

interface AIONRequest {
  userMessage: string;
  systemPrompt: string;
  role?: 'assistant' | 'creator';
}

export async function fetchAION({ userMessage, systemPrompt }: AIONRequest): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nПользователь: ${userMessage}`,
      });
      if (response.text) {
        return response.text;
      }
    } catch (geminiError) {
      console.warn('Gemini generateContent error:', geminiError);
    }
  }

  // Fallback to legacy AION endpoint if configured
  const apiKey = process.env.AION_API_KEY;
  const endpoint = process.env.AION_API_ENDPOINT;

  if (apiKey && endpoint && !endpoint.includes('aion.xyz')) {
    const payload = {
      model: 'aion-base',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      const data = await resp.json();
      return data.choices?.[0]?.message?.content ?? '';
    }
  }

  return '';
}
