

## What I recommend fixing

### 1. Critical — Self-upgrade exploit (FIX)
Right now, any logged-in user can run an UPDATE on their own `profiles` row and set `subscription_tier = 'pro'`, giving themselves a paid plan for free. They can also overwrite Stripe IDs. Your app only writes these fields from the `stripe-webhook` edge function (service role), so locking them down won't break anything in the UI.

### 2. Warnings (your call — recommended but not urgent)
- **Leaked password protection** — toggle in Supabase Auth settings. Blocks signups using passwords found in known breaches. ~30 seconds.
- **OTP long expiry** — shorten OTP lifetime (recommend 10 min) in Auth settings. Reduces window for an intercepted code to be used.
- **Postgres patches available** — minor version upgrade in Supabase. Brief downtime possible. Important long-term but not exploitable through your app code.

These three are dashboard toggles I can't do for you — I'll give you the exact links after the code fix.

---

## Plan: Lock down billing fields on `profiles`

**Approach:** Replace the broad UPDATE policy with one that uses a column-level guard via a trigger. Users keep being able to edit `name`, `target_role`, `background`, `interview_preferences`, `has_completed_setup`, `first_name`. Any attempt to change subscription/Stripe columns from a non-service-role context throws an error. The webhook continues to work because service role bypasses RLS and triggers' permission checks don't apply to it the same way — we'll explicitly allow the service role inside the trigger.

### Migration (SQL)
1. Create a trigger function `prevent_profile_billing_update()`:
   - Runs BEFORE UPDATE on `profiles`.
   - If `auth.role()` is `'service_role'`, allow anything (webhook path).
   - Otherwise, if any of `subscription_tier`, `subscription_status`, `subscription_end_date`, `stripe_customer_id`, `stripe_subscription_id` differ between OLD and NEW, raise an exception: `"Billing fields can only be updated by the billing system"`.
2. Attach trigger to `public.profiles`.
3. Leave existing RLS UPDATE policy as-is (users still update their own row), since the trigger now enforces the column restriction at a lower level.

### Why a trigger and not a separate table
A separate `billing_details` table is cleaner architecturally but would force changes in 3 frontend files (`Settings.tsx`, `Profile.tsx`, `InterviewSession.tsx`) and the webhook — more surface area, more risk. The trigger achieves the same security guarantee with one migration and zero frontend changes.

### Files touched
- New migration only. No frontend or edge function code changes needed.

### Verification after apply
- Confirm Settings/Profile/Interview pages still load subscription data (read paths unaffected).
- Confirm regular profile edits (name, target_role) still save.
- Optionally: from the Supabase SQL editor as an authenticated user, try `UPDATE profiles SET subscription_tier = 'pro' WHERE user_id = auth.uid()` — should error.

### Dashboard fixes I'll link after
- Auth → Providers → enable "Leaked password protection"
- Auth → Settings → set OTP expiry to 600 seconds
- Database → upgrade Postgres to latest patch version

