# Resolved

**Goal tracking and public accountability via minimalistic UI**

A New Year's resolution tracker that enforces commitment through **time-locked edit windows**. Set your goals once, then focus on execution—not endless pivoting.

---

## 🎯 Core Concept

Resolved is designed around one key insight: **the best resolutions are the ones you stick to**.

Most goal apps let you endlessly add, remove, and modify goals. This creates a loophole where you can always "reset" instead of pushing through.

Resolved is different:
- Set your goals during the **Resolution Window** (Dec 25 - Jan 3)
- Goals are **locked** for most of the year
- **Quarterly Review windows** allow limited adjustments
- Progress tracking (checking off items) is **always available**

---

## 📅 Edit Windows (Quarterly Review System)

Structural changes to goals (adding, removing, renaming) are only allowed during specific windows:

| Window | Dates | Purpose | Edited Flag |
|--------|-------|---------|-------------|
| **Resolution** | Dec 25 - Jan 3 | Initial goal setting | ❌ Not flagged |
| **Q1 Review** | Apr 1 - 3 | First quarter adjustment | ✅ Flagged as "edited" |
| **Q2 Review** | Jul 1 - 3 | Mid-year pivot | ✅ Flagged as "edited" |
| **Q3 Review** | Oct 1 - 3 | Final quarter adjustment | ✅ Flagged as "edited" |

### What's a "Structural Change"?
- ➕ Adding a new goal
- ➕ Adding a new sub-goal
- ✏️ Renaming a goal or sub-goal
- 🗑️ Deleting a goal or sub-goal

### What's Always Allowed? (365 days/year)
- ✅ Marking a goal as complete
- ✅ Checking off sub-goals
- ✅ Viewing your profile

---

## 🏷️ The "Edited" Badge

Goals modified during **Q1, Q2, or Q3 Review windows** display an "edited" badge. This provides transparency about mid-year pivots.

- Changes during **Dec/Jan Resolution Window** = **No badge** (initial drafting phase)
- Changes during **Apr/Jul/Oct Review Windows** = **Badge visible**

This creates accountability: visitors can see if you changed your goals mid-year.

---

## 👤 Public Profiles

Each user gets a public profile at `resolved.app/username` showing:
- Profile info (name, bio, location, profession)
- Goals with progress
- Follower count
- Social link

### Owner vs Visitor

| Feature | Owner | Visitor |
|---------|-------|---------|
| View goals | ✅ | ✅ |
| Mark progress | ✅ | ❌ |
| Add/edit goals | ✅ (during windows) | ❌ |
| Follow | ❌ | ✅ |
| Edit profile | ✅ | ❌ |

---

## 📊 Limits

| Item | Limit |
|------|-------|
| Goals per user | 10 |
| Sub-goals total | 30 |
| Username length | 20 characters |
| Display name | 50 characters |
| Bio | 160 characters |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS
- **Icons**: Hugeicons
- **Package Manager**: Bun

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [username]/     # Dynamic user profile pages
│   ├── auth/           # Auth callback handlers
│   ├── home/           # Public homepage
│   └── onboarding/     # New user setup
├── components/
│   ├── dashboard/      # Profile, goals, dialogs
│   └── ui/             # Reusable UI components
├── lib/
│   └── constants.ts    # Edit windows, reserved usernames
└── utils/
    └── supabase/       # Supabase client utilities
```

---

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Run development server
bun dev
```

---

## 📝 License

MIT