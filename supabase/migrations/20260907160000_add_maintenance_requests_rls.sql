grant select on public.maintenance_requests to authenticated;
grant insert (
  organisation_id,
  property_id,
  created_by_id,
  title,
  description,
  status,
  priority
) on public.maintenance_requests to authenticated;
grant update (status, priority) on public.maintenance_requests to authenticated;

grant select on public.properties to authenticated;

alter table public.properties enable row level security;

create policy properties_select_own_organisation
on public.properties
for select
to authenticated
using (
  organisation_id = (
    select users.organisation_id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
);

alter table public.maintenance_requests enable row level security;

create policy maintenance_requests_select_own_organisation
on public.maintenance_requests
for select
to authenticated
using (
  organisation_id = (
    select users.organisation_id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
);

create policy maintenance_requests_insert_own_organisation
on public.maintenance_requests
for insert
to authenticated
with check (
  organisation_id = (
    select users.organisation_id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
  and created_by_id = (
    select users.id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.properties
    where properties.id = maintenance_requests.property_id
      and properties.organisation_id = maintenance_requests.organisation_id
  )
);

create policy maintenance_requests_update_own_organisation
on public.maintenance_requests
for update
to authenticated
using (
  organisation_id = (
    select users.organisation_id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
)
with check (
  organisation_id = (
    select users.organisation_id
    from public.users
    where users.auth_user_id = (select auth.uid())
  )
);