# The Laundry Lounge Hillary — Gap Assessment (us vs. competitors)

DRAFT — internal, for Jaime's review · generated 2026-08-24 · prices valid 30 days from issue once sent

Evidence: our `index.html`/`learn.html` read directly; competitor homepages fetched and scanned for the same signals (see `competitors.md`). None of the three verified competitors is a true single-location walk-in laundromat with its own site — see that caveat there.

## Feature table

| | Us (demo) | CleanLab SA | Oasis Dry Cleaning & Laundry | That Dirty Spot |
|---|---|---|---|---|
| Real photos | ✗ 100% stock, disclosed in footer | ~ template/professional imagery, not confirmed real | ~ professional imagery, not confirmed real | ~ not confirmed either way |
| Visible prices | ✗ "R —" placeholders throughout | ~ WooCommerce cart implies pricing at checkout, not a plain price list | ✗ none shown | ✗ none shown |
| Online booking | ~ WhatsApp drop-off flow explained, no form | ✓ booking-calendar plugin + area/service selector | ✗ phone/contact form only | ✓ online service-request form (branch + pickup/delivery) |
| WhatsApp | ✓ sticky FAB (real number) + nav + chat fallback | not confirmed on scanned pages | ✗ not mentioned | ✗ not visible |
| Chatbot | ✓ canned FAQ widget | ✗ none found | ✗ none found | ✗ none found |
| Maps / wayfinding | ✓ embedded map + Navigate link + basement-level note | ✗ none found on scanned pages | ✗ none found | ✗ none found |
| Reviews shown | ✓ real 5.0★/34, live from Google, disclosed as such | ✗ none found (review-nonce present in code, not visibly surfaced) | ✗ none present | ✗ none present (unverified "10,000 customers" claim instead) |
| Journal / content | ✓ 6 posts + FAQPage schema | ✗ no blog found | ✗ no blog found | ✗ no blog found |
| Schema / SEO | ~ title/meta present, but `noindex` (draft) | ✓ live, indexed, active WooCommerce build | ✓ live, indexed | ✓ live, indexed |
| Mobile | ✓ mobile-first, lightweight static HTML | ✓ (WooCommerce/Elementor, heavier) | ✓ (assumed modern build) | ✓ (assumed modern build) |

## Where we're already ahead

- Only one of the four with an embedded Google Map — and the only one with a wayfinding note at all, which matters specifically because this business is a basement-level unit that's easy to walk past.
- Only one with any content/journal system — 6 Hillary/Queensburgh-specific articles plus FAQPage schema already in the code. None of the three competitors run a blog.
- Only one with an on-site chat widget answering the obvious questions (location, hours, services, drop-off) without leaving the page.
- We display the real, current Google rating (5.0★/34) directly on the page as its own trust band; none of the three competitors show any review signal (That Dirty Spot instead states an unverified "10,000 satisfied customers" claim with no source).
- We're the only one with a distinct **Custom Prints** section — none of the three competitors show any secondary product/service line.

## Where competitors beat us today

- All three are live, indexed, real websites today. Ours is a draft (`noindex`), not yet public.
- CleanLab SA and That Dirty Spot both have a working online booking/request path; ours is WhatsApp-only (a real number, but not yet a structured flow).
- All three presumably have at least some real photography of their own operations; ours is 100% stock, clearly disclosed as such — and worse, the "real" photos we pulled for this business turned out to belong to unrelated US laundromats sharing a similar name, so we had to reject all three (see `images/_assets-manifest.json`).

## The two sharpest gaps

1. **Real photography.** All three pulled photos had to be rejected outright — this business currently has zero usable photography anywhere in the pipeline, and the demo is fully stock-led as a result.
2. **No structured booking/request path.** CleanLab SA and That Dirty Spot both let a customer submit a request on-site; we currently route everything through WhatsApp with no automation layer.

## What closes them

1. **Real photography** — once the client supplies photos (interior, machines, folding counter, prints in progress) or a shoot is arranged, swap out all 4 stock images. Bundled into The Foundation build; add copywriting (R850/page) if captions are also needed.
2. **WhatsApp automation — R6,500 setup.** This business already has a real, working WhatsApp number (069 467 7133) — unusually, the hard part (getting a number) is already solved. Automation turns the existing channel into something closer to CleanLab SA/That Dirty Spot's structured request forms, without needing a full custom booking system (The Structure, R32,000 — not justified at this scale).
3. **Confirmed pricing** — copywriting R850/page (or R3,500 for up to 5 pages) once real services and prints pricing exist, replacing the "R —" placeholders.
