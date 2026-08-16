# Heron & Crow Tattoo — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-08-16 · prices valid 30 days from issue once sent

Three real, independent tattoo studios in the same catchment (Upper Highway / greater Durban, all within ~20 min of Gillitts), each with a working, own-domain website (verified HTTP 200 via curl and cross-checked with PowerShell `Invoke-WebRequest`, since curl on this machine sometimes reports 000 on TLS quirks). Azalea Ink (Hillcrest) was excluded — it is one of our own clients (`builds/azalea-ink/`), not a genuine competitor for this exercise.

## Step Up Tattoo Studio
- **Town:** Kloof (Kloof Village Mall)
- **URL:** https://www.stepuptattoostudio.com/ (verified 200)
- **Site:** Multi-page build — Home, About (studio history + team), Services (tattoos, piercings, dermal piercings, hand-poke, permanent makeup, scalp micropigmentation), FAQ, Tattoo Finance, Events, Contact. No prices shown ("free consults" mentioned instead). Walk-ins welcome, no online booking system evident. Heavy on social proof: 30+ client testimonials naming individual artists by name, praising cleanliness and professionalism. Limited real photo gallery on the homepage itself.

## Sin on Skin
- **Town:** Westville (Dawncrest, Jan Hofmeyr Rd)
- **URL:** https://sinonskin.co.za/ (verified 200)
- **Site:** WordPress build with Home, About Us, Trading Hours, Our People (artist profiles), Piercings, Bookings, Pricing, Aftercare, Merchandise, Terms & Conditions. Has a dedicated Pricing page and a dedicated Bookings page — the most booking-forward of the three. No testimonials or extensive photo gallery visible on the homepage itself. Connected to Facebook and Instagram.

## Wild Orchid Tattoos
- **Town:** Westville (private studio inside a wellness centre)
- **URL:** https://www.wildorchidtattoostudio.com/ (verified 200)
- **Site:** Wix build — Home, About, Location, Gallery, Contact. Deliberately upmarket/private positioning ("calm, upmarket experience"), appointment-only, no walk-ins, no online booking — enquiries go through a contact form. No prices, no testimonials shown. Has a dedicated Gallery page (image content not fully verified from the homepage fetch alone).

---

### Query trail (traceability)
1. `tattoo studio Hillcrest Durban website` — surfaced Azalea Ink (excluded, our client), Cam's Tats and Alpha Assassin (Hillcrest, no independent live site found), Matriarch Tattoo (Facebook-only, excluded), and Trade Mark Tattoo (Umhlanga, trademarktattoos.com — live but further catchment, not used to keep the set tightly Upper-Highway/Westville).
2. `tattoo studio Westville Durban website` — surfaced Sin on Skin and Wild Orchid Tattoos, both used above.
3. `tattoo shop Kloof Pinetown Durban website` — surfaced Step Up Tattoo Studio (used above) and KwaZulu Tattoo & Piercing Studio (Pinetown, Facebook-only — excluded, no independent site found).
4. HTTP verification: curl returned `000` (TLS handshake quirk on this machine) for `trademarktattoos.com` and `stepuptattoostudio.com`; PowerShell `Invoke-WebRequest` confirmed both as `200`, along with `sinonskin.co.za` and `wildorchidtattoostudio.com` (which curl already reported as `200`).
