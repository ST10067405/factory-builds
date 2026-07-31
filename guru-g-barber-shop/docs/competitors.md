# Guru G Barber Shop — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-07-31 · prices valid 30 days from issue once sent

Three real, live-site competitors in the same trade and catchment (Westville / Upper Highway / greater Durban). Two independents, one chain (per rate-card research rule: max one chain when locals are scarce — here we had enough independents but included the chain because it is physically inside Guru G's own suburb, which is directly relevant to the sales conversation).

---

### 1. Cam's Barber Shop
**Town:** Gillitts, Upper Highway (Durban)
**URL:** https://camsbarbershop.co.za/ — verified 200 OK
**What their site is like:** A WordPress site with a real, sizeable work gallery (~25 photos), Google-review/testimonial content and star-rating markup, a WhatsApp click-to-chat link, and an "appointment only" booking model. No Maps embed found on the homepage. Independent, single-location, owner-named ("Founded by Durban local Cameron Rice").

### 2. Legends Barbershop
**Town:** Westville — The Pavilion Shopping Centre (same suburb as Guru G's Westville Junction location)
**URL:** https://www.legends-barber.com/ — verified 200 OK via HEAD request (`curl -sI`, confirmed `HTTP/1.1 200 OK`; a direct `-o /dev/null -w` GET hit a local curl/schannel TLS quirk on this specific host and returned a spurious `000` despite the page loading fully in verbose mode — treated as a tooling artifact, not a site issue)
**What their site is like:** A heavy, JS-driven (Framer-built, ~780KB) brand site for a fast-growing barbershop chain now operating in 4 African countries. App-based booking ("Download the Legends app"), a real price list on the homepage (R100–R200 range), and a meta-description claim of "Africa's #1 Rated Barbershop." No WhatsApp CTA, no Maps embed, no journal/content found. This is a chain, but it just opened *inside Westville itself* — a direct, physical, well-funded local threat worth naming to the client.

### 3. Xclusive Barber
**Town:** Davenport/Bulwer, Durban (greater Durban catchment)
**URL:** https://xclusivebarber.co.za/ — verified 200 OK
**What their site is like:** A lean single-page site running a strictly online-booking, no-walk-ins model ("we operate strictly via online bookings on our website — no walk-ins allowed"). Has a Google Maps link and basic LocalBusiness schema markup. No WhatsApp CTA, no visible reviews, no prices shown. Independent, single-location.

---

## Serper queries used (traceability)

- `barbershop Westville Durban`
- `Uppercut barbershop Durban website`
- `Sorbet Man barbershop website`
- `barbershop Kloof Hillcrest Durban website booking`
- `uppercutbarbershopandsalon.com Durban`
- `Gentlemans Touch Barbershop Durban website`
- `barbershop Westville Durban site:co.za`
- `barbershop Pinetown Durban own website booking`
- `barbershop Durban "book now" -booksy -fresha -instagram -facebook site:*.co.za`
- `Cams Barber Shop location address Upper Highway`
- `Stag n Dear barbershop location address`
- `Legends Barbershop The Pavilion Westville locations`
- (cached from an earlier interrupted pass on this same lead, reused rather than re-queried: `barbershop website Upper Highway Durban booking`)

**Ruled out:** Sorbet Man (Westville Mall) — national franchise, considered but Legends was the sharper "chain just landed in our suburb" story so only one chain was kept. Uppercutbarbershopandsalon.com — turned out to be a US (North Dakota) business, unrelated to Durban's "Upper Cut" (Reservoir Hills), which itself has no owned website (Fresha listing only). Gentleman's Touch Barbershop — real but in Mount Edgecombe, outside the catchment, no owned website (Instagram/Booksy/TikTok only). New Images (Kloof/Hillcrest hairdresser) — returned HTTP 403 on verification, excluded per the "must verify 200" rule.
