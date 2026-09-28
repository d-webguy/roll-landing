import React, { useEffect, useRef, useState } from "react";

const styles = `
.roll{
  --sage-bg:#E4ECE0; --sage-deep:#5C6B54; --sage-mid:#7C8B72;
  --ink:#141810; --cream:#F6F8F1; --muted:#7A8371; --line:rgba(255,255,255,0.5);
  --card:rgba(255,255,255,0.42); --card-border:rgba(255,255,255,0.65); --card-blur:blur(18px) saturate(160%);
  --glass-shadow:0 10px 34px rgba(20,24,16,0.10), inset 0 1px 0 rgba(255,255,255,0.5);
}
.roll[data-theme="dark"]{
  --sage-bg:#12160D; --sage-deep:#8FBF7A; --sage-mid:#6E8A5E;
  --ink:#F1F4EB; --cream:#F1F4EB; --muted:#8FA07D;
  --line:rgba(255,255,255,0.12); --card:rgba(255,255,255,0.06); --card-border:rgba(255,255,255,0.16);
  --card-blur:blur(18px) saturate(160%); --glass-shadow:0 10px 34px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
}
.roll[data-theme="neutral"]{
  --sage-bg:#EDEBE6; --sage-deep:#5A564D; --sage-mid:#8A857A;
  --ink:#232220; --cream:#FAF9F6; --muted:#8A8680;
  --line:rgba(255,255,255,0.55); --card:rgba(255,255,255,0.45); --card-border:rgba(255,255,255,0.65);
  --card-blur:blur(18px) saturate(140%); --glass-shadow:0 10px 34px rgba(35,34,32,0.08), inset 0 1px 0 rgba(255,255,255,0.5);
}
.roll[data-theme="transparent"]{
  --sage-bg:transparent; --sage-deep:#5C6B54; --sage-mid:#7C8B72;
  --ink:#141810; --cream:#F6F8F1; --muted:#5A5F53;
  --line:rgba(255,255,255,0.4); --card:rgba(255,255,255,0.16); --card-border:rgba(255,255,255,0.4);
  --card-blur:blur(20px) saturate(160%); --glass-shadow:0 10px 34px rgba(20,24,16,0.08), inset 0 1px 0 rgba(255,255,255,0.35);
}
.roll{background:var(--sage-bg); color:var(--ink); font-family:Inter, ui-sans-serif, system-ui, sans-serif; line-height:1.5; transition:background 0.4s, color 0.4s;}
.roll[data-theme="transparent"]{
  background:
    radial-gradient(circle at 12% 8%, rgba(191,214,174,0.9), transparent 42%),
    radial-gradient(circle at 88% 28%, rgba(236,200,170,0.65), transparent 42%),
    radial-gradient(circle at 28% 92%, rgba(170,198,220,0.65), transparent 42%),
    #E4ECE0;
  background-attachment:fixed;
}
.roll-glass{
  background:var(--card); backdrop-filter:var(--card-blur); -webkit-backdrop-filter:var(--card-blur);
  border:1px solid var(--card-border); box-shadow:var(--glass-shadow);
}

.roll-theme-toggle{
  display:flex; gap:4px; border-radius:999px; padding:3px;
  background:var(--card); border:1px solid var(--card-border); backdrop-filter:var(--card-blur); -webkit-backdrop-filter:var(--card-blur);
}
.roll-theme-toggle button{
  width:26px; height:26px; border-radius:50%; border:none; background:transparent; cursor:pointer;
  display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:11px;
}
.roll-theme-toggle button.active{background:var(--sage-mid); color:var(--cream);}
.roll h1,.roll h2,.roll h3{font-family:Spectral, Georgia, serif; font-weight:500; color:var(--ink);}
.roll a{color:inherit; text-decoration:none;}
.roll-wrap{max-width:1120px; margin:0 auto; padding:0 32px;}

.roll-header{display:flex; align-items:center; justify-content:space-between; padding:22px 32px;}
.roll-brand{display:flex; align-items:center; gap:10px; font-size:16px; letter-spacing:0.28em; font-weight:600;}
.roll-brand .bars{display:flex; flex-direction:column; gap:2px;}
.roll-brand .bars span{display:block; width:16px; height:4px; background:var(--sage-deep); border-radius:1px;}
.roll-brand .bars span:nth-child(2){width:12px; background:var(--sage-mid);}
.roll-nav{display:flex; align-items:center; gap:22px; font-size:14px;}
.roll-menu-btn{border:1px solid var(--line); border-radius:999px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;}
@media (max-width:680px){ .roll-nav a{display:none;} }

/* HERO: full-bleed rotating image with overlay */
.roll-hero{
  position:relative; min-height:560px; overflow:hidden;
  display:flex; align-items:flex-end; padding:64px 32px 72px;
}
.roll-hero-bg{
  position:absolute; inset:0; z-index:0; opacity:0; cursor:pointer;
  background-size:cover; background-position:center;
  transition:opacity 1.1s ease-in-out, transform 0.12s ease-out;
}
.roll-hero-bg.active{opacity:1;}
@media (prefers-reduced-motion: reduce){ .roll-hero-bg{ transition:opacity 1.1s ease-in-out; } }
.roll-hero-bg::after{
  content:""; position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(10,14,8,0.15), rgba(8,10,6,0.78) 72%);
}

.roll-hero-inner{max-width:640px; position:relative; z-index:1;}
.roll-eyebrow{
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(255,255,255,0.14); backdrop-filter:blur(14px) saturate(160%); -webkit-backdrop-filter:blur(14px) saturate(160%);
  border:1px solid rgba(255,255,255,0.32); box-shadow:inset 0 1px 0 rgba(255,255,255,0.2);
  border-radius:999px; padding:7px 16px; font-size:12px; letter-spacing:0.18em; color:var(--cream);
  margin-bottom:24px; height:32px; overflow:hidden;
}
.roll-eyebrow .dot{width:6px; height:6px; border-radius:50%; background:#A9C79A; flex-shrink:0;}
.roll-reel{position:relative; height:16px; overflow:hidden; display:inline-block; min-width:150px;}
.roll-reel span{
  position:absolute; left:0; top:0; white-space:nowrap; line-height:16px;
  animation:roll-spin 2.6s cubic-bezier(0.6,0,0.15,1) infinite;
}
@keyframes roll-spin{
  0%, 20%{ transform:translateY(0); }
  28%, 45%{ transform:translateY(-16px); }
  53%, 70%{ transform:translateY(-32px); }
  78%, 98%{ transform:translateY(-48px); }
  100%{ transform:translateY(-48px); }
}
@media (prefers-reduced-motion: reduce){ .roll-reel span{ animation:none; } }
.roll-hero h1{color:var(--cream); font-size:clamp(32px,5vw,50px); line-height:1.12; max-width:560px;}
.roll-hero h1 em{font-style:italic; color:#BFD6AE;}
.roll-hero p{color:#C9D2C0; font-size:16px; max-width:460px; margin:20px 0 30px;}
.roll-pill-btn{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  color:var(--cream); width:100%; max-width:460px;
  padding:8px 8px 8px 26px; border-radius:999px; font-size:15px; font-weight:500;
  position:relative; z-index:1;
  background:linear-gradient(180deg, rgba(255,255,255,0.18), transparent 55%), var(--sage-mid);
  border:1px solid rgba(255,255,255,0.25);
  box-shadow:0 8px 18px rgba(20,24,16,0.18), inset 0 1px 0 rgba(255,255,255,0.4);
  transition:transform 0.15s ease, box-shadow 0.15s ease;
}
.roll-pill-btn:active{
  transform:scale(0.99);
  box-shadow:0 4px 10px rgba(20,24,16,0.16), inset 0 1px 0 rgba(255,255,255,0.3);
}
.roll-pill-btn .arrow-circle{
  width:44px; height:44px; border-radius:50%; background:rgba(246,248,241,0.22);
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,0.3);
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.roll-pill-btn svg{width:16px; height:16px;}

.roll-heartbeat-wrap{position:relative; display:block; width:100%; max-width:460px;}
.roll-heartbeat-wrap::before{
  content:""; position:absolute; inset:0; border-radius:999px;
  border:1.5px solid rgba(191,214,174,0.9);
  animation:roll-heartbeat 5.2s cubic-bezier(0.4,0,0.2,1) infinite;
  pointer-events:none;
}
@keyframes roll-heartbeat{
  0%{ transform:scale(1); opacity:0.85; }
  10%{ transform:scale(1.18); opacity:0; }
  100%{ transform:scale(1.18); opacity:0; }
}

/* Scroll reveal — replays every time a section crosses into view, either direction */
.roll-reveal{
  opacity:0; transform:translateY(90px) scale(0.82); filter:blur(8px);
  transition:opacity 1s cubic-bezier(0.22,1.4,0.36,1), transform 1s cubic-bezier(0.22,1.4,0.36,1), filter 1s ease-out;
}
.roll-reveal.in{ opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
@media (prefers-reduced-motion: reduce){
  .roll-reveal{ transition:none; opacity:1; transform:none; filter:none; }
}
@media (prefers-reduced-motion: reduce){
  .roll-heartbeat-wrap::before,.roll-heartbeat-wrap::after{ animation:none; opacity:0; }
}

/* Essentials / product cards styled as browser-chrome mockups */
.roll-essentials{padding:80px 32px 40px;}
.roll-essentials h2{font-size:28px; max-width:460px; margin-bottom:44px;}
.roll-cards{display:grid; grid-template-columns:repeat(3,1fr); gap:20px;}
@media (max-width:860px){ .roll-cards{grid-template-columns:1fr;} }
.roll-card{border-radius:14px; padding:26px; cursor:pointer; transition:transform 0.2s, border-color 0.2s;}
.roll-card:hover{ transform:translateY(-3px); border-color:var(--sage-mid); }
.roll-card .icon-box{
  width:46px; height:46px; border-radius:12px; display:flex;
  align-items:center; justify-content:center; margin-bottom:18px;
}
.roll-card .icon-box svg{width:22px; height:22px; color:var(--sage-deep);}
.roll-card h3{font-size:18px; margin-bottom:8px;}
.roll-card p{color:var(--muted); font-size:14px; margin-bottom:14px;}
.roll-card .link{font-size:13px; font-weight:600; color:var(--sage-deep); display:inline-flex; gap:6px; align-items:center;}

/* Browser chrome mockup */
.mockup{border-radius:16px; overflow:hidden; margin:64px 0;}
.mockup-bar{display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--card-border);}
.mockup-bar .dot{width:9px; height:9px; border-radius:50%;}
.mockup-bar .url{
  flex:1; text-align:center; font-size:12px; color:var(--muted); border-radius:999px;
  padding:5px 12px; margin-left:6px; background:var(--card); border:1px solid var(--card-border);
}
.mockup-body{padding:24px;}

.file-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:12px;}
.file-tile{border-radius:12px; padding:16px; min-height:96px; position:relative;}
.file-tile .badge{font-size:10px; font-weight:700; background:var(--sage-mid); color:#fff; padding:3px 7px; border-radius:5px; position:absolute; top:12px; left:12px;}
.file-tile .fname{position:absolute; bottom:12px; left:16px; font-size:13px; font-weight:600;}
.file-tile .fsize{position:absolute; bottom:-2px; left:16px; font-size:11px; color:var(--muted); transform:translateY(22px);}

.invoice-mock{padding:8px 4px;}
.invoice-mock .row{display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line); font-size:14px;}
.invoice-mock .row:last-child{border-bottom:none; font-weight:600; padding-top:16px;}
.invoice-mock .head{display:flex; justify-content:space-between; margin-bottom:18px;}
.invoice-mock .head .num{font-size:13px; color:var(--muted);}

.gallery-mock{display:grid; grid-template-columns:repeat(3,1fr); gap:8px;}
.gallery-mock .g{
  aspect-ratio:4/5; border-radius:10px; background-size:cover; background-position:center;
  border:1px solid rgba(255,255,255,0.4); box-shadow:inset 0 1px 0 rgba(255,255,255,0.3), 0 6px 18px rgba(0,0,0,0.12);
}

/* Pricing */
.roll-pricing{padding:24px 32px 96px;}
.roll-pricing h2{font-size:27px; margin-bottom:36px;}
.roll-tiers{border-radius:20px; overflow:hidden;}
.roll-tier{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  padding:22px 28px; cursor:pointer; border-bottom:1px solid var(--card-border);
  transition:background 0.2s;
}
.roll-tier:last-child{border-bottom:none;}
.roll-tier .left{display:flex; align-items:center; gap:16px;}
.roll-tier.popular{background:rgba(140,155,125,0.14);}
.roll-tier.selected{background:rgba(140,155,125,0.22); box-shadow:inset 3px 0 0 var(--sage-deep);}
.roll-tier .name{font-size:16px; font-weight:600; margin-bottom:2px;}
.roll-tier .name .pop-tag{font-weight:400; color:var(--muted); font-size:14px;}
.roll-tier .storage{font-size:13px; color:var(--muted);}
.roll-tier .price{font-size:19px; font-weight:600; white-space:nowrap;}
.roll-tier .price span{font-size:13px; color:var(--muted); font-weight:400;}
@media (max-width:520px){
  .roll-tier{padding:18px 18px;}
  .roll-tier .left{gap:12px;}
}

.roll-billing-toggle{display:inline-flex; border-radius:999px; padding:4px; gap:2px; margin-bottom:36px;}
.roll-billing-toggle button{
  border:none; background:transparent; padding:10px 20px; border-radius:999px; font-size:14px; cursor:pointer;
  color:var(--muted); display:flex; align-items:center; gap:8px;
}
.roll-billing-toggle button.active{
  color:var(--cream);
  background:linear-gradient(180deg, rgba(255,255,255,0.18), transparent 55%), var(--sage-mid);
  box-shadow:0 6px 14px rgba(20,24,16,0.18), inset 0 1px 0 rgba(255,255,255,0.4);
  transition:transform 0.15s ease, box-shadow 0.15s ease;
}
.roll-billing-toggle button.active:active{
  transform:scale(0.98);
  box-shadow:0 3px 8px rgba(20,24,16,0.16), inset 0 1px 0 rgba(255,255,255,0.3);
}
.roll-billing-toggle .badge-free{font-size:11px; background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:999px;}

.roll-tiers .icon-box{width:48px; height:48px; border-radius:14px; color:var(--sage-deep); flex-shrink:0;}
.roll-tiers .icon-box svg{width:20px; height:20px;}

.roll-testimonials{
  display:flex; gap:16px; margin-top:8px; overflow-x:auto; scroll-snap-type:x mandatory;
  padding-bottom:8px; -webkit-overflow-scrolling:touch; scrollbar-width:none;
}
.roll-testimonials::-webkit-scrollbar{display:none;}
.roll-testimonial-item{flex:0 0 82%; scroll-snap-align:start;}
@media (min-width:700px){ .roll-testimonial-item{flex-basis:44%;} }
@media (min-width:1000px){ .roll-testimonial-item{flex-basis:31%;} }

.roll-testimonial{border-radius:16px; padding:26px;}
.roll-testimonial .tm-head{display:flex; align-items:center; gap:12px; margin-bottom:16px;}
.roll-testimonial .avatar{
  width:40px; height:40px; border-radius:50%; background:var(--sage-mid); color:var(--cream);
  display:flex; align-items:center; justify-content:center; font-weight:600; flex-shrink:0;
}
.roll-testimonial .tm-name{font-weight:600; font-size:14px;}
.roll-testimonial .tm-role{font-size:12px; color:var(--muted);}
.roll-testimonial p{font-size:14px; color:var(--ink); line-height:1.6;}

.roll-footer{border-top:1px solid var(--card-border); padding:0 32px 28px; margin-top:40px;}
.roll-footer-top{display:flex; justify-content:space-between; padding:28px 0; color:var(--muted); font-size:13px;}
.roll-footer-accordion{display:grid; gap:0;}
.roll-footer-section{border-top:1px solid var(--card-border); padding:16px 0;}
.roll-footer-section button{
  width:100%; display:flex; justify-content:space-between; align-items:center;
  background:none; border:none; color:var(--ink); font-size:14px; font-weight:600; cursor:pointer; padding:0;
}
.roll-footer-section .chevron{transition:transform 0.2s;}
.roll-footer-section.open .chevron{transform:rotate(180deg);}
.roll-footer-section .content{
  max-height:0; overflow:hidden; transition:max-height 0.3s ease;
}
.roll-footer-section.open .content{max-height:200px; padding-top:12px;}
.roll-footer-section .content a{display:block; font-size:13px; color:var(--muted); padding:6px 0;}

.roll-stripe{
  height:52px;
  background-image:repeating-linear-gradient(45deg, transparent 0 7px, var(--line) 7px 8px);
}

.roll-quote-heading{
  font-size:clamp(28px, 4.4vw, 40px); line-height:1.25; max-width:640px; margin:0 auto 20px;
  text-align:center;
}
.roll-quote-lead{ text-align:center; max-width:480px; margin:0 auto 40px; color:var(--muted); font-size:15px; }
`;

const RollIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <circle cx="9" cy="11" r="2" />
    <path d="M3 17l5-4 4 3 4-5 5 4" />
  </svg>
);
const BillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M7 3h10l2 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7Z" />
    <path d="M9 11h6M9 15h6" />
  </svg>
);
const VaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 9h16M9 4v16" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Generated inline SVG scenes — no network fetch, so these can never fail to load.
   Swap for real https:// photo URLs once deployed to an actual browser/host. */
const RING_ICON = `<g transform="translate(400,300)" opacity="0.45">
  <circle cx="-26" cy="0" r="62" fill="none" stroke="white" stroke-width="9"/>
  <circle cx="26" cy="0" r="62" fill="none" stroke="white" stroke-width="9"/>
</g>`;
const BALLOON_ICON = `<g transform="translate(400,300)" opacity="0.45">
  <ellipse cx="-42" cy="-24" rx="42" ry="58" fill="white"/>
  <ellipse cx="42" cy="12" rx="42" ry="58" fill="white"/>
  <path d="M-42,34 L-30,130 M42,70 L30,150" stroke="white" stroke-width="3" fill="none"/>
</g>`;

function svgScene(colorA, colorB, icon, w = 800, h = 600) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colorA}"/><stop offset="1" stop-color="${colorB}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>${icon}
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const HERO_BACKDROPS = [
  svgScene("#8B5E83", "#2A1E28", RING_ICON, 1600, 900),
  svgScene("#C9A66B", "#241C10", RING_ICON, 1600, 900),
  svgScene("#E8879A", "#2A151C", BALLOON_ICON, 1600, 900),
  svgScene("#7FA3C9", "#141C28", BALLOON_ICON, 1600, 900),
];

const GALLERY_PHOTOS = [
  svgScene("#8B5E83", "#3A2A38", RING_ICON, 800, 1000),
  svgScene("#E8879A", "#3A1F28", BALLOON_ICON, 800, 1000),
  svgScene("#C9A66B", "#3A2A18", RING_ICON, 800, 1000),
  svgScene("#F0B45C", "#3A2712", BALLOON_ICON, 800, 1000),
  svgScene("#B98CA8", "#241C28", RING_ICON, 800, 1000),
  svgScene("#7FA3C9", "#1B2A3A", BALLOON_ICON, 800, 1000),
];

const THEMES = [
  { id: "light", label: "L" },
  { id: "dark", label: "D" },
  { id: "neutral", label: "N" },
  { id: "transparent", label: "T" },
];

const REEL_WORDS = ["SHOOT.", "DELIVER.", "GET PAID.", "SHOOT."];

function Reel() {
  return (
    <span className="roll-reel">
      <span>
        {REEL_WORDS.map((w, i) => (
          <React.Fragment key={i}>
            {w}
            <br />
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}

const TIERS = [
  { name: "Core", storage: "50 GB storage", monthly: 3500, annual: 2917, icon: "target" },
  { name: "Advanced", storage: "150 GB storage", monthly: 7500, annual: 6250, icon: "bolt" },
  { name: "Pro", storage: "250 GB storage", monthly: 10000, annual: 8333, icon: "diamond", popular: true },
  { name: "Max", storage: "500 GB storage", monthly: 15000, annual: 12500, icon: "flame" },
];

const TIER_ICONS = {
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>,
  diamond: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9 12 3l9 6-9 12-9-12Z" /></svg>,
  flame: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-1-2-1-2 1 0 3 1.5 3 4.5A5.5 5.5 0 0 1 11.5 21 5.5 5.5 0 0 1 6 15.5C6 10 12 8 12 3Z" /></svg>,
};

const TESTIMONIALS = [
  { name: "Ada Nwachukwu", role: "Founder, Frame & Co.", quote: "Delivery used to be the part that made everything feel scattered. Roll makes it feel like one clean handoff." },
  { name: "Chidi Eze", role: "Wedding photographer", quote: "Clients pay before they even think about arguing over the invoice. That alone changed how I run bookings." },
  { name: "Tari Ibim", role: "Event photographer", quote: "I stopped losing raw files between three different drives. Vault just holds everything now." },
];

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`roll-reveal${visible ? " in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function BrowserChrome({ url, children }) {
  return (
    <div className="mockup roll-glass">
      <div className="mockup-bar">
        <span className="dot" style={{ background: "#E27D6B" }} />
        <span className="dot" style={{ background: "#E8C468" }} />
        <span className="dot" style={{ background: "#8FBF7A" }} />
        <span className="url">{url}</span>
      </div>
      <div className="mockup-body">{children}</div>
    </div>
  );
}

export default function RollLanding() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [theme, setTheme] = useState("light");
  const [selectedTier, setSelectedTier] = useState("Pro");
  const [billing, setBilling] = useState("monthly");
  const [openFooter, setOpenFooter] = useState(null);
  const [tmIndex, setTmIndex] = useState(0);
  const tmScrollRef = useRef(null);

  const handleTmScroll = () => {
    const el = tmScrollRef.current;
    if (!el) return;
    const itemWidth = el.firstChild ? el.firstChild.offsetWidth + 16 : 1;
    setTmIndex(Math.round(el.scrollLeft / itemWidth));
  };
  const scrollToTm = (i) => {
    const el = tmScrollRef.current;
    if (!el || !el.children[i]) return;
    el.scrollTo({ left: el.children[i].offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTmIndex((i) => {
        const next = (i + 1) % TESTIMONIALS.length;
        scrollToTm(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);
  const heroRef = useRef(null);

  const handleHeroMove = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setHeroOffset({ x, y });
  };
  const resetHeroOffset = () => setHeroOffset({ x: 0, y: 0 });

  useEffect(() => {
    const saved = typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem("roll-theme")
      : null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("roll-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_BACKDROPS.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="roll" data-theme={theme}>
      <style>{styles}</style>

      <header className="roll-header">
        <div className="roll-brand">
          <span className="bars"><span /><span /></span>
          ROLL.
        </div>
        <nav className="roll-nav">
          <a href="#essentials">Products</a>
          <a href="#pricing">Pricing</a>
          <a href="#">Log in</a>
          <div className="roll-theme-toggle">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={theme === t.id ? "active" : ""}
                onClick={() => setTheme(t.id)}
                title={t.id}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="roll-menu-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </span>
        </nav>
      </header>

      <section
        className="roll-hero"
        ref={heroRef}
        onMouseMove={handleHeroMove}
        onMouseLeave={resetHeroOffset}
      >
        {HERO_BACKDROPS.map((bg, i) => (
          <div
            key={i}
            className={`roll-hero-bg${i === heroIndex ? " active" : ""}`}
            style={{
              backgroundImage: `url(${bg})`,
              transform: `scale(1.08) translate(${heroOffset.x * -14}px, ${heroOffset.y * -14}px) rotate(${heroOffset.x * 0.6}deg)`,
            }}
            onClick={() => setHeroIndex((i2) => (i2 + 1) % HERO_BACKDROPS.length)}
            role="button"
            aria-label="Show next photo"
          />
        ))}
        <div className="roll-hero-inner roll-wrap" style={{ padding: 0 }}>
          <span className="roll-eyebrow"><span className="dot" /><Reel /></span>
          <h1>The business layer for working <em>photographers</em>.</h1>
          <p>
            Galleries clients love, invoices that get paid, and a vault that never loses
            a file — Roll gives you the operating layer to run a real studio.
          </p>
          <span className="roll-heartbeat-wrap">
            <a className="roll-pill-btn" href="#pricing">
              <span style={{ position: "relative", zIndex: 1 }}>Get started</span>
              <span className="arrow-circle"><ArrowIcon /></span>
            </a>
          </span>
        </div>
      </section>

      <div className="roll-stripe" />

      <section className="roll-essentials roll-wrap" id="essentials">
        <Reveal><h2>One roll. Three essentials.</h2></Reveal>
        <Reveal><p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 460, margin: "0 0 44px" }}>
          Everything a working photographer bills, shares, and stores — without stitching three separate apps together.
        </p></Reveal>
        <div className="roll-cards">
          <Reveal><div className="roll-card roll-glass" onClick={() => scrollTo("mockup-roll")}>
            <div className="icon-box roll-glass"><RollIcon /></div>
            <h3>Roll</h3>
            <p>Branded client galleries with favorites, selections, and a lock on full-res downloads until payment clears.</p>
            <span className="link">Explore Roll <ArrowIcon /></span>
          </div></Reveal>
          <Reveal><div className="roll-card roll-glass" onClick={() => scrollTo("mockup-bill")}>
            <div className="icon-box roll-glass"><BillIcon /></div>
            <h3>Bill</h3>
            <p>Studio-branded invoices, PDF export, and payment tracking so you always know what's outstanding.</p>
            <span className="link">Explore Bill <ArrowIcon /></span>
          </div></Reveal>
          <Reveal><div className="roll-card roll-glass" onClick={() => scrollTo("mockup-vault")}>
            <div className="icon-box roll-glass"><VaultIcon /></div>
            <h3>Vault</h3>
            <p>A private cloud home for raws and contracts — folders, password-protected links, and bulk download.</p>
            <span className="link">Explore Vault <ArrowIcon /></span>
          </div></Reveal>
        </div>

        <div id="mockup-roll"><Reveal><BrowserChrome url="app.roll.studio/galleries">
          <div className="gallery-mock">
            {GALLERY_PHOTOS.map((src, i) => (
              <div className="g" key={i} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        </BrowserChrome></Reveal></div>

        <div id="mockup-bill"><Reveal><BrowserChrome url="app.roll.studio/invoices">
          <div className="invoice-mock">
            <div className="head">
              <strong>Kachi Studios</strong>
              <span className="num">#RL-0192 · Due 14 Jul</span>
            </div>
            <div className="row"><span>Wedding coverage</span><span>₦350,000</span></div>
            <div className="row"><span>Pre-wedding shoot</span><span>₦80,000</span></div>
            <div className="row"><span>Total due</span><span>₦430,000</span></div>
          </div>
        </BrowserChrome></Reveal></div>

        <div id="mockup-vault"><Reveal><BrowserChrome url="app.roll.studio/vault">
          <div className="file-grid">
            <div className="file-tile roll-glass"><span className="badge">RAW</span><span className="fname">wedding-final.zip</span></div>
            <div className="file-tile roll-glass"><span className="badge">PDF</span><span className="fname">contract-v2.pdf</span></div>
          </div>
        </BrowserChrome></Reveal></div>
      </section>

      <div className="roll-stripe" />

      <section className="roll-pricing roll-wrap" id="pricing">
        <Reveal><h2>Simple plans. No surprises.</h2></Reveal>
        <Reveal><p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 24 }}>
          Start with a 14-day free trial. Cancel anytime.
        </p></Reveal>
        <Reveal>
          <div className="roll-billing-toggle roll-glass">
            <button
              type="button"
              className={billing === "monthly" ? "active" : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={billing === "annual" ? "active" : ""}
              onClick={() => setBilling("annual")}
            >
              Annual <span className="badge-free">2 months free</span>
            </button>
          </div>
        </Reveal>
        <Reveal><div className="roll-tiers roll-glass">
          {TIERS.map((t) => (
            <div
              className={`roll-tier${t.popular ? " popular" : ""}${selectedTier === t.name ? " selected" : ""}`}
              key={t.name}
              onClick={() => setSelectedTier(t.name)}
            >
              <div className="left">
                <div className="icon-box roll-glass" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {TIER_ICONS[t.icon]}
                </div>
                <div>
                  <div className="name">{t.name}{t.popular ? <span className="pop-tag"> · Popular</span> : ""}</div>
                  <div className="storage">{t.storage}</div>
                </div>
              </div>
              <div className="price">
                ₦{(billing === "monthly" ? t.monthly : t.annual).toLocaleString()}
                <span>/mo</span>
              </div>
            </div>
          ))}
        </div></Reveal>

      </section>

      <div className="roll-stripe" />

      <section className="roll-pricing roll-wrap" style={{ paddingTop: 64 }}>
        <Reveal><h2 className="roll-quote-heading">"Everything I need in one place"</h2></Reveal>
        <Reveal><p className="roll-quote-lead">
          Photographers use Roll to deliver their best work, send invoices, and keep every project organized.
        </p></Reveal>
        <div className="roll-testimonials" ref={tmScrollRef} onScroll={handleTmScroll}>
          {TESTIMONIALS.map((tm) => (
            <div className="roll-testimonial-item" key={tm.name}>
              <div className="roll-testimonial roll-glass">
                <div className="tm-head">
                  <div className="avatar">{tm.name.charAt(0)}</div>
                  <div>
                    <div className="tm-name">{tm.name}</div>
                    <div className="tm-role">{tm.role}</div>
                  </div>
                </div>
                <p>{tm.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="roll-stripe" />

      <footer className="roll-footer">
        <div className="roll-footer-accordion">
          {[
            { id: "product", label: "Product", links: ["Roll", "Bill", "Vault", "Pricing"] },
            { id: "resources", label: "Resources", links: ["Help center", "Guides", "API docs"] },
            { id: "company", label: "Company", links: ["About", "Blog", "Contact"] },
          ].map((sec) => (
            <div key={sec.id} className={`roll-footer-section${openFooter === sec.id ? " open" : ""}`}>
              <button
                type="button"
                onClick={() => setOpenFooter(openFooter === sec.id ? null : sec.id)}
              >
                {sec.label}
                <span className="chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </span>
              </button>
              <div className="content">
                {sec.links.map((l) => <a key={l} href="#">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="roll-footer-top">
          <span>© 2026 Roll.</span>
          <span>Built for working photographers</span>
        </div>
      </footer>
    </div>
  );
}