# Database Schema & Architecture: RESOLVED

**Project:** Resolved (Minimalist Goal Tracker)
**Database:** Supabase (PostgreSQL)
**Auth:** Supabase Auth (Google OAuth)
**Version:** 1.1 (Updated with Social Features)

---

## 1. Overview

The database uses a relational structure with four core tables.
- **User Data:** `profiles` (Synced with Auth).
- **Core Loop:** `goals` and `sub_goals`.
- **Social Graph:** `follows` (Many-to-Many relationship).
- **Performance:** Counts (`num_goals`, `num_subgoals`, `follower_count`) are cached in parent tables and updated via Triggers to ensure O(1) read performance.

---

## 2. Table Definitions

### 2.1 Profiles (`public.profiles`)
Stores public user information. Linked 1:1 with `auth.users`.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key, -- Links to Supabase Auth
  username text unique not null,                      -- URL: resolved.app/username
  full_name text,
  bio text,
  location text,
  profession text,
  avatar_url text,
  
  -- Social Fields (New)
  social_link text,             -- External link (e.g. [twitter.com/user](https://twitter.com/user))
  follower_count int default 0, -- Auto-updated via trigger
  
  -- Goal Stats (Auto-updated)
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

### 2.4 Follows (`public.follows`)

Handles the social graph (User A follows User B).

```sql
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Composite Key prevents duplicate following
  primary key (follower_id, following_id),
  
  -- Constraint prevents self-following
  constraint no_self_follow check (follower_id != following_id)
);

```

---

## 3. Automation (Database Triggers)

We use PostgreSQL triggers to manage counts automatically. This removes the need for complex counting logic in the frontend.

### 3.1 Goal & Sub-Goal Counts

*Logic: When a Goal/Sub-goal is created or deleted, update the user's profile stats.*

```sql
-- Goal Count Trigger
create trigger on_goal_change
  after insert or delete on public.goals
  for each row execute procedure handle_goal_count();

-- Sub-Goal Count Trigger
create trigger on_subgoal_change
  after insert or delete on public.sub_goals
  for each row execute procedure handle_subgoal_count();

```

### 3.2 Follower Count (Social)

*Logic: When a row is added to `follows`, increment `follower_count` for the `following_id` user.*

```sql
create or replace function handle_new_follow()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.profiles 
    set follower_count = follower_count + 1 
    where id = new.following_id;
  elsif (TG_OP = 'DELETE') then
    update public.profiles 
    set follower_count = follower_count - 1 
    where id = old.following_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute procedure handle_new_follow();

```

---

## 4. Security (RLS Policies)

Row Level Security is **ENABLED** on all tables.

### 4.1 Profiles

* **Select:** Public (Everyone can view profiles).
* **Insert/Update:** Owner Only (`auth.uid() = id`).

```sql
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using ( true );

create policy "Users can update own profile." 
  on public.profiles for update using ( auth.uid() = id );

```

### 4.2 Goals & Sub-Goals

* **Select:** * If `is_public = true` -> Everyone.
* If `is_public = false` -> Owner Only.


* **Write:** Owner Only.

```sql
create policy "Public goals are viewable by everyone." 
  on public.goals for select 
  using ( is_public = true or auth.uid() = user_id );

create policy "Users can manage own goals." 
  on public.goals for all 
  using ( auth.uid() = user_id );

```

### 4.3 Follows

* **Select:** Public (Friend lists are public).
* **Insert (Follow):** Authenticated users can follow others.
* **Delete (Unfollow):** Users can only delete records where they are the `follower`.

```sql
create policy "Public follows are viewable by everyone."
  on public.follows for select using ( true );

create policy "Users can follow others."
  on public.follows for insert with check ( auth.uid() = follower_id );

create policy "Users can unfollow."
  on public.follows for delete using ( auth.uid() = follower_id );

```

```

```