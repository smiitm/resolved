
# Database Schema & Architecture: RESOLVED

**Project:** Resolved (Minimalist Goal Tracker)  
**Database:** Supabase (PostgreSQL)  
**Auth:** Supabase Auth (Google OAuth)

---

## 1. Overview

The database uses a relational structure with three core tables: `profiles`, `goals`, and `sub_goals`.
- **User Management:** Handled by Supabase Auth (`auth.users`), synced to `public.profiles`.
- **Performance:** `num_goals` and `num_subgoals` are cached in the `profiles` table and updated automatically via Database Triggers to avoid expensive `COUNT(*)` queries on the frontend.
- **Security:** Row Level Security (RLS) is enabled on all tables.

---

## 2. Table Definitions

### 2.1 Profiles (`public.profiles`)
Stores public user information. Linked 1:1 with `auth.users`.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key, -- Links to Supabase Auth
  username text unique not null,                      -- For URL (resolved.app/username)
  full_name text,
  bio text,
  location text,
  profession text,
  avatar_url text,
  
  -- Cached Counts (Managed by Triggers)
  num_goals int default 0, 
  num_subgoals int default 0,
  
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

```

### 2.2 Goals (`public.goals`)

The top-level goals (Limit: Max 15 per user).

```sql
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  is_public boolean default true,
  position int default 0, -- For UI ordering/drag-and-drop
  created_at timestamp with time zone default timezone('utc'::text, now())
);

```

### 2.3 Sub-Goals (`public.sub_goals`)

The actionable steps for each goal (Limit: Max 35 total per user).

```sql
create table public.sub_goals (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

```

---

## 3. Automation (Triggers)

We use PostgreSQL functions and triggers to automatically update the `num_goals` and `num_subgoals` columns in the `profiles` table whenever records are inserted or deleted.

### 3.1 Goal Count Trigger

```sql
-- Function
create or replace function handle_goal_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.profiles set num_goals = num_goals + 1 where id = new.user_id;
  elsif (TG_OP = 'DELETE') then
    update public.profiles set num_goals = num_goals - 1 where id = old.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_goal_change
  after insert or delete on public.goals
  for each row execute procedure handle_goal_count();

```

### 3.2 Sub-Goal Count Trigger

```sql
-- Function
create or replace function handle_subgoal_count()
returns trigger as $$
declare
  target_user_id uuid;
begin
  if (TG_OP = 'INSERT') then
    select user_id into target_user_id from public.goals where id = new.goal_id;
    update public.profiles set num_subgoals = num_subgoals + 1 where id = target_user_id;
  elsif (TG_OP = 'DELETE') then
    select user_id into target_user_id from public.goals where id = old.goal_id;
    update public.profiles set num_subgoals = num_subgoals - 1 where id = target_user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_subgoal_change
  after insert or delete on public.sub_goals
  for each row execute procedure handle_subgoal_count();

```

---

## 4. Security (RLS Policies)

Row Level Security is ENABLED on all tables.

### 4.1 Profiles

* **Select:** Public (Everyone can view profiles).
* **Insert:** Authenticated Users only (Must match their own `auth.uid`).
* **Update:** Authenticated Users only (Must match their own `auth.uid`).

```sql
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using ( true );

create policy "Users can insert their own profile." 
  on public.profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on public.profiles for update using ( auth.uid() = id );

```

### 4.2 Goals

* **Select:** Public (if `is_public = true`) OR Owner (if `auth.uid() = user_id`).
* **Insert/Update/Delete:** Owner only.

```sql
create policy "Public goals are viewable by everyone." 
  on public.goals for select 
  using ( is_public = true or auth.uid() = user_id );

create policy "Users can manage own goals." 
  on public.goals for all 
  using ( auth.uid() = user_id );

```

### 4.3 Sub-Goals

* **Select:** Visible if the parent Goal is visible (Public or Owned).
* **Insert/Update/Delete:** Owner only (Checked via Parent Goal ownership).

```sql
create policy "Subgoals viewable if parent goal is visible"
  on public.sub_goals for select
  using ( 
    exists (
      select 1 from public.goals 
      where goals.id = sub_goals.goal_id 
      and (goals.is_public = true or goals.user_id = auth.uid())
    ) 
  );

create policy "Users can manage subgoals for their own goals"
  on public.sub_goals for all
  using (
    exists (
      select 1 from public.goals
      where goals.id = sub_goals.goal_id
      and goals.user_id = auth.uid()
    )
  );

```

```

```