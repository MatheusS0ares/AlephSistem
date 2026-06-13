-- ====================================================
-- Galeria de trabalhos HUD'S
-- ====================================================

create table if not exists gallery (
  id          uuid default gen_random_uuid() primary key,
  store_id    text not null,
  image_url   text not null,
  caption     text,
  service_tag text,
  active      boolean default true,
  order_index integer default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_gallery_store
  on gallery(store_id, active, order_index);

alter table gallery enable row level security;

create policy "Allow all for service role" on gallery
  using (true) with check (true);

-- Adicionar store_id aos serviços existentes (HUD'S)
update services set store_id = 'huds' where store_id is null;
