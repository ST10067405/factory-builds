# The Laundry Lounge Hillary — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-08-24 · prices valid 30 days from issue once sent

Three real, independent (non-franchise-recruitment) laundry/dry-cleaning businesses serving the greater Durban catchment, each with a working own-domain website (verified HTTP 200 via curl with a browser user-agent, cross-checked with PowerShell `Invoke-WebRequest`). None is a client of ours (checked against folder names in `C:\Users\jaime\_factory_audit\builds`).

**Important caveat:** no true single-location, walk-in coin-laundromat in the immediate Hillary/Queensburgh catchment was found with an independent website — see "Excluded candidates" below. The three below are the closest verified-live comparables: laundry/dry-cleaning businesses covering the wider Durban area, mostly pickup-and-delivery in model rather than pure walk-in self-service.

## CleanLab SA
- **Coverage:** Multi-branch/multi-province service; explicitly lists Hillary and Queensburgh (alongside Durban & Surrounds) in its serviceable-area selector.
- **URL:** https://www.cleanlabsa.co.za/ (verified 200 — returns 403 to default curl/PowerShell user-agents, a bot-check quirk; confirmed live with a browser user-agent)
- **Site:** WordPress/WooCommerce build with a live booking-calendar plugin, an area-based service selector (province → suburb, KZN branch explicitly includes Hillary), and an e-commerce cart/checkout for laundry and dry-cleaning orders. No prices visible as a plain list; pricing likely revealed at checkout. No reviews or Maps embed found on the pages scanned.

## Oasis Dry Cleaning & Laundry
- **Location:** Durban North (66 Adelaide Tambo Dr, Broadway) and Glenwood (Shop 37, Glenwood Village)
- **URL:** https://oasisdrycleaning.co.za/ (verified 200)
- **Site:** Eco-friendly dry cleaning ("SoftWash® technology"), general laundry (wash/dry/fold with stain treatment), sports-kit cleaning, and corporate uniform laundry. Professional imagery throughout (not confirmed as real client photos vs. stock/template imagery). "Trusted by Engen" used as social proof. No prices, no online booking (phone/contact form only), no WhatsApp link, no Maps embed found.

## That Dirty Spot
- **Location:** Four branches — Umhlanga Ridge (main, with on-site processing plant), Mount Edgecombe, Glen Anil, Umhlanga Rocks
- **URL:** https://www.thatdirtyspot.co.za/ (verified 200)
- **Site:** Dry cleaning, carpet/upholstery "special cleaning," and household items (curtains, blankets, duvets). Online service-request form (branch + pickup/delivery preference). Claims "10,000 satisfied customers" and "800 deliveries per day," 7-day operation. No prices, no reviews/testimonials, no Maps embed found.

---

### Excluded candidates (traceability)

- **EziWash** (eziwash.co.za) — domain does not resolve (DNS failure); dead.
- **Fresh and Fold** (freshandfold.co.za) — live, but based in Port Elizabeth/Gqeberha, wrong catchment.
- **Dirty Laundry** (dirtylaundry.co.za) — live (confirmed via PowerShell after a 403 to WebFetch/curl's default UA), but based in Johannesburg, wrong catchment.
- **Coin-Op** (coin-op.co.za) — live, but Cape Town only, wrong catchment.
- **Eazi Laundromat** (eazilaundromat.co.za) — live, but based in Florida, Johannesburg, and the site is a franchise-recruitment page, not a customer-facing local business.
- **High Street Laundromat** — actually based in Tygervalley/Durbanville (Cape Town), despite the "Durban Road" street name causing confusion; wordpress.com subdomain in any case, not an own domain.
- **Rezzie's Laundromat** (Reservoir Hills/Westville, Durban — correct catchment) — hosted on a Google Sites subdomain (sites.google.com), not an independent domain; excluded on the same "own domain" basis as Millflour Cafe in the Seven Seeds scan.
- **Bluff Laundromat & Dry Cleaning**, **LD Laundry** (Pinetown), **The Laundry Room** (Glen Ashley) — all correct catchment, all real local laundromats, but only found on business directories (Hotfrog, Cylex, Waze) or Facebook — no independent website found for any of them.
- **Pressed In Time** (pressedintime.co.za) — live, correct catchment (Durban North branch), but describes itself as "South Africa's largest laundry and dry cleaning network" — set aside in favour of the three above to keep the comparison set from being dominated by the very largest national player, mirroring how the Seven Seeds scan set aside a multi-branch chain in favour of independents.

### Search queries used

1. `laundromat Durban website wash and fold service` — surfaced CleanLab SA, Fresh and Fold, EziWash, Rezzie's Laundromat, High Street Laundromat.
2. `laundry service Queensburgh Durban South website` — surfaced CleanLab SA, The Laundry Room (Facebook-only).
3. `"laundromat" Durban South OR Queensburgh OR Malvern OR Yellowwood Park OR "Northdene" website` — surfaced directory listings and CleanLab SA.
4. `self service laundromat Durban own website coin laundry` — surfaced Dirty Laundry (Johannesburg), Coin-Op (Cape Town), 24 Hour Laundry Sonstraal (Durbanville, Cape Town).
5. `"laundromat" OR "wash and fold" Pinetown OR Malvern OR "Yellowwood Park" OR Montclair OR Bluff Durban .co.za` — surfaced Bluff Laundromat & Dry Cleaning and LD Laundry (both directory/Facebook-only, no own site).
6. `High Street Laundromat Durban own domain website .co.za` — confirmed High Street Laundromat is a Cape Town business; surfaced Eazi Laundromat (Johannesburg franchise site).
7. `dry cleaners Durban KwaZulu-Natal own website locations pickup delivery -directory` — surfaced Oasis Dry Cleaning & Laundry (confirmed) and CleanLab SA.
8. `"laundry" Durban franchise website locations store` — surfaced Pressed In Time (set aside, see above) and That Dirty Spot (confirmed).
