

## Refined: Stars only awarded for *correct* answers

### Change to the question bonus rule

**Old:** +1 star per question answered (capped at +10).
**New:** +1 star per question answered **correctly**, capped at +10.

Stops the obvious exploit of spamming "yes / I don't know / next" to farm stars.

### How "correct" is determined

We already run Claude post-session in `analyze-interview` to score the transcript. That function returns per-question feedback and an overall score. We extend its prompt to also return a per-question `correct: boolean` (or a 1–5 quality score where ≥3 counts as correct — cleaner for partial credit).

Star calculation moves from "count questions in transcript" to "count questions where Claude marked quality ≥ 3", still capped at +10.

### Where the logic lives

- `supabase/functions/analyze-interview/index.ts` — extend the JSON schema Claude returns to include `questionScores: { question: string, qualityScore: 1-5 }[]`. Already returns structured analysis, so this is an additive field.
- `src/pages/InterviewResults.tsx` — when computing stars to award, count entries where `qualityScore >= 3` instead of total questions answered. Pass that count (capped at 10) to `awardStars`.
- Everything else from the previous plan stays the same (interviewer bonus, type bonus, levels rescaled, All-Time leaderboard, DB migration).

### User-facing copy

On the results screen, break the star award down so it's transparent and feels earned:
- "Rebecca (hard interviewer): +3"
- "Hiring Manager round: +2"
- "7 of 9 answers rated strong: +7"
- "First practice today: +1"
- **Total: +13 ⭐**

This also doubles as feedback — users see exactly which answers counted.

### Edge cases handled

- Very short sessions (1–2 questions) still award the interviewer + type bonus even if no answer was strong.
- Sessions that fail analysis (Claude error) fall back to +0 question stars rather than crashing — interviewer + type bonus still awarded.
- Cap of +10 still applies, so a 30-question session with all strong answers caps at +10 question stars (+ interviewer + type).

