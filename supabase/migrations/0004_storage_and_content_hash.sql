insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('notes-documents', 'notes-documents', false, 20971520, array['application/pdf', 'text/plain', 'text/markdown'])
on conflict (id) do update
set public = false,
    file_size_limit = 20971520,
    allowed_mime_types = array['application/pdf', 'text/plain', 'text/markdown'];

create policy "document uploads insert to own folder" on storage.objects for insert to authenticated
with check (
  bucket_id = 'notes-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "document uploads select from own folder" on storage.objects for select to authenticated
using (
  bucket_id = 'notes-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "document uploads update in own folder" on storage.objects for update to authenticated
using (
  bucket_id = 'notes-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'notes-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "document uploads delete from own folder" on storage.objects for delete to authenticated
using (
  bucket_id = 'notes-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);