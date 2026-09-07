alter table public.users
  add column auth_user_id uuid;

alter table public.users
  add constraint users_auth_user_id_unique unique (auth_user_id);

alter table public.users
  add constraint users_auth_user_id_fkey
  foreign key (auth_user_id)
  references auth.users (id)
  on delete cascade;