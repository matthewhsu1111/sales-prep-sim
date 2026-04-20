
The user wants three changes:

1. **Fix bullet #1 (gate bypass)**: Currently `/dashboard/interview-session` can be reached directly, skipping the 3-interview limit. Add the same gating check inside `InterviewSession.tsx` so a free user with ≥3 completed interviews is bounced to the upgrade modal (or back to the training page) instead of starting an interview.

2. **Add "Upgrade to Pro" link** next to the `Free plan: X/3 interviews used` text on the Interview Training page. Clicking it opens the existing `UpgradeModal`. Also tweak the modal so the description varies — when it's opened proactively (not from hitting the limit), it reads "Upgrade for unlimited interview sessions." Simplest: add an optional `description` prop to `UpgradeModal` with the limit-reached copy as default.

3. **Last bullet ignored** (count incremented before completion) — user said skip it.

4. **Landing page**: Remove "Watch Demo" buttons from `src/pages/Index.tsx` but keep the page itself.

## Plan

**1. `src/pages/InterviewSession.tsx`** — On mount, fetch the user's `subscription_tier`, `subscription_status`, and `total_interviews`. If free/inactive AND count ≥ 3, redirect back to `/dashboard/interview-roleplay` with a toast prompting upgrade (the modal will then surface naturally on next "Start Training" click — or we trigger it via navigation state).

**2. `src/components/UpgradeModal.tsx`** — Add optional `description?: string` prop. Default keeps the current "You've reached the maximum…" copy.

**3. `src/pages/InterviewRoleplay.tsx`** — 
   - Next to the `Free plan: X/3 interviews used` line, add an inline "Upgrade to Pro" link/button that calls `setIsUpgradeModalOpen(true)`.
   - Pass `description="Upgrade for unlimited interview sessions."` when opened from this link. When opened from hitting the limit in `handleStartTraining`, pass no description (uses default).
   - Track which trigger opened it via a small state like `upgradeReason: 'limit' | 'proactive'`.

**4. `src/pages/Index.tsx`** — Locate and remove all "Watch Demo" buttons. Page otherwise untouched.

## Files to change
- `src/pages/InterviewSession.tsx` (add gate check)
- `src/components/UpgradeModal.tsx` (optional description prop)
- `src/pages/InterviewRoleplay.tsx` (Upgrade to Pro link + dynamic description)
- `src/pages/Index.tsx` (remove Watch Demo buttons)

No DB changes, no new dependencies.
