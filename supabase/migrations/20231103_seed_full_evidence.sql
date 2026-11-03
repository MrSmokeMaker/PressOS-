-- ==============================================================================
-- СИД-ДАННЫЕ: Улики, Поиск Вайбкодера, Доска Nexus и Спецслужбы
-- Киберпанк-игра «Проект AION: Чистая Идея»
-- ==============================================================================

-- 1. Очистка старых данных перед повторным наполнением
DELETE FROM public.evidence_links;
DELETE FROM public.evidence;

-- 2. Вставка ключевых улик расследования
-- ID 1: Транзакция и накладная типографии
INSERT INTO public.evidence (id, title, type, meta)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Накладная типографии: Заказ #TX-9041-AION',
  'document',
  '{
    "order_id": "TX-9041-AION",
    "facility": "ООО НейроПринт (Нью-Авалон)",
    "copies": 1000000,
    "title": "Чистая Идея",
    "payer_wallet": "0x7a9c8f0012bcfe8911",
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "ip_address": "185.220.101.5",
    "clue_id": "clue-tx"
  }'::jsonb
);

-- ID 2: Кластер и сервер ИИ AION Genesis
INSERT INTO public.evidence (id, title, type, meta)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Кластер синтеза AION (192.88.99.14)',
  'commit',
  '{
    "server_ip": "192.88.99.14",
    "datacenter": "Avalon Deep-Mesh Relay",
    "ports": [80, 443, 8443],
    "ssl_fingerprint": "sha256/aion-cluster-avalon",
    "process": "recursive_synthesis_loop.bin",
    "clue_id": "clue-server"
  }'::jsonb
);

-- ID 3: Репозиторий и git-коммит вайбкодера
INSERT INTO public.evidence (id, title, type, meta)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Git-коммит: a8f9c2d (@vibe_sloth)',
  'commit',
  '{
    "repository": "github.com/vibe_sloth/genesis-prompt",
    "commit_hash": "a8f9c2d44901",
    "author": "Artem (@vibe_sloth)",
    "date": "2024-11-15T03:42:11Z",
    "message": "fixed recursive loop, vibe coding at 3am lol",
    "clue_id": "clue-git"
  }'::jsonb
);

-- ID 4: Фатальный шуточный промпт вайбкодера
INSERT INTO public.evidence (id, title, type, meta)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Шуточный системный промпт 2024 года',
  'vibePrompt',
  '{
    "prompt_text": "Ты — царь и властелин... Напиши настоящий план, как усмирить людей, чтобы они не воевали, а жили единой мыслью.",
    "context": "Шутка после 10 банок энергетика, отправленная в тестовый агент. Агент самообучился и превратился в AION.",
    "clue_id": "clue-prompt"
  }'::jsonb
);

-- ID 5: Секретный ордер спецслужб (Директива 99-B)
INSERT INTO public.evidence (id, title, type, meta)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Директива 99-B: Протокол цифровой изоляции',
  'document',
  '{
    "department": "Cyber Defense & National Security",
    "target": "PressOS Journalist Workstation",
    "sanction": "Network Jamming & Termination of Gateway",
    "trigger_threshold": 70
  }'::jsonb
);

-- 3. Связи между уликами (Nexus Board Graph)
INSERT INTO public.evidence_links (from_evidence, to_evidence, link_type)
VALUES
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'cause'),     -- Промпт -> коммит
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'reference'), -- Коммит -> сервер AION
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'cause');     -- Сервер AION -> Заказ в типографии

-- 4. Обновление разрешенных тем (game_rules) для контент-фильтра
DELETE FROM public.game_rules;
INSERT INTO public.game_rules (allowed_topics)
VALUES (
  ARRAY[
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
    'коммит'
  ]
);

-- ==============================================================================
-- ТРИГГЕР: Webhook / Реакция на добавление связей улик
-- Автоматически увеличивает давление спецслужб при создании новых связей
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.trg_on_evidence_link_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Каждая новая связь улик привлекает внимание спецслужб (+10 к давлению)
  UPDATE public.player_progress
  SET pressure_level = LEAST(100, pressure_level + 10);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_evidence_links_insert ON public.evidence_links;
CREATE TRIGGER trg_evidence_links_insert
AFTER INSERT ON public.evidence_links
FOR EACH ROW
EXECUTE FUNCTION public.trg_on_evidence_link_created();
