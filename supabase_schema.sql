-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Create the page_views table
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  viewed_at timestamptz default now(),
  user_agent text,
  device_type text,
  referrer text,
  screen_resolution text,
  language text,
  timezone text,
  visitor_id text -- Anonymous ID stored in cookie/localstorage
);

-- Enable RLS on the table
alter table public.page_views enable row level security;

-- POLICY 1: Allow anonymous users to INSERT data (tracking views)
create policy "Allow anonymous inserts"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

-- POLICY 2: Allow ONLY authenticated users (Admins) to READ data
create policy "Allow authenticated reads"
  on public.page_views
  for select
  to authenticated
  using (true);

-- Create some useful indexes for query performance
create index idx_page_views_viewed_at on public.page_views(viewed_at);
create index idx_page_views_page_path on public.page_views(page_path);
