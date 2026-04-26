
-- ---------- Sequences ----------
create sequence if not exists public.ngo_client_seq start 1;
create sequence if not exists public.coordinator_seq start 1;
create sequence if not exists public.payment_seq start 1;

-- ---------- payment_code column ----------
alter table public.payments add column if not exists payment_code text unique;

-- ---------- Auto-code triggers ----------
create or replace function public.set_ngo_client_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.client_code is null or new.client_code = '' then
    new.client_code := 'MPFH-NGO-' || lpad(nextval('public.ngo_client_seq')::text, 4, '0');
  end if;
  return new;
end; $$;

drop trigger if exists trg_set_ngo_client_code on public.ngo_clients;
create trigger trg_set_ngo_client_code before insert on public.ngo_clients
for each row execute function public.set_ngo_client_code();

create or replace function public.set_coordinator_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.member_code is null or new.member_code = '' then
    new.member_code := 'MPFH-CO-' || lpad(nextval('public.coordinator_seq')::text, 4, '0');
  end if;
  if new.referral_code is null or new.referral_code = '' then
    new.referral_code := 'REF-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  end if;
  return new;
end; $$;

drop trigger if exists trg_set_coordinator_code on public.coordinators;
create trigger trg_set_coordinator_code before insert on public.coordinators
for each row execute function public.set_coordinator_code();

create or replace function public.set_payment_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.payment_code is null or new.payment_code = '' then
    new.payment_code := 'PAY-MPFH-' || lpad(nextval('public.payment_seq')::text, 4, '0');
  end if;
  return new;
end; $$;

drop trigger if exists trg_set_payment_code on public.payments;
create trigger trg_set_payment_code before insert on public.payments
for each row execute function public.set_payment_code();

-- ---------- admin_tasks ----------
create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  status text not null default 'pending',
  assigned_to text,
  due_date date,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_tasks enable row level security;

create policy "Admins manage admin_tasks"
on public.admin_tasks for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger reuse
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_admin_tasks_touch on public.admin_tasks;
create trigger trg_admin_tasks_touch before update on public.admin_tasks
for each row execute function public.touch_updated_at();

-- ---------- Public coordinator application policy ----------
create policy "Anyone can submit valid coordinator application"
on public.coordinators for insert to anon, authenticated
with check (
  length(trim(full_name)) between 2 and 100
  and length(trim(mobile)) between 7 and 20
  and length(trim(state)) between 2 and 60
  and length(trim(district)) between 2 and 60
  and role_level in ('district','block','panchayat')
  and approval_status = 'pending'
  and user_id is null
);
