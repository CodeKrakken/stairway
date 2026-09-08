create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_role_check check (role in ('admin', 'member')),
  constraint users_email_unique unique (email)
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  name text not null,
  address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_by_id uuid not null references public.users (id) on delete restrict,
  title text not null,
  description text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maintenance_requests_status_check check (status in ('open', 'in_progress', 'resolved')),
  constraint maintenance_requests_priority_check check (priority in ('low', 'medium', 'high'))
);

alter table public.organisations enable row level security;
alter table public.users enable row level security;
alter table public.properties enable row level security;
alter table public.maintenance_requests enable row level security;

create index users_organisation_id_idx on public.users (organisation_id);
create index properties_organisation_id_idx on public.properties (organisation_id);
create index maintenance_requests_organisation_id_idx on public.maintenance_requests (organisation_id);
create index maintenance_requests_property_id_idx on public.maintenance_requests (property_id);
create index maintenance_requests_created_by_id_idx on public.maintenance_requests (created_by_id);
create index maintenance_requests_status_idx on public.maintenance_requests (status);
create index maintenance_requests_priority_idx on public.maintenance_requests (priority);