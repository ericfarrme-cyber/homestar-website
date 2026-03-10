import { useState, useEffect, useRef } from "react";

/* ─── Brand Tokens ────────────────────────────────── */
const C = {
  navy: "#1B2A4A", navyMid: "#243556", navyLight: "#2E4068", navyDark: "#111D35",
  green: "#5CB832", greenDark: "#49A023", greenLight: "#6FCC42", greenMuted: "rgba(92,184,50,0.12)",
  white: "#FFFFFF", cream: "#F7F8FA", sand: "#ECEEF2",
  gray: "#8892A4", grayDark: "#4B5563", text: "#1A1F2E",
};

/* ─── Icons (inline SVG) ──────────────────────────── */
const I = {
  phone: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  mail: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
  pin: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star: <svg width="16" height="16" fill="#5CB832" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  check: <svg width="18" height="18" fill="none" stroke="#5CB832" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  arrow: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  menu: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  play: <svg width="40" height="40" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  chevDown: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>,
  chevL: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
  clock: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  bulb: <svg width="32" height="32" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21h6M12 3a6 6 0 014 10.5V17H8v-3.5A6 6 0 0112 3z"/></svg>,
  calc: <svg width="32" height="32" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4M8 18h4"/></svg>,
  cal: <svg width="32" height="32" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  shield: <svg width="32" height="32" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  fb: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  ig: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  gg: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
};

const SVC = [
  { title: "Bathroom Remodeling", tag: "Schluter Pro Certified", desc: "Our Schluter Pro Certified team delivers premium bathroom renovations backed by a 25-year waterproofing warranty. Walk-in showers, custom vanities, heated floors — built with materials that protect your investment for decades.", color: "#6A9FD4", href: "#projects" },
  { title: "Basement Finishing", tag: "Unlock hidden potential", desc: "That unused square footage below your main floor? It's ready for a promotion. We convert unfinished basements into entertainment spaces, guest suites, home offices, and more.", color: "#8B7EC4", href: "#projects" },
  { title: "Kitchen Remodeling", tag: "Where great meals begin", desc: "The kitchen is the heart of every home. We build spaces that balance function and beauty—thoughtful layouts, quality cabinetry, and finishes that elevate your everyday routine.", color: "#D4A76A", href: "#projects" },
  { title: "Flooring Services", tag: "The foundation of great design", desc: "New flooring changes the entire feel of a room. We install hardwood, luxury vinyl, tile, and carpet—selected for your lifestyle, built to handle real life, and installed with precision.", color: "#C49A6A", href: "#projects" },
  { title: "Painting Services", tag: "Fresh color, fresh energy", desc: "A professional paint job does more than change a color—it transforms a room. We deliver clean edges, smooth finishes, and expert prep work that makes the difference.", color: "#6AC4A8", href: "#projects" },
  { title: "Decks & Outdoor Living", tag: "Bring life outdoors", desc: "Custom decks, covered patios, and outdoor living areas designed for how you actually live. Built with quality materials and craftsmanship that stands up to Indiana weather.", color: "#7AAF5A", href: "#projects" },
];

const PROCESS = [
  { icon: I.bulb, step: "01", title: "Inspiration & Understanding", sub: "Getting to Know Your Vision.", text: "Every project starts with a conversation. We visit your home, walk the space with you, and take time to understand how you use it and what you'd like to change. No pressure, no sales pitch—just an honest discussion about what's possible.", bullets: ["Walk-through of your space with our team", "Discussion of your goals, style, and priorities", "Clear understanding of budget and timeline", "Expert guidance and realistic recommendations"] },
  { icon: I.calc, step: "02", title: "Design, Details & Estimate", sub: "Your Vision Takes Shape.", text: "With a clear picture of what you want, we put together a detailed plan—complete with design concepts, material options you can see in person, and a transparent, itemized estimate. No guesswork, no vague numbers.", bullets: ["Design renderings tailored to your space", "Physical material samples to compare", "Itemized estimate with clear, honest pricing", "Defined project timeline from start to finish"] },
  { icon: I.cal, step: "03", title: "Sign, Schedule & Start", sub: "Your Project, On Your Timeline.", text: "Once the plan feels right, we lock in a start date and prepare everything behind the scenes. Our crew arrives on time, respects your home, and keeps you informed every step of the way.", bullets: ["Finalize and sign your project proposal", "Confirmed start date that works for you", "Pre-project preparation checklist provided", "Consistent communication throughout the build"] },
];

/*
 * ── PROJECTS ──────────────────────────────────────
 * How to add your photos:
 * 1. Put images in public/images/ on GitHub
 * 2. Uncomment and update the image paths below
 * 3. Add as many images per project as you want
 * 4. Alt text helps SEO — include service + city
 */
const PROJECTS = [
  {
    title: "Custom Green Tile Bathroom Remodel in Carmel",
    cat: "Bathroom",
    color: "#4A6A8B",
    desc: "Bold green tile brings this Carmel bathroom to life with a one-of-a-kind design, custom vanity, and full gut renovation.",
    images: [
      { src: "/images/bathroom-green-tile-1.jpg", alt: "Custom green tile bathroom remodel in Carmel Indiana" },
      { src: "/images/bathroom-green-tile-2.jpg", alt: "Green tile shower installation Carmel IN" },
      { src: "/images/bathroom-green-tile-3.jpg", alt: "Bathroom tile detail work Carmel Indiana" },
      { src: "/images/bathroom-green-tile-4.jpg", alt: "Completed green tile bathroom Carmel IN" },
      { src: "/images/bathroom-green-tile-5.jpg", alt: "Custom vanity in green tile bathroom Carmel Indiana" },
      { src: "/images/bathroom-green-tile-6.jpg", alt: "Green tile bathroom renovation Carmel IN" },
      { src: "/images/bathroom-green-tile-7.jpg", alt: "Bathroom remodel with green tile accents Carmel Indiana" },
      { src: "/images/bathroom-green-tile-8.jpg", alt: "Full bathroom transformation with green tile Carmel IN" },
    ],
  },
  {
    title: "Double Shower Remodel in Fishers",
    cat: "Bathroom",
    color: "#5A7A9B",
    desc: "A luxurious double shower installation in this stunning Fishers bathroom remodel.",
    images: [
      { src: "/images/fishers-double-shower-1.jpg", alt: "Double shower bathroom remodel in Fishers Indiana" },
      { src: "/images/fishers-double-shower-2.jpg", alt: "Luxury double shower installation Fishers IN" },
      { src: "/images/fishers-double-shower-3.jpg", alt: "Custom double shower design Fishers Indiana" },
      { src: "/images/fishers-double-shower-4.jpg", alt: "Double shower tile work Fishers IN" },
      { src: "/images/fishers-double-shower-5.jpg", alt: "Completed double shower remodel Fishers Indiana" },
      { src: "/images/fishers-double-shower-6.jpg", alt: "Double shower bathroom renovation Fishers IN" },
    ],
  },
  {
    title: "Spa Retreat Bathroom Remodel in Fishers",
    cat: "Bathroom",
    color: "#6A8B7A",
    desc: "A serene spa-inspired bathroom retreat with premium finishes and a calming design.",
    images: [
      { src: "/images/fishers-spa-retreat-1.jpg", alt: "Spa retreat bathroom remodel in Fishers Indiana" },
      { src: "/images/fishers-spa-retreat-2.jpg", alt: "Spa inspired bathroom renovation Fishers IN" },
      { src: "/images/fishers-spa-retreat-3.jpg", alt: "Luxury spa bathroom design Fishers Indiana" },
      { src: "/images/fishers-spa-retreat-4.jpg", alt: "Spa bathroom with premium finishes Fishers IN" },
      { src: "/images/fishers-spa-retreat-5.jpg", alt: "Relaxing spa bathroom remodel Fishers Indiana" },
      { src: "/images/fishers-spa-retreat-6.jpg", alt: "Completed spa retreat bathroom Fishers IN" },
    ],
  },
  {
    title: "Beautiful Geist Upper Level Remodel",
    cat: "Whole Home",
    color: "#7B5A4A",
    desc: "Complete upper level transformation in a beautiful Geist residence — every room reimagined with modern finishes.",
    images: [
      { src: "/images/geist-upper-level-1.jpg", alt: "Upper level home remodel in Geist Indiana" },
      { src: "/images/geist-upper-level-2.jpg", alt: "Geist home renovation upper level IN" },
      { src: "/images/geist-upper-level-3.jpg", alt: "Full upper level remodel Geist Indiana" },
      { src: "/images/geist-upper-level-4.jpg", alt: "Modern upper level renovation Geist IN" },
      { src: "/images/geist-upper-level-5.jpg", alt: "Upper level home transformation Geist Indiana" },
      { src: "/images/geist-upper-level-6.jpg", alt: "Geist upper level remodel completed IN" },
      { src: "/images/geist-upper-level-7.jpg", alt: "Beautiful upper level renovation Geist Indiana" },
      { src: "/images/geist-upper-level-8.jpg", alt: "Upper level interior remodel Geist IN" },
      { src: "/images/geist-upper-level-9.jpg", alt: "Geist home upper level makeover Indiana" },
      { src: "/images/geist-upper-level-10.jpg", alt: "Upper level remodel details Geist IN" },
      { src: "/images/geist-upper-level-11.jpg", alt: "Geist upper level finishing touches Indiana" },
      { src: "/images/geist-upper-level-12.jpg", alt: "Completed upper level remodel Geist IN" },
    ],
  },
  {
    title: "Floor-to-Ceiling Tile Bathroom Remodel in Noblesville",
    cat: "Bathroom",
    color: "#5A6A8B",
    desc: "Complete floor-to-ceiling tile transformation in this Noblesville bathroom — every surface upgraded.",
    images: [
      { src: "/images/noblesville-floor-to-ceiling-tile-1.jpg", alt: "Floor to ceiling tile bathroom remodel Noblesville Indiana" },
      { src: "/images/noblesville-floor-to-ceiling-tile-2.jpg", alt: "Full tile bathroom renovation Noblesville IN" },
      { src: "/images/noblesville-floor-to-ceiling-tile-3.jpg", alt: "Floor to ceiling tile installation Noblesville Indiana" },
      { src: "/images/noblesville-floor-to-ceiling-tile-4.jpg", alt: "Completed tile bathroom remodel Noblesville IN" },
    ],
  },
  {
    title: "Noblesville Laundry Room Remodel",
    cat: "Laundry",
    color: "#8B7A5A",
    desc: "A dated laundry room gets a complete makeover with modern storage, new countertops, and a fresh layout.",
    images: [
      { src: "/images/noblesville-laundry-1.jpg", alt: "Laundry room remodel in Noblesville Indiana" },
      { src: "/images/noblesville-laundry-2.jpg", alt: "Modern laundry room renovation Noblesville IN" },
      { src: "/images/noblesville-laundry-3.jpg", alt: "Completed laundry room remodel Noblesville Indiana" },
    ],
  },
  {
    title: "Two Children's Bathroom Remodels in Geist",
    cat: "Children's Bathroom",
    color: "#6A5A8B",
    desc: "Fun, functional, and kid-friendly — two children's bathrooms completely redesigned in a Geist home.",
    images: [
      { src: "/images/two-geist-childrens-bathrooms-1.jpg", alt: "Children's bathroom remodel in Geist Fishers Indiana" },
      { src: "/images/two-geist-childrens-bathrooms-2.jpg", alt: "Kids bathroom renovation Geist IN" },
      { src: "/images/two-geist-childrens-bathrooms-3.jpg", alt: "Children's bathroom design Geist Fishers Indiana" },
      { src: "/images/two-geist-childrens-bathrooms-4.jpg", alt: "Kid-friendly bathroom remodel Geist IN" },
      { src: "/images/two-geist-childrens-bathrooms-5.jpg", alt: "Completed children's bathroom Geist Fishers Indiana" },
      { src: "/images/two-geist-childrens-bathrooms-6.jpg", alt: "Two children's bathrooms remodeled Geist IN" },
    ],
  },
  {
    title: "Jack & Jill Bathroom Remodel in Zionsville",
    cat: "Bathroom",
    color: "#5A8B6A",
    desc: "A shared Jack & Jill bathroom gets a complete makeover with dual vanities and modern finishes in Zionsville.",
    images: [
      { src: "/images/zionsville-jack-and-jill-1.jpg", alt: "Jack and Jill bathroom remodel in Zionsville Indiana" },
      { src: "/images/zionsville-jack-and-jill-2.jpg", alt: "Jack and Jill bathroom renovation Zionsville IN" },
      { src: "/images/zionsville-jack-and-jill-3.jpg", alt: "Shared bathroom remodel Zionsville Indiana" },
      { src: "/images/zionsville-jack-and-jill-4.jpg", alt: "Jack and Jill dual vanity Zionsville IN" },
      { src: "/images/zionsville-jack-and-jill-5.jpg", alt: "Jack and Jill bathroom design Zionsville Indiana" },
      { src: "/images/zionsville-jack-and-jill-6.jpg", alt: "Modern Jack and Jill bathroom Zionsville IN" },
      { src: "/images/zionsville-jack-and-jill-7.jpg", alt: "Jack and Jill bathroom finishes Zionsville Indiana" },
      { src: "/images/zionsville-jack-and-jill-8.jpg", alt: "Completed Jack and Jill remodel Zionsville IN" },
      { src: "/images/zionsville-jack-and-jill-9.jpg", alt: "Jack and Jill bathroom transformation Zionsville Indiana" },
    ],
  },
  {
    title: "Quick Fishers Basement Finish",
    cat: "Basement",
    color: "#4A5A7B",
    desc: "A fast, efficient basement finish that added usable living space without breaking the budget.",
    images: [
      { src: "/images/fishers-basement-1.jpg", alt: "Basement finishing in Fishers Indiana" },
      { src: "/images/fishers-basement-2.jpg", alt: "Finished basement living space Fishers IN" },
      { src: "/images/fishers-basement-3.jpg", alt: "Completed basement remodel Fishers Indiana" },
    ],
  },
  {
    title: "Fishers Bathroom Renovation",
    cat: "Bathroom",
    color: "#6A7B8B",
    desc: "A complete bathroom renovation in Fishers with updated tile, fixtures, and a modern layout.",
    images: [
      { src: "/images/fishers-bath-1.jpg", alt: "Bathroom renovation in Fishers Indiana" },
      { src: "/images/fishers-bath-2.jpg", alt: "Updated bathroom remodel Fishers IN" },
      { src: "/images/fishers-bath-3.jpg", alt: "Modern bathroom renovation Fishers Indiana" },
      { src: "/images/fishers-bath-4.jpg", alt: "Completed bathroom remodel Fishers IN" },
    ],
  },
  {
    title: "Teenage Child Bathroom Remodel in Fishers",
    cat: "Children's Bathroom",
    color: "#7B6A8B",
    desc: "A stylish bathroom remodel designed for a teenager — durable, functional, and with personality.",
    images: [
      { src: "/images/fishers-childrens-bath-1.jpg", alt: "Children's bathroom remodel in Fishers Indiana" },
      { src: "/images/fishers-childrens-bath-2.jpg", alt: "Teen bathroom renovation Fishers IN" },
      { src: "/images/fishers-childrens-bath-3.jpg", alt: "Kids bathroom remodel Fishers Indiana" },
      { src: "/images/fishers-childrens-bath-4.jpg", alt: "Completed children's bathroom Fishers IN" },
    ],
  },
  {
    title: "Laundry Room Flip near Geist, Fishers",
    cat: "Laundry",
    color: "#8B7A5A",
    desc: "A compact laundry room transformed with smart storage and a clean, modern design.",
    images: [
      { src: "/images/geist-laundry-1.jpg", alt: "Laundry room remodel near Geist Fishers Indiana" },
      { src: "/images/geist-laundry-2.jpg", alt: "Modern laundry room renovation Geist Fishers IN" },
    ],
  },
  {
    title: "Modern Farmhouse Bathroom Remodel in Fishers",
    cat: "Bathroom",
    color: "#7B8B6A",
    desc: "A warm, modern farmhouse-inspired bathroom with shiplap accents, wood-tone vanity, and classic fixtures.",
    images: [
      { src: "/images/modern-farmhouse-1.jpg", alt: "Modern farmhouse bathroom remodel in Fishers Indiana" },
      { src: "/images/modern-farmhouse-2.jpg", alt: "Farmhouse style bathroom renovation Fishers IN" },
      { src: "/images/modern-farmhouse-3.jpg", alt: "Farmhouse bathroom with shiplap Fishers Indiana" },
      { src: "/images/modern-farmhouse-4.jpg", alt: "Completed farmhouse bathroom remodel Fishers IN" },
    ],
  },
  {
    title: "Westfield Basement Finish on a Budget",
    cat: "Basement",
    color: "#5A6A7B",
    desc: "Proof that a great basement doesn't require a massive budget — smart design and efficient execution in Westfield.",
    images: [
      { src: "/images/westfield-basement-1.jpg", alt: "Budget basement finish in Westfield Indiana" },
      { src: "/images/westfield-basement-2.jpg", alt: "Affordable basement remodel Westfield IN" },
      { src: "/images/westfield-basement-3.jpg", alt: "Basement finishing on a budget Westfield Indiana" },
      { src: "/images/westfield-basement-4.jpg", alt: "Completed basement finish Westfield IN" },
    ],
  },
];

const BLOG = [
  { title: "Why Your Bathroom Tile Might Fail in 5 Years (And How to Prevent It)", date: "Mar 5, 2026", read: "7 min", cat: "Bathroom", excerpt: "Most tile failures aren't about the tile — they're about what's underneath. Learn why the Schluter waterproofing system outperforms standard cement board and protects your remodel for decades.",
    body: [
      "Most homeowners spend weeks choosing the perfect tile for their bathroom remodel. They agonize over color, texture, pattern, and size. But here's what almost nobody talks about: what goes under that tile matters more than the tile itself.",
      "We've seen it too many times — a homeowner invests $20,000+ in a beautiful bathroom remodel, only to see cracked grout lines, loose tiles, and water damage show up within a few years. The tile gets blamed, but the tile was never the problem. The problem is what was — or wasn't — underneath it.",
      "Tile doesn't fail because it's bad tile. It fails because the substrate beneath it can't handle the conditions of a bathroom. Moisture is the enemy. Every shower sends moisture through grout lines and into whatever is behind the tile. If that material absorbs water — and standard cement board does — problems start developing that you can't see until they're serious.",
      "Houses move. Your home is constantly shifting — settling, expanding and contracting with temperature changes, responding to humidity. These micro-movements put stress on rigid materials. When the substrate can't flex, the grout and tile above it crack.",
      "At HomeStar, we exclusively use the complete Schluter System on every bathroom project. Ditra for floors, Kerdi for walls, and Schluter shower pans. It's 100% waterproof — not water-resistant, waterproof. The membrane creates a completely sealed barrier that prevents any moisture from reaching your subfloor or wall framing.",
      "It also absorbs movement. The Schluter system acts as an uncoupling layer between your tile and the substrate. When your house shifts, the membrane absorbs that movement instead of transferring it to your tile. This prevents cracked grout and loose tiles.",
      "Our tile installers are Schluter Pro Certified, which means your project is backed by a full 25-year manufacturer's warranty. If a contractor tells you they 'use Schluter' but can't show certification, the warranty may not apply. Always ask.",
      "Beyond tile work, every bathroom remodel involves plumbing and electrical. At HomeStar, all plumbing is done by licensed plumbers and all electrical by licensed electricians. This isn't always the case with other contractors.",
      "If you're planning a bathroom remodel in Hamilton County, ask your contractor: What substrate system are you using? Are your installers certified by the manufacturer? Are your plumbers and electricians licensed? The answers tell you everything about the quality you'll get.",
      "Call HomeStar at (317) 279-4798 or request a free estimate at thehomestarservice.com."
    ]},
  { title: "5 Signs Your Bathroom Needs a Remodel", date: "Feb 18, 2026", read: "5 min", cat: "Bathroom", excerpt: "Cracked grout, outdated fixtures, and poor ventilation aren't just eyesores—they're signs it's time to invest in your bathroom. Here's what to look for.",
    body: [
      "Sometimes a bathroom remodel is a want. Sometimes it's a need. And sometimes you've been living with problems for so long that they start to feel normal. Here are five signs that your bathroom is telling you it's time for an upgrade.",
      "1. Cracked, Missing, or Moldy Grout — If the grout between your tiles is cracking, crumbling, or showing black mold spots, it's more than cosmetic. Damaged grout lets water seep behind tiles and into your subfloor and walls, leading to structural damage and hidden mold growth. If the damage is widespread, retiling is usually more cost-effective than patching.",
      "2. Outdated Fixtures and Layout — If your bathroom still has brass fixtures from the 1990s or a layout that makes no sense for how your family uses the space, an update will dramatically improve your daily routine. Start with faucets, showerhead, lighting, and hardware for the biggest visual impact.",
      "3. Poor Ventilation — If your mirror stays fogged for 20 minutes after a shower, or you notice moisture on walls and ceiling, your ventilation isn't doing its job. Poor ventilation leads to mold, peeling paint, and deterioration over time. A properly sized exhaust fan is one of those behind-the-scenes upgrades that protects everything else.",
      "4. Water Damage or Soft Spots — If your floor feels soft near the toilet or tub, or you notice water stains on the ceiling below a second-floor bathroom, water is going where it shouldn't. This doesn't get better on its own. A remodel lets you address the source, repair damage, and rebuild with proper waterproofing.",
      "5. You're Embarrassed When Guests Visit — This is actually the most common reason homeowners call us. If you find yourself apologizing for your bathroom, that's your gut telling you it's time. Sometimes a vanity swap, fresh paint, a new mirror, and updated lighting is all it takes.",
      "If any of these signs sound familiar, HomeStar Services & Contracting specializes in bathroom remodels across Hamilton County. Call us at (317) 279-4798 for a free estimate."
    ]},
  { title: "Kitchen Remodel ROI: What Actually Adds Value in Indiana", date: "Feb 4, 2026", read: "6 min", cat: "Kitchen", excerpt: "Not all upgrades are equal. We break down which kitchen improvements deliver the best return for Hamilton County homeowners.",
    body: [
      "You want your kitchen to look amazing — but you also want to know the money you're putting in is well spent. As contractors working in Hamilton County homes every week, we see firsthand which kitchen upgrades deliver real returns.",
      "Cabinet refacing or replacement consistently delivers one of the highest returns. If your boxes are solid, refacing with new doors and hardware gives you a new look at about 40% of the cost of full replacement. New semi-custom cabinets in a modern shaker style offer great value if the boxes are worn.",
      "Countertop upgrades make a dramatic visual difference. Quartz has become the go-to material in central Indiana — durable, low-maintenance, and available in enough styles to match any kitchen. Both quartz and granite signal quality to future buyers.",
      "Lighting is one of the most underrated kitchen upgrades. Replacing a dated fluorescent fixture with recessed lighting and under-cabinet LED strips transforms how the entire room feels — and it's relatively inexpensive compared to other kitchen work.",
      "Ultra-premium appliances like Sub-Zero and Wolf are incredible products, but in most Hamilton County homes you won't recoup the full cost at resale. Mid-range professional-style appliances from brands like KitchenAid or Samsung offer 90% of the look at a fraction of the price.",
      "Based on current market data for the Indianapolis metro area, a mid-range kitchen remodel typically recoups 60-75% of its cost at resale. A minor kitchen remodel with cosmetic updates can return 75-85%. You don't need an $80,000 gut job to add value.",
      "Start with what bothers you most about your current kitchen — layout, storage, or the look. Prioritizing your pain points ensures you spend where it matters most. We offer free in-home consultations across Hamilton County. Call (317) 279-4798."
    ]},
  { title: "Why Basement Finishing Is the Best Investment You'll Make This Year", date: "Jan 20, 2026", read: "4 min", cat: "Basement", excerpt: "Extra living space without moving? A finished basement adds square footage, comfort, and serious resale value to your home.",
    body: [
      "If you're running out of room in your home but don't want to move, look down. Your unfinished basement is probably the most underutilized space in your house — and finishing it is one of the smartest investments a Hamilton County homeowner can make.",
      "A finished basement adds usable square footage to your home without the cost or complexity of a home addition. You already own the space and the foundation is already built. The cost per square foot to finish a basement is significantly less than building out or up.",
      "The most popular basement uses we see in Hamilton County homes include family entertainment areas with media setups, guest suites with a bedroom and bathroom, home offices for remote workers, kids' play areas, and home gyms. Many homeowners combine two or three of these into one project.",
      "From a resale perspective, a finished basement can recoup 70-80% of its cost while making your home significantly more attractive to buyers. In competitive markets like Carmel, Fishers, and Westfield, a finished basement can be the differentiator that gets your home sold faster.",
      "Common concerns include moisture and waterproofing — which we address with proper drainage, vapor barriers, and the right materials. Ceiling height is another factor; most Hamilton County homes built in the last 20-30 years have adequate ceiling height for a comfortable finished space.",
      "Ready to put that empty space to work? HomeStar handles basement finishes from design through final inspection. Call (317) 279-4798 for a free estimate."
    ]},
  { title: "Deck Season Is Coming: How to Plan Your Outdoor Living Space", date: "Jan 8, 2026", read: "3 min", cat: "Outdoor", excerpt: "Spring is the perfect time to start planning your dream deck. Here's how to choose materials, layout, and features that last.",
    body: [
      "Indiana winters are long, but spring arrives fast — and when it does, you'll want an outdoor space that's ready for it. If you're thinking about adding or replacing a deck, now is the time to start planning so construction can begin as soon as weather allows.",
      "The biggest decision is material. Pressure-treated wood is the most affordable option and looks great when new, but requires annual maintenance — staining, sealing, and eventually replacing boards as they weather. Composite decking from brands like Trex or TimberTech costs more upfront but requires virtually no maintenance and lasts 25-30 years.",
      "For Hamilton County homeowners who want to enjoy their deck rather than maintain it, composite is usually the better long-term investment. The math works out over time when you factor in the cost of annual staining and board replacements with wood.",
      "Layout matters more than most people realize. Think about how you'll actually use the space — dining, lounging, grilling, entertaining. A well-designed deck has distinct zones for different activities and flows naturally from your home's interior. Consider built-in seating, pergolas for shade, and landscape lighting for evening use.",
      "Permits are required for deck construction in most Hamilton County municipalities. We handle the entire permitting process and ensure everything meets current building codes. A properly permitted deck protects your investment and avoids issues when you sell your home.",
      "Start planning now and you'll be hosting cookouts by Memorial Day. Call HomeStar at (317) 279-4798 or visit thehomestarservice.com to request a free estimate."
    ]},
];

const VIDEOS = [
  { title: "Floor-to-Ceiling Bathroom Remodel in Noblesville, IN", id: "7ww8YOK33B8", desc: "Complete bathroom transformation from floor to ceiling in a Noblesville home." },
  { title: "Full Upper Level Home Remodel in Geist, IN", id: "coWQF-AMLsw", desc: "Watch the full upper level renovation of this beautiful Geist residence." },
  { title: "Luxury Double Shower Bathroom Remodel in Carmel, IN", id: "EM4UCRyGCYs", desc: "A luxurious double shower installation in this stunning Carmel bathroom remodel." },
  { title: "Custom Green Tile Bathroom Remodel in Carmel, IN", id: "OauuZVYCbYY", desc: "Bold green tile brings this Carmel bathroom to life with a one-of-a-kind design." },
  { title: "Jack & Jill Bathroom Remodel in Zionsville, IN", id: "QiuKLitzftY", desc: "A shared Jack & Jill bathroom gets a complete makeover in Zionsville." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", loc: "Carmel, IN", text: "HomeStar completely transformed our kitchen. The attention to detail was incredible, and they finished ahead of schedule. Robb and Eric are the real deal.", rating: 5 },
  { name: "James & Linda K.", loc: "Westfield, IN", text: "Professional from start to finish. The crew was respectful of our home, and the communication throughout the project was outstanding. No surprises, no hidden fees.", rating: 5 },
  { name: "David R.", loc: "Fishers, IN", text: "We've used HomeStar for three projects now—bathroom remodel, basement finish, and a deck build. Consistently excellent work at fair prices. They're our go-to.", rating: 5 },
];

const FAQS = [
  { q: "How do I get a free estimate?", a: "Give us a call at (317) 279-4798 or submit a request through the form on this page. We'll set up a time to visit your home, talk through your project, and provide a detailed written estimate at no cost." },
  { q: "Are you licensed and insured?", a: "Yes — HomeStar Services & Contracting holds full licensing, bonding, and insurance in Indiana, including general liability and workers' compensation. Your home and our crew are fully protected." },
  { q: "How long does a typical remodel take?", a: "It depends on scope. Most bathroom remodels wrap up in 2–4 weeks, kitchens run 4–8 weeks, and basement finishes typically take 6–12 weeks. We'll give you a clear timeline before any work begins." },
  { q: "Do you offer a warranty?", a: "Every project we complete includes a 1-year workmanship warranty. If something isn't right after we finish, we come back and fix it. Quality work should hold up long after the last day on the job." },
  { q: "What areas do you serve?", a: "We work throughout Hamilton County and surrounding communities — including Carmel, Fishers, Noblesville, Zionsville, Brownsburg, Pendleton, McCordsville, and Fortville." },
];

const AREAS = ["Carmel", "Fishers", "Noblesville", "Zionsville", "Brownsburg", "Pendleton", "McCordsville", "Fortville"];

/* ─── Styles ──────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Bricolage+Grotesque:wght@400;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;color:${C.text};overflow-x:hidden;-webkit-font-smoothing:antialiased}

.display{font-family:'Bricolage Grotesque',sans-serif}

@keyframes fu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sl{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
.fu{animation:fu .65s ease-out both}.fi{animation:fi .5s ease-out both}.sl{animation:sl .65s ease-out both}
.d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.2s;opacity:0}.d3{animation-delay:.3s;opacity:0}
.d4{animation-delay:.4s;opacity:0}.d5{animation-delay:.5s;opacity:0}.d6{animation-delay:.6s;opacity:0}

.btn-g{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:${C.green};color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:none;border-radius:8px;cursor:pointer;text-decoration:none;transition:all .25s;letter-spacing:.01em}
.btn-g:hover{background:${C.greenDark};transform:translateY(-2px);box-shadow:0 8px 24px rgba(92,184,50,.3)}
.btn-n{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:${C.navy};color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:none;border-radius:8px;cursor:pointer;text-decoration:none;transition:all .25s}
.btn-n:hover{background:${C.navyMid};transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,42,74,.3)}
.btn-o{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:transparent;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:2px solid rgba(255,255,255,.35);border-radius:8px;cursor:pointer;text-decoration:none;transition:all .25s}
.btn-o:hover{border-color:#fff;background:rgba(255,255,255,.08)}

.sec{padding:96px 24px}.sec-in{max-width:1160px;margin:0 auto}
.lab{font-weight:800;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.green};margin-bottom:12px}
.ttl{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(28px,4vw,42px);line-height:1.15;color:${C.navy};margin-bottom:18px}
.ttl-w{color:#fff}
.sub{font-size:16px;color:${C.gray};line-height:1.75;max-width:580px}

::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${C.cream}}::-webkit-scrollbar-thumb{background:${C.navy};border-radius:3px}

@media(max-width:900px){.desk{display:none!important}.mob-btn{display:flex!important}.hero-grid{grid-template-columns:1fr!important;gap:32px!important}}
@media(min-width:901px){.mob-btn{display:none!important}.mob-menu{display:none!important}}
`;

/* ─── useVis hook ─────────────────────────────────── */
function useVis(t=0.12){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([en])=>{if(en.isIntersecting){setV(true);o.disconnect()}},{threshold:t});o.observe(e);return()=>o.disconnect()},[t]);
  return[r,v];
}

/* ─── Nav ─────────────────────────────────────────── */
function Nav(){
  const[open,setOpen]=useState(false);
  const[sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  const links=[{l:"Services",h:"#services"},{l:"Why HomeStar",h:"#difference"},{l:"Our Process",h:"#process"},{l:"Projects",h:"#projects"},{l:"Videos",h:"#videos"},{l:"Blog",h:"#blog"},{l:"About",h:"#about"},{l:"Contact",h:"#contact"}];

  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:sc?"rgba(27,42,74,.97)":"transparent",backdropFilter:sc?"blur(14px)":"none",transition:"all .35s",borderBottom:sc?"1px solid rgba(255,255,255,.06)":"none"}}>
      {/* Top bar */}
      <div style={{background:sc?"transparent":C.navyDark,transition:"background .35s",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",height:sc?0:36,overflow:"hidden",transition:"height .3s"}}>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <a href="tel:+13172794798" style={{color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>{I.phone} (317) 279-4798</a>
            <span style={{color:"rgba(255,255,255,.3)",fontSize:12}}>Serving Hamilton County, IN</span>
          </div>
          <a href="#contact" style={{color:C.green,fontSize:12,fontWeight:700,textDecoration:"none",letterSpacing:".04em"}}>REQUEST A FREE ESTIMATE</a>
        </div>
      </div>
      {/* Main bar */}
      <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:sc?64:72,transition:"height .3s"}}>
        <a href="#hero" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <img src="/images/logo-mascot.png" alt="HomeStar Services mascot" style={{width:40,height:40,objectFit:"contain"}} />
          <div>
            <div className="display" style={{color:"#fff",fontSize:17,fontWeight:800,letterSpacing:".02em",lineHeight:1.1}}>HOMESTAR</div>
            <div style={{color:C.green,fontSize:9,fontWeight:700,letterSpacing:".11em",lineHeight:1}}>SERVICES & CONTRACTING</div>
          </div>
        </a>
        <div className="desk" style={{display:"flex",alignItems:"center",gap:26}}>
          {links.map(l=><a key={l.h} href={l.h} style={{color:"rgba(255,255,255,.75)",textDecoration:"none",fontSize:13,fontWeight:600,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.75)"}>{l.l}</a>)}
          <a href="#contact" className="btn-g" style={{padding:"9px 20px",fontSize:13}}>Free Estimate</a>
        </div>
        <button className="mob-btn" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center"}}>{open?I.close:I.menu}</button>
      </div>
      {open&&<div className="mob-menu" style={{background:C.navyDark,padding:"16px 24px 28px",display:"flex",flexDirection:"column",gap:14}}>
        {links.map(l=><a key={l.h} href={l.h} onClick={()=>setOpen(false)} style={{color:"#fff",textDecoration:"none",fontSize:15,fontWeight:600,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>{l.l}</a>)}
        <a href="#contact" className="btn-g" style={{textAlign:"center",marginTop:8}}>Get a Free Estimate</a>
      </div>}
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────── */
/* ─── Hero Photo Showcase ──────────────────────────── */
const HERO_PHOTOS = [
  { src: "/images/fishers-spa-retreat-1.jpg", alt: "Spa retreat bathroom remodel in Fishers Indiana" },
  { src: "/images/bathroom-green-tile-1.jpg", alt: "Custom green tile bathroom in Carmel Indiana" },
  { src: "/images/geist-upper-level-1.jpg", alt: "Upper level home remodel in Geist Indiana" },
  { src: "/images/zionsville-jack-and-jill-1.jpg", alt: "Jack and Jill bathroom remodel Zionsville Indiana" },
  { src: "/images/fishers-double-shower-1.jpg", alt: "Double shower remodel in Fishers Indiana" },
  { src: "/images/modern-farmhouse-1.jpg", alt: "Modern farmhouse bathroom Fishers Indiana" },
];

function HeroShowcase(){
  const[idx,setIdx]=useState(0);
  useEffect(()=>{
    const timer=setInterval(()=>setIdx(i=>(i+1)%HERO_PHOTOS.length),4000);
    return()=>clearInterval(timer);
  },[]);
  return(
    <div className="fu d3" style={{position:"relative",width:"100%",height:"100%",minHeight:420,borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
      {HERO_PHOTOS.map((p,i)=>(
        <img key={p.src} src={p.src} alt={p.alt} loading={i===0?"eager":"lazy"}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:idx===i?1:0,transition:"opacity 1.2s ease-in-out"}}/>
      ))}
      {/* Subtle gradient overlay at bottom */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(transparent,rgba(17,29,53,.6))"}}/>
      {/* Photo counter */}
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:6}}>
        {HERO_PHOTOS.map((_,i)=>(
          <div key={i} style={{width:idx===i?20:6,height:6,borderRadius:3,background:idx===i?"#fff":"rgba(255,255,255,.35)",transition:"all .4s ease"}}/>
        ))}
      </div>
    </div>
  );
}

function Hero(){
  return(
    <section id="hero" style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.1) 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:-120,left:-120,width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.06) 0%,transparent 65%)"}}/>
      <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>

      <div style={{maxWidth:1160,margin:"0 auto",padding:"140px 24px 100px",position:"relative",zIndex:2,width:"100%"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}} className="hero-grid">
          {/* Left: Text */}
          <div>
            <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:26}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
              <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>FAMILY-OWNED • HAMILTON COUNTY, IN</span>
            </div>

            <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(36px,5.5vw,60px)",lineHeight:1.06,marginBottom:22}}>
              Major Projects.<br/><span style={{color:C.green}}>Master Craftsmanship.</span>
            </h1>

            <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:18,lineHeight:1.7,maxWidth:520,marginBottom:36}}>
              Full-service home remodeling for Hamilton County, Indiana and the surrounding communities. Licensed contractors, honest pricing, and results that speak for themselves.
            </p>

            <div className="fu d4" style={{display:"flex",flexWrap:"wrap",gap:14}}>
              <a href="#contact" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
              <a href="#services" className="btn-o">View Our Services</a>
            </div>

            <div className="fu d5" style={{display:"flex",flexWrap:"wrap",gap:36,marginTop:52}}>
              {[{n:"100+",l:"Projects Completed"},{n:"1-Year",l:"Workmanship Warranty"},{n:"5.0★",l:"Google Rating"},{n:"25-Year",l:"Schluter Waterproofing Warranty"},{n:"100%",l:"Licensed & Insured"}].map(b=>
                <div key={b.l}><div className="display" style={{color:C.green,fontSize:26,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:12,fontWeight:600,letterSpacing:".03em",marginTop:2}}>{b.l}</div></div>
              )}
            </div>
          </div>

          {/* Right: Photo showcase */}
          <HeroShowcase/>
        </div>
      </div>
      <div style={{position:"absolute",bottom:-2,left:0,right:0,height:70,background:"#fff",clipPath:"polygon(0 100%,100% 100%,100% 0)"}}/>
    </section>
  );
}

/* ─── Services ─────────────────────────────────────── */
function Services(){
  const[ref,vis]=useVis();
  return(
    <section id="services" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className="lab">What We Do</div>
          <h2 className="ttl">Comprehensive Remodeling Services</h2>
          <p className="sub" style={{margin:"0 auto"}}>From kitchens and bathrooms to basements and outdoor spaces — our licensed team handles every phase of your project with precision and care.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:22}}>
          {SVC.map((s,i)=>
            <div key={s.title} className={vis?`fu d${i%6+1}`:""} style={{padding:"32px 28px",borderRadius:14,border:`1px solid ${C.sand}`,background:"#fff",transition:"all .3s",cursor:"pointer",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 40px rgba(92,184,50,.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${s.color},${s.color}88)`,borderRadius:"14px 14px 0 0"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,marginTop:4}}>
                <div style={{width:10,height:10,borderRadius:3,background:s.color,flexShrink:0}}/>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:C.gray,textTransform:"uppercase"}}>{s.tag}</span>
              </div>
              <h3 className="display" style={{fontSize:19,fontWeight:700,color:C.navy,marginBottom:10}}>{s.title}</h3>
              <p style={{color:C.gray,lineHeight:1.7,fontSize:14}}>{s.desc}</p>
              <a href={s.href} style={{marginTop:16,color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}>View Our Work {I.arrow}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── The HomeStar Difference ──────────────────────── */
function Difference(){
  const[ref,vis]=useVis();
  const items = [
    {
      title: "Schluter Pro Certified Installers",
      desc: "We exclusively use the complete Schluter System — Ditra for floors, Kerdi for walls, and Schluter shower pans. This 100% waterproof system absorbs natural house movement, preventing cracked tiles and water damage. Because our installers are Schluter Pro Certified, your project is backed by a 25-year manufacturer's warranty.",
      highlight: "25-Year Warranty",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
    },
    {
      title: "Licensed Plumbers & Electricians Only",
      desc: "Every plumbing and electrical component of your project is handled by fully licensed tradespeople — not handymen, not apprentices. We don't cut corners on the professionals responsible for your family's safety and code compliance.",
      highlight: "Fully Licensed",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    },
    {
      title: "3D Design Renderings",
      desc: "Before any work begins, we create detailed 3D renderings of your space so you can see exactly how your new room will look. We refine the design based on your feedback until every detail is right — tile patterns, fixtures, lighting, and layout.",
      highlight: "See It Before We Build It",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    },
    {
      title: "Responsive Communication & Accountability",
      desc: "You'll never be left wondering what's happening with your project. Our team provides timely updates, answers your calls and messages promptly, and takes full accountability for every detail — from the first consultation through final walkthrough.",
      highlight: "Always In The Loop",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      title: "Premium Materials, Not Shortcuts",
      desc: "What goes under your tile matters more than the tile itself. While other contractors use standard cement board to save money, we invest in the Schluter System — the industry gold standard for waterproofing and long-term durability.",
      highlight: "Built to Last",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    },
    {
      title: "Locally Owned & Community Rooted",
      desc: "We're a small business deeply connected to Hamilton County. Your neighbors are our clients, and our reputation is built on every project we complete. Licensed with the State of Indiana, fully insured, and bonded.",
      highlight: "Your Neighbors Trust Us",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    },
  ];

  return(
    <section id="difference" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`,position:"relative",overflow:"hidden"}} ref={ref}>
      <div style={{position:"absolute",top:-80,left:-80,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.08) 0%,transparent 70%)"}}/>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className="lab">Why HomeStar</div>
          <h2 className="ttl ttl-w">The HomeStar Difference</h2>
          <p className="sub" style={{margin:"0 auto",color:"rgba(255,255,255,.45)"}}>We're not the cheapest option — and that's by design. Here's what you get when you choose a contractor who invests in doing it right.</p>
        </div>

        {/* Schluter callout */}
        <div className={vis?"fu d1":""} style={{background:"rgba(92,184,50,.08)",border:"1px solid rgba(92,184,50,.2)",borderRadius:16,padding:"32px 36px",marginBottom:36,display:"flex",flexWrap:"wrap",gap:32,alignItems:"center"}}>
          <div style={{flex:"1 1 400px"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(92,184,50,.15)",borderRadius:50,padding:"6px 14px",marginBottom:16}}>
              <span style={{color:C.green,fontWeight:800,fontSize:11,letterSpacing:".08em"}}>SCHLUTER PRO CERTIFIED</span>
            </div>
            <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:10}}>The Hidden Investment That Changes Everything</h3>
            <p style={{color:"rgba(255,255,255,.55)",fontSize:14,lineHeight:1.75}}>What goes <strong style={{color:"#fff"}}>under</strong> your tile matters more than the tile itself. We exclusively use the complete Schluter waterproofing system — the bright orange material that's 100% waterproof and absorbs natural house movement. Standard cement board is rigid, absorbs moisture over time, and leads to cracked tiles and water damage. Our approach costs more upfront but protects your investment for decades.</p>
          </div>
          <div style={{flex:"0 0 auto",display:"flex",gap:20}}>
            {[{label:"Schluter System",sub:"100% waterproof",color:C.green},{label:"Cement Board",sub:"Absorbs moisture",color:"#888"}].map(c=>
              <div key={c.label} style={{textAlign:"center",padding:"20px 24px",borderRadius:12,background:"rgba(255,255,255,.05)",border:`1px solid ${c.color}33`,minWidth:130}}>
                <div className="display" style={{color:c.color,fontSize:14,fontWeight:700,marginBottom:4}}>{c.label}</div>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:11}}>{c.sub}</div>
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20}}>
          {items.map((item,i)=>
            <div key={item.title} className={vis?`fu d${i%6+1}`:""} style={{padding:"28px 26px",borderRadius:14,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(92,184,50,.3)";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:10,background:"rgba(92,184,50,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</div>
                <div>
                  <h3 className="display" style={{color:"#fff",fontSize:16,lineHeight:1.3}}>{item.title}</h3>
                  <span style={{color:C.green,fontSize:11,fontWeight:700,letterSpacing:".04em"}}>{item.highlight}</span>
                </div>
              </div>
              <p style={{color:"rgba(255,255,255,.45)",fontSize:13,lineHeight:1.7}}>{item.desc}</p>
            </div>
          )}
        </div>

        <div style={{textAlign:"center",marginTop:44}}>
          <a href="#contact" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Our Process ──────────────────────────────────── */
function OurProcess(){
  const[ref,vis]=useVis();
  return(
    <section id="process" className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className="lab">How We Work</div>
          <h2 className="ttl">A Clear Process from Start to Finish</h2>
          <p className="sub" style={{margin:"0 auto"}}>No surprises, no guesswork. Here's exactly how we take your project from idea to completion.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:32}}>
          {PROCESS.map((p,i)=>
            <div key={p.step} className={vis?`fu d${i+1}`:""} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:40,alignItems:"center",background:"#fff",borderRadius:16,padding:"40px 36px",boxShadow:"0 2px 16px rgba(0,0,0,.04)",border:`1px solid ${C.sand}`}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                  <div style={{width:48,height:48,borderRadius:12,background:C.greenMuted,display:"flex",alignItems:"center",justifyContent:"center"}}>{p.icon}</div>
                  <div>
                    <span className="display" style={{fontSize:12,fontWeight:800,color:C.green,letterSpacing:".1em"}}>STEP {p.step}</span>
                    <h3 className="display" style={{fontSize:22,fontWeight:700,color:C.navy,lineHeight:1.2}}>{p.title}</h3>
                  </div>
                </div>
                <p style={{color:C.grayDark,fontWeight:600,fontSize:15,marginBottom:10,fontStyle:"italic"}}>{p.sub}</p>
                <p style={{color:C.gray,lineHeight:1.75,fontSize:14}}>{p.text}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {p.bullets.map(b=><div key={b} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  {I.check}<span style={{fontSize:14,color:C.grayDark,lineHeight:1.5}}>{b}</span>
                </div>)}
              </div>
            </div>
          )}
        </div>
        {/* After project */}
        <div style={{textAlign:"center",marginTop:48,padding:"36px 28px",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:16}}>
          <div style={{marginBottom:12}}>{I.shield}</div>
          <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:8}}>After the Project — We Stand Behind Our Work</h3>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:14,lineHeight:1.7,maxWidth:560,margin:"0 auto 20px"}}>Every project includes a 1-year workmanship warranty. If anything needs attention after we're done, we come back and take care of it. That's our commitment to you.</p>
          <a href="#contact" className="btn-g">Start Your Project {I.arrow}</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Image Carousel ───────────────────────────────── */
function Carousel({ images, color, title }) {
  const [idx, setIdx] = useState(0);
  const hasImages = images && images.length > 0;
  const multi = hasImages && images.length > 1;

  if (!hasImages) {
    return (
      <div style={{height:230,background:`linear-gradient(135deg,${color},${color}aa)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <div style={{position:"absolute",inset:0,opacity:.06,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.5) 10px,rgba(255,255,255,.5) 11px)"}}/>
        <span style={{color:"rgba(255,255,255,.25)",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>Project Photo</span>
      </div>
    );
  }

  return (
    <div style={{position:"relative",height:230,overflow:"hidden",background:C.navyDark}}>
      <img
        src={images[idx].src}
        alt={images[idx].alt || title}
        style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity .3s ease"}}
        loading="lazy"
      />
      {multi && (
        <>
          <button onClick={(e)=>{e.stopPropagation();setIdx(idx===0?images.length-1:idx-1)}}
            style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"background .2s",backdropFilter:"blur(4px)"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.75)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.5)"}
          >{I.chevL}</button>
          <button onClick={(e)=>{e.stopPropagation();setIdx(idx===images.length-1?0:idx+1)}}
            style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"background .2s",backdropFilter:"blur(4px)"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.75)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.5)"}
          >{I.chevR}</button>
          {/* Dot indicators */}
          <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
            {images.map((_,j)=>(
              <button key={j} onClick={(e)=>{e.stopPropagation();setIdx(j)}}
                style={{width:idx===j?18:7,height:7,borderRadius:4,background:idx===j?"#fff":"rgba(255,255,255,.45)",border:"none",cursor:"pointer",transition:"all .25s",padding:0}}
              />
            ))}
          </div>
          {/* Counter */}
          <div style={{position:"absolute",top:10,right:12,background:"rgba(0,0,0,.55)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,backdropFilter:"blur(4px)"}}>
            {idx+1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Projects ─────────────────────────────────────── */
function Projects(){
  const[ref,vis]=useVis();
  const[filter,setFilter]=useState("All");
  const cats=["All",...new Set(PROJECTS.map(p=>p.cat))];
  const filtered=filter==="All"?PROJECTS:PROJECTS.filter(p=>p.cat===filter);
  return(
    <section id="projects" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="lab">Our Portfolio</div>
          <h2 className="ttl">Real Projects. Real Homes. Real Results.</h2>
          <p className="sub" style={{margin:"0 auto"}}>See the difference HomeStar makes in real homes across Hamilton County. Our portfolio showcases the quality and care we bring to every project.</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginBottom:36}}>
          {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"9px 20px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,letterSpacing:".02em",fontFamily:"'Plus Jakarta Sans',sans-serif",background:filter===c?C.navy:"#fff",color:filter===c?"#fff":C.grayDark,transition:"all .2s",boxShadow:filter===c?"0 4px 14px rgba(27,42,74,.2)":"0 1px 4px rgba(0,0,0,.06)"}}>{c}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:22}}>
          {filtered.map((p,i)=>
            <div key={p.title} className={vis?`fu d${i%6+1}`:""} style={{borderRadius:14,overflow:"hidden",background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,.05)",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 44px rgba(0,0,0,.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"}}>
              <Carousel images={p.images} color={p.color} title={p.title} />
              <div style={{padding:"20px 24px 24px"}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:C.green,textTransform:"uppercase"}}>{p.cat}</span>
                <h3 className="display" style={{fontSize:17,color:C.navy,marginTop:6}}>{p.title}</h3>
                {p.desc && <p style={{color:C.gray,fontSize:13,lineHeight:1.6,marginTop:8}}>{p.desc}</p>}
                {p.images && p.images.length > 1 && <div style={{marginTop:10,color:C.gray,fontSize:11,fontWeight:600}}>{p.images.length} photos</div>}
              </div>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:44}}>
          <a href="#contact" className="btn-n">View Full Portfolio {I.arrow}</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Videos ───────────────────────────────────────── */
function Videos(){
  const[ref,vis]=useVis();
  return(
    <section id="videos" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">See Our Work in Action</div>
          <h2 className="ttl ttl-w">Video Walkthroughs</h2>
          <p className="sub" style={{margin:"0 auto",color:"rgba(255,255,255,.45)"}}>Watch our process and results up close with behind-the-scenes project videos.</p>
        </div>
        {/* Horizontal scroll container for vertical Shorts */}
        <div style={{display:"flex",gap:20,overflowX:"auto",paddingBottom:16,scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch"}}>
          {VIDEOS.map((v,i)=>
            <div key={v.id} className={vis?`fu d${i+1}`:""} style={{minWidth:280,maxWidth:300,flexShrink:0,borderRadius:14,overflow:"hidden",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",scrollSnapAlign:"start",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(92,184,50,.35)";e.currentTarget.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{position:"relative",width:"100%",paddingTop:"177.78%",background:C.navyDark}}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div style={{padding:"18px 20px 22px"}}>
                <h3 className="display" style={{color:"#fff",fontSize:14,marginBottom:8,lineHeight:1.35}}>{v.title}</h3>
                <p style={{color:"rgba(255,255,255,.4)",fontSize:12,lineHeight:1.6}}>{v.desc}</p>
              </div>
            </div>
          )}
        </div>
        {/* Scroll hint */}
        <div style={{textAlign:"center",marginTop:16,color:"rgba(255,255,255,.25)",fontSize:12,fontWeight:600}}>
          ← Swipe to see more videos →
        </div>
      </div>
    </section>
  );
}

/* ─── Blog ─────────────────────────────────────────── */
function Blog(){
  const[ref,vis]=useVis();
  const[openPost,setOpenPost]=useState(null);

  return(
    <section id="blog" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Expert Tips & Insights</div>
          <h2 className="ttl">From the HomeStar Blog</h2>
          <p className="sub" style={{margin:"0 auto"}}>Helpful guides, project inspiration, and homeowner tips from our team.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22}}>
          {BLOG.map((b,i)=>
            <article key={b.title} className={vis?`fu d${i+1}`:""} onClick={()=>setOpenPost(b)} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,transition:"all .3s",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.07)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{height:5,background:`linear-gradient(90deg,${C.navy},${C.green})`}}/>
              <div style={{padding:"24px 24px 28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase",background:C.greenMuted,padding:"3px 10px",borderRadius:50}}>{b.cat}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.gray}}>{I.clock} {b.read}</span>
                </div>
                <h3 className="display" style={{fontSize:17,color:C.navy,marginBottom:10,lineHeight:1.3}}>{b.title}</h3>
                <p style={{color:C.gray,fontSize:13,lineHeight:1.7,marginBottom:14}}>{b.excerpt}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.gray,fontSize:12}}>{b.date}</span>
                  <span style={{color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>Read More {I.arrow}</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Blog Post Modal */}
      {openPost&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"60px 20px",overflowY:"auto"}}
          onClick={()=>setOpenPost(null)}>
          <div style={{background:"#fff",borderRadius:18,maxWidth:720,width:"100%",padding:"48px 40px",position:"relative",animation:"fu .4s ease-out"}}
            onClick={e=>e.stopPropagation()}>
            {/* Close button */}
            <button onClick={()=>setOpenPost(null)} style={{position:"absolute",top:18,right:18,width:36,height:36,borderRadius:"50%",background:C.cream,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.sand}
              onMouseLeave={e=>e.currentTarget.style.background=C.cream}>{I.close}</button>

            {/* Post header */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase",background:C.greenMuted,padding:"4px 12px",borderRadius:50}}>{openPost.cat}</span>
              <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.gray}}>{I.clock} {openPost.read}</span>
              <span style={{color:C.gray,fontSize:12}}>• {openPost.date}</span>
            </div>

            <h2 className="display" style={{fontSize:28,color:C.navy,lineHeight:1.25,marginBottom:8}}>{openPost.title}</h2>
            <div style={{height:4,width:60,background:C.green,borderRadius:2,marginBottom:28}}/>

            {/* Post body */}
            {openPost.body&&openPost.body.map((p,i)=>
              <p key={i} style={{color:C.grayDark,fontSize:15,lineHeight:1.85,marginBottom:18}}>{p}</p>
            )}

            {/* CTA at bottom */}
            <div style={{marginTop:32,padding:"24px 28px",background:C.cream,borderRadius:12,textAlign:"center"}}>
              <p className="display" style={{color:C.navy,fontSize:17,marginBottom:12}}>Ready to start your project?</p>
              <a href="#contact" className="btn-g" onClick={()=>setOpenPost(null)}>Get a Free Estimate {I.arrow}</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Testimonials ─────────────────────────────────── */
function Testimonials(){
  const[ref,vis]=useVis();
  useEffect(()=>{
    if(!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')){
      const s=document.createElement("script");
      s.src="https://elfsightcdn.com/platform.js";
      s.async=true;
      document.body.appendChild(s);
    }
  },[]);
  return(
    <section className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Trusted by Homeowners</div>
          <h2 className="ttl">What Our Clients Say</h2>
          <p className="sub" style={{margin:"0 auto"}}>Real reviews from real homeowners across Hamilton County.</p>
        </div>
        <div className={vis?"fu d1":""}>
          <div className="elfsight-app-aa4b2192-d931-4bb1-9f22-53adc2e6ed5e" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
}

/* ─── About ────────────────────────────────────────── */
function About(){
  const[ref,vis]=useVis();
  return(
    <section id="about" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:56,alignItems:"center"}}>
          <div className={vis?"fu d1":""}>
            <div className="lab">Who We Are</div>
            <h2 className="ttl">Built on Friendship,<br/>Backed by Experience</h2>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:22}}>
              HomeStar Services and Contracting is a family-owned remodeling company rooted in Hamilton County. We specialize in residential projects that improve how you live in your home — from full renovations to targeted upgrades that make a real difference.
            </p>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:28}}>
              Co-founded by <strong style={{color:C.navy}}>Robb and Eric</strong>, two lifelong friends with backgrounds in real estate and small business, HomeStar was built on a straightforward idea: treat every home like it's our own, and treat every homeowner like they're family.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {["Licensed, Bonded & Insured","1-Year Workmanship Warranty","Transparent, Honest Pricing","Customer-First Communication","Clean Job Sites Always","On-Time Completion"].map(item=>
                <div key={item} style={{display:"flex",alignItems:"center",gap:8}}>{I.check}<span style={{fontSize:13,fontWeight:600,color:C.grayDark}}>{item}</span></div>
              )}
            </div>
          </div>
          <div className={vis?"sl d2":""} style={{height:440,borderRadius:16,overflow:"hidden",position:"relative"}}>
            <img src="/images/robb-eric-1.JPG" alt="HomeStar founders Robb and Eric" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
            <div style={{position:"absolute",bottom:-16,right:-16,width:100,height:100,borderRadius:14,background:C.green,opacity:.2}}/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────── */
function FAQ(){
  const[open,setOpen]=useState(null);
  const[ref,vis]=useVis();
  return(
    <section id="faq" className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in" style={{maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Common Questions</div>
          <h2 className="ttl">Frequently Asked Questions</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {FAQS.map((f,i)=>
            <div key={i} className={vis?`fu d${Math.min(i+1,5)}`:""} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:`1px solid ${open===i?C.green:C.sand}`,transition:"border-color .3s"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                {f.q}<span style={{transform:open===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
              </button>
              <div style={{maxHeight:open===i?260:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ──────────────────────────────────────── */
function Contact(){
  const[ref,vis]=useVis();
  useEffect(()=>{
    // Load Jobber CSS
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");
      link.rel="stylesheet";
      link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";
      link.media="screen";
      document.head.appendChild(link);
    }
    // Load Jobber script
    if(!document.querySelector('script[src*="work_request_embed_snippet"]')){
      const s=document.createElement("script");
      s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
      s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
      s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
      document.body.appendChild(s);
    }
  },[]);
  return(
    <section id="contact" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`,position:"relative",overflow:"hidden"}} ref={ref}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:70,background:C.cream,clipPath:"polygon(0 0,100% 0,100% 100%)"}}/>
      <div style={{position:"absolute",top:-80,right:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.08) 0%,transparent 70%)"}}/>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:56}}>
          <div className={vis?"fu d1":""}>
            <div className="lab">Get Started</div>
            <h2 className="ttl ttl-w">Let's Talk About<br/>Your Project</h2>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:36,maxWidth:420}}>
              Whether it's a full-scale renovation or a single room that needs attention, we're here to help. Reach out for a free estimate — no obligation, no pressure, just a real conversation about what's possible.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:22}}>
              {[{icon:I.phone,label:"(317) 279-4798",sub:"Mon–Fri 7am–6pm, Sat 8am–2pm"},{icon:I.mail,label:"eric@thehomestarservice.com",sub:"We respond within 24 hours"},{icon:I.pin,label:"Hamilton County, Indiana",sub:"Carmel • Fishers • Westfield • Noblesville • Zionsville"}].map(c=>
                <div key={c.label} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{color:C.green,flexShrink:0,marginTop:2}}>{c.icon}</div>
                  <div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>{c.label}</div><div style={{color:"rgba(255,255,255,.35)",fontSize:12}}>{c.sub}</div></div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:14,marginTop:32}}>
              {[{icon:I.fb,label:"Facebook",href:"https://www.facebook.com/people/HomeStar-Services-and-Contracting/61568970834535/"},{icon:I.ig,label:"Instagram",href:"https://www.instagram.com/thehomestarservice/"},{icon:I.gg,label:"Google",href:"https://g.page/r/CVYAu4UIVz1wEBM/review"}].map(s=>
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{width:42,height:42,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.45)",transition:"all .25s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(92,184,50,.15)";e.currentTarget.style.color=C.green}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.45)"}}>{s.icon}</a>
              )}
            </div>
          </div>
          <div className={vis?"sl d2":""} style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* Quick contact options */}
            <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"28px 24px",textAlign:"center"}}>
              <h3 className="display" style={{color:"#fff",fontSize:18,marginBottom:6}}>Quick Contact</h3>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:20}}>Skip the form — reach us directly.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="tel:+13172794798" className="btn-g" style={{flex:"1 1 140px",justifyContent:"center",padding:"14px 20px",fontSize:14}}>
                  {I.phone} Call Us
                </a>
                <a href="sms:+13172794798" className="btn-o" style={{flex:"1 1 140px",justifyContent:"center",padding:"14px 20px",fontSize:14,borderColor:"rgba(92,184,50,.5)",color:C.green}}>
                  {I.mail} Text Us
                </a>
              </div>
            </div>
            {/* Jobber form */}
            <div style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Request a Free Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────── */
function Footer(){
  return(
    <footer style={{background:C.navyDark,padding:"56px 24px 28px"}}>
      <div style={{maxWidth:1160,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:44,marginBottom:44}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
              <img src="/images/logo-mascot.png" alt="HomeStar Services mascot" style={{width:36,height:36,objectFit:"contain"}} />
              <div><div className="display" style={{color:"#fff",fontSize:14,fontWeight:800}}>HOMESTAR</div><div style={{color:C.green,fontSize:8,fontWeight:700,letterSpacing:".1em"}}>SERVICES & CONTRACTING</div></div>
            </div>
            <p style={{color:"rgba(255,255,255,.3)",fontSize:12,lineHeight:1.7,maxWidth:260}}>Licensed, bonded, and insured home remodeling for Hamilton County, Indiana. Quality craftsmanship, clear pricing, and a 1-year workmanship warranty on every project.</p>
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Services</h4>
            {SVC.map(s=><a key={s.title} href="#services" style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{s.title}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Company</h4>
            {["About Us","Our Process","Projects","Blog","Videos","Contact","Request Estimate"].map(l=><a key={l} href={`#${l.toLowerCase().replace(/ /g,"")}`} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{l}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Service Areas</h4>
            {AREAS.map(a=><span key={a} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:9}}>{a}, IN</span>)}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <p style={{color:"rgba(255,255,255,.2)",fontSize:11}}>© 2026 HomeStar Services and Contracting, LLC. All rights reserved.</p>
          <div style={{display:"flex",gap:18}}>{["Privacy Policy","Terms of Service","Sitemap"].map(l=><a key={l} href="#" style={{color:"rgba(255,255,255,.2)",fontSize:11,textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.2)"}>{l}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ──────────────────────────────────────────── */
export default function HomestarSite(){
  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",description:"Family-owned home remodeling company serving Hamilton County, Indiana. Kitchen & bath remodeling, basement finishing, flooring, painting, decks & outdoor living.",url:"https://www.thehomestarservice.com",telephone:"+1-317-279-4798",address:{"@type":"PostalAddress",addressLocality:"Carmel",addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:39.9784,longitude:-86.1180},areaServed:[{name:"Carmel"},{name:"Fishers"},{name:"Westfield"},{name:"Noblesville"},{name:"Zionsville"},{name:"Brownsburg"},{name:"Pendleton"},{name:"McCordsville"},{name:"Fortville"}].map(c=>({"@type":"City",...c})),aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"},openingHours:["Mo-Fr 07:00-18:00","Sa 08:00-14:00"],priceRange:"$$",sameAs:["https://www.facebook.com/people/HomeStar-Services-and-Contracting/61568970834535/","https://www.instagram.com/thehomestarservice/"],founder:[{"@type":"Person",name:"Robb"},{"@type":"Person",name:"Eric"}],hasOfferCatalog:{"@type":"OfferCatalog",name:"Home Remodeling Services",itemListElement:SVC.map((s,i)=>({"@type":"Offer",itemOffered:{"@type":"Service",name:s.title,description:s.desc}}))}})}}/>
      <Nav/>
      <Hero/>
      <Services/>
      <Difference/>
      <OurProcess/>
      <Projects/>
      <Videos/>
      <Blog/>
      <Testimonials/>
      <About/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </div>
  );
}
