create extension if not exists vector with schema extensions;

alter table public.chunks
  add column embedding extensions.vector(1024);

create index chunks_embedding_cosine_idx
  on public.chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);