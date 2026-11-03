import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id, x-pressure-level',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const userId = req.headers.get('x-user-id');
    const headerPressure = req.headers.get('x-pressure-level');

    let pressureLevel = headerPressure ? Number(headerPressure) : 0;

    if (userId) {
      const { data: progress } = await supabaseClient
        .from('player_progress')
        .select('pressure_level, current_phase')
        .eq('user_id', userId)
        .single();

      if (progress) {
        pressureLevel = progress.pressure_level ?? pressureLevel;
      }
    }

    // Триггер цифровой изоляции: при давлении >= 70 возвращаем 503
    if (pressureLevel >= 70) {
      return new Response(
        JSON.stringify({
          error: '503 Service Unavailable: Gateway Jammed',
          isolated: true,
          directive: 'DIRECTIVE-99B-DEFENSE-INTERCEPTION',
          pressureLevel,
          message:
            'Внимание: Ваш терминал переведен в режим жесткой цифровой изоляции правительственными спецслужбами.',
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '120' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        status: 'online',
        isolated: false,
        pressureLevel,
        message: 'Network channels operational.',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
