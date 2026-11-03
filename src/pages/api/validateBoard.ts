// pages/api/validateBoard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

/**
 * Proxy to Supabase Edge Function `validateBoard`.
 * Expects same body: { fromId, toId }
 * Passes through the `x-user-id` header for pressure updates.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/validateBoard`;
  const response = await fetch(functionUrl, {
    method: req.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': req.headers['x-user-id'] as string || '',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
