-- supabase/migrations/20231103_game_rules_and_audit.sql
-- Таблица правил игры (разрешённые темы)
create table public.game_rules (
  id uuid primary key default gen_random_uuid(),
  allowed_topics text[] not null, -- массив ключевых слов/имен
  created_at timestamptz default now()
);

-- Таблица квестов и переходов (сюжетный граф)
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,            -- короткий идентификатор квеста
  title text not null,
  description text,
  required_phase int not null,          -- фазa, при которой квест доступен
  created_at timestamptz default now()
);

create table public.quest_transitions (
  id uuid primary key default gen_random_uuid(),
  from_quest uuid references public.quests(id) on delete cascade,
  to_quest uuid references public.quests(id) on delete cascade,
  condition jsonb not null,             -- условия перехода, напр. { "evidence_link": true }
  created_at timestamptz default now()
);

-- Таблица аудита действий игрока
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,                  -- e.g. 'echo_request', 'link_created'
  payload jsonb,                        -- оригинальные данные запроса/ответа
  result text,                          -- 'allowed' | 'blocked'
  created_at timestamptz default now()
);

-- Индексы для ускорения поиска
create index idx_quest_slug on public.quests(slug);
create index idx_audit_user on public.audit_log(user_id);
