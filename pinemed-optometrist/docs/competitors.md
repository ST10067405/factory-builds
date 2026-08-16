# PineMed Optometrist — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-08-16 · prices valid 30 days from issue once sent

Three real, live, verified (HTTP 200, curl + PowerShell `Invoke-WebRequest` cross-checked) independent optometry practices in the Pinetown/Westville/Upper Highway catchment. All are independents with their own domain — deliberately excluding Specsavers and Torga Optical, whose Pinetown/Westville/Hillcrest/Kloof branch pages also surfaced in the same searches, per the brief (franchises are never named or used as comparators on the public-facing site).

## 1. Westville Eyecare
- **Town:** Westville
- **URL:** https://westvilleeyecare.co.za/ (verified 200)
- **Site:** WordPress build, titled "Westville eyecare Optometrist — We change the world you see". Has a "Book now" call-to-action on the homepage. No WhatsApp link found in the page markup, no Google Maps embed detected in the static HTML, no chatbot, no visible prices.

## 2. Graham Lewis Optometrist
- **Town:** Hillcrest
- **URL:** https://grahamlewisoptometrist.co.za/ (verified 200)
- **Site:** WordPress build using the Revolution Slider plugin. Has a Google Maps embed on the homepage. No WhatsApp link found, no chatbot, no visible prices (an initial "R11" grep hit turned out to be a false positive — part of the plugin's internal script name `revslider11`, not a price).

## 3. Kloof Optometrists
- **Town:** Kloof
- **URL:** https://www.kloofoptom.co.za/ (verified 200)
- **Site:** Modern Next.js build (client-rendered) — "Kloof Optometrists" has served the area since 1991 per public listings. Because the site renders via JavaScript, our static fetch only captured the initial app shell; WhatsApp/Maps/pricing presence on this one couldn't be fully confirmed from the raw HTML alone, flagged as a limitation rather than a claim either way.

## Why these three are comparable
All three are independently owned optometry practices (not franchise chains) serving the same Pinetown/Westville/Upper Highway catchment as PineMed, each with its own live, owned domain — the same competitive set a Pinetown CBD patient would realistically be choosing between.

## Search queries used (traceability)
1. `independent optometrist Pinetown website` — surfaced Torga Optical Pinecrest, Specsavers Pinetown (both excluded as franchises), plus PineMed's own Facebook listing.
2. `optometrist Westville KZN website book eye test` — surfaced Spec-Savers Westville Junction and Execuspecs Westville Mall (both excluded as franchises), Westville Eyecare, and two other Westville-named sites (westvilleoptometrist.co.za, westvilleeye.co.za) that returned ambiguous/empty page titles on fetch — excluded in favour of the clearly-titled, confirmed-independent Westville Eyecare.
3. `optometrist Highway Durban independent practice website` — used to widen the Upper Highway search; no additional catchment-fit independent found beyond the Westville/Hillcrest/Kloof set below.
4. `optometrist Hillcrest Kloof KZN independent practice website eye test` — surfaced Spec-Savers Hillcrest/Kloof and Execuspecs Hillcrest (all excluded as franchises), Graham Lewis Optometrist, and Kloof Optometrists.

## Excluded (franchises, per brief)
Specsavers Pinetown (Hill Street), Specsavers Pine Crest Centre, Specsavers Westville Junction, Specsavers Hillcrest, Specsavers Kloof, Torga Optical Pinecrest, Torga Optical Westwood, Execuspecs Westville Mall, Execuspecs Hillcrest — all live franchise-branch sites, never named on PineMed's own site per the brief's positioning rule.
