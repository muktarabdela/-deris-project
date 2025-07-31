create table public.users (
  id uuid not null default gen_random_uuid (),
  telegram_user_id bigint not null,
  first_name text not null,
  username text null,
  profile_picture_url text null,
  role public.Role not null default 'STUDENT'::"Role",
  points integer not null default 0,
  current_ders_id text null,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;

create unique INDEX IF not exists users_telegram_user_id_key on public.users using btree (telegram_user_id) TABLESPACE pg_default;

create trigger on_users_update BEFORE
update on users for EACH row
execute FUNCTION handle_updated_at ();