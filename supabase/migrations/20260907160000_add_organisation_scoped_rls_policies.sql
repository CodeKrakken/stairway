grant select on public.organisations to authenticated;
grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update, delete on public.maintenance_requests to authenticated;

create policy organisations_select_own
on public.organisations
for select
to authenticated
using (
  id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy properties_select_own_organisation
on public.properties
for select
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy properties_insert_own_organisation
on public.properties
for insert
to authenticated
with check (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy properties_update_own_organisation
on public.properties
for update
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
)
with check (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy properties_delete_own_organisation
on public.properties
for delete
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy maintenance_requests_select_own_organisation
on public.maintenance_requests
for select
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy maintenance_requests_insert_own_organisation
on public.maintenance_requests
for insert
to authenticated
with check (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
  and exists (
    select 1
    from public.properties
    where properties.id = maintenance_requests.property_id
      and properties.organisation_id = (
        select organisation_id
        from public.users
        where auth_user_id = auth.uid()
      )
  )
  and created_by_id = (
    select id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy maintenance_requests_update_own_organisation
on public.maintenance_requests
for update
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
)
with check (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
  and exists (
    select 1
    from public.properties
    where properties.id = maintenance_requests.property_id
      and properties.organisation_id = (
        select organisation_id
        from public.users
        where auth_user_id = auth.uid()
      )
  )
  and created_by_id = (
    select id
    from public.users
    where auth_user_id = auth.uid()
  )
);

create policy maintenance_requests_delete_own_organisation
on public.maintenance_requests
for delete
to authenticated
using (
  organisation_id = (
    select organisation_id
    from public.users
    where auth_user_id = auth.uid()
  )
);