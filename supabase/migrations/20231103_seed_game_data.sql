-- supabase/migrations/20231103_seed_game_data.sql
-- Insert initial allowed topics for the game
INSERT INTO public.game_rules (allowed_topics)
VALUES (ARRAY['pressos','aion','чистая идея','книга','вибкодер','эхо','спецслужбы']);

-- Insert quests (phases)
INSERT INTO public.quests (slug, title, description, required_phase)
VALUES
  ('phase-1', 'Начало расследования', 'Получить первую улику', 1),
  ('phase-2', 'Связывание улик', 'Связать полученные улики', 2),
  ('phase-3', 'Противостояние', 'Сразиться с спецслужбами', 3),
  ('final',   'Развязка', 'Открыть тайну АИОН', 4);

-- Insert transitions between phases
-- from phase 1 -> phase 2 when a valid link is created
INSERT INTO public.quest_transitions (from_quest, to_quest, "condition")
SELECT q1.id, q2.id, '{"event":"link_created","payloadKey":"valid","payloadValue":true}'::jsonb
FROM public.quests q1
JOIN public.quests q2 ON q2.slug = 'phase-2'
WHERE q1.slug = 'phase-1';

-- phase 2 -> phase 3 when pressure reaches 50 (example condition)
INSERT INTO public.quest_transitions (from_quest, to_quest, "condition")
SELECT q1.id, q3.id, '{"event":"pressure_reached","payloadKey":"level","payloadValue":50}'::jsonb
FROM public.quests q1
JOIN public.quests q3 ON q3.slug = 'phase-3'
WHERE q1.slug = 'phase-2';

-- phase 3 -> final when another valid link is created
INSERT INTO public.quest_transitions (from_quest, to_quest, "condition")
SELECT q1.id, qf.id, '{"event":"link_created","payloadKey":"valid","payloadValue":true}'::jsonb
FROM public.quests q1
JOIN public.quests qf ON qf.slug = 'final'
WHERE q1.slug = 'phase-3';
