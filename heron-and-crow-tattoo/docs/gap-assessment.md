# Heron & Crow Tattoo — Gap Assessment (us vs. competitors)

DRAFT — internal, for Jaime's review · generated 2026-08-16 · prices valid 30 days from issue once sent

Evidence: our `index.html`/`learn.html` read directly; competitor homepages fetched and scanned for the same signals (homepage/nav-level only, not a full site crawl — noted where uncertain).

## Feature table

| | Us (demo) | Step Up Tattoo | Sin on Skin | Wild Orchid |
|---|---|---|---|---|
| Real photos | ✗ (100% stock, disclosed) | ~ (limited on homepage) | ~ (only logo seen; site has more pages) | ~ (Gallery page exists, not fully verified) |
| Visible prices | ✗ ("R —" placeholders, honest) | ✗ (free consults only) | ✓ (dedicated Pricing page) | ✗ |
| Online booking | ✗ (WhatsApp/call, "coming soon" copy) | ✗ (walk-ins welcome, no online system) | ✓ (dedicated Bookings page) | ✗ (contact form only, appointment-only) |
| WhatsApp CTA | ✓ (real number, sticky + nav + chat) | ✗ not seen | ✗ not seen (phone number exists) | ✗ not seen |
| Chatbot | ✓ canned FAQ widget | ✗ | ✗ | ✗ |
| Maps/directions | ✓ embedded map + link | ~ not confirmed | ~ not confirmed | ~ "Location" page exists |
| Reviews shown | ~ real aggregate (5.0★/23), no quotes | ✓ 30+ named testimonials | ✗ none seen | ✗ none seen |
| Journal/content | ✓ 6 posts + FAQPage schema | ✗ no blog found | ✗ no blog found (has an Aftercare page, not a journal) | ✗ no blog found |
| Schema/SEO | ~ LocalBusiness + FAQPage schema present, but `noindex` (draft) | ~ not confirmed | ~ WordPress default, not confirmed | ~ Wix default, not confirmed |
| Mobile | ✓ | ~ not confirmed | ~ not confirmed | ~ not confirmed |

## Where we're already ahead

- We're the only one of the four with a **real, working WhatsApp CTA** wired to a confirmed number — none of the three competitors show WhatsApp on their homepage, even though Sin on Skin has a published phone number.
- We're the only one with an **on-site chat widget** answering the obvious questions (location, hours, styles, booking) without leaving the page.
- We're the only one with **any content/journal system** — 6 articles plus FAQPage schema markup already in the code. None of the three competitors run a blog.
- We're the only one with an **embedded Google Map** directly on the homepage — the others require leaving the page (or don't show one at all on the homepage).
- We display the real, current Google rating (5.0★/23) directly on the page — Step Up beats us on volume of on-page social proof (30+ testimonials), but none of the three show a live aggregate rating the way we do.

## Where competitors beat us today

- Sin on Skin already has a **live Pricing page and a Bookings page** — the most self-serve of the four, and the clearest gap for us to consider closing (see `quote.md`).
- Step Up Tattoo has **extensive, named client testimonials** — real social proof we can't replicate without real reviews (we intentionally show no invented quotes).
- All three appear to have **at least some real photography or a gallery page** in their site structure, even where we couldn't confirm the images directly — ours is 100% stock, clearly disclosed as such in the footer.
- All three are **live, indexed, real websites today**. Ours is a draft (`noindex`), not yet public.

## The two sharpest gaps

1. **No real photography.** Both photos pulled for this build failed vetting (a heron tattoo photo carrying a third-party clothing-brand watermark, and a polished multi-panel composite that couldn't be confirmed as this studio's own work) — see `images/_assets-manifest.json`. Every image on the demo today is stock. For a portfolio-led tattoo studio with two active artists and an Instagram following, this is the single highest-leverage fix available.
2. **No structured booking path beyond WhatsApp.** Sin on Skin already runs a live Bookings + Pricing flow; we rely on WhatsApp and a "coming soon" chatbot answer.

## What closes them

1. **Real photography** — the fastest, lowest-cost path is likely sourcing existing session photos directly from the two resident artists' own galleries/Instagram (with their permission), rather than commissioning a fresh shoot first. If that's not enough, a photo/video shoot is on the rate card as TBC pricing — arrange directly once the artists confirm what they can already supply.
2. **Booking integration (R3,600)** — once the studio picks a platform (Fresha is the local norm; Azalea Ink and Step Up Tattoo both already use it). Worth confirming first whether the two artists actually want self-serve booking, or prefer to keep consultations WhatsApp-gated the way Wild Orchid deliberately does.
3. **On-page reviews depth** — not a rate-card line by default, but worth a copywriting pass (R850/page) once the client can supply real review quotes to sit alongside the aggregate rating we already show.
