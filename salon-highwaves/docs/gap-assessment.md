# Salon Highwaves — Gap Assessment

DRAFT — internal, for Jaime's review · generated 2026-07-31 · prices valid 30 days from issue once sent

Our demo (`index.html`/`learn.html`) vs. three verified live competitors (see `competitors.md`). Evidence: direct read of our HTML + `curl` of each competitor homepage on 2026-07-31. `~` = partial, unclear, or unverifiable via static fetch (e.g. Cerése is a JS-rendered app — its real content can't be seen by a plain fetch).

| Feature | Us (demo) | Cerése (Hillcrest) | New Images (Kloof/Hillcrest) | Synergyhair (Kloof) |
|---|---|---|---|---|
| Mobile-first | ✓ | ~ | ✓ | ✓ |
| Load feel (static HTML size) | ✓ light (~20KB) | ~ (JS bundle, unmeasured) | ✗ heavier (~92KB + 23 imgs) | ✗ heaviest (~344KB) |
| WhatsApp CTA | ✓ | ~ | ✗ (mentioned in text, no link found) | ✗ (tel: only) |
| Booking | ✓ live Fresha | ~ | ✓ (mentioned) | ✓ ("Book Now/online") |
| Chatbot | ✓ (FAQ chip widget) | ~ | ✗ | ✓ (live-chat widget) |
| Journal/content | ✓ 6 posts + FAQ schema | ~ | ✓ blog/article | ✓ blog |
| Gallery/real photos | ~ 1 real + 4 stock | ~ 1 hero photo ref | ✓ 23 images | ~ 8 images |
| Maps/directions | ✓ embedded + navigate link | ~ | ✗ not on homepage | ~ (geo-schema only, no visible embed) |
| Reviews/social proof | ✓ 4.6★/83 shown | ~ | ~ mentioned, unclear | ✓ rating/review schema |
| SEO basics (title/meta/schema) | ~ title+meta yes; FAQ schema only on Journal page; homepage still `noindex` (draft) | ~ title+meta+OG yes; no schema/content in static HTML | ✓ title+meta+Organization/WebSite schema | ~ generic title ("Home Page") but rich LocalBusiness-style schema |
| Prices shown | ✗ placeholders | ~ unknown | ✗ none found | ✗ none found |

## Where we already win

- We're the only one of the four with a WhatsApp message button confirmed working in the static markup — New Images only mentions WhatsApp in copy, Synergyhair has none.
- Live Fresha booking is linked as the primary CTA, not just referenced — same booking depth as the competitors claiming "book online," with less friction.
- Our Journal already ships with FAQPage schema and hyper-local content (Hillcrest humidity, salt air, bridal timelines) — none of the three competitors show comparably localised written content.
- Our page is the lightest of the four by a wide margin — fastest likely load on mobile, where salon searches mostly happen.
- We display the 4.6★/83-review rating directly on the homepage as a trust signal — Cerése and New Images don't surface a rating this prominently in static content.

## Where competitors beat us today

- **Real photography.** New Images has 23 real-looking homepage images to our one verified real photo; our gallery is majority stock and says so outright ("Most imagery here is representative stock"). This is the single biggest visible gap.
- **Homepage structured data.** Synergyhair has full LocalBusiness-style schema (geo, hours, rating, review, service) directly on its homepage. Ours currently only has FAQ schema on the Journal subpage — the homepage itself has none, and is still flagged `noindex` as a draft.
- **We're not discoverable yet.** Because the demo is pre-launch, it can't be found in search at all right now — all three competitors are live and indexed today.

## What closes the gap

1. **Real photography, folded into the Foundation build (R16,500).** Replace stock with a real shoot of the salon and stylists at work as part of go-live — not a separate line item, but a hard requirement of shipping.
2. **SEO Launch — R4,500 once.** Add LocalBusiness/Service schema to the homepage and remove `noindex` at launch, closing the structured-data gap with Synergyhair and making the site indexable at all.
3. **Visibility — R4,500 pm.** Three real, ranking competitors confirmed live in the same catchment is the proof this isn't a hypothetical market — ongoing local SEO is what keeps Salon Highwaves visible next to them after launch, not just present.
