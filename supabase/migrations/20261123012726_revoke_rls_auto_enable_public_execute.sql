-- public.rls_auto_enable() is the event-trigger function behind `ensure_rls`
-- (created by Supabase's "auto-enable RLS" option). Postgres invokes it on
-- DDL by itself; nobody needs to call it through the Data API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
