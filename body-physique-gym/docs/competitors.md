# Body Physique Gym — Competitor Scan

DRAFT — internal, for Jaime's review · generated 2026-08-16 · prices valid 30 days from issue once sent

Three real, independent gyms in the greater Durban catchment — one directly in the neighbouring suburb (Yellowwood Park, ~3km from Escombe), two further afield in greater Durban — each with a working, verified-live (HTTP 200, checked with both `curl` and PowerShell `Invoke-WebRequest`) own-domain website. Franchise gyms (Virgin Active, multiple Pinetown/Kloof locations) were found and excluded in favour of independents, per the brief.

## Access Gym
- **Town:** Yellowwood Park, Durban South (closest catchment to Escombe/Queensburgh)
- **URL:** https://accessgym.co.za/ (verified 200)
- **Site:** Independent, single-location gym. Real membership pricing published on the homepage — a R50 day pass up to a R300/month contract, plus a "pay 4 months, get 1 free" promo. WhatsApp contact listed (072 231 1749). Modest real facility photography. No online booking (a manual registration/interest form instead), no reviews or testimonials, no blog/journal.

## Triple S Fitness
- **Town:** La Lucia, Durban North
- **URL:** https://triplesfitness.co.za/ (verified 200)
- **Site:** Independent, semi-private gym with a female-friendly, personal-attention positioning. WhatsApp-driven "Claim Free Trial" CTA (083 777 5883). Two client testimonials plus stated satisfaction metrics (100% client satisfaction/support). Membership prices not shown on the page. Imagery is mostly stock rather than facility-specific. No blog/journal.

## Pure Fitness
- **Town:** Durban CBD (477 Anton Lembede St)
- **URL:** https://bepurefitness.com/ (verified 200)
- **Site:** Independent, multi-level facility — dumbbells up to 50kg, machines, functional training and group classes, positioned for "beginners to PRO athletes." Real facility photo gallery. No prices on the homepage (a separate rates page), no WhatsApp (phone/email only), no reviews, no blog/journal.

---

### Query trail (traceability)

1. `independent gym Queensburgh Escombe Durban South website bodybuilding` (WebSearch) — surfaced Body Physique's own FindGLocal listing plus general Durban gym directories; no independent competitor domain yet.
2. `gym Pinetown Kloof Westville Queensburgh independent bodybuilding gym website membership` — surfaced a Pinetown gym directory (heygyms.co.za) listing Virgin Active (franchise, excluded per brief), Fitness Master Gym (no resolvable own domain — `fitnessmaster.co.za` fails DNS, only a Facebook page exists), and Jump Gym (`justgym.co.za` — confirmed dead via both `curl` HTTP 000/526 and PowerShell `Invoke-WebRequest` error 526 — excluded).
3. `"gym" Queensburgh Malvern Yellowwood Park Durban South membership website` — surfaced **Access Gym** (accessgym.co.za) — verified live, kept.
4. `"Better Bodies Gym" Malvern Durban website` — surfaced a same-named Durban South bodybuilding gym (Hillary/Memorial Park) via directory listings, but the only resolvable `betterbodiesgym.co.za` domain found belongs to an unrelated, same-named gym in Westonaria, Gauteng — excluded as a wrong-city mismatch, not the Durban business.
5. `"Levels Fitness" Durban gym location website` and direct fetches of `bepurefitness.com` / `triplesfitness.co.za` — confirmed **Triple S Fitness** and **Pure Fitness** as live, independent, own-domain sites; both kept. Levels Fitness (Durban North, functional-classes studio) was located but not used — Triple S and Pure Fitness were a closer stylistic match (weight-training/bodybuilding-adjacent) for a like-for-like comparison.

**Excluded:** Virgin Active (multiple Kloof/Pavilion/Hillcrest locations) — franchise. Fitness Master Gym — no resolvable independent domain. Jump Gym — `justgym.co.za` confirmed dead (HTTP 526) via both `curl` and PowerShell. "Better Bodies Gym" Durban South — no verifiable own-domain site found (the live `.co.za` domain of that name is a different, unrelated gym).
