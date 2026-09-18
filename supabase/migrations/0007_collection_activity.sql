-- Activity fields drive the library's frequently-opened ordering.
alter table public.collections
  add column if not exists last_opened_at timestamptz,
  add column if not exists open_count integer not null default 0;

alter table public.collections
  add constraint collections_open_count_nonnegative
  check (open_count >= 0) not valid;

alter table public.collections
  validate constraint collections_open_count_nonnegative;

create index if not exists collections_user_open_count_idx
  on public.collections (user_id, open_count desc, last_opened_at desc nulls last);

create or replace function public.record_collection_open(target_collection_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.collections
  set
    open_count = open_count + 1,
    last_opened_at = now()
  where id = target_collection_id
    and user_id = (select auth.uid());

  if not found then
    raise exception 'Collection not found.' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.record_collection_open(uuid) from public;
grant execute on function public.record_collection_open(uuid) to authenticated;
