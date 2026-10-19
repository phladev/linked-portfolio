-- Painel de prospecção: só adiciona objetos novos. Não altera nem remove nada existente.
-- Reversão: drop table lead_interactions, leads, message_templates, demos; drop type lead_stage, lead_niche, lead_source, site_quality, interaction_type;

do $$ begin create type lead_stage as enum ('novo','contatado','demo_enviada','respondeu','reuniao','proposta','fechado','perdido'); exception when duplicate_object then null; end $$;
do $$ begin create type lead_niche as enum ('advocacia','clinica','imobiliaria','restaurante','academia','barbearia','outro'); exception when duplicate_object then null; end $$;
do $$ begin create type lead_source as enum ('google','maps','instagram','anuncios','indicacao','outro'); exception when duplicate_object then null; end $$;
do $$ begin create type site_quality as enum ('desconhecido','nenhum','fraco','bom'); exception when duplicate_object then null; end $$;
do $$ begin create type interaction_type as enum ('whatsapp','ligacao','email','instagram','reuniao','nota','etapa'); exception when duplicate_object then null; end $$;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche lead_niche not null default 'outro',
  city text,
  contact_name text,
  phone text,
  instagram text,
  website text,
  email text,
  source lead_source not null default 'outro',
  stage lead_stage not null default 'novo',
  site_quality site_quality not null default 'desconhecido',
  runs_ads boolean not null default false,
  demo_slug text,
  next_action_at date,
  next_action_note text,
  value_estimate integer,
  lost_reason text,
  notes text,
  last_contact_at timestamptz,
  stage_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_stage_idx on leads (stage);
create index if not exists leads_next_action_idx on leads (next_action_at);

create table if not exists lead_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type interaction_type not null,
  content text not null default '',
  demo_slug text,
  created_at timestamptz not null default now()
);
create index if not exists lead_interactions_lead_idx on lead_interactions (lead_id, created_at);

create table if not exists message_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche lead_niche,
  body text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists demos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  niche lead_niche,
  url text not null,
  note text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
