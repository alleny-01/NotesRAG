alter table public.collections enable row level security;
alter table public.documents enable row level security;
alter table public.chunks enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.citations enable row level security;

create function public.user_owns_collection(target_collection_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.collections
    where id = target_collection_id
      and user_id = (select auth.uid())
  );
$$;

create function public.user_owns_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.documents documents
    join public.collections collections on collections.id = documents.collection_id
    where documents.id = target_document_id
      and collections.user_id = (select auth.uid())
  );
$$;

create function public.user_owns_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_sessions sessions
    join public.collections collections on collections.id = sessions.collection_id
    where sessions.id = target_session_id
      and collections.user_id = (select auth.uid())
  );
$$;

create function public.user_owns_message(target_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.messages messages
    join public.chat_sessions sessions on sessions.id = messages.session_id
    join public.collections collections on collections.id = sessions.collection_id
    where messages.id = target_message_id
      and collections.user_id = (select auth.uid())
  );
$$;

revoke all on function public.user_owns_collection(uuid) from public;
revoke all on function public.user_owns_document(uuid) from public;
revoke all on function public.user_owns_session(uuid) from public;
revoke all on function public.user_owns_message(uuid) from public;
grant execute on function public.user_owns_collection(uuid) to authenticated;
grant execute on function public.user_owns_document(uuid) to authenticated;
grant execute on function public.user_owns_session(uuid) to authenticated;
grant execute on function public.user_owns_message(uuid) to authenticated;

create policy "collections select own" on public.collections for select to authenticated using ((select auth.uid()) = user_id);
create policy "collections insert own" on public.collections for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "collections update own" on public.collections for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "collections delete own" on public.collections for delete to authenticated using ((select auth.uid()) = user_id);

create policy "documents select in own collection" on public.documents for select to authenticated using (public.user_owns_collection(collection_id));
create policy "documents insert in own collection" on public.documents for insert to authenticated with check (public.user_owns_collection(collection_id));
create policy "documents update in own collection" on public.documents for update to authenticated using (public.user_owns_collection(collection_id)) with check (public.user_owns_collection(collection_id));
create policy "documents delete in own collection" on public.documents for delete to authenticated using (public.user_owns_collection(collection_id));

create policy "chunks select in own document" on public.chunks for select to authenticated using (public.user_owns_document(document_id));
create policy "chunks insert in own document" on public.chunks for insert to authenticated with check (public.user_owns_document(document_id));
create policy "chunks update in own document" on public.chunks for update to authenticated using (public.user_owns_document(document_id)) with check (public.user_owns_document(document_id));
create policy "chunks delete in own document" on public.chunks for delete to authenticated using (public.user_owns_document(document_id));

create policy "sessions select in own collection" on public.chat_sessions for select to authenticated using (public.user_owns_collection(collection_id));
create policy "sessions insert in own collection" on public.chat_sessions for insert to authenticated with check (public.user_owns_collection(collection_id));
create policy "sessions update in own collection" on public.chat_sessions for update to authenticated using (public.user_owns_collection(collection_id)) with check (public.user_owns_collection(collection_id));
create policy "sessions delete in own collection" on public.chat_sessions for delete to authenticated using (public.user_owns_collection(collection_id));

create policy "messages select in own session" on public.messages for select to authenticated using (public.user_owns_session(session_id));
create policy "messages insert in own session" on public.messages for insert to authenticated with check (public.user_owns_session(session_id));
create policy "messages update in own session" on public.messages for update to authenticated using (public.user_owns_session(session_id)) with check (public.user_owns_session(session_id));
create policy "messages delete in own session" on public.messages for delete to authenticated using (public.user_owns_session(session_id));

create policy "citations select for own message" on public.citations for select to authenticated using (public.user_owns_message(message_id));
create policy "citations insert for own message" on public.citations for insert to authenticated with check (public.user_owns_message(message_id));
create policy "citations update for own message" on public.citations for update to authenticated using (public.user_owns_message(message_id)) with check (public.user_owns_message(message_id));
create policy "citations delete for own message" on public.citations for delete to authenticated using (public.user_owns_message(message_id));

grant select, insert, update, delete on public.collections, public.documents, public.chunks, public.chat_sessions, public.messages, public.citations to authenticated;