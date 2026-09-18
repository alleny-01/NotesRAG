-- Retrieve only chunks belonging to the authenticated user's active collection.
-- The threshold is applied in SQL so callers never receive weak matches.
create or replace function public.match_collection_chunks(
  target_collection_id uuid,
  query_embedding extensions.vector(1024),
  similarity_threshold double precision default 0.72,
  result_limit integer default 5,
  target_document_id uuid default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  filename text,
  content text,
  page_number integer,
  chunk_index integer,
  similarity double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    chunks.id as chunk_id,
    documents.id as document_id,
    documents.filename,
    chunks.content,
    chunks.page_number,
    chunks.chunk_index,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from public.chunks
  join public.documents on documents.id = chunks.document_id
  where public.user_owns_collection(target_collection_id)
    and documents.collection_id = target_collection_id
    and documents.status = 'ready'
    and chunks.embedding is not null
    and (target_document_id is null or documents.id = target_document_id)
    and 1 - (chunks.embedding <=> query_embedding) >= similarity_threshold
  order by chunks.embedding <=> query_embedding
  limit least(greatest(result_limit, 1), 10);
$$;

revoke all on function public.match_collection_chunks(uuid, extensions.vector, double precision, integer, uuid) from public;
grant execute on function public.match_collection_chunks(uuid, extensions.vector, double precision, integer, uuid) to authenticated;
