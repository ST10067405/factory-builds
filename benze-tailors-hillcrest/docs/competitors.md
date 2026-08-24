# Benze Tailors Hillcrest — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-08-24 · prices valid 30 days from issue once sent

Three real tailoring/formalwear businesses in the greater Durban catchment, each with a working, own-domain website (verified HTTP 200 — curl and PowerShell `Invoke-WebRequest` cross-checked). None are our own clients (checked against folder names in `C:\Users\jaime\_factory_audit\builds`).

## Tip Top Tailor (Durban branch)
- **Town:** Westville, Durban — Shop 154, Entrance 2, The Pavilion Shopping Centre (closest of the three to Hillcrest/Upper Highway)
- **URL:** https://tiptoptailor.co.za/ (verified 200)
- **Site:** National chain (20+ branches across South Africa) with a dedicated Durban/Pavilion location page. Tailored suits, women's suits, wedding suits, and while-you-wait alterations. No prices shown, no online booking, no customer reviews or testimonials displayed. Gallery images present but their authenticity (real work vs. generic design imagery) isn't confirmed.
- **Why comparable:** Same core trade (made-to-measure suits + alterations + wedding wear) with a real branch inside the Hillcrest/Upper Highway catchment.

## B Gangaram Tailors
- **Town:** Gateway, Umhlanga, Durban — Shop 2, The Palm Boulevard (next to Protea Hotel)
- **URL:** https://bgangaram.co.za/ (verified 200)
- **Site:** Independent bespoke tailor trading on an 85-year heritage story (since 1937). Custom-made formal suits, sherwanis and kurtas for weddings, positioned as a premier eastern wedding-attire specialist. Two written customer testimonials displayed. No prices, no online booking, imagery reads as stock/generic rather than authentic shop or product photography. No structured data (schema.org) detected.
- **Why comparable:** The closest match to Benze in business shape — an independent, long-established bespoke tailor (not a mall chain) built on decades of reputation, same as Benze's "five decades" story.

## Suit Yourself
- **Town:** Durban North — 23 Swapo Road
- **URL:** https://www.suityourself.co.za/ (verified 200)
- **Site:** Suit hire and sales business that also offers tailoring/alterations (sleeve adjustments, jacket alterations, trouser hemming), covering weddings, matric dances, varsity balls and corporate functions. Real product photography of suits and tuxedos shown. No prices displayed on the pages reviewed, no online booking, no customer reviews or testimonials.
- **Why comparable:** Same customer occasions as Benze's matric-dance and wedding-wear services, and offers tailoring/alterations alongside its core hire business — a genuine trade overlap in the same metro.

---

### Query trail (traceability)
1. `tailor Hillcrest Durban website bespoke suits alterations` — surfaced Tip Top Tailor, Frans Tailors, TailorMe, Trublu Tailor, Legend Tailor.
2. `tailor Durban Upper Highway alterations website` — surfaced Frans Tailors, Tip Top Tailor, K Magan Tailors (Facebook-only, excluded — no independent site found).
3. `tailor Pinetown Westville Kloof own website suits alterations` — surfaced Windsor Alterations (Facebook-only, excluded), KW Tailors, Kale & Co Bespoke.
4. `"Legend Tailor" South Africa location address bespoke` — confirmed Legend Tailor SA is Johannesburg/Vereeniging-based; excluded for catchment (too far from Durban).
5. `"tailors" Durban website suits alterations -mall -Johannesburg site:co.za` — surfaced Suit Yourself, Suits Society, B Gangaram, KW Tailors.
6. `Durban bespoke tailor independent website matric dance suit wedding suit` — surfaced Suit Yourself with matric-dance/wedding specifics; confirmed KW Tailors is Cape Town-based (excluded for catchment).

### Excluded candidates
- **Frans Tailors** (franstailors.com, Gateway Umhlanga + Ocean Mall Durban) — live, real gallery, online booking; excluded only to avoid overlap with Tip Top Tailor (both are large multi-branch mall chains) in favour of a more varied set of three.
- **TailorMe** (tailorme.co.za) — Johannesburg/Cape Town/Pretoria only, no Durban presence; also returned HTTP 403 to automated fetch.
- **Trublu Tailor** (trublutailor.com) — Sandton, Johannesburg; wrong catchment.
- **Legend Tailor SA** (legendtailorsa.co.za) — Johannesburg/Vereeniging; wrong catchment. (Note: curl reported HTTP 000 on this domain — a TLS quirk on this machine; PowerShell `Invoke-WebRequest` confirmed HTTP 200, genuinely live.)
- **KW Tailors** (kwtailors.co.za) — Woodstock, Cape Town; wrong catchment.
- **K Magan Tailors & Outfitters**, **Windsor Alterations** — Facebook pages only, no independent website found.
