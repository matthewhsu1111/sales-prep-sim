## Fix /schedule default day

Change `getDisplayDate()` in `src/pages/Schedule.tsx` to always return the real current date, so the default selected day matches today's actual weekday (Monday today, etc.) instead of being clamped to May 20 (a Wednesday).

### Changes
- `src/pages/Schedule.tsx`: replace `getDisplayDate()` so it just returns `new Date()`. Keep the `May 20 – June 20` label and the rest of the UI untouched.

### Notes
- The "Today" indicator (dot + label) will now correctly highlight the real weekday.
- Per-day localStorage keys still work since they're derived from the same date.