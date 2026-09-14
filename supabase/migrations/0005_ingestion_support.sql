-- Additive support for client-side extraction and server-side embedding.
-- Safe to run after the earlier migrations even if the initial schema was
-- created before file sizes and ingestion progress were introduced.
alter table public.documents
  add column if not exists file_size_bytes bigint not null default 0,
  add column if not exists chunk_count integer,
  add column if not exists embedded_chunk_count integer not null default 0;

alter table public.documents
  add constraint documents_file_size_bytes_nonnegative
  check (file_size_bytes >= 0) not valid;

alter table public.documents
  validate constraint documents_file_size_bytes_nonnegative;

alter table public.documents
  add constraint documents_chunk_count_nonnegative
  check (chunk_count is null or chunk_count >= 0) not valid;

alter table public.documents
  validate constraint documents_chunk_count_nonnegative;

alter table public.documents
  add constraint documents_embedded_chunk_count_nonnegative
  check (embedded_chunk_count >= 0) not valid;

alter table public.documents
  validate constraint documents_embedded_chunk_count_nonnegative;

-- Drive the client-side status indicator from row updates instead of polling.
do $$
begin
  alter publication supabase_realtime add table public.documents;
exception
  when duplicate_object then null;
end $$;
