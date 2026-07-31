# Competitors — Guru's Barbershop Maytime Kloof

DRAFT — internal, for Jaime's review · generated 2026-07-31

Three real barbershops in the same catchment (Kloof / Upper Highway / greater Durban), each with a working website verified live.

---

**1. Cam's Barber Shop** — Gillitts (Upper Highway)
https://camsbarbershop.co.za/ — verified 200
Independent single-location shop. Dedicated `/book/` booking page, WhatsApp click-to-chat, a 25-photo gallery, "premium grooming" positioning. No prices shown on the site.

**2. Legends Barbershop** — Kloof (Waterfall Corner)
https://www.legends-barber.com/ — verified live: `http://` returns 308 → `https://www.legends-barber.com/` returns 200 OK (confirmed via header trace and a full-body fetch matching the response's Content-Length; direct HTTPS status probing hit a local TLS/schannel quirk on this machine, not a site outage).
Multi-location brand with a shop physically in Kloof at Waterfall Corner. High-production Framer build, "Africa's #1 Rated Barbershop" positioning, 53-photo gallery, prices shown, booking flow. No WhatsApp CTA detected.

**3. Nev the Barber** — Durban North
https://www.nevthebarber.co.za/ — verified 200
Independent shop with an active blog/journal, prices shown, Google Maps embed, Fresha-linked booking. No WhatsApp CTA detected.

---

**Excluded candidates (for traceability):**
- Deacons Hair Salon (deaconshairsalon.co.za, Hillcrest) — resolves HTTP 200 but serves a parked "domain registered on behalf of our client" placeholder page, not a live business site. Their real presence is Facebook + Fresha only.
- Guru G Barbershop (Hillcrest Corner) and Areeb Guru Barber Shop (Pioneer Rd, Kloof) — both appear to be sibling branches of the same Guru family per our research, not independent competitors.
- Medellin – The Barber Cartel (medellin.co.za) — live and well-built, but a larger multi-store franchise brand; dropped in favour of Legends as the "one chain" allowance since Legends has an actual shop in Kloof itself.

**Serper queries used** (google.serper.dev/search, gl:"za"):
`barbershop Kloof Durban` · `barbershop Hillcrest Durban` · `barbershop Gillitts` · `Deacons Barbershop Hillcrest website` · `Gentlemans Touch Barbershop website Durban` · `barbershop website Upper Highway Durban booking` · `barber Waterfall Kloof Durban own website` · `mens barbershop Kloof Village website`
