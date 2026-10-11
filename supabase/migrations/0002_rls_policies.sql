alter table challenge_departments enable row level security;
alter table challenge_registrations enable row level security;
alter table challenge_admins enable row level security;

-- Departments: public can read only safe columns via a view; direct select denied
drop policy if exists dept_admin_all on challenge_departments;
create policy dept_admin_all on challenge_departments
  for all to authenticated
  using (exists (select 1 from challenge_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from challenge_admins a where a.user_id = auth.uid()));

-- Public read via a security-barrier view (no RLS bypass for whatsapp URL except when is_open)
create or replace view public_departments as
  select id, name_en, name_fr, description_fr, is_open,
         case when is_open and whatsapp_invite_url is not null then true else false end as can_register
  from challenge_departments;

grant select on public_departments to anon, authenticated;

-- Registrations: no direct access for anon; admin full access
drop policy if exists reg_admin_select on challenge_registrations;
create policy reg_admin_select on challenge_registrations
  for select to authenticated
  using (exists (select 1 from challenge_admins a where a.user_id = auth.uid()));

drop policy if exists reg_admin_update on challenge_registrations;
create policy reg_admin_update on challenge_registrations
  for update to authenticated
  using (exists (select 1 from challenge_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from challenge_admins a where a.user_id = auth.uid()));

-- Admins table: self-read only; no insert policy (service_role only writes here)
drop policy if exists admins_self_read on challenge_admins;
create policy admins_self_read on challenge_admins
  for select to authenticated
  using (user_id = auth.uid());
