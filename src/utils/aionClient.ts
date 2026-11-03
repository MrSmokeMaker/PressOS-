// aionClient.ts – thin wrapper over AION chat endpoint
// Uses global fetch in Next.js runtime

interface AIONRequest {
  userMessage: string;
  systemPrompt: string;
  role?: 'assistant' | 'creator';
}

export async function fetchAION({ userMessage, systemPrompt, role = 'assistant' }: AIONRequest): Promise<string> {
  const apiKey = process.env.AION_API_KEY;
  const endpoint = process.env.AION_API_ENDPOINT || 'https://api.aion.xyz/v1/chat';

  const payload = {
    model: 'aion-base',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    // role influences system prompt; we can also send custom metadata if AION supports it
    metadata: { role },
  };

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`AION API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  // Assume response format { choices: [{ message: { content: string } }] }
  return data.choices?.[0]?.message?.content ?? '';
}
