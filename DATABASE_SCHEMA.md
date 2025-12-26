
# Database Schema & Architecture: RESOLVED

**Project:** Resolved (Minimalist Goal Tracker)
**Database:** Supabase (PostgreSQL)
**Auth:** Supabase Auth (Google OAuth)
**Version:** 1.3 (Final Logic)

---

## 1. Overview

The architecture enforces a clear separation between **User Data**, **Goals** (The Core Loop), and **Social Connections**.
- **Performance:** All aggregate stats (`num_goals`, `follower_count`, etc.) are cached on the parent tables and updated via Triggers.
- **Integrity:** `last_edited` timestamps track *changes to intent* (renaming goals), not *progress* (checking boxes).

---

## 2. Table Definitions

### 2.1 Profiles (`public.profiles`)
Public user profiles. Linked 1:1 with `auth.users`.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  full_name text,
  bio text,
  location text,
  profession text,
  avatar_url text,
  
  -- Social
  social_link text,
  follower_count int default 0,
  
  -- Stats
  num_goals int default 0, 
  num_subgoals int default 0,
  
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

```

### 2.2 Goals (`public.goals`)

Top-level objectives. Limit: 15 per user.

```sql
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  is_public boolean default true,
  position int default 0,
  
  -- Progress vs Intent
  is_completed boolean default false, -- Status
  last_edited timestamp with time zone default timezone('utc'::text, now()), -- Intent Tracking
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

```

### 2.3 Sub-Goals (`public.sub_goals`)

Granular steps. Limit: 35 total per user.

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

Social graph (Many-to-Many).

```sql
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

```

---

## 3. Automation (Triggers)

### 3.1 "Strict Windows" Logic (Updated v1.5)
We enforce a strict "Quarterly Review" system. Structural changes (Renaming goals, adding steps) are **blocked** outside of specific dates.

* **Allowed Windows:**
    1.  **Resolution:** Dec 25 - Jan 3 (Edits here are **NOT** flagged as "Edited").
    2.  **Q1 Review:** Apr 1 - Apr 3 (Edits **ARE** flagged).
    3.  **Q2 Review:** Jul 1 - Jul 3 (Edits **ARE** flagged).
    4.  **Q3 Review:** Oct 1 - Oct 3 (Edits **ARE** flagged).
* **Always Allowed:** Toggling `is_completed` (Progress) is allowed 365 days a year.
* **Mechanism:** * `get_edit_window_status()` function checks `NOW()`.
    * Triggers raise an `EXCEPTION` if user tries to `UPDATE title` or `INSERT/DELETE sub_goals` outside valid windows.



### 3.2 Counter Caching

We automatically maintain counts to avoid slow queries.

* `num_goals`: Updates on Goal Insert/Delete.
* `num_subgoals`: Updates on Sub-Goal Insert/Delete.
* `follower_count`: Updates on Follow Insert/Delete.

---

## 4. Security (RLS Policies)

**Row Level Security is ENABLED on all tables.**

* **Profiles:**
* `SELECT`: Public.
* `INSERT/UPDATE`: Owner (`auth.uid() = id`).


* **Goals:**
* `SELECT`: Public (if `is_public` is true) OR Owner.
* `ALL`: Owner (`auth.uid() = user_id`).


* **Sub-Goals:**
* `SELECT`: Inherits visibility from Parent Goal.
* `ALL`: Owner (via Parent Goal check).


* **Follows:**
* `SELECT`: Public.
* `INSERT/DELETE`: Follower Only (`auth.uid() = follower_id`).



```