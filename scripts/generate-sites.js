#!/usr/bin/env node
/*
 * generate-sites.js — build an icon-forward concept site (index.html) per scouted lead
 * from builds/local-leads.json. Real data only, no photos (zero contamination), category
 * palette/icon/services, Comms Bridge, Maps embed, noindex + draft ribbon + reduced-motion,
 * WCAG-AA --accent/--accent-ink, 44px touch targets. Un-breaks the board previews.
 *   node scripts/generate-sites.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const leads = JSON.parse(fs.readFileSync(path.join(ROOT, 'local-leads.json'), 'utf8'));

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const telOf = p => '+27' + String(p || '').replace(/\D/g, '').replace(/^0/, '');
const isMobile = p => /^0(6|7|8)/.test(String(p || '').replace(/\s/g, ''));
const q = s => encodeURIComponent(s);

// category -> theme. accent-ink values are all >=4.8:1 on their bg (verified family).
const THEMES = {
  dental:   { pal:['#F4F7F8','#14202A','#0E6E8C','#7FC6D9','#0B5A72','rgba(20,32,42,.72)'], disp:'Sora', body:'Inter',
    icon:'<path d="M12 5c-2-2-5-2-6 0-1.4 2-1 6 .5 10 .8 2.2 1.6 3 2.5 3 .8 0 1-1.5 1.3-3 .2-1 .5-1.5 1.2-1.5s1 .5 1.2 1.5c.3 1.5.5 3 1.3 3 .9 0 1.7-.8 2.5-3 1.5-4 1.9-8 .5-10-1-2-4-2-6 0z"/>',
    svc:['Check-ups &amp; cleaning','Fillings','Extractions','Teeth whitening','Crowns &amp; bridges','Emergency care'], kind:'dental practice' },
  barber:   { pal:['#F5F3EF','#1C1A17','#232323','#C8922E','#8A5E12','rgba(28,26,23,.72)'], disp:'Space Grotesk', body:'Inter',
    icon:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.1" y2="15.9"/><line x1="14.5" y1="14.5" x2="20" y2="20"/><line x1="8.1" y1="8.1" x2="12" y2="12"/>',
    svc:['Cuts &amp; fades','Beard trims','Hot-towel shave','Kids&rsquo; cuts','Line-ups','Styling'], kind:'barbershop' },
  hair:     { pal:['#FAF5F6','#241A20','#6E3350','#D98BA0','#9A3755','rgba(36,26,32,.72)'], disp:'Fraunces', body:'Karla',
    icon:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.1" y2="15.9"/><line x1="14.5" y1="14.5" x2="20" y2="20"/><line x1="8.1" y1="8.1" x2="12" y2="12"/>',
    svc:['Cut &amp; style','Colour','Highlights &amp; balayage','Blow-dry','Treatments','Bridal &amp; occasion'], kind:'hair salon' },
  beauty:   { pal:['#FBF4F2','#2A1F26','#7A2E4A','#E8A0B4','#9A3755','rgba(42,31,38,.72)'], disp:'Fraunces', body:'Karla',
    icon:'<path d="M12 3l2.2 5.2L20 9l-4 3.6L17 19l-5-3-5 3 1-6.4L4 9l5.8-.8z"/>',
    svc:['Facials &amp; skin','Lashes','Brows','Waxing','Nails','Massage &amp; treatments'], kind:'beauty studio' },
  pet:      { pal:['#F4F6F0','#1E2418','#3E5E34','#E8B87A','#6B4A1E','rgba(30,36,24,.72)'], disp:'Poppins', body:'Inter',
    icon:'<circle cx="5.5" cy="12" r="1.8"/><circle cx="9.5" cy="7.5" r="1.8"/><circle cx="14.5" cy="7.5" r="1.8"/><circle cx="18.5" cy="12" r="1.8"/><path d="M12 12c-2.2 0-4 1.8-4 3.6 0 1.6 1.4 2.4 4 2.4s4-.8 4-2.4C16 13.8 14.2 12 12 12z"/>',
    svc:['Bath &amp; blow-dry','Full groom','Nail clipping','De-shedding','Puppy grooming','Mobile service'], kind:'pet groomer' },
  cafe:     { pal:['#F6F1EA','#241C15','#5B3A26','#C89B6A','#7A4E2E','rgba(36,28,21,.72)'], disp:'Fraunces', body:'Inter',
    icon:'<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h2a2 2 0 0 1 0 4h-2"/><line x1="7" y1="3" x2="7" y2="5"/><line x1="11" y1="3" x2="11" y2="5"/>',
    svc:['Coffee &amp; espresso','Breakfast','Lunch &amp; light meals','Cakes &amp; bakes','Takeaway','Catering'], kind:'cafe' },
  plumbing: { pal:['#F4F7F7','#13211F','#0E5C63','#C8703A','#8A4A24','rgba(19,33,31,.72)'], disp:'Manrope', body:'Inter',
    icon:'<path d="M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9z"/>',
    svc:['Leaks &amp; burst pipes','Geyser repairs &amp; installs','Blocked drains','Taps &amp; mixers','Toilets &amp; cisterns','Maintenance &amp; call-outs'], kind:'plumber' },
  electrical:{pal:['#F5F6F8','#161B26','#1B2A4A','#F5B301','#6E5410','rgba(22,27,38,.72)'], disp:'Sora', body:'Inter',
    icon:'<polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2"/>',
    svc:['Fault finding &amp; repairs','DB board upgrades','Lighting installation','Plugs &amp; sockets','Certificates of Compliance','Backup power &amp; inverters'], kind:'electrician' },
  venue:    { pal:['#F5F5F0','#20241C','#3E4A34','#C2B280','#5E5620','rgba(32,36,28,.72)'], disp:'Cormorant Garamond', body:'Jost',
    icon:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    svc:['Functions &amp; events','Weddings','Accommodation','Conferencing','Dining','Private hire'], kind:'venue' },
  other:    { pal:['#F5F5F4','#1C1C1A','#2E3A46','#9BB0C1','#3A4A57','rgba(28,28,26,.72)'], disp:'Sora', body:'Inter',
    icon:'<circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/>',
    svc:['Consultation','Our services','Quality work','Local &amp; reliable','Get in touch','Book a visit'], kind:'local business' }
};
function themeFor(l){
  const c = (l.category + ' ' + l.name).toLowerCase();
  if (/dent/.test(c)) return THEMES.dental;
  if (/barber/.test(c)) return THEMES.barber;
  if (/plumb/.test(c)) return THEMES.plumbing;
  if (/electric|solar/.test(c)) return THEMES.electrical;
  if (/groom|\bpet\b|\bdog\b|parlour/.test(c)) return THEMES.pet;
  if (/beaut|aesthet|\bnail\b|\bspa\b|therapy/.test(c)) return THEMES.beauty;
  if (/salon|hair|hairdress/.test(c)) return THEMES.hair;
  if (/coffee|cafe|café|restaurant|bistro|eatery|food|tea/.test(c)) return THEMES.cafe;
  if (/estate|guest|lodge|venue|room/.test(c)) return THEMES.venue;
  return THEMES.other;
}

function site(l){
  const t = themeFor(l);
  const [bg,ink,brand,accent,aink,mut] = t.pal;
  const name = esc(l.name), town = esc(l.town || 'Durban'), addr = esc(l.address || l.town || 'Durban');
  const tel = telOf(l.phone), mob = isMobile(l.phone);
  const wa = 'https://wa.me/' + tel.replace('+','');
  const ratingReal = l.rating && l.reviews ? `${l.rating} &middot; ${l.reviews} Google reviews` : 'Well-rated locally';
  const kicker = `${esc(l.category || t.kind)} · ${town}`;
  const chatQA = [
    ['Where are you?', `We&rsquo;re in ${town}${l.address? ' (' + addr + ')':''} — see the map in the Visit section for directions.`],
    ['What do you offer?', `${t.svc.slice(0,4).join(', ').replace(/&amp;/g,'and')} and more. Final details confirmed with ${name}.`],
    ['What are your hours?', `Hours are being confirmed with ${name}. (draft — final hours from ${name}.)`],
    ['How do I book?', mob ? `Call or WhatsApp ${esc(l.phone)}.` : (l.phone? `Call ${esc(l.phone)}.` : 'Reach us via the contact details in the Visit section.')]
  ];
  const socials = [l.instagram && `<a href="${esc(l.instagram)}" target="_blank" rel="noopener">Instagram</a>`, l.facebook && `<a href="${esc(l.facebook)}" target="_blank" rel="noopener">Facebook</a>`].filter(Boolean).join(' &middot; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — ${esc(l.category || t.kind)} in ${town}</title>
<meta name="description" content="${name} in ${town} — ${esc(l.category || t.kind)}. ${l.rating?`Rated ${l.rating} on Google. `:''}Get in touch to book.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${t.disp.replace(/ /g,'+')}:wght@500;600;700&family=${t.body.replace(/ /g,'+')}:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:${bg};--surface:#fff;--ink:${ink};--brand:${brand};--accent:${accent};--accent-ink:${aink};--mut:${mut};--line:rgba(0,0,0,.10);--display:'${t.disp}',serif;--body:'${t.body}',sans-serif}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--body);line-height:1.65;overflow-x:hidden}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.draft{position:fixed;top:0;left:0;right:0;z-index:99;background:var(--brand);color:#fff;font-size:11px;letter-spacing:.14em;text-transform:uppercase;text-align:center;padding:6px 12px;font-weight:600}
nav{position:fixed;top:28px;left:0;right:0;z-index:50;transition:background .3s,box-shadow .3s}
nav.scrolled{background:var(--bg);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--line)}
.nav-in{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:1120px;margin:0 auto}
.logo{font-family:var(--display);font-size:22px;font-weight:700;color:var(--brand);text-decoration:none}
.nav-links{display:flex;gap:26px;list-style:none}.nav-links a{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut);text-decoration:none}
.nav-links a:hover{color:var(--brand)}
.nav-cta{font-size:13px;font-weight:600;background:var(--brand);color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center;touch-action:manipulation}
@media(max-width:760px){.nav-links{display:none}}
header{position:relative;overflow:hidden;padding:132px 0 76px}
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,5vw,56px);align-items:center}
@media(max-width:900px){.hero{grid-template-columns:1fr;gap:28px}header{padding:116px 0 52px}}
.kicker{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--accent-ink);margin-bottom:18px}
h1{font-family:var(--display);font-size:clamp(38px,6vw,72px);line-height:1.04;letter-spacing:-.01em;text-wrap:balance}
.sub{max-width:46ch;margin-top:20px;color:var(--mut);font-size:17px}
.proof{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px;font-size:13.5px;color:var(--mut);align-items:center}
.pill{display:inline-flex;align-items:center;gap:7px;background:color-mix(in srgb,var(--accent) 22%,transparent);color:var(--accent-ink);font-weight:700;padding:6px 12px;border-radius:8px;font-size:12.5px}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:14.5px;padding:13px 26px;border-radius:8px;text-decoration:none;min-height:44px;touch-action:manipulation;transition:transform .2s}
.btn-p{background:var(--brand);color:#fff}.btn-p:hover{transform:translateY(-2px)}
.btn-g{background:transparent;color:var(--brand);border:1.5px solid var(--accent)}.btn-g:hover{background:color-mix(in srgb,var(--accent) 14%,transparent)}
.loc{margin-top:16px;font-size:13px;color:var(--mut)}
.panel{position:relative;border-radius:16px;background:var(--brand);aspect-ratio:4/5;display:grid;place-items:center;overflow:hidden;box-shadow:0 30px 60px -28px rgba(0,0,0,.45)}
@media(max-width:900px){.panel{aspect-ratio:16/10}}
.panel svg{width:38%;height:38%;stroke:var(--accent);stroke-width:1.4;fill:none;stroke-linecap:round;stroke-linejoin:round;opacity:.95}
.panel .badge{position:absolute;bottom:18px;left:0;right:0;text-align:center;color:#fff;font-size:13px;font-weight:600;opacity:.9}
.glow{position:absolute;width:60%;height:60%;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 55%,transparent),transparent 70%);filter:blur(30px);animation:drift 9s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate(-10%,-6%)}to{transform:translate(12%,8%)}}
section{padding:clamp(64px,8vw,100px) 0}
h2{font-family:var(--display);font-size:clamp(30px,4.6vw,48px);line-height:1.1;margin-bottom:16px;text-wrap:balance}
.lede{color:var(--mut);max-width:60ch}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:44px}
@media(max-width:820px){.cards{grid-template-columns:1fr}}
.card{background:var(--surface);border:1px solid var(--line);border-top:3px solid var(--accent);border-radius:12px;padding:28px 24px}
.card h3{font-family:var(--display);font-size:20px;margin-bottom:8px;color:var(--brand)}.card p{color:var(--mut);font-size:14.5px}
.svc{display:grid;grid-template-columns:1fr 1fr;gap:0 48px;margin-top:20px}
@media(max-width:640px){.svc{grid-template-columns:1fr}}
.si{display:flex;justify-content:space-between;gap:14px;padding:15px 0;border-bottom:1px solid var(--line)}
.si b{font-weight:600}.si .p{color:var(--accent-ink);font-weight:600;font-size:13.5px}
.rate{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:center;margin-top:36px;background:var(--brand);color:#fff;border-radius:14px;padding:38px}
@media(max-width:600px){.rate{grid-template-columns:1fr;gap:16px;text-align:center}}
.rate .n{font-family:var(--display);font-size:72px;line-height:1;color:var(--accent)}
.rate small{display:block;font-size:12.5px;opacity:.8;margin-top:6px}
.rate p{opacity:.9;font-size:14.5px}
.visit{display:grid;grid-template-columns:1fr 1fr;gap:48px}@media(max-width:820px){.visit{grid-template-columns:1fr}}
.vi{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--line)}.vi b{display:block}.vi span,.vi a{color:var(--mut);font-size:14.5px;text-decoration:none}
iframe{border:0;display:block;width:100%;height:230px;border-radius:12px;border:1px solid var(--line)}
footer{border-top:1px solid var(--line);padding:36px 0;color:var(--mut);font-size:12.5px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
.reveal{opacity:0;transform:translateY(22px);transition:.6s}.reveal.in{opacity:1;transform:none}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
.fab-stack{position:fixed;right:20px;bottom:20px;z-index:80;display:flex;flex-direction:column;gap:12px;align-items:flex-end}
.fab{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;cursor:pointer;border:none;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.fab-wa{background:#25D366}.fab-chat{background:var(--brand)}
.chatbox{position:fixed;right:20px;bottom:146px;z-index:81;width:min(330px,calc(100vw - 40px));background:var(--bg);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:none;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.chatbox.open{display:flex}.chat-head{background:var(--brand);color:#fff;padding:13px 16px;font-size:13px;font-weight:600;display:flex;justify-content:space-between}
.chat-head button{background:none;border:none;color:#fff;cursor:pointer;font-size:16px}
.chat-log{padding:14px;display:flex;flex-direction:column;gap:9px;max-height:270px;overflow-y:auto}
.msg{max-width:85%;padding:9px 13px;border-radius:12px;font-size:13.5px}.msg.bot{background:var(--surface)}.msg.user{background:var(--brand);color:#fff;align-self:flex-end}
.chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 14px}
.chip{font-size:12px;font-weight:600;border:1px solid var(--accent);background:none;color:var(--accent-ink);border-radius:8px;padding:8px 13px;min-height:44px;display:inline-flex;align-items:center;cursor:pointer;touch-action:manipulation}
.chip:hover{background:var(--accent);color:#fff}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}.glow{animation:none}.btn:hover{transform:none}}
</style></head>
<body>
<div class="draft">Concept draft — built for ${name} by Arkatype Digital · not yet live</div>
<nav id="nav"><div class="nav-in">
  <a class="logo" href="#top">${name.length>22?name.slice(0,20)+'…':name}</a>
  <ul class="nav-links"><li><a href="#about">About</a></li><li><a href="#services">Services</a></li><li><a href="#reviews">Reviews</a></li><li><a href="#visit">Visit</a></li></ul>
  ${l.phone?`<a class="nav-cta" href="tel:${tel}">${esc(l.phone)}</a>`:`<a class="nav-cta" href="#visit">Contact</a>`}
</div></nav>
<header id="top"><div class="wrap"><div class="hero">
  <div>
    <p class="kicker">${kicker}</p>
    <h1>${esc(l.name)}</h1>
    <p class="sub">A ${esc(l.category||t.kind).toLowerCase()} in ${town} and the surrounding Upper Highway — real, local, and easy to reach. This is a concept of what a proper website could do for the business.</p>
    <div class="proof"><span>★★★★★&nbsp;${ratingReal}</span><span class="pill">Local · ${town}</span></div>
    <div class="actions">
      ${l.phone?`<a class="btn btn-p" href="tel:${tel}">Call ${esc(l.phone)}</a>`:''}
      ${mob?`<a class="btn btn-g" href="${wa}?text=${q('Hi '+l.name+', I would like to book')}" target="_blank" rel="noopener">WhatsApp us</a>`:(l.booking?`<a class="btn btn-g" href="${esc(l.booking)}" target="_blank" rel="noopener">Book online</a>`:'')}
    </div>
    <p class="loc">${addr}${l.phone?' · '+esc(l.phone):''}</p>
  </div>
  <div class="panel"><div class="glow"></div><svg viewBox="0 0 24 24" aria-hidden="true">${t.icon}</svg><div class="badge">${town} · ${l.rating?l.rating+' ★':'local'}</div></div>
</div></div></header>

<section id="about"><div class="wrap">
  <h2 class="reveal">Why ${town} chooses ${esc(l.name)}</h2>
  <p class="lede reveal">${esc(l.suggestedAngle || 'A trusted local business worth finding online.')}</p>
  <div class="cards">
    <div class="card reveal"><h3>Truly local</h3><p>Based in ${town} on the Upper Highway — close by, familiar, and easy to reach.</p></div>
    <div class="card reveal"><h3>Well-rated</h3><p>${l.rating?`A ${l.rating}★ Google rating from ${l.reviews} reviews — steady, careful work locals come back for.`:'A steady local reputation built on careful, honest work.'}</p></div>
    <div class="card reveal"><h3>Easy to reach</h3><p>${l.phone?'One call or message away':'A message away'}${socials?', and active on '+socials.replace(/<[^>]+>/g,'').replace(/&middot;/g,'&').replace(/\s+/g,' '):''} — no hoops to book.</p></div>
  </div>
</div></section>

<section id="services" style="padding-top:0"><div class="wrap">
  <h2 class="reveal">What we do</h2>
  <p class="lede reveal">A sample of typical services — the final list &amp; pricing are confirmed by ${esc(l.name)}.</p>
  <div class="svc reveal">
    ${t.svc.map(s=>`<div class="si"><div><b>${s}</b></div><span class="p">R —</span></div>`).join('')}
  </div>
</div></section>

<section id="reviews" style="padding-top:0"><div class="wrap">
  <h2 class="reveal">${l.rating?`Rated ${l.rating} by locals`:'Trusted locally'}</h2>
  <div class="rate reveal">
    <div class="n">${l.rating||'★'}<small>${l.reviews?'★★★★★ · '+l.reviews+' Google reviews':'Google rated'}</small></div>
    <p>${esc(l.painSignal || 'A well-regarded local business — a proper website would help more people find and book them.')} <br><span style="opacity:.7;font-size:12.5px">Rating shown is from the business&rsquo;s live Google profile; review highlights to be added with ${esc(l.name)}&rsquo;s sign-off.</span></p>
  </div>
</div></section>

<section id="visit" style="padding-top:0"><div class="wrap"><div class="visit">
  <div class="reveal">
    <h2>Find ${esc(l.name.split(' ').slice(0,2).join(' '))}</h2>
    <div class="vi"><div><b>Where</b><span>${addr}</span></div></div>
    ${l.phone?`<div class="vi"><div><b>Call</b><a href="tel:${tel}">${esc(l.phone)}</a></div></div>`:''}
    ${mob?`<div class="vi"><div><b>WhatsApp</b><a href="${wa}" target="_blank" rel="noopener">${esc(l.phone)}</a></div></div>`:''}
    ${socials?`<div class="vi"><div><b>Social</b><span>${socials}</span></div></div>`:''}
    <div class="vi"><div><b>Hours</b><span>To be confirmed (draft)</span></div></div>
    <iframe title="Map to ${name}" src="https://maps.google.com/maps?q=${q(l.name+' '+town)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="margin-top:16px"></iframe>
  </div>
  <div class="reveal panel" style="aspect-ratio:1/1"><div class="glow"></div><svg viewBox="0 0 24 24" aria-hidden="true">${t.icon}</svg><div class="badge">${esc(l.category||t.kind)}</div></div>
</div></div></section>

<footer class="wrap"><span>${name} · ${town}</span><span>Concept by Arkatype Digital — draft, awaiting client sign-off</span></footer>

<div class="fab-stack">
  ${mob?`<a class="fab fab-wa" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.7-1.4 1.3-1.9 1.4-.5.1-1.1.2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.2 1c.3.1.5.2.5.3.1.1.1.5-.1 1.1z"/></svg></a>`:''}
  <button class="fab fab-chat" id="chatToggle" aria-label="Ask a question" aria-expanded="false"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
</div>
<div class="chatbox" id="chatbox" role="dialog" aria-label="Quick questions">
  <div class="chat-head"><span>${name.length>20?name.slice(0,18)+'…':name} — quick answers</span><button id="chatClose" aria-label="Close">✕</button></div>
  <div class="chat-log" id="chatLog" aria-live="polite"><div class="msg bot">Hi! Ask me anything about ${name} 👇</div></div>
  <div class="chips" id="chatChips"></div>
</div>
<script>
const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const QA=${JSON.stringify(chatQA)};
const box=document.getElementById('chatbox'),log=document.getElementById('chatLog'),chips=document.getElementById('chatChips'),tg=document.getElementById('chatToggle');
QA.forEach(([qq,aa])=>{const b=document.createElement('button');b.className='chip';b.innerHTML=qq;b.onclick=()=>{log.insertAdjacentHTML('beforeend','<div class="msg user">'+qq+'</div>');setTimeout(()=>{log.insertAdjacentHTML('beforeend','<div class="msg bot">'+aa+'</div>');log.scrollTop=log.scrollHeight},300);log.scrollTop=log.scrollHeight};chips.appendChild(b)});
tg.onclick=()=>{const o=box.classList.toggle('open');tg.setAttribute('aria-expanded',o)};document.getElementById('chatClose').onclick=()=>box.classList.remove('open');
</script>
</body></html>`;
}

let n = 0;
for (const l of leads) {
  const dir = path.join(ROOT, l.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), site(l));
  n++;
  console.log('built ' + l.slug + '  [' + themeFor(l).kind + ']');
}
console.log('\nGenerated ' + n + ' concept sites (index.html).');
