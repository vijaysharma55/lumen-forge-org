
-- Create private buckets
insert into storage.buckets (id, name, public) values ('ngo-docs', 'ngo-docs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- ngo-docs policies (user-scoped folders)
create policy "Users read own ngo-docs"
on storage.objects for select to authenticated
using (bucket_id = 'ngo-docs' and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(), 'admin')));

create policy "Users upload own ngo-docs"
on storage.objects for insert to authenticated
with check (bucket_id = 'ngo-docs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users update own ngo-docs"
on storage.objects for update to authenticated
using (bucket_id = 'ngo-docs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own ngo-docs"
on storage.objects for delete to authenticated
using (bucket_id = 'ngo-docs' and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(), 'admin')));

create policy "Admins manage all ngo-docs"
on storage.objects for all to authenticated
using (bucket_id = 'ngo-docs' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'ngo-docs' and public.has_role(auth.uid(), 'admin'));

-- receipts policies
create policy "Users read own receipts"
on storage.objects for select to authenticated
using (bucket_id = 'receipts' and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(), 'admin')));

create policy "Users upload own receipts"
on storage.objects for insert to authenticated
with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Admins manage all receipts"
on storage.objects for all to authenticated
using (bucket_id = 'receipts' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'receipts' and public.has_role(auth.uid(), 'admin'));
