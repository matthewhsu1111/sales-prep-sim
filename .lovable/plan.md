
**Privacy concern:** Currently `getDisplayName` falls back to the full `name` field, exposing first + last names. Profiles table has no username field.

**Recommended approach (industry standard — Duolingo, Strava):**

1. **Display as "First name + Last initial"** (e.g., "Sarah K.")
   - Derive from `first_name` + first letter of last word in `name`
   - Fallback chain: `first_name + last initial` → `first_name` → `"Anonymous Learner"`
   - Current user still sees their own full name next to the "You" badge

2. **Respect opt-out flag** — `user_progress.leaderboard_visible` already exists. Filter out users where `leaderboard_visible = false` from the `weekly_leaderboard` view (migration if not already filtered).

3. **Add a small privacy note** under the leaderboard header: *"Names shown as first name + last initial. Manage visibility in Settings."*

4. **Verify Settings exposes the toggle** — if `Settings.tsx` doesn't already have a "Show me on leaderboards" switch, add one wired to `leaderboard_visible`.

**Files touched:**
- `src/pages/Leaderboards.tsx` — new name formatter + privacy note
- `supabase/migrations/` — only if `weekly_leaderboard` view doesn't already filter on `leaderboard_visible`
- `src/pages/Settings.tsx` — only if visibility toggle is missing

**Quick question before building:** Do you want the format to be **"Sarah K."** (first name + last initial — recommended), or just **"Sarah"** (first name only)? And for users who opt out — hide them entirely from the list, or show them as "Anonymous" keeping their rank visible?
