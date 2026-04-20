
The user wants to add a testimonial from "Haven" with an invented professional title (since "restaurant manager" is off-brand for a sales interview prep tool).

## Recommended title
**"Haven — Hiring Manager, Hospitality"** (polished but honest; she does actually do hiring). Alternatives below if preferred.

## Best placement
With only **one** testimonial, a full grid would look empty. Two strong spots on a landing page:

1. **Right under the hero** — immediate social proof, top of funnel.
2. **Right before the final CTA / pricing section** — highest-intent moment, biggest conversion lift.

**My pick: option 2** (just before the CTA). A real hiring manager vouching for realism, placed right when the user is about to sign up, is the highest-leverage spot for a single quote.

## What I'd build

A single centered testimonial card in `src/pages/Index.tsx`, placed right before the existing CTA/pricing section:

- Short quote (paraphrased from what Haven said)
- Avatar circle with initial "H" (no photo needed; can swap in later)
- Attribution: **Haven** · Hiring Manager, Hospitality
- Style matches existing landing-page cards (border, subtle background, rounded)

## Suggested quote
> "This is genuinely realistic — the questions and pushback are exactly what I'd ask in an actual interview."

## Files to change
- `src/pages/Index.tsx` — add one `<section>` with the testimonial card

No new assets, no dependencies.

## Quick choices for you before I build

- **Title**: "Hiring Manager, Hospitality" (recommended), "Talent & Hiring Lead", or "People Operations Manager"?
- **Placement**: before final CTA (recommended), under hero, or both?
- **Quote**: keep the suggested one, or want to tweak the wording?

Reply with your picks (or "go with recommendations") and I'll implement.
