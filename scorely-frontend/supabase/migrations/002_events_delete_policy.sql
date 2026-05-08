-- Allow match creators and assigned scorers to delete events (needed for Undo)
create policy "events_delete_authorized_scorer"
  on public.events for delete
  using (
    auth.uid() is not null and (
      exists (
        select 1 from public.matches
        where id = match_id and created_by = auth.uid()
      ) or
      exists (
        select 1 from public.match_scorers
        where match_id = events.match_id and user_id = auth.uid()
      )
    )
  );
