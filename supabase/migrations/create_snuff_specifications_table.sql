-- This is a SQL function that you need to create in your Supabase project
-- Go to the SQL Editor in your Supabase dashboard and run this code

create or replace function create_snuff_specifications_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Create the table if it doesn't exist
  create table if not exists snuff_specifications (
    id uuid primary key default gen_random_uuid(),
    product_id bigint not null,
    product_title text not null,
    ease_of_use text not null,
    nicotine_content text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );

  -- Create indexes
  create index if not exists idx_snuff_specifications_product_id on snuff_specifications(product_id);
  
  -- Set up RLS (Row Level Security)
  alter table snuff_specifications enable row level security;
  
  -- Create policies
  drop policy if exists "Allow anonymous read access" on snuff_specifications;
  create policy "Allow anonymous read access" 
    on snuff_specifications for select 
    using (true);
    
  drop policy if exists "Allow authenticated insert" on snuff_specifications;
  create policy "Allow authenticated insert" 
    on snuff_specifications for insert 
    with check (true);
end;
$$;

