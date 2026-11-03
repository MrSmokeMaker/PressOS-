-- supabase/migrations/20231103_create_game_schema.sql
-- Таблица улик (evidence)
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text check (type in ('document','commit','image','vibePrompt')),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Таблица связей улик (edges)
create table public.evidence_links (
  id uuid primary key default gen_random_uuid(),
  from_evidence uuid references public.evidence(id) on delete cascade,
  to_evidence uuid references public.evidence(id) on delete cascade,
  link_type text check (link_type in ('cause','reference','hint')),
  created_at timestamptz default now()
);

-- Таблица прогресса игрока
create table public.player_progress (
  user_id uuid primary key references auth.users(id),
  current_phase int not null default 1,
  pressure_level int not null default 0,
  inventory jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- Индексы для быстрых поисков по хешу в meta
create index idx_evidence_meta_hash on public.evidence using gin (meta jsonb_path_ops);

-- Триггер обновления updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

create trigger trg_player_progress_updated
before update on public.player_progress
for each row execute function public.touch_updated_at();
