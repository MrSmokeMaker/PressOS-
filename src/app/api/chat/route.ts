import { NextRequest, NextResponse } from 'next/server';
import { fetchAION } from '@/utils/aionClient';
import { PHASE_SYSTEM_PROMPTS, getSimulatedEchoResponse } from '@/utils/echoEngine';

export async function POST(req: NextRequest) {
  try {
    const { message, phase = 1 } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = PHASE_SYSTEM_PROMPTS[phase] || PHASE_SYSTEM_PROMPTS[1];
    const role = phase === 'climax' ? 'creator' : 'assistant';

    try {
      const reply = await fetchAION({
        userMessage: message,
        systemPrompt,
        role,
      });

      if (reply) {
        return NextResponse.json({ reply });
      }
    } catch (apiError) {
      console.warn('AI API call failed, falling back to simulated engine:', apiError);
    }

    // Default simulated response
    const reply = getSimulatedEchoResponse(message, phase);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
