-- XOM 30-Day Challenge: base schema
create extension if not exists "pgcrypto";

create table if not exists challenge_departments (
  id text primary key,
  name_en text not null,
  name_fr text not null,
  description_fr text not null,
  whatsapp_invite_url text,
  is_open boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint chk_dept_id check (id in ('tech','business','health','travel','academic','general')),
  constraint chk_dept_url check (
    whatsapp_invite_url is null
    or whatsapp_invite_url ~ '^https://chat\.whatsapp\.com/[A-Za-z0-9]+(\?.*)?$'
    or whatsapp_invite_url ~ '^https://wa\.me/[0-9]+(\?.*)?$'
  )
);

create table if not exists challenge_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  whatsapp_e164 text not null,
  email_normalized text,
  department text not null references challenge_departments(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_first_name check (length(btrim(first_name)) between 1 and 80),
  constraint chk_last_name  check (length(btrim(last_name))  between 1 and 80),
  constraint chk_phone      check (whatsapp_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  constraint chk_email      check (
    email_normalized is null
    or (email_normalized = lower(btrim(email_normalized)) and length(email_normalized) <= 254)
  ),
  constraint chk_status     check (status in ('active','cancelled'))
);

create unique index if not exists uniq_active_whatsapp
  on challenge_registrations (whatsapp_e164) where status = 'active';

create unique index if not exists uniq_active_email
  on challenge_registrations (email_normalized)
  where status = 'active' and email_normalized is not null;

create index if not exists idx_reg_dept_created
  on challenge_registrations (department, created_at desc);

create table if not exists challenge_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_dept_updated on challenge_departments;
create trigger trg_dept_updated before update on challenge_departments
  for each row execute function set_updated_at();

drop trigger if exists trg_reg_updated on challenge_registrations;
create trigger trg_reg_updated before update on challenge_registrations
  for each row execute function set_updated_at();
