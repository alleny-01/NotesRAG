create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  status text not null default 'pending' check (status in ('pending', 'embedding', 'ready', 'failed')),
  page_count integer check (page_count is null or page_count > 0),
  content_hash text not null,
  created_at timestamptz not null default now(),
  unique (collection_id, content_hash)
);

create table public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  content text not null,
  page_number integer check (page_number is null or page_number > 0),
  chunk_index integer not null check (chunk_index >= 0),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table public.citations (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  chunk_id uuid not null references public.chunks(id) on delete cascade,
  order_index integer not null check (order_index >= 0),
  unique (message_id, order_index)
);

create index collections_user_created_idx on public.collections(user_id, created_at desc);
create index documents_collection_created_idx on public.documents(collection_id, created_at desc);
create index chunks_document_idx on public.chunks(document_id, chunk_index);
create index sessions_collection_created_idx on public.chat_sessions(collection_id, created_at desc);
create index messages_session_created_idx on public.messages(session_id, created_at);