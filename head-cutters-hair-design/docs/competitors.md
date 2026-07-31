# Head Cutters Hair Design — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-07-31

Three live, independent hair salons in the same catchment (Westville/Dawncliffe and the Upper Highway). Excluded: national chains/franchise directory pages (Sorbet, Booksy, Fresha listings) and any business that is already an Arkatype demo client.

## 1. Coyote Hair Studio
- Town: Westville (Shop 2, 8 Elvira Rd)
- URL: https://coyotehair.co.za/ (verified live, browser-confirmed)
- Site notes: Simple single-page template site ("17 years" in Westville). Real client-photo gallery (~19 photos) but no online booking, no WhatsApp link despite mentioning WhatsApp in the text, no schema markup, and an empty meta description.

## 2. Timeless Touch
- Town: Westville/Dawncliffe (63 Westville Road — same suburb as Head Cutters)
- URL: https://timelesstouch.co.za/ (verified 200 via curl)
- Site notes: WordPress site with a clear services + pricing list (from R180 for blow-dry up to R1,000 for keratin), an FAQ accordion, and stated opening hours. "Book Now" is a tel: link, not a real calendar. No WhatsApp CTA, no reviews/ratings shown.

## 3. New Images
- Town: Kloof & Hillcrest (Upper Highway — two locations)
- URL: https://newimages.co.za/ (verified live, browser-confirmed; curl blocked by the site's WAF/TLS setup, so verification was done via the browser instead)
- Site notes: Full WordPress + Yoast SEO setup (WebPage/WebSite/Organization/BreadcrumbList schema, canonical tags, OG tags) — the strongest technical SEO of the three. No WhatsApp, no online booking (Book links go to a static contact page), no prices shown, no reviews displayed.

## Data problem worth flagging
`coyotehair.co.za` and `newimages.co.za` returned curl exit 43 / HTTP 000 on every attempt (repeatable, including on a plain `https://example.com/` control request), while other domains fetched fine — this looks like a Schannel/TLS-negotiation quirk in this machine's curl build (or bot-detection on those two servers) rather than the sites being down. Both were confirmed live and rendering correctly via the browser tool instead, so treat them as verified-live despite the failed curl status.

## Serper queries used
- `hair salon Westville Durban website book online` (gl:za)
- `hair salon Kloof OR Hillcrest OR Gillitts Upper Highway Durban official website` (gl:za)
