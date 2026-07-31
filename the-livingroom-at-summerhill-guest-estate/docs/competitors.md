# Competitors — The LivingRoom at Summerhill Guest Estate

DRAFT — internal, for Jaime's review · generated 2026-07-31 · prices valid 30 days from issue once sent

Three real, currently-live fine-dining competitors in the same Durban/Midlands catchment. All URLs verified 200 (see method note).

---

### 1. The Chefs' Table
- **Town:** Durban (Umhlanga)
- **URL:** https://www.thechefstable.co.za/ — verified 200
- **Site:** A modern seasonal fine-dining site with a dedicated menu page showing course prices (R200–R350), Dineplan/OpenTable booking widgets, and a gallery/blog nav. Meta description is empty and the viewport tag omits `width=device-width` — a real mobile-rendering weak point.

### 2. 9th Avenue Marina (formerly 9th Avenue Bistro)
- **Town:** Durban Harbour
- **URL:** https://www.9thavenuemarina.co.za/ — verified 200 (note: verify via a real browser or `Invoke-WebRequest`; this host's TLS handshake fails against curl/schannel on Windows, which reads as down but isn't)
- **Site:** A Durban dining institution (25+ years) with a Dineplan "Book Now" widget embedded directly on the homepage, gallery and Instagram links. No blog/journal, no on-page reviews despite carrying 701 reviews and a 4.5 rating on Tripadvisor externally.

### 3. Hartford House (Manor House Restaurant)
- **Town:** Mooi River, KZN Midlands (Summerhill Equestrian Estate — a different Summerhill to our client's, same "boutique estate dining" category)
- **URL:** https://www.hartford.co.za/ — verified 200
- **Site:** A WordPress/Divi boutique-hotel site with a dedicated Manor House Restaurant page, gallery, Instagram, testimonials and a Tripadvisor link, full meta description and schema markup. No prices published anywhere on the restaurant page — enquiry-based, consistent with country-house positioning.

---

## Method

Search API: Serper (`https://google.serper.dev/search`, POST, `{q, gl:"za"}`).

Queries run:
1. `fine dining restaurant Durban tasting menu`
2. `9th Avenue Bistro Durban website`
3. `Beira Alta restaurant Durban website` (Beira Alta was found but excluded — it's a multi-location Portuguese chain, not a comparable independent fine-dining business, and two stronger independents were already in hand)
4. `boutique guest estate restaurant KwaZulu-Natal Midlands fine dining website`

All three chosen sites were re-verified individually with a direct status check (`curl -sL -o /dev/null -w "%{http_code}"`, with `Invoke-WebRequest` as fallback for 9th Avenue Marina where curl's TLS stack failed).
