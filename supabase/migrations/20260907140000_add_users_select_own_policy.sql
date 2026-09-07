create policy users_select_own
on public.users
for select
to authenticated
using (auth_user_id = auth.uid());