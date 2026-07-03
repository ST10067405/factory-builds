# Tier 0 Build Runbook (target: ≤60 min per site)

Copy `_template/` → `<business-slug>/`, then work this checklist top to bottom.
The `_template` folder itself is excluded from builds/slugs — never deploy it.

## 1. Research (10 min — do NOT skip, do NOT extend)
- [ ] Google Maps detail page via Chrome `get_page_text`: rating, review count, phone, address, hours signal, 2–3 quotable reviews (copy them EXACTLY)
- [ ] Socials from the Leads DB enrichment (IG/FB/email already found by `lead_enrichment_stage2`)
- [ ] Brand capture: their logo colours / IG aesthetic if visible. If not capturable, pick an archetype palette and flag `⚠ brand not captured` in the commit message

## 2. Fill tokens (15 min)
- [ ] Replace every `{{TOKEN}}` — grep for `{{` until zero hits
- [ ] Real data only: prices stay `R —`, unverified hours keep the draft marker, review quotes verbatim from Google
- [ ] WhatsApp number = their advertised cell in `27XXXXXXXXX` form (confirm it's on WhatsApp before GO-LIVE, not before demo)

## 3. Differentiate (15 min) — the anti-clone pass
- [ ] `:root` palette ≠ any recent build (check 3 newest folders)
- [ ] Font pairing ≠ any recent build (`grep -h "family=" */index.html | sort -u`)
- [ ] ONE signature motion in the hero, matched to the business (steam / petals / leaves / marquee / sheen / self-drawing SVG / count-up). Add its keyframes inside the reduced-motion guard
- [ ] Optional: swap section order or hero layout (split / centered / arch image) so the skeleton reads differently

## 4. Images (10 min)
- [ ] Self-host in `images/` (curl download; Unsplash `?auto=format` links are fine as source)
- [ ] Read-vet every image before using (GBP photos are often wrong-business or promo posters)
- [ ] Real client photos (GBP/socials) first; graded stock as fill

## 5. Verify (5 min)
- [ ] Serve locally, open in Chrome: images load (force `loading='eager'` via console if tab is backgrounded — lazy-load doesn't fire in hidden tabs), chat chips answer, WhatsApp/Maps links present
- [ ] Mobile width check (375px), reduced-motion check
- [ ] No `{{` left, no invented facts, DRAFT banner on

## 6. Ship (5 min)
- [ ] `node scripts/build.js` (mints slug) → commit folder + `slugs.json` → push
- [ ] Write the demo slug URL into the lead's **Demo URL** field in the Leads DB
- [ ] Draft the outreach message into the lead's **Email Draft** field (2 short paragraphs: what you noticed about their business, link to the live demo, R2k + R250/m anchor). Human approves + sends
- [ ] Deploy = human gate (Vercel)

## Hard rules (unchanged)
- Single self-contained `index.html` + `images/` — no build tooling
- Never invent facts, prices, testimonials, or hours
- Comms Bridge (chat + WhatsApp + Maps) ships on every build — it's in the template
- The "online booking is coming" chat answer is the Tier 1 upsell hook — keep it
