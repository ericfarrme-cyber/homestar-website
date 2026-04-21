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
  { title: "Bathroom Remodeling", tag: "Schluter Pro Certified", desc: "Our Schluter Pro Certified team delivers premium bathroom renovations backed by a 25-year waterproofing warranty. Walk-in showers, custom vanities, heated floors — built with materials that protect your investment for decades.", color: "#6A9FD4", href: "/bathroom-remodeling" },
  { title: "Basement Finishing", tag: "Unlock hidden potential", desc: "That unused square footage below your main floor? It's ready for a promotion. We convert unfinished basements into entertainment spaces, guest suites, home offices, and more.", color: "#8B7EC4", href: "/basement-finishing" },
  { title: "Kitchen Remodeling", tag: "Where great meals begin", desc: "The kitchen is the heart of every home. We build spaces that balance function and beauty—thoughtful layouts, quality cabinetry, and finishes that elevate your everyday routine.", color: "#D4A76A", href: "/kitchen-remodeling" },
  { title: "Flooring Services", tag: "The foundation of great design", desc: "New flooring changes the entire feel of a room. We install hardwood, luxury vinyl, tile, and carpet—selected for your lifestyle, built to handle real life, and installed with precision.", color: "#C49A6A", href: "/flooring-services" },
  { title: "Painting Services", tag: "Fresh color, fresh energy", desc: "A professional paint job does more than change a color—it transforms a room. We deliver clean edges, smooth finishes, and expert prep work that makes the difference.", color: "#6AC4A8", href: "/painting-services" },
  { title: "Decks & Outdoor Living", tag: "Bring life outdoors", desc: "Custom decks, covered patios, and outdoor living areas designed for how you actually live. Built with quality materials and craftsmanship that stands up to Indiana weather.", color: "#7AAF5A", href: "/decks-outdoor-living" },
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
    slug: "green-tile-bathroom-carmel",
    cat: "Bathroom", city: "Carmel", service: "Bathroom Remodeling",
    color: "#4A6A8B",
    desc: "Bold green tile brings this Carmel bathroom to life with a one-of-a-kind design, custom vanity, and full gut renovation.",
    story: {challenge:"This Carmel homeowner wanted a bathroom that would stand out — something bold, personal, and unlike anything their neighbors had. The existing bathroom was dated with standard white tile and a worn vanity.",approach:"We worked with the homeowner to select a distinctive green tile that would become the signature of the space. The complete Schluter waterproofing system was installed — Ditra on floors, Kerdi on walls — before any tile was set. A custom vanity with stone countertop was designed to complement the green palette. All plumbing by licensed plumber, all electrical by licensed electrician.",result:"The finished bathroom is one of our most striking transformations — a bold, one-of-a-kind space that perfectly reflects the homeowner's personality while being built on a waterproofing system that will protect their investment for 25+ years."},
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
    title: "Double Shower Remodel in Fishers", slug: "double-shower-fishers", city: "Fishers", service: "Bathroom Remodeling",
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
    title: "Spa Retreat Bathroom Remodel in Fishers", slug: "spa-retreat-bathroom-fishers", city: "Fishers", service: "Bathroom Remodeling",
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
    title: "Beautiful Geist Upper Level Remodel", slug: "geist-upper-level-remodel", city: "Geist", service: "Bathroom Remodeling",
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
    title: "Floor-to-Ceiling Tile Bathroom Remodel in Noblesville", slug: "floor-to-ceiling-tile-noblesville", city: "Noblesville", service: "Bathroom Remodeling",
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
    title: "Noblesville Laundry Room Remodel", slug: "laundry-room-noblesville", city: "Noblesville", service: "Flooring Services",
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
    title: "Two Children's Bathroom Remodels in Geist", slug: "childrens-bathrooms-geist", city: "Geist", service: "Bathroom Remodeling",
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
    title: "Jack & Jill Bathroom Remodel in Zionsville", slug: "jack-and-jill-zionsville", city: "Zionsville", service: "Bathroom Remodeling",
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
    title: "Quick Fishers Basement Finish", slug: "basement-finish-fishers", city: "Fishers", service: "Basement Finishing",
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
    title: "Fishers Bathroom Renovation", slug: "bathroom-renovation-fishers", city: "Fishers", service: "Bathroom Remodeling",
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
    title: "Teenage Child Bathroom Remodel in Fishers", slug: "kids-bathroom-fishers", city: "Fishers", service: "Bathroom Remodeling",
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
    title: "Laundry Room Flip near Geist, Fishers", slug: "laundry-room-geist", city: "Fishers", service: "Flooring Services",
    cat: "Laundry",
    color: "#8B7A5A",
    desc: "A compact laundry room transformed with smart storage and a clean, modern design.",
    images: [
      { src: "/images/geist-laundry-1.jpg", alt: "Laundry room remodel near Geist Fishers Indiana" },
      { src: "/images/geist-laundry-2.jpg", alt: "Modern laundry room renovation Geist Fishers IN" },
    ],
  },
  {
    title: "Modern Farmhouse Bathroom Remodel in Fishers", slug: "modern-farmhouse-bathroom-fishers", city: "Fishers", service: "Bathroom Remodeling",
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
    title: "Westfield Basement Finish on a Budget", slug: "basement-finish-westfield", city: "Westfield", service: "Basement Finishing",
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
  {
    title: "Double Shower Bathroom Remodel in Carmel", slug: "double-shower-carmel", city: "Carmel", service: "Bathroom Remodeling",
    cat: "Bathroom",
    color: "#5A7B8B",
    desc: "A stunning double shower bathroom renovation in Carmel featuring custom tile, modern vanity with LED mirror, hexagonal floor tile, and premium fixtures throughout.",
    images: [
      { src: "/images/carmel-double-shower-1.jpg", alt: "Double shower bathroom remodel in Carmel Indiana" },
      { src: "/images/carmel-double-shower-2.jpg", alt: "LED mirror vanity bathroom renovation Carmel IN" },
      { src: "/images/carmel-double-shower-3.jpg", alt: "Custom tile shower remodel Carmel Indiana" },
      { src: "/images/carmel-double-shower-4.jpg", alt: "Walk-in shower bathroom remodel Carmel IN" },
      { src: "/images/carmel-double-shower-5.jpg", alt: "Hexagonal tile bathroom floor Carmel Indiana" },
      { src: "/images/carmel-double-shower-6.jpg", alt: "Modern bathroom fixtures Carmel IN" },
      { src: "/images/carmel-double-shower-7.jpg", alt: "Completed double shower bathroom Carmel Indiana" },
    ],
  },
  {
    title: "Fortville Pavilion Patio Project", slug: "pavilion-patio-fortville", city: "Fortville", service: "Decks & Outdoor Living",
    cat: "Exterior",
    color: "#8B6A5A",
    desc: "A custom outdoor pavilion and patio in Fortville featuring a stone column bar area, covered seating with stained wood beams, and a comfortable entertaining space designed for year-round use.",
    images: [
      { src: "/images/fortville-pavilion-1.jpg", alt: "Custom pavilion patio project in Fortville Indiana" },
      { src: "/images/fortville-pavilion-2.jpg", alt: "Stone column outdoor bar Fortville IN" },
      { src: "/images/fortville-pavilion-3.jpg", alt: "Covered pavilion outdoor living Fortville Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Patio in Fishers", slug: "stamped-concrete-fishers", city: "Fishers", service: "Decks & Outdoor Living",
    cat: "Exterior",
    color: "#7B6A5A",
    desc: "A beautiful stamped concrete patio installation in Fishers featuring decorative patterns and clean borders, creating a durable outdoor living space perfect for entertaining.",
    images: [
      { src: "/images/fishers-concrete-1.jpg", alt: "Stamped concrete patio in Fishers Indiana" },
      { src: "/images/fishers-concrete-2.jpg", alt: "Decorative concrete patio installation Fishers IN" },
    ],
  },
  {
    title: "Stamped Concrete Patio in Noblesville", slug: "stamped-concrete-noblesville", city: "Noblesville", service: "Decks & Outdoor Living",
    cat: "Exterior",
    color: "#6A7B5A",
    desc: "A custom stamped concrete patio in Noblesville with a decorative finish and clean edges, extending the home's living space outdoors.",
    images: [
      { src: "/images/noblesville-concrete-1.jpg", alt: "Stamped concrete patio in Noblesville Indiana" },
      { src: "/images/noblesville-concrete-2.jpg", alt: "Concrete patio installation Noblesville IN" },
      { src: "/images/noblesville-concrete-3.jpg", alt: "Decorative stamped concrete Noblesville Indiana" },
      { src: "/images/noblesville-concrete-4.jpg", alt: "Completed concrete patio Noblesville IN" },
    ],
  },
  {
    title: "Composite Deck Build in Fishers", slug: "composite-deck-fishers", city: "Fishers", service: "Decks & Outdoor Living",
    cat: "Exterior",
    color: "#6A7B6A",
    desc: "A custom composite deck in Fishers with white railing, dual staircases, and a spacious layout designed for entertaining. Built with low-maintenance composite decking that stands up to Indiana weather year after year.",
    images: [
      { src: "/images/fishers-composite-deck-1.jpg", alt: "Composite deck build in Fishers Indiana" },
      { src: "/images/fishers-composite-deck-2.jpg", alt: "Custom composite deck with white railing Fishers IN" },
      { src: "/images/fishers-composite-deck-3.jpg", alt: "Completed composite deck project Fishers Indiana" },
    ],
  },
];

/* ─── SEO Helpers ─────────────────────────────────── */
function useCanonical(path){
  useEffect(()=>{
    let link=document.querySelector('link[rel="canonical"]');
    if(!link){link=document.createElement("link");link.rel="canonical";document.head.appendChild(link);}
    link.href="https://www.thehomestarservice.com"+(path?"/"+path:"");
  },[path]);
}

function useJobberForm(){
  useEffect(()=>{
    /* CSS — only add once */
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");link.rel="stylesheet";link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";link.media="screen";document.head.appendChild(link);
    }
    /* Script — remove old and re-add to force re-initialization */
    const old=document.querySelector('script[src*="work_request_embed_snippet"]');
    if(old)old.remove();
    const s=document.createElement("script");
    s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
    s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
    s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
    document.body.appendChild(s);
  },[]);
}

function FaqSchema({faqs}){
  if(!faqs||faqs.length===0)return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))})}} />;
}

function BreadcrumbSchema({items}){
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.name,item:item.url?"https://www.thehomestarservice.com"+item.url:undefined}))})}} />;
}

/* ─── Service-City Cross Links ────────────────────── */
function ServiceCityLinks({currentService,currentCity}){
  const services=[
    {name:"Bathroom Remodeling",slug:"bathroom-remodeling"},
    {name:"Basement Finishing",slug:"basement-finishing"},
    {name:"Kitchen Remodeling",slug:"kitchen-remodeling"},
    {name:"Flooring Services",slug:"flooring-services"},
    {name:"Painting Services",slug:"painting-services"},
    {name:"Decks & Outdoor Living",slug:"deck-builder"},
  ];
  const cities=["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"];

  if(currentService){
    /* On a service page — show links to all cities for this service */
    const svcSlug=services.find(s=>s.name===currentService)?.slug;
    if(!svcSlug)return null;
    return(
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:32}}>
            <div className="lab">{currentService} by City</div>
            <h2 className="ttl">{currentService} Across Hamilton County</h2>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10}}>
            {cities.filter(c=>c!==currentCity).map(c=>
              <a key={c} href={`/${svcSlug}-${c.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"10px 20px",borderRadius:50,background:"#fff",border:`1px solid ${C.sand}`,color:C.navy,fontWeight:600,fontSize:13,textDecoration:"none",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.color=C.navy}}>
                {currentService} in {c}
              </a>
            )}
          </div>
          {!currentCity&&(
            <div style={{textAlign:"center",marginTop:28}}>
              <h3 style={{color:C.navy,fontSize:15,fontWeight:700,marginBottom:14}}>Other Services</h3>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10}}>
                {services.filter(s=>s.name!==currentService).map(s=>
                  <a key={s.name} href={`/${s.slug==="deck-builder"?"decks-outdoor-living":s.slug}`} style={{padding:"8px 16px",borderRadius:50,background:"#fff",border:`1px solid ${C.sand}`,color:C.gray,fontWeight:600,fontSize:12,textDecoration:"none",transition:"all .3s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.color=C.gray}}>
                    {s.name}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if(currentCity){
    /* On a city page — show links to all services for this city */
    return(
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:32}}>
            <div className="lab">Services in {currentCity}</div>
            <h2 className="ttl">All Services Available in {currentCity}, IN</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
            {services.map(s=>
              <a key={s.name} href={`/${s.slug}-${currentCity.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"16px 20px",borderRadius:12,background:"#fff",border:`1px solid ${C.sand}`,color:C.navy,fontWeight:600,fontSize:14,textDecoration:"none",transition:"all .3s",display:"flex",alignItems:"center",gap:10}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                {I.check}{s.name} in {currentCity}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }
  return null;
}

const BLOG = [
  { slug:"bathroom-tile-failure-prevention", title: "Why Your Bathroom Tile Might Fail in 5 Years (And How to Prevent It)", date: "Mar 5, 2026", read: "7 min", cat: "Bathroom", excerpt: "Most tile failures aren't about the tile — they're about what's underneath. Learn why the Schluter waterproofing system outperforms standard cement board and protects your remodel for decades.",
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
  { slug:"signs-bathroom-needs-remodel", title: "5 Signs Your Bathroom Needs a Remodel", date: "Feb 18, 2026", read: "5 min", cat: "Bathroom", excerpt: "Cracked grout, outdated fixtures, and poor ventilation aren't just eyesores—they're signs it's time to invest in your bathroom. Here's what to look for.",
    body: [
      "Sometimes a bathroom remodel is a want. Sometimes it's a need. And sometimes you've been living with problems for so long that they start to feel normal. Here are five signs that your bathroom is telling you it's time for an upgrade.",
      "1. Cracked, Missing, or Moldy Grout — If the grout between your tiles is cracking, crumbling, or showing black mold spots, it's more than cosmetic. Damaged grout lets water seep behind tiles and into your subfloor and walls, leading to structural damage and hidden mold growth. If the damage is widespread, retiling is usually more cost-effective than patching.",
      "2. Outdated Fixtures and Layout — If your bathroom still has brass fixtures from the 1990s or a layout that makes no sense for how your family uses the space, an update will dramatically improve your daily routine. Start with faucets, showerhead, lighting, and hardware for the biggest visual impact.",
      "3. Poor Ventilation — If your mirror stays fogged for 20 minutes after a shower, or you notice moisture on walls and ceiling, your ventilation isn't doing its job. Poor ventilation leads to mold, peeling paint, and deterioration over time. A properly sized exhaust fan is one of those behind-the-scenes upgrades that protects everything else.",
      "4. Water Damage or Soft Spots — If your floor feels soft near the toilet or tub, or you notice water stains on the ceiling below a second-floor bathroom, water is going where it shouldn't. This doesn't get better on its own. A remodel lets you address the source, repair damage, and rebuild with proper waterproofing.",
      "5. You're Embarrassed When Guests Visit — This is actually the most common reason homeowners call us. If you find yourself apologizing for your bathroom, that's your gut telling you it's time. Sometimes a vanity swap, fresh paint, a new mirror, and updated lighting is all it takes.",
      "If any of these signs sound familiar, HomeStar Services & Contracting specializes in bathroom remodels across Hamilton County. Call us at (317) 279-4798 for a free estimate."
    ]},
  { slug:"kitchen-remodel-roi-indiana", title: "Kitchen Remodel ROI: What Actually Adds Value in Indiana", date: "Feb 4, 2026", read: "6 min", cat: "Kitchen", excerpt: "Not all upgrades are equal. We break down which kitchen improvements deliver the best return for Hamilton County homeowners.",
    body: [
      "You want your kitchen to look amazing — but you also want to know the money you're putting in is well spent. As contractors working in Hamilton County homes every week, we see firsthand which kitchen upgrades deliver real returns.",
      "Cabinet refacing or replacement consistently delivers one of the highest returns. If your boxes are solid, refacing with new doors and hardware gives you a new look at about 40% of the cost of full replacement. New semi-custom cabinets in a modern shaker style offer great value if the boxes are worn.",
      "Countertop upgrades make a dramatic visual difference. Quartz has become the go-to material in central Indiana — durable, low-maintenance, and available in enough styles to match any kitchen. Both quartz and granite signal quality to future buyers.",
      "Lighting is one of the most underrated kitchen upgrades. Replacing a dated fluorescent fixture with recessed lighting and under-cabinet LED strips transforms how the entire room feels — and it's relatively inexpensive compared to other kitchen work.",
      "Ultra-premium appliances like Sub-Zero and Wolf are incredible products, but in most Hamilton County homes you won't recoup the full cost at resale. Mid-range professional-style appliances from brands like KitchenAid or Samsung offer 90% of the look at a fraction of the price.",
      "Based on current market data for the Indianapolis metro area, a mid-range kitchen remodel typically recoups 60-75% of its cost at resale. A minor kitchen remodel with cosmetic updates can return 75-85%. You don't need an $80,000 gut job to add value.",
      "Start with what bothers you most about your current kitchen — layout, storage, or the look. Prioritizing your pain points ensures you spend where it matters most. We offer free in-home consultations across Hamilton County. Call (317) 279-4798."
    ]},
  { slug:"basement-finishing-best-investment", title: "Why Basement Finishing Is the Best Investment You'll Make This Year", date: "Jan 20, 2026", read: "4 min", cat: "Basement", excerpt: "Extra living space without moving? A finished basement adds square footage, comfort, and serious resale value to your home.",
    body: [
      "If you're running out of room in your home but don't want to move, look down. Your unfinished basement is probably the most underutilized space in your house — and finishing it is one of the smartest investments a Hamilton County homeowner can make.",
      "A finished basement adds usable square footage to your home without the cost or complexity of a home addition. You already own the space and the foundation is already built. The cost per square foot to finish a basement is significantly less than building out or up.",
      "The most popular basement uses we see in Hamilton County homes include family entertainment areas with media setups, guest suites with a bedroom and bathroom, home offices for remote workers, kids' play areas, and home gyms. Many homeowners combine two or three of these into one project.",
      "From a resale perspective, a finished basement can recoup 70-80% of its cost while making your home significantly more attractive to buyers. In competitive markets like Carmel, Fishers, and Westfield, a finished basement can be the differentiator that gets your home sold faster.",
      "Common concerns include moisture and waterproofing — which we address with proper drainage, vapor barriers, and the right materials. Ceiling height is another factor; most Hamilton County homes built in the last 20-30 years have adequate ceiling height for a comfortable finished space.",
      "Ready to put that empty space to work? HomeStar handles basement finishes from design through final inspection. Call (317) 279-4798 for a free estimate."
    ]},
  { slug:"deck-season-outdoor-living-planning", title: "Deck Season Is Coming: How to Plan Your Outdoor Living Space", date: "Jan 8, 2026", read: "3 min", cat: "Outdoor", excerpt: "Spring is the perfect time to start planning your dream deck. Here's how to choose materials, layout, and features that last.",
    body: [
      "Indiana winters are long, but spring arrives fast — and when it does, you'll want an outdoor space that's ready for it. If you're thinking about adding or replacing a deck, now is the time to start planning so construction can begin as soon as weather allows.",
      "The biggest decision is material. Pressure-treated wood is the most affordable option and looks great when new, but requires annual maintenance — staining, sealing, and eventually replacing boards as they weather. Composite decking from brands like Trex or TimberTech costs more upfront but requires virtually no maintenance and lasts 25-30 years.",
      "For Hamilton County homeowners who want to enjoy their deck rather than maintain it, composite is usually the better long-term investment. The math works out over time when you factor in the cost of annual staining and board replacements with wood.",
      "Layout matters more than most people realize. Think about how you'll actually use the space — dining, lounging, grilling, entertaining. A well-designed deck has distinct zones for different activities and flows naturally from your home's interior. Consider built-in seating, pergolas for shade, and landscape lighting for evening use.",
      "Permits are required for deck construction in most Hamilton County municipalities. We handle the entire permitting process and ensure everything meets current building codes. A properly permitted deck protects your investment and avoids issues when you sell your home.",
      "Start planning now and you'll be hosting cookouts by Memorial Day. Call HomeStar at (317) 279-4798 or visit thehomestarservice.com to request a free estimate."
    ]},
  { slug:"bathroom-remodel-cost-hamilton-county", title: "How Much Does a Bathroom Remodel Cost in Hamilton County, Indiana?", date: "Mar 29, 2026", read: "8 min", cat: "Bathroom", excerpt: "From basic refreshes to full spa-level renovations, here's what bathroom remodels actually cost in Fishers, Carmel, Noblesville, and surrounding areas — with real numbers from local projects.",
    body: [
      "If you're a homeowner in Hamilton County thinking about remodeling your bathroom, the first question on your mind is probably: how much is this going to cost? It's a fair question — and unfortunately, the answer you'll find online is usually a vague national average that has nothing to do with what you'll actually pay in Fishers, Carmel, Noblesville, or Westfield.",
      "We're going to break it down honestly based on what we see every day as a local remodeling company working in Hamilton County homes. No vague ranges, no bait-and-switch. Just real numbers for real projects.",
      "A basic bathroom refresh — new vanity, faucet, mirror, light fixture, fresh paint, and maybe new flooring — typically runs $8,000 to $12,000 in the Fishers and Carmel area. This level of update is great if the layout works fine and the bones are solid, but the finishes are dated. You're not moving plumbing or changing the footprint, which keeps costs down.",
      "A mid-range bathroom remodel is where most Hamilton County homeowners land. This typically runs $15,000 to $30,000 and includes a full gut of the space — new tile (floor and shower), new vanity and countertop, new fixtures, improved lighting, fresh paint, and often a new shower configuration. At this level, you're likely moving some plumbing and upgrading the exhaust fan.",
      "What separates a $15,000 remodel from a $30,000 remodel at this tier? Tile is the biggest variable. A standard subway tile shower runs significantly less than a floor-to-ceiling large-format tile installation. The scope of plumbing changes also matters — relocating a shower valve or adding a new drain line costs more than replacing fixtures in place.",
      "A high-end or spa-level bathroom remodel in Hamilton County typically runs $30,000 to $50,000+. This includes premium finishes throughout — custom tile work, frameless glass shower enclosures, freestanding soaking tubs, heated floors, dual vanities with quartz or marble countertops, custom lighting, and often a complete reconfiguration of the layout.",
      "At HomeStar, every bathroom remodel at every price point uses the complete Schluter waterproofing system — Ditra for floors, Kerdi for walls, and Schluter shower pans. This system is 100% waterproof and backed by a 25-year manufacturer's warranty. This is not an optional upgrade; it's our standard. Most contractors in Hamilton County use standard cement board, which absorbs moisture over time and leads to tile failure.",
      "Here's something most contractors won't tell you: the quality of what goes under your tile matters more than the tile itself. We've seen $25,000 remodels fail within three years because the substrate wasn't properly waterproofed. And we've seen $15,000 remodels still look perfect after a decade because the waterproofing was done right.",
      "Labor costs in Hamilton County are influenced by the fact that licensed tradespeople are in high demand. At HomeStar, all plumbing is done by licensed plumbers and all electrical by licensed electricians. This costs more than a company that has a general handyman doing everything, but it means the work is done correctly and to code — and it passes inspection the first time.",
      "Beyond the remodel itself, there are a few costs homeowners sometimes overlook. Permit fees in Fishers, Carmel, and Noblesville typically run $100 to $300. If your home is older and the project reveals issues like outdated wiring, galvanized plumbing, or water damage in the subfloor, remediation adds cost. We always flag these during our initial walkthrough so you're not surprised.",
      "Our advice to Hamilton County homeowners: start with what bothers you most about your current bathroom. Is it the shower? The vanity? The layout? Prioritizing your biggest pain point ensures your budget goes where it matters most. You don't need to do everything at once — a well-planned phase-one remodel can transform your daily experience while staying on budget.",
      "Ready to get a real number for your bathroom? Call HomeStar at (317) 279-4798 or request a free estimate at thehomestarservice.com. We'll visit your home, walk the space with you, and provide a detailed, itemized estimate — no pressure, no vague ranges, just honest numbers."
    ]},
  { slug:"schluter-vs-cement-board-waterproofing", title: "Schluter vs Cement Board: The Complete Waterproofing Comparison for Indiana Homeowners", date: "Apr 10, 2026", read: "10 min", cat: "Bathroom", excerpt: "The material behind your tile determines whether your bathroom lasts 5 years or 25. Here's a detailed, side-by-side comparison of the Schluter waterproofing system versus standard cement board — based on real-world performance in Hamilton County homes.",
    body: [
      "If you're planning a bathroom remodel in Hamilton County, Indiana, the most important decision you'll make isn't about tile, fixtures, or paint color. It's about what goes behind your tile — the waterproofing substrate. This choice determines whether your bathroom looks perfect in 10 years or fails in 3.",
      "The two most common options are standard cement board (brands like HardieBacker and Durock) and the Schluter waterproofing system (Kerdi membrane for walls, Ditra for floors). Most contractors in central Indiana default to cement board because it's cheaper and faster. At HomeStar, we exclusively use the complete Schluter system on every bathroom project. Here's why.",
      "Cement board is water-resistant, not waterproof. This is the critical distinction that most homeowners don't know. Cement board can withstand moisture without deteriorating like drywall, but it is not a moisture barrier. Water passes through cement board and reaches the framing behind it. Over time — typically 3 to 7 years in a daily-use shower — this moisture causes mold growth in the wall cavity, wood rot in the framing, and eventual tile failure as the substrate degrades.",
      "The Schluter Kerdi membrane is 100% waterproof. Zero moisture passes through it. The membrane is applied directly over the substrate and creates a completely sealed envelope around every surface that contacts water. Your framing stays bone dry for the life of the installation. This isn't water-resistant — it's waterproof, and the difference matters enormously over a 10, 15, or 25-year timeframe.",
      "Cement board is rigid. Houses move — they settle, expand with heat, contract with cold, and respond to humidity changes. Indiana homes experience significant seasonal movement due to our freeze-thaw cycles. When a rigid cement board substrate can't flex with this movement, stress transfers directly to the tile and grout above it. The result: cracked grout lines, loose tiles, and eventual failure. The Schluter Ditra membrane acts as an uncoupling layer between the tile and substrate. It absorbs structural movement instead of transferring it to the tile. This prevents cracked grout and loose tiles even in homes with significant seasonal movement.",
      "Here's a direct comparison. Waterproofing: Cement board is water-resistant only with seams that can leak, while Schluter is 100% waterproof with fully sealed seams. Movement absorption: Cement board has none — stress transfers to tile, while Schluter's uncoupling membrane absorbs structural movement. Manufacturer warranty: Cement board has no waterproofing warranty, while Schluter offers a 25-year manufacturer's warranty when installed by a certified installer. Mold risk: Cement board allows moisture into wall cavities creating mold conditions, while Schluter blocks all moisture from reaching framing. Lifespan: Cement board installations typically show problems at 3-7 years, while Schluter installations maintain integrity for 25+ years. Cost: Cement board materials cost roughly $1.50-$2.50 per square foot, while Schluter materials cost roughly $4-$6 per square foot.",
      "Yes, Schluter costs more upfront — roughly $1,500 to $3,000 more on a typical Hamilton County bathroom remodel. But consider the math. A $20,000 bathroom remodel that fails in 5 years because of inadequate waterproofing costs you $4,000 per year of use — plus the cost of tearing it out and redoing it. A $22,000 remodel with Schluter that lasts 25+ years costs you $880 per year. The more expensive option is actually the dramatically cheaper option over any reasonable timeframe.",
      "Not all Schluter installations are equal. The warranty only applies when the system is installed by a Schluter Pro Certified installer. If a contractor tells you they 'use Schluter products' but can't show you their certification, the 25-year warranty may not apply. Always ask to see the certification before signing a contract.",
      "At HomeStar Services & Contracting, every tile installer on our team is Schluter Pro Certified. This means our installation technique has been verified by the manufacturer, and every bathroom we build qualifies for the full 25-year warranty. We don't offer Schluter as an upgrade or add-on — it's our standard on every bathroom, at every price point.",
      "Beyond waterproofing, the quality of your bathroom remodel depends on who does the plumbing and electrical work. At HomeStar, all plumbing is performed by licensed plumbers and all electrical by licensed electricians. Many contractors use general laborers for these tasks to save money. The difference shows up during inspection — and more importantly, in the safety and longevity of the work.",
      "If you're comparing bathroom remodeling quotes in Hamilton County, ask every contractor three questions: What waterproofing system do you use? Are your installers certified by the manufacturer? Are your plumbers and electricians individually licensed? The answers will tell you everything about the quality you'll receive.",
      "Ready to learn more? Call HomeStar at (317) 279-4798 or request a free estimate at thehomestarservice.com. We serve Fishers, Carmel, Noblesville, Westfield, Zionsville, Fortville, McCordsville, and surrounding Hamilton County communities."
    ]},
  { slug:"bathroom-remodel-timeline-week-by-week", title: "The Complete Bathroom Remodel Timeline: What to Expect Week by Week in Hamilton County", date: "Apr 12, 2026", read: "9 min", cat: "Bathroom", excerpt: "Wondering how long a bathroom remodel actually takes? Here's a detailed, week-by-week breakdown of what happens during a typical bathroom renovation in Fishers, Carmel, Noblesville, and Hamilton County — from demo day through final walkthrough.",
    body: [
      "One of the most common questions we hear from Hamilton County homeowners is: how long will my bathroom remodel take? The honest answer depends on scope, but we can give you a detailed week-by-week timeline based on what we see on every project we complete in Fishers, Carmel, Noblesville, Westfield, and Zionsville.",
      "A mid-range bathroom remodel — full gut, new tile shower, new vanity, new fixtures, new lighting — typically takes 3 to 4 weeks from demolition to final walkthrough. Here's exactly what happens each week and why each phase matters.",
      "Before construction starts, there's typically 2 to 4 weeks of pre-construction planning. This includes the initial consultation and space walkthrough, 3D design renderings for your review and approval, material selection (tile, vanity, fixtures, hardware), detailed estimate and contract signing, material ordering (some specialty tiles and vanities have 2-3 week lead times), and permit application with the local building department. Pro tip: start this process 4-6 weeks before you want construction to begin. Material lead times are the most common cause of delays — not the construction itself.",
      "Week 1 is demolition and rough-in. Days 1-2 are protection and demolition. We protect floors, hallways, and adjacent rooms with plastic sheeting and drop cloths. The existing bathroom is stripped — tile, vanity, fixtures, drywall, and flooring are removed. This is the loudest, messiest phase, but it's also the fastest. Most demo is complete in 1-2 days. Days 3-4 are inspection and rough-in. Once the walls and floor are exposed, we inspect the framing, subfloor, and existing plumbing and electrical. This is where we discover any hidden issues — water damage, outdated wiring, galvanized pipes, or insufficient subfloor. If issues are found, we address them now. Licensed plumbers rough in new water supply lines, drain positions, and shower valve placement. Licensed electricians run new circuits for lighting, exhaust fan, and outlets. Day 5 is the rough-in inspection with the local building department.",
      "Week 2 is waterproofing and tile. Days 6-7 involve installing the complete Schluter waterproofing system. Ditra uncoupling membrane goes on the floor. Kerdi waterproof membrane goes on every wall surface that will receive tile. The Schluter shower pan is installed. All seams are sealed with Kerdi-Band. This system creates a 100% waterproof envelope around the entire wet area. Days 8-11 are tile installation — typically the longest single phase. Floor tile is set first, followed by shower floor, shower walls, and any accent walls. Grout is applied and sealed. A standard subway tile shower can be tiled in 2-3 days. A complex floor-to-ceiling large-format tile installation with multiple patterns may take 4-5 days. This is where craftsmanship matters most, and it's not a phase you want rushed.",
      "Week 3 is finishing. Days 12-14 are fixture and vanity installation. The vanity, countertop, sink, and faucet are installed. The toilet is set. Shower fixtures — showerhead, handle, and glass enclosure or door — go in. Towel bars, toilet paper holder, and accessories are mounted. Days 14-16 cover electrical finishing and paint. Light fixtures, exhaust fan, outlets, and switches are installed by our licensed electrician. Walls and ceiling are painted (typically 2 coats). Any trim or baseboard work is completed.",
      "Week 3-4 is final details and walkthrough. Days 16-18 handle final connections, mirror installation, hardware adjustment, caulking, and deep cleaning of the entire space. Day 18-19 is the final inspection with the building department. Day 19-20 is your walkthrough with our team. We go through every detail together. If anything needs adjustment, we handle it on the spot.",
      "Common causes of delays in Hamilton County bathroom remodels include material lead times (ordering specialty tile 2-3 weeks out), hidden water damage discovered during demo (adds 2-3 days for remediation), permit inspection scheduling (varies by municipality — Fishers and Carmel are typically faster than Noblesville), and weather affecting material delivery in winter months. At HomeStar, we mitigate most delays through thorough pre-construction planning — ordering materials early, conducting detailed initial assessments, and building buffer time into our timelines.",
      "Here's how the timeline scales for different project scopes. A basic refresh with new vanity, fixtures, paint, and flooring typically takes 1 to 1.5 weeks. A mid-range remodel with full gut, tile shower, new everything takes 3 to 4 weeks. A spa-level renovation with layout changes, freestanding tub, heated floors, and custom everything takes 4 to 5 weeks. A Jack & Jill or multi-bathroom project typically takes 4 to 6 weeks total, since some work can overlap between bathrooms.",
      "Your daily life during the remodel: the bathroom will be completely unusable from day 1 of demo through the end of the project. If it's your only bathroom, plan to use a gym membership, a neighbor's kindness, or a temporary solution. If it's a secondary bathroom, the rest of your home functions normally — we contain dust and debris to the work area.",
      "What makes HomeStar's timeline reliable: we don't start a project until all materials are on-site or confirmed for delivery. We use our own crews — not subcontractors we've never worked with. All plumbing is by our licensed plumbers and all electrical by our licensed electricians, so there's no waiting on third-party scheduling. We communicate daily — you always know what happened today and what's happening tomorrow.",
      "Ready to plan your bathroom remodel timeline? Call HomeStar at (317) 279-4798 or request a free estimate at thehomestarservice.com. We serve Fishers, Carmel, Noblesville, Westfield, Zionsville, Fortville, McCordsville, and all of Hamilton County."
    ]},
  { slug:"how-to-choose-remodeling-contractor-indiana", title: "How to Choose a Remodeling Contractor in Indiana: 12 Questions You Must Ask Before Signing", date: "Apr 14, 2026", read: "11 min", cat: "General", excerpt: "Hiring the wrong contractor is the most expensive mistake a homeowner can make. Here are 12 specific questions to ask any remodeling contractor in Hamilton County before you sign a contract — and what their answers reveal about the quality you'll receive.",
    body: [
      "Choosing a remodeling contractor is one of the highest-stakes decisions a homeowner can make. A great contractor transforms your home and your daily life. A bad one can cost you tens of thousands of dollars, months of your time, and an enormous amount of stress. After completing dozens of remodeling projects across Hamilton County — in Fishers, Carmel, Noblesville, Westfield, Zionsville, and surrounding areas — we've seen what separates reliable contractors from the ones who leave homeowners frustrated.",
      "Here are 12 specific questions to ask every contractor you're considering, and exactly what to look for in their answers.",
      "Question 1: Are you licensed, bonded, and insured in Indiana? This is non-negotiable. Indiana requires contractors to carry general liability insurance and workers' compensation. Ask for their certificate of insurance and verify it's current. If a contractor can't produce this immediately, walk away. A contractor without proper insurance puts your home and your finances at risk if something goes wrong on the job.",
      "Question 2: Are your plumbers and electricians individually licensed? This is the question most homeowners don't think to ask — and it's one of the most important. Many general contractors use general laborers or handymen for plumbing and electrical work to save money. In Indiana, plumbing and electrical work should be performed by individually licensed tradespeople. Licensed professionals understand building codes, pull the right permits, and deliver work that passes inspection the first time. Ask for their license numbers.",
      "Question 3: What waterproofing system do you use for bathrooms? If the answer is 'cement board' or 'we use RedGard over cement board,' you're getting the industry minimum — a water-resistant system, not a waterproof one. Ask if they use the Schluter system (Kerdi for walls, Ditra for floors). Ask if their installers are Schluter Pro Certified. If they are, your project qualifies for a 25-year manufacturer's warranty. If they're not certified, the warranty may not apply even if they use Schluter products.",
      "Question 4: Can you provide a detailed, itemized written estimate? A professional contractor provides a line-by-line estimate that breaks out materials, labor, permits, and any allowances. Vague estimates like 'approximately $20,000-$30,000' are red flags. You should know exactly what's included, what's excluded, and what happens if changes are needed during the project. At HomeStar, our estimates detail every material, every fixture, and every phase of labor.",
      "Question 5: Do you handle permits and inspections? In Hamilton County, most remodeling projects involving structural, plumbing, or electrical changes require building permits. A professional contractor manages the entire permit process — application, scheduling inspections, and ensuring all work passes code. If a contractor suggests skipping permits to 'save money,' that's a serious red flag. Unpermitted work can create problems when you sell your home and may void your homeowners insurance.",
      "Question 6: What is your project timeline, and how do you handle delays? Get a specific timeline in writing — not a vague 'a few weeks.' Ask what the most common causes of delays are and how they handle them. A contractor who builds buffer time into their schedule and communicates proactively about any changes is far better than one who gives an optimistic timeline and then goes silent when things slip.",
      "Question 7: Who will be on-site doing the work? Some contractors operate with their own crews, while others subcontract most or all of the work. Neither is inherently bad, but you should know who's in your home. Ask: Will the same crew be here every day? How do you vet your subcontractors? Will I have a single point of contact? Consistency matters — a new crew every week means no one owns the quality of the overall project.",
      "Question 8: Can I see examples of completed projects similar to mine? Every contractor should have a portfolio of finished work — ideally with photos, descriptions, and the ability to speak to what was done and why. If they can't show you projects similar to yours, they may not have relevant experience. Look for projects in your area (Hamilton County), in your service category (bathroom, kitchen, basement), and at your approximate budget level.",
      "Question 9: Do you offer design services or 3D renderings? Being able to visualize your project before construction begins prevents costly change orders and ensures you're happy with the result. Ask if the contractor provides design concepts, material samples, or 3D renderings. Not all contractors offer this, but the ones who do tend to deliver results more closely aligned with the homeowner's vision.",
      "Question 10: What warranty do you offer on your workmanship? A contractor who stands behind their work offers a written workmanship warranty — typically 1 to 2 years. This means if something isn't right after the project is complete, they come back and fix it at no cost. Ask for the warranty terms in writing. If a contractor won't guarantee their work, that tells you something about their confidence in it.",
      "Question 11: How do you communicate during the project? Communication is the number one source of frustration in remodeling projects. Ask: How will I receive updates? How quickly do you return calls or texts? Will I know what's happening each day? The best contractors communicate proactively — you shouldn't have to chase them for information about work happening in your own home.",
      "Question 12: Can I speak with recent clients as references? Any contractor worth hiring can connect you with 2-3 recent clients who had projects similar to yours. When you call those references, ask: Was the project completed on time and on budget? How was communication? Were there any surprises? Would you hire them again? Online reviews on Google, Houzz, and the BBB also give you a picture of consistent quality over time.",
      "At HomeStar Services & Contracting, we welcome every one of these questions. We're licensed, bonded, and insured. Our plumbers and electricians are individually licensed. We're Schluter Pro Certified with a 25-year waterproofing warranty. We provide detailed written estimates, handle all permits, offer 3D renderings, and communicate daily throughout every project. Every project includes our 1-year workmanship warranty.",
      "We also have 62+ Google reviews at a 5.0 rating, a detailed project gallery at thehomestarservice.com, and we're happy to connect you with recent Hamilton County clients. Call (317) 279-4798 for a free estimate in Fishers, Carmel, Noblesville, Westfield, Zionsville, Fortville, McCordsville, or anywhere in Hamilton County."
    ]},
  { slug:"hamilton-county-remodeling-trends-2026", title: "2026 Home Remodeling Trends in Hamilton County: What Indiana Homeowners Are Choosing", date: "Apr 15, 2026", read: "8 min", cat: "General", excerpt: "Based on real project data from Hamilton County homes, here are the remodeling trends driving decisions in Fishers, Carmel, Noblesville, and surrounding areas in 2026 — from materials and layouts to the upgrades delivering the best return on investment.",
    body: [
      "Every year, remodeling trends shift — and what homeowners in Hamilton County, Indiana are choosing in 2026 reflects a clear set of priorities: durability over flash, smart material choices over impulse upgrades, and investments that improve daily life rather than just resale value. Based on the projects we've completed across Fishers, Carmel, Noblesville, Westfield, and Zionsville, here's what's happening on the ground.",
      "Trend 1: Walk-in showers are replacing bathtubs. The most consistent trend we see in Hamilton County bathrooms is the conversion of tub/shower combos to walk-in showers. Homeowners in their 40s-60s — which represents the majority of remodeling clients in Carmel, Fishers, and Zionsville — are choosing spacious, curbless or low-curb walk-in showers over bathtubs. The reasons are practical: walk-in showers are easier to use, easier to clean, and age-in-place friendly. Freestanding soaking tubs are still popular in luxury remodels as a design feature, but the standard built-in tub is disappearing from master bathrooms across Hamilton County.",
      "Trend 2: Large-format tile is dominating bathroom design. The classic 3x6 subway tile isn't gone, but it's being overtaken by larger format tiles — 12x24, 24x24, and even 24x48 inch tiles for shower walls and floors. The advantage is fewer grout lines, which means a cleaner look and less maintenance. Large-format tile requires more precise installation — the substrate must be perfectly flat, and the installer needs experience with thin-set coverage on larger surfaces. This is one reason the Schluter system matters: the Ditra uncoupling membrane provides a perfectly flat, stable surface for large-format tile installation.",
      "Trend 3: Luxury vinyl plank is the floor of choice for basements and main levels. Hardwood is still the premium choice for main living areas, but luxury vinyl plank (LVP) has become the dominant flooring material in Hamilton County basements and is gaining ground on main levels too. Modern LVP is virtually indistinguishable from real hardwood, is 100% waterproof, and costs 30-50% less than hardwood installed. For basements — where moisture is always a concern — LVP is the clear winner. We're also seeing it chosen for kitchens and mudrooms where water exposure is common.",
      "Trend 4: Quartz has decisively won the countertop battle. In Hamilton County kitchens and bathrooms, quartz has overtaken granite as the countertop material of choice. Roughly 70% of our kitchen and bathroom countertop installations in 2025 were quartz, up from about 50% in 2023. The appeal is consistency (no natural variation to worry about), zero maintenance (no sealing required), and a wider range of colors and patterns than granite offers. Granite is still chosen for its natural beauty in higher-end remodels, but for most Hamilton County homeowners, quartz checks every box.",
      "Trend 5: Basement finishing is surging in newer construction. Hamilton County's building boom over the last 15 years means thousands of homes in Fishers, Westfield, and McCordsville have unfinished basements with 9-foot ceilings — perfect candidates for finishing. We're seeing more homeowners in the 3-7 year ownership range investing in basement finishes as an alternative to moving. The most popular basement configurations include a family entertainment area with a large TV wall, a guest suite with bedroom and full bathroom, and a home office or remote work space. Many homeowners combine two or three of these functions in a single project.",
      "Trend 6: Composite decking is replacing wood for new deck builds. The math has shifted decisively in favor of composite decking for Hamilton County homeowners. While pressure-treated wood costs less upfront, the annual maintenance costs — staining, sealing, board replacement — add up. Over 10 years, a composite deck typically costs the same or less than a maintained wood deck, with virtually zero upkeep. Brands like Trex and TimberTech offer products that look remarkably like real wood but last 25-30 years with no staining or sealing. Nearly all of our 2025-2026 deck builds in Fishers and Noblesville have been composite.",
      "Trend 7: Home offices are a permanent fixture, not a pandemic trend. We initially expected home office demand to fade as offices reopened. It hasn't. In fact, home office projects have increased in Hamilton County because the hybrid work model appears permanent. What's changed is the quality of the ask — homeowners aren't settling for a desk in the guest room anymore. They want dedicated spaces with proper lighting, sound isolation, built-in storage, and professional video call backgrounds. These are commonly included in basement finishing projects.",
      "Trend 8: Homeowners are prioritizing quality waterproofing over decorative upgrades. This may be the most significant shift we've observed. Hamilton County homeowners are increasingly educated about what goes behind the tile — and they're willing to invest in proper waterproofing over upgrading to fancier fixtures. When we explain the difference between cement board and the Schluter waterproofing system, the vast majority choose Schluter — even when it adds $1,500-$3,000 to the project cost. They understand that a $20,000 bathroom that fails in 5 years is more expensive than a $22,000 bathroom that lasts 25 years.",
      "What does this mean for Hamilton County homeowners planning a remodel in 2026? Focus on materials and systems over cosmetic upgrades. A well-waterproofed bathroom with quality tile will outlast a flashy bathroom with poor substrate work. Choose versatile, durable materials — quartz countertops, LVP flooring, composite decking — that perform well over decades, not just on installation day. Think about how you use your home today, not how it might look to a future buyer. The remodels that deliver the most satisfaction are the ones designed for the homeowner's actual lifestyle.",
      "At HomeStar Services & Contracting, we help Hamilton County homeowners make smart choices about materials, design, and scope. We're Schluter Pro Certified, use licensed plumbers and electricians on every project, and provide free in-home consultations with 3D design renderings. Call (317) 279-4798 or visit thehomestarservice.com for a free estimate. We serve Fishers, Carmel, Noblesville, Westfield, Zionsville, Fortville, McCordsville, and surrounding communities."
    ]},
  { slug:"quartz-vs-granite-countertops", title: "Quartz vs Granite Countertops: The Complete Hamilton County Homeowner's Guide", date: "Apr 17, 2026", read: "8 min", cat: "Kitchen", excerpt: "Choosing between quartz and granite for your kitchen or bathroom countertops? Here's a detailed comparison based on what we see in Hamilton County homes — cost, durability, maintenance, and which one delivers better long-term value.",
    body: [
      "If you're remodeling a kitchen or bathroom in Hamilton County, the countertop question comes up on every single project: quartz or granite? Both are premium materials. Both look beautiful. And both will last for years. But they're fundamentally different products with different strengths — and the right choice depends on how you live, what you value, and what matters most to you long-term.",
      "Granite is a natural stone quarried from the earth and cut into slabs. Every piece is unique — the veining, color variation, and movement in granite are completely natural and unrepeatable. Quartz countertops (brands like Cambria, Caesarstone, and Silestone) are engineered stone — roughly 90-95% ground natural quartz mixed with resins and pigments, then formed into slabs. The result is a consistent, controlled appearance.",
      "Here's the direct comparison that matters for Hamilton County homeowners. Appearance: Granite offers natural beauty with unique variation — no two slabs are identical. Quartz offers consistent color and pattern — what you see in the showroom is what you get. Durability: Both are extremely durable. Granite can chip or crack if hit hard enough. Quartz is slightly more flexible and resistant to impact. Heat resistance: Granite handles hot pots and pans well. Quartz can be damaged by direct high heat — always use trivets. Maintenance: Granite requires annual sealing to prevent staining. Quartz requires zero sealing — ever. Stain resistance: Sealed granite resists most stains but can absorb liquids if the seal wears. Quartz is non-porous and virtually stain-proof. Cost: In Hamilton County, both materials typically run $50-$120 per square foot installed, depending on the specific slab and edge profile.",
      "About 70% of our kitchen countertop installations in Hamilton County in 2025 were quartz, up from about 50% in 2023. The shift is driven by one thing: maintenance. Hamilton County homeowners — busy professionals, families with kids, people who use their kitchens daily — don't want to think about annual sealing schedules. Quartz gives them a premium look with zero ongoing maintenance.",
      "That said, granite is still chosen by homeowners who value natural beauty above all else. If you love the look of natural stone — the organic movement, the depth, the fact that your countertop is a one-of-a-kind piece of the earth — granite delivers something quartz simply cannot replicate. Many high-end Carmel and Zionsville kitchens still feature granite as a design centerpiece.",
      "Our recommendation for Hamilton County homeowners: if you want the lowest-maintenance premium countertop that will look exactly the same in 10 years as it does today, choose quartz. If you want a natural, unique surface and you're willing to seal it annually, choose granite. Both are excellent investments — neither is a wrong choice.",
      "At HomeStar, we install both quartz and granite countertops as part of our kitchen and bathroom remodeling services throughout Fishers, Carmel, Noblesville, Westfield, and Zionsville. Call (317) 279-4798 for a free consultation."
    ]},
  { slug:"composite-vs-wood-decking", title: "Composite vs Wood Decking: Cost Comparison for Indiana Homeowners", date: "Apr 18, 2026", read: "7 min", cat: "Outdoor", excerpt: "Thinking about a new deck? Here's a detailed cost comparison of composite vs pressure-treated wood decking for Indiana homeowners — including upfront cost, maintenance, lifespan, and the 10-year total cost of ownership.",
    body: [
      "When Hamilton County homeowners ask us about building a new deck, the first question is almost always: composite or wood? The answer used to be simple — wood was cheaper, composite was a luxury upgrade. But the math has changed significantly, and for most Indiana homeowners, composite decking is now the smarter financial decision over any reasonable timeframe.",
      "Pressure-treated wood decking costs roughly $15-$25 per square foot for materials, installed. Composite decking (brands like Trex, TimberTech, and Fiberon) costs roughly $30-$45 per square foot installed. On a typical 300-square-foot deck, that's roughly $4,500-$7,500 for wood versus $9,000-$13,500 for composite. Wood wins the upfront cost comparison by a wide margin.",
      "But here's where the math changes. A wood deck requires annual maintenance: power washing ($150-$300), staining or sealing ($300-$600 for materials and a weekend of your time, or $600-$1,200 to hire it out), and eventually board replacement as individual boards warp, crack, or rot ($200-$500 per repair). Over 10 years, annual maintenance on a wood deck adds $5,000-$15,000 to the total cost of ownership.",
      "A composite deck requires essentially zero maintenance. No staining. No sealing. No board replacement. An occasional wash with soap and water is all it needs. The 10-year maintenance cost is effectively $0. When you add the upfront cost plus 10 years of maintenance, a wood deck costs roughly $9,500-$22,500 total, while a composite deck costs roughly $9,000-$13,500 total. Composite wins the 10-year cost comparison — and the gap widens every year after.",
      "Lifespan is the other major factor. Pressure-treated wood decks typically last 10-15 years before needing significant repair or replacement, assuming consistent maintenance. Composite decks last 25-30+ years with manufacturer warranties to match. If you plan to stay in your home for more than 5-7 years, composite pays for itself.",
      "Indiana weather is particularly hard on wood decks. Our freeze-thaw cycles cause wood to expand and contract repeatedly, accelerating warping and cracking. Composite materials are engineered to handle these temperature swings without degradation. We've seen wood decks in Hamilton County need their first major repair within 3-4 years of installation when maintenance is skipped even one season.",
      "Nearly all of our 2025-2026 deck builds in Fishers and Hamilton County have been composite. The homeowners who choose composite consistently tell us the same thing: they want to enjoy their outdoor space, not maintain it. That's hard to argue with.",
      "Ready to plan your deck? HomeStar builds composite and wood decks throughout Hamilton County. Call (317) 279-4798 for a free estimate."
    ]},
  { slug:"lvp-vs-hardwood-flooring", title: "LVP vs Hardwood Flooring: Which Is Right for Your Indiana Home?", date: "Apr 19, 2026", read: "7 min", cat: "Flooring", excerpt: "Luxury vinyl plank has exploded in popularity — but is it really better than hardwood? Here's a detailed comparison for Hamilton County homeowners based on what we install in local homes every week.",
    body: [
      "Five years ago, recommending luxury vinyl plank (LVP) flooring to a Hamilton County homeowner would have been met with skepticism. Today, it's the most popular flooring material we install — and for good reason. Modern LVP is virtually indistinguishable from real hardwood, costs significantly less, and handles Indiana life (kids, dogs, wet boots, basement moisture) better than wood ever could.",
      "Hardwood flooring — oak, maple, hickory, walnut — remains the gold standard for warmth, character, and long-term home value. Nothing replicates the feel of real wood underfoot or the way hardwood ages with character over decades. In the luxury neighborhoods of Carmel, Zionsville, and Geist, hardwood is still the premium choice for main living areas where buyers expect real wood.",
      "Here's the comparison. Cost: Hardwood typically runs $8-$15 per square foot installed in Hamilton County. LVP runs $4-$8 per square foot installed. For a typical 1,000-square-foot main level, that's $8,000-$15,000 for hardwood versus $4,000-$8,000 for LVP — a 40-50% savings. Water resistance: Hardwood is damaged by standing water. LVP is 100% waterproof. This alone makes LVP the only choice for basements, bathrooms, laundry rooms, and entryways. Durability: Hardwood scratches and dents (especially softer species). LVP's wear layer resists scratches from pets, furniture, and kids. Refinishing: Hardwood can be sanded and refinished 3-5 times over its lifespan, extending it to 50-100 years. LVP cannot be refinished — when the wear layer is through, it's replaced. Lifespan: Hardwood lasts 50-100 years with refinishing. Quality LVP lasts 15-25 years. Feel underfoot: Hardwood has a natural warmth and slight give. LVP is slightly harder and cooler, though underlayment helps.",
      "For basements, LVP is the only sensible choice. Moisture is always a concern below grade, and even the best vapor barriers can't guarantee a completely dry environment long-term. We install LVP in virtually every basement finish project in Hamilton County — it looks like hardwood, handles moisture without damage, and gives homeowners decades of worry-free performance.",
      "For main living areas, it depends on the home and the homeowner. In luxury homes — $800K+ in Carmel, Zionsville, and Geist — real hardwood on the main level remains the standard. Buyers at this level expect it, and it's the right choice for long-term value. In homes under $600K, or for homeowners with young kids and pets, LVP on the main level delivers 90% of the look at 50% of the cost with dramatically better durability.",
      "Our recommendation: hardwood on the main level of luxury homes where long-term value matters, LVP everywhere else — basements, bathrooms, laundry rooms, and main levels where durability is the priority. Many Hamilton County homeowners are choosing a hybrid approach: hardwood in the living room and dining room, LVP in the kitchen, mudroom, and basement.",
      "HomeStar installs both hardwood and luxury vinyl plank throughout Hamilton County. Call (317) 279-4798 for a free consultation on the best flooring for your home."
    ]},
  { slug:"best-tile-bathroom-showers", title: "Best Tile for Bathroom Showers in Indiana: A Contractor's Honest Guide", date: "Apr 20, 2026", read: "8 min", cat: "Bathroom", excerpt: "Not all shower tile is created equal. After installing tile in hundreds of Hamilton County bathrooms, here's our honest assessment of which tile materials, sizes, and styles perform best in Indiana showers — and which ones to avoid.",
    body: [
      "Choosing tile for your shower is one of the most important decisions in a bathroom remodel — and one of the most overwhelming. Walk into any tile showroom in Indianapolis and you're facing hundreds of options. After installing tile in bathrooms across Hamilton County for years, here's what we've learned about which tile actually performs well in Indiana showers and which tile causes problems.",
      "Porcelain tile is the gold standard for shower walls and floors. It's dense, low-porosity, extremely durable, and available in virtually any color, size, or pattern. Porcelain absorbs less than 0.5% water, making it ideal for wet environments. Most of the shower tile we install in Hamilton County is porcelain — it performs flawlessly for decades when installed correctly on a proper waterproofing system.",
      "Ceramic tile is a step below porcelain in density and water resistance, but it's perfectly acceptable for shower walls (not floors). It costs 20-30% less than porcelain and comes in a huge range of styles. For budget-conscious bathroom remodels, ceramic tile on the walls with porcelain on the floor is a smart combination that saves money without sacrificing performance.",
      "Natural stone tile (marble, travertine, slate) is beautiful but requires more maintenance in a shower environment. Stone is porous and needs regular sealing — typically every 6-12 months in a shower. Marble is particularly susceptible to etching from acidic products (shampoo, body wash, cleaning solutions). If you choose natural stone for your shower, commit to the maintenance schedule or you'll see deterioration within a few years.",
      "Large-format tile — 12x24 inches and larger — has become the dominant choice in Hamilton County bathroom remodels. The advantages are significant: fewer grout lines means a cleaner look, easier maintenance, and less opportunity for mold and mildew to develop. Large-format tile requires a perfectly flat substrate for proper installation. This is one of the key reasons we use the Schluter Ditra system — it provides the flat, stable surface that large-format tile demands.",
      "The tile nobody talks about but should: your shower floor tile matters as much as your wall tile. Shower floor tile needs to be textured for slip resistance — smooth porcelain on a shower floor is a safety hazard. Small mosaic tiles (2x2 or 1x1 inch) are the traditional choice for shower floors because the many grout lines provide traction. Larger tiles can work on shower floors if they have adequate texture.",
      "What matters more than the tile itself is what's behind it. We've seen beautiful tile installations fail within 3-5 years because the waterproofing was inadequate. Standard cement board absorbs moisture over time, leading to mold, rot, and tile failure. The Schluter waterproofing system — Kerdi on walls, Ditra on floors — creates a 100% waterproof barrier that protects your investment for 25+ years. We install Schluter on every shower, with every tile type, at every price point.",
      "Our tile recommendations for Hamilton County homeowners: For most budgets, large-format porcelain tile (12x24 or larger) on walls with small mosaic porcelain on the shower floor. For luxury remodels, consider porcelain that mimics natural stone (you get the look without the maintenance). For budget remodels, ceramic on walls with porcelain on the floor. And regardless of tile choice, insist on the Schluter waterproofing system — it's the foundation everything else depends on.",
      "Ready to choose tile for your bathroom remodel? HomeStar provides 3D design renderings so you can see exactly how your tile selection will look before we set a single piece. Call (317) 279-4798 for a free consultation."
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
  { q: "What areas do you serve?", a: "We work throughout Hamilton County and surrounding communities — including Carmel, Fishers, Geist, Noblesville, Westfield, Zionsville, Brownsburg, Pendleton, McCordsville, and Fortville." },
];

const AREAS = ["Carmel", "Fishers", "Geist", "Noblesville", "Zionsville", "Brownsburg", "Pendleton", "McCordsville", "Fortville", "Westfield"];

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
function Nav({isCity}){
  const[open,setOpen]=useState(false);
  const[sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  const p=isCity?"/":"";
  const links=[{l:"Services",h:p+"#services"},{l:"Why HomeStar",h:p+"#difference"},{l:"Our Process",h:p+"#process"},{l:"Projects",h:p+"#projects"},{l:"Videos",h:p+"#videos"},{l:"Blog",h:p+"#blog"},{l:"Service Areas",h:p+"#areas"},{l:"Contact",h:p+"#contact"}];

  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:sc?"rgba(27,42,74,.97)":"transparent",backdropFilter:sc?"blur(14px)":"none",transition:"all .35s",borderBottom:sc?"1px solid rgba(255,255,255,.06)":"none"}}>
      {/* Top bar */}
      <div style={{background:sc?"transparent":C.navyDark,transition:"background .35s",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",height:sc?0:36,overflow:"hidden",transition:"height .3s"}}>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <a href="tel:+13172794798" style={{color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>{I.phone} (317) 279-4798</a>
            <span style={{color:"rgba(255,255,255,.3)",fontSize:12}}>Serving Hamilton County, IN</span>
          </div>
          <a href={isCity?"#city-estimate":"#estimate"} style={{color:C.green,fontSize:12,fontWeight:700,textDecoration:"none",letterSpacing:".04em"}}>REQUEST A FREE ESTIMATE</a>
        </div>
      </div>
      {/* Main bar */}
      <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:sc?64:72,transition:"height .3s"}}>
        <a href={isCity?"/":"#hero"} style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <img src="/images/logo-mascot.png" alt="HomeStar Services mascot" style={{width:40,height:40,objectFit:"contain"}} />
          <div>
            <div className="display" style={{color:"#fff",fontSize:17,fontWeight:800,letterSpacing:".02em",lineHeight:1.1}}>HOMESTAR</div>
            <div style={{color:C.green,fontSize:9,fontWeight:700,letterSpacing:".11em",lineHeight:1}}>SERVICES & CONTRACTING</div>
          </div>
        </a>
        <div className="desk" style={{display:"flex",alignItems:"center",gap:26}}>
          {links.map(l=><a key={l.h} href={l.h} style={{color:"rgba(255,255,255,.75)",textDecoration:"none",fontSize:13,fontWeight:600,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.75)"}>{l.l}</a>)}
          <a href={isCity?"#city-estimate":"#estimate"} className="btn-g" style={{padding:"9px 20px",fontSize:13}}>Free Estimate</a>
        </div>
        <button className="mob-btn" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center"}}>{open?I.close:I.menu}</button>
      </div>
      {open&&<div className="mob-menu" style={{background:C.navyDark,padding:"16px 24px 28px",display:"flex",flexDirection:"column",gap:14}}>
        {links.map(l=><a key={l.h} href={l.h} onClick={()=>setOpen(false)} style={{color:"#fff",textDecoration:"none",fontSize:15,fontWeight:600,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>{l.l}</a>)}
        <a href={isCity?"#city-estimate":"#estimate"} className="btn-g" style={{textAlign:"center",marginTop:8}}>Get a Free Estimate</a>
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
              <a href="#estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
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
              <a href={s.href} style={{marginTop:16,color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}>{s.href.startsWith("/")?"Learn More":"View Our Work"} {I.arrow}</a>
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
          <a href="#estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
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
          <a href="#estimate" className="btn-g">Start Your Project {I.arrow}</a>
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
function YouTubeFacade({id,title}){
  const[play,setPlay]=useState(false);
  return(
    <div style={{position:"relative",width:"100%",paddingTop:"177.78%",background:C.navyDark}}>
      {play?(
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title}
          style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ):(
        <button onClick={()=>setPlay(true)} aria-label={`Play ${title}`}
          style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none",cursor:"pointer",background:"none",padding:0}}>
          <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={title}
            loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.25)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .3s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.25)"}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
              {I.play}
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

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
              <YouTubeFacade id={v.id} title={v.title}/>
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
            <a key={b.slug} href={`/blog/${b.slug}`} className={vis?`fu d${i+1}`:""} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,transition:"all .3s",cursor:"pointer",textDecoration:"none",display:"block"}}
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
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Blog Post Page (full indexable page) ────────── */
function BlogPostPage({post}){
  useCanonical("blog/"+post.slug);

  useEffect(()=>{
    document.title=post.title+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",post.excerpt);
  },[post]);

  /* Find related posts (same category, different post) */
  const related=BLOG.filter(b=>b.cat===post.cat&&b.slug!==post.slug).slice(0,2);

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:"Blog",url:"/#blog"},{name:post.title}]}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting",headline:post.title,description:post.excerpt,datePublished:post.date,author:{"@type":"Person",name:BLOG.findIndex(b=>b.slug===post.slug)%2===1?"Robb Rice":"Eric Farr",url:"https://www.thehomestarservice.com/about/"+(BLOG.findIndex(b=>b.slug===post.slug)%2===1?"robb-rice":"eric-farr")},publisher:{"@type":"Organization",name:"HomeStar Services & Contracting",url:"https://www.thehomestarservice.com"}})}}/>

      <Nav isCity/>

      <section style={{position:"relative",padding:"160px 24px 60px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`}}>
        <div style={{maxWidth:720,margin:"0 auto",position:"relative",zIndex:2}}>
          <div className="fu d1" style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase",background:C.greenMuted,padding:"4px 12px",borderRadius:50}}>{post.cat}</span>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"rgba(255,255,255,.5)"}}>{I.clock} {post.read}</span>
            <span style={{color:"rgba(255,255,255,.4)",fontSize:12}}>• {post.date}</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(28px,4.5vw,42px)",lineHeight:1.2,marginBottom:16}}>{post.title}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.5)",fontSize:16,lineHeight:1.7}}>{post.excerpt}</p>
        </div>
      </section>

      <section className="sec" style={{background:"#fff"}}>
        <div style={{maxWidth:720,margin:"0 auto",padding:"0 24px"}}>
          {post.body&&post.body.map((p,i)=>
            <p key={i} style={{color:C.grayDark,fontSize:16,lineHeight:1.9,marginBottom:20}}>{p}</p>
          )}

          {/* Author Attribution */}
          {(()=>{
            const idx=BLOG.findIndex(b=>b.slug===post.slug);
            const isRobb=idx%2===1;
            const authorName=isRobb?"Robb Rice":"Eric Farr";
            const authorSlug=isRobb?"robb-rice":"eric-farr";
            const authorInitials=isRobb?"RR":"EF";
            return(
              <div style={{display:"flex",alignItems:"center",gap:16,padding:"20px 24px",background:C.cream,borderRadius:12,marginTop:32,marginBottom:8}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0}}>{authorInitials}</div>
                <div>
                  <a href={`/about/${authorSlug}`} style={{color:C.navy,fontWeight:700,fontSize:14,textDecoration:"none"}}>{authorName}</a>
                  <div style={{color:C.gray,fontSize:12}}>Co-Founder, HomeStar Services & Contracting · Schluter Pro Certified</div>
                </div>
              </div>
            );
          })()}

          <div style={{marginTop:32,padding:"28px 32px",background:C.cream,borderRadius:14,textAlign:"center"}}>
            <p className="display" style={{color:C.navy,fontSize:18,marginBottom:12}}>Ready to start your project?</p>
            <a href="/#estimate" className="btn-g">Get a Free Estimate {I.arrow}</a>
          </div>

          {related.length>0&&(
            <div style={{marginTop:48}}>
              <h3 style={{color:C.navy,fontWeight:700,fontSize:17,marginBottom:20}}>Related Articles</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
                {related.map(r=>
                  <a key={r.slug} href={`/blog/${r.slug}`} style={{padding:"20px",borderRadius:12,border:`1px solid ${C.sand}`,textDecoration:"none",transition:"all .3s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase"}}>{r.cat}</span>
                    <h4 className="display" style={{color:C.navy,fontSize:15,marginTop:6,lineHeight:1.3}}>{r.title}</h4>
                  </a>
                )}
              </div>
            </div>
          )}

          <div style={{marginTop:32}}>
            <a href="/" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← Back to main site</a>
          </div>
        </div>
      </section>

      <Footer isCity/>
    </div>
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
    <section id="reviews" className="sec" style={{background:C.cream}} ref={ref}>
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

/* ─── Service Areas ────────────────────────────────── */
function ServiceAreas(){
  const[ref,vis]=useVis();
  const cities=[
    {name:"Fishers",slug:"home-remodeling-fishers-in",desc:"Geist, Saxony, Britton Falls & more",projects:"7+ projects completed"},
    {name:"Carmel",slug:"home-remodeling-carmel-in",desc:"West Clay, Arts District, City Center & more",projects:"Custom tile specialist"},
    {name:"Noblesville",slug:"home-remodeling-noblesville-in",desc:"Downtown, Morse Reservoir, Millstone & more",projects:"Floor-to-ceiling tile experts"},
    {name:"Westfield",slug:"home-remodeling-westfield-in",desc:"Grand Park, Chatham Hills, Bridgewater & more",projects:"Budget-friendly options"},
    {name:"Zionsville",slug:"home-remodeling-zionsville-in",desc:"Village, Holliday Farms, Traders Point & more",projects:"Premium renovations"},
    {name:"Fortville",slug:"home-remodeling-fortville-in",desc:"Downtown Fortville, Buck Creek area & more",projects:"Custom outdoor living"},
    {name:"McCordsville",slug:"home-remodeling-mccordsville-in",desc:"Geist area, Mt. Comfort corridor & more",projects:"Growing community"},
    {name:"Geist",slug:"home-remodeling-geist-in",desc:"Reservoir estates, Admirals Pointe & more",projects:"Luxury renovations"},
    {name:"Pendleton",slug:"home-remodeling-pendleton-in",desc:"Falls Park, Downtown & more",projects:"Serving east Hamilton County"},
  ];
  return(
    <section id="areas" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`,position:"relative",overflow:"hidden"}} ref={ref}>
      <div style={{position:"absolute",top:-60,left:-60,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.06) 0%,transparent 70%)"}}/>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Where We Work</div>
          <h2 className="ttl ttl-w">Serving Hamilton County & Beyond</h2>
          <p className="sub" style={{margin:"0 auto",color:"rgba(255,255,255,.45)"}}>Bathroom remodeling, kitchen renovation, and basement finishing across central Indiana's top communities.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {cities.map((c,i)=>
            <a key={c.name} href={`/${c.slug}`} className={vis?`fu d${i+1}`:""} style={{padding:"28px 22px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",textDecoration:"none",transition:"all .3s",display:"block"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(92,184,50,.35)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background="rgba(255,255,255,.06)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(255,255,255,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                {I.pin}
                <h3 className="display" style={{color:"#fff",fontSize:18}}>{c.name}, IN</h3>
              </div>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:12,lineHeight:1.6,marginBottom:12}}>{c.desc}</p>
              <span style={{color:C.green,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>View {c.name} Services {I.arrow}</span>
            </a>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <p style={{color:"rgba(255,255,255,.3)",fontSize:13}}>Also serving Brownsburg and surrounding communities.</p>
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
      <FaqSchema faqs={FAQS}/>
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
  useJobberForm();
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
              <p style={{color:"rgba(255,255,255,.25)",fontSize:10,lineHeight:1.6,marginTop:14,textAlign:"center"}}>
                By texting us, you agree to receive project reminders and updates from HomeStar Services & Contracting. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out at any time. View our <a href="/privacy-policy.html" style={{color:"rgba(255,255,255,.4)",textDecoration:"underline"}}>Privacy Policy</a> and <a href="/terms-and-conditions.html" style={{color:"rgba(255,255,255,.4)",textDecoration:"underline"}}>Terms & Conditions</a>.
              </p>
            </div>
            {/* Jobber form */}
            <div id="estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Request a Free Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
              <p style={{color:C.gray,fontSize:10,lineHeight:1.6,marginTop:14,textAlign:"center"}}>
                By submitting this form, you agree to receive project-related text messages from HomeStar Services & Contracting. Message frequency varies. Msg & data rates may apply. Reply <strong>STOP</strong> to opt out. Reply <strong>HELP</strong> for help. Consent is not a condition of service. View our <a href="/privacy-policy.html" style={{color:C.green,textDecoration:"underline",fontSize:10}}>Privacy Policy</a> and <a href="/terms-and-conditions.html" style={{color:C.green,textDecoration:"underline",fontSize:10}}>Terms & Conditions</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────── */
function Footer({isCity}){
  const p=isCity?"/":"";
  const companyLinks=[{l:"About Us",h:p+"#about"},{l:"Our Process",h:p+"#process"},{l:"Projects",h:p+"#projects"},{l:"Blog",h:p+"#blog"},{l:"Videos",h:p+"#videos"},{l:"Contact",h:p+"#contact"},{l:"Request Estimate",h:isCity?"#city-estimate":p+"#estimate"}];
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
            {SVC.map(s=><a key={s.title} href={s.href.startsWith("/")?s.href:p+"#services"} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{s.title}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Company</h4>
            {companyLinks.map(l=><a key={l.l} href={l.h} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{l.l}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Service Areas</h4>
            {[{name:"Fishers",slug:"home-remodeling-fishers-in"},{name:"Carmel",slug:"home-remodeling-carmel-in"},{name:"Noblesville",slug:"home-remodeling-noblesville-in"},{name:"Westfield",slug:"home-remodeling-westfield-in"},{name:"Zionsville",slug:"home-remodeling-zionsville-in"},{name:"Fortville",slug:"home-remodeling-fortville-in"},{name:"McCordsville",slug:"home-remodeling-mccordsville-in"},{name:"Geist",slug:"home-remodeling-geist-in"},{name:"Pendleton",slug:"home-remodeling-pendleton-in"}].map(a=><a key={a.name} href={`/${a.slug}`} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{a.name}, IN</a>)}
            {["Brownsburg"].map(a=><span key={a} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:9}}>{a}, IN</span>)}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <p style={{color:"rgba(255,255,255,.2)",fontSize:11}}>© 2026 HomeStar Services and Contracting, LLC. All rights reserved.</p>
          <div style={{display:"flex",gap:18}}>{[{l:"Privacy Policy",h:"/privacy-policy.html"},{l:"Terms & Conditions",h:"/terms-and-conditions.html"}].map(item=><a key={item.l} href={item.h} style={{color:"rgba(255,255,255,.2)",fontSize:11,textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.2)"}>{item.l}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ──────────────────────────────────────────── */
/* ─── Legal Page Modal ──────────────────────────────── */
function LegalModal({page,onClose}){
  if(!page)return null;

  const privacy = [
    {t:"Introduction",c:"HomeStar Services & Contracting, LLC (\"HomeStar,\" \"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at thehomestarservice.com or communicate with us via phone, text, email, or our online forms."},
    {t:"Information We Collect",c:"We may collect personal information you voluntarily provide, including: your name, phone number, email address, home address, and project details when you request a free estimate or contact us. We also automatically collect certain information when you visit our site, including IP address, browser type, pages visited, and time spent on pages through analytics tools."},
    {t:"How We Use Your Information",c:"We use the information we collect to: respond to your estimate requests and inquiries, communicate with you about your project, send project reminders and updates via text message (if you opt in), improve our website and services, and comply with legal obligations."},
    {t:"Text Messaging",c:"By texting HomeStar Services & Contracting at (317) 279-4798, you consent to receive project reminders and updates. Message frequency varies based on your project status. Message and data rates may apply. You may opt out at any time by replying STOP to any message. Reply HELP for assistance. Text messaging is not required to use our services."},
    {t:"Information Sharing",c:"We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business (such as our project management software, Jobber), provided they agree to keep your information confidential. We may also disclose information when required by law or to protect our rights."},
    {t:"Cookies and Analytics",c:"Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. We use Google Analytics and similar tools to understand how visitors interact with our site. You can control cookies through your browser settings."},
    {t:"Third-Party Services",c:"Our website may contain embedded content from third parties including Google Reviews (via Elfsight), YouTube videos, and Jobber forms. These services may collect information about you according to their own privacy policies, which we encourage you to review."},
    {t:"Data Security",c:"We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."},
    {t:"Your Rights",c:"You may request access to, correction of, or deletion of your personal information by contacting us at eric@thehomestarservice.com or (317) 279-4798. We will respond to your request within a reasonable timeframe."},
    {t:"Children's Privacy",c:"Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children."},
    {t:"Changes to This Policy",c:"We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after changes are posted constitutes your acceptance of the updated policy."},
    {t:"Contact Us",c:"If you have questions about this Privacy Policy, contact us at: HomeStar Services & Contracting, LLC, Fishers, Indiana, Phone: (317) 279-4798, Email: eric@thehomestarservice.com"},
  ];

  const terms = [
    {t:"Acceptance of Terms",c:"By accessing and using the website at thehomestarservice.com (the \"Site\"), operated by HomeStar Services & Contracting, LLC (\"HomeStar,\" \"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our Site."},
    {t:"Services Description",c:"HomeStar provides home remodeling and contracting services in Hamilton County, Indiana and surrounding areas, including but not limited to bathroom remodeling, kitchen remodeling, basement finishing, flooring, painting, and deck construction. All services are subject to a separate written contract between HomeStar and the client."},
    {t:"Free Estimates",c:"Estimates provided through our website, phone, or in-person consultations are non-binding and provided for informational purposes. Final project pricing is determined by a written contract that outlines the full scope of work, materials, timeline, and payment terms. Estimates are valid for 30 days unless otherwise stated."},
    {t:"Text Messaging Terms",c:"By initiating a text message to HomeStar at (317) 279-4798, you consent to receive text messages related to your project inquiry, including reminders and updates. Message frequency varies depending on project status and communication needs. Standard message and data rates may apply depending on your mobile carrier plan. You may opt out at any time by replying STOP. Reply HELP for assistance. Text messaging consent is not a condition of purchasing any service from HomeStar."},
    {t:"Intellectual Property",c:"All content on this Site, including text, images, graphics, logos, videos, and design elements, is the property of HomeStar Services & Contracting, LLC unless otherwise noted. Project photographs depict actual work completed by HomeStar. You may not reproduce, distribute, or use any content from this Site without our written permission."},
    {t:"User-Submitted Information",c:"By submitting information through our contact forms, estimate requests, or text messages, you represent that the information provided is accurate and that you are authorized to share it. You grant HomeStar permission to use this information to respond to your inquiry and provide services."},
    {t:"Third-Party Links and Services",c:"Our Site may contain links to or embedded content from third-party websites and services, including Google, YouTube, Elfsight, and Jobber. We are not responsible for the content, privacy practices, or terms of these third-party services. We encourage you to review their respective policies."},
    {t:"Warranty and Workmanship",c:"HomeStar provides a 1-year workmanship warranty on all completed projects. For bathroom remodeling projects using the Schluter System installed by our Schluter Pro Certified team, a 25-year manufacturer's warranty applies. Specific warranty terms are outlined in your individual project contract."},
    {t:"Limitation of Liability",c:"HomeStar Services & Contracting, LLC and its owners, employees, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this Site or reliance on any information provided herein. Our total liability for any claim related to the Site shall not exceed the amount you have paid to HomeStar in the preceding 12 months."},
    {t:"Indemnification",c:"You agree to indemnify and hold harmless HomeStar Services & Contracting, LLC, its owners, employees, and agents from any claims, damages, losses, or expenses arising from your use of this Site or violation of these Terms."},
    {t:"Governing Law",c:"These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of Indiana. Any disputes arising from these terms shall be resolved in the courts of Hamilton County, Indiana."},
    {t:"Changes to Terms",c:"We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Site after changes are posted constitutes acceptance of the updated terms."},
    {t:"Contact Us",c:"For questions about these Terms & Conditions, contact: HomeStar Services & Contracting, LLC, Fishers, Indiana, Phone: (317) 279-4798, Email: eric@thehomestarservice.com"},
  ];

  const content = page==="privacy" ? {title:"Privacy Policy",date:"March 11, 2026",sections:privacy} : {title:"Terms & Conditions",date:"March 11, 2026",sections:terms};

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"60px 20px",overflowY:"auto"}}
      onClick={onClose}>
      <div style={{background:"#fff",borderRadius:18,maxWidth:720,width:"100%",padding:"48px 40px",position:"relative",animation:"fu .4s ease-out"}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:18,right:18,width:36,height:36,borderRadius:"50%",background:C.cream,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.close}</button>
        <h2 className="display" style={{fontSize:28,color:C.navy,marginBottom:6}}>{content.title}</h2>
        <p style={{color:C.gray,fontSize:13,marginBottom:6}}>Effective Date: {content.date}</p>
        <p style={{color:C.gray,fontSize:13,marginBottom:28}}>HomeStar Services & Contracting, LLC — Fishers, Indiana</p>
        <div style={{height:4,width:60,background:C.green,borderRadius:2,marginBottom:28}}/>
        {content.sections.map((s,i)=>
          <div key={i} style={{marginBottom:22}}>
            <h3 style={{color:C.navy,fontSize:16,fontWeight:700,marginBottom:8}}>{s.t}</h3>
            <p style={{color:C.grayDark,fontSize:14,lineHeight:1.8}}>{s.c}</p>
          </div>
        )}
        <div style={{marginTop:32,padding:"20px 24px",background:C.cream,borderRadius:12}}>
          <p style={{color:C.gray,fontSize:13,lineHeight:1.7}}>Questions? Contact us at <strong style={{color:C.navy}}>eric@thehomestarservice.com</strong> or call <strong style={{color:C.navy}}>(317) 279-4798</strong>.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── City Pages ────────────────────────────────────── */
const CITIES = {
  "home-remodeling-fishers-in": {
    city: "Fishers", state: "IN", lat: 39.9568, lng: -86.0131,
    title: "Home Remodeling in Fishers, IN",
    metaDesc: "Licensed home remodeling contractor in Fishers, Indiana. Bathroom remodeling, basement finishing, kitchen renovations & more. Schluter Pro Certified. Free estimates. (317) 279-4798",
    heroHeading: "Trusted Home Remodeling in Fishers, Indiana",
    heroSub: "From Geist to Olio Road, we've been transforming Fishers homes with expert craftsmanship, honest pricing, and a 25-year Schluter waterproofing warranty.",
    neighborhoods: ["Hamilton Proper", "Geist Reservoir", "The Estates at Geist", "Admirals Pointe", "Saxon Woods", "Thorpe Creek", "Cambridge", "Canal Place", "Brooks School area", "Olio Road corridor"],
    intro: "Fishers is one of the fastest-growing communities in Indiana, and homeowners here expect quality that matches the standard of their neighborhoods. Whether you're in a newer Saxony build that needs personalization or an established Geist home ready for a full renovation, HomeStar Services & Contracting brings the same level of precision and care to every project.",
    whyUs: "As a family-owned company based right here in Hamilton County, we know Fishers homes inside and out. Our Schluter Pro Certified tile installers deliver bathroom renovations backed by a 25-year waterproofing warranty — something most contractors in the area simply can't offer. All plumbing and electrical work is performed by licensed professionals, and every project comes with a 1-year workmanship guarantee.",
    services: ["Bathroom Remodeling","Basement Finishing","Kitchen Remodeling","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["fishers-double-shower","fishers-spa-retreat","fishers-bath","fishers-childrens-bath","modern-farmhouse","fishers-basement"],
    faq: [
      {q:"Do I need a permit for a bathroom remodel in Fishers?",a:"It depends on the scope. If the project involves plumbing or electrical changes, a permit is typically required through the City of Fishers. We handle the entire permitting process for you and ensure all work passes inspection."},
      {q:"How long does a bathroom remodel take in Fishers?",a:"Most bathroom remodels in Fishers take 2-4 weeks depending on scope. A vanity refresh might take a week, while a full gut renovation with custom tile could take 3-4 weeks. We provide a detailed timeline before work begins."},
      {q:"What does a bathroom remodel cost in Fishers, IN?",a:"Costs vary by scope. A mid-range bathroom remodel in Fishers typically runs $15,000-$30,000. A basic refresh starts around $8,000, while luxury spa-level renovations can reach $40,000+. We provide free, detailed estimates."},
    ],
  },
  "home-remodeling-carmel-in": {
    city: "Carmel", state: "IN", lat: 39.9784, lng: -86.1180,
    title: "Home Remodeling in Carmel, IN",
    metaDesc: "Premium home remodeling contractor in Carmel, Indiana. Bathroom renovations, kitchen remodels, basement finishing. Schluter Pro Certified with 25-year warranty. Free estimates. (317) 279-4798",
    heroHeading: "Premium Home Remodeling in Carmel, Indiana",
    heroSub: "From the Arts & Design District to the Village of WestClay, Carmel homeowners trust HomeStar for bathroom renovations, kitchen remodels, and whole-home transformations.",
    neighborhoods: ["Laurelwood", "116th Street corridor", "Jackson's Grant", "Reserve at Springmill", "Laurel Lakes", "Village of WestClay", "Bridgewater Club", "Springmill", "Brookshire", "Smokey Ridge"],
    intro: "Carmel has been named one of the best places to live in America, and the homes here reflect that reputation. Whether you're updating a master bathroom in WestClay, finishing a basement in West Carmel, or renovating a kitchen near City Center, HomeStar delivers the quality craftsmanship that Carmel homeowners expect.",
    whyUs: "We've completed numerous projects across Carmel, including our signature green tile bathroom remodel that showcases the precision of our Schluter Pro Certified installers. Every bathroom we build uses the complete Schluter waterproofing system — Ditra for floors, Kerdi for walls — backed by a 25-year manufacturer's warranty. Combined with licensed plumbers and electricians on every job, you get a renovation built to last.",
    services: ["Bathroom Remodeling","Kitchen Remodeling","Basement Finishing","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["bathroom-green-tile"],
    faq: [
      {q:"Do I need a permit for remodeling in Carmel?",a:"Carmel requires permits for most remodeling projects that involve structural, plumbing, or electrical work. The City of Carmel Department of Community Services handles permits. We manage the entire process for you."},
      {q:"How much does a kitchen remodel cost in Carmel?",a:"A mid-range kitchen remodel in Carmel typically costs $25,000-$50,000 depending on scope. Minor updates start around $15,000, while high-end renovations with custom cabinetry can reach $75,000+. We provide free detailed estimates."},
      {q:"What sets HomeStar apart from other Carmel contractors?",a:"We're Schluter Pro Certified (25-year waterproofing warranty), use only licensed plumbers and electricians, provide 3D design renderings before construction, and you work directly with the owners throughout the project."},
    ],
  },
  "home-remodeling-noblesville-in": {
    city: "Noblesville", state: "IN", lat: 40.0456, lng: -86.0086,
    title: "Home Remodeling in Noblesville, IN",
    metaDesc: "Expert home remodeling in Noblesville, Indiana. Bathroom remodeling, basement finishing, kitchen renovations. Schluter Pro Certified. Licensed & insured. Free estimates. (317) 279-4798",
    heroHeading: "Expert Home Remodeling in Noblesville, Indiana",
    heroSub: "From the Historic Square to Morse Reservoir, Noblesville homeowners count on HomeStar for quality renovations backed by certified craftsmanship.",
    neighborhoods: ["Bear Slide / Golden Bear", "Morse Reservoir", "Finch Creek", "Prairie Lakes", "Hinkle Creek", "Federal Hill"],
    intro: "Noblesville blends small-town charm with modern growth, and the homes here range from historic downtown properties to newer developments around Morse Reservoir. Whether your home needs a complete bathroom overhaul or a basement finish to add living space, HomeStar understands the unique character of Noblesville homes and delivers renovations that respect that character while modernizing your space.",
    whyUs: "Our Noblesville projects include a stunning floor-to-ceiling tile bathroom remodel that demonstrates the quality our Schluter Pro Certified installers bring to every job. With the complete Schluter waterproofing system and a 25-year manufacturer's warranty, your investment is protected for decades. We also completed a laundry room remodel in Noblesville that shows how we maximize every square foot.",
    services: ["Bathroom Remodeling","Basement Finishing","Kitchen Remodeling","Laundry Room Remodeling","Flooring Services","Painting Services"],
    projects: ["noblesville-floor-to-ceiling-tile","noblesville-laundry"],
    faq: [
      {q:"Does Noblesville require building permits for remodeling?",a:"Yes. The City of Noblesville requires permits for projects involving structural changes, plumbing, or electrical work. Our team handles the permit application and all required inspections."},
      {q:"How long does a basement finish take in Noblesville?",a:"A standard basement finish in Noblesville typically takes 6-12 weeks depending on the scope — whether it includes a bathroom, wet bar, or guest suite. We provide a full project timeline upfront."},
      {q:"Do you serve areas around Morse Reservoir?",a:"Absolutely. We serve all of Noblesville including the Morse Reservoir area, downtown, Millstone, Federal Hill, and all surrounding neighborhoods."},
    ],
  },
  "home-remodeling-westfield-in": {
    city: "Westfield", state: "IN", lat: 40.0428, lng: -86.1275,
    title: "Home Remodeling in Westfield, IN",
    metaDesc: "Quality home remodeling contractor in Westfield, Indiana. Bathroom renovations, basement finishing, kitchen remodels. Licensed, insured & Schluter Pro Certified. (317) 279-4798",
    heroHeading: "Quality Home Remodeling in Westfield, Indiana",
    heroSub: "Grand Park families trust HomeStar for bathroom remodels, basement finishes, and home renovations built with quality materials and honest pricing.",
    neighborhoods: ["Chatham Hills", "Centennial", "Bridgewater", "Harmony", "Grand Park area"],
    intro: "Westfield is booming — and with all that growth comes homeowners looking to make their spaces truly their own. Whether you bought a new build near Grand Park that needs a basement finish, or you're renovating bathrooms in an established neighborhood like Chatham Hills, HomeStar brings the same certified craftsmanship and transparent process to every Westfield project.",
    whyUs: "Our Westfield basement finish project demonstrates how we deliver quality results on a smart budget — proving you don't need to overspend to get a great space. Every bathroom project uses the Schluter waterproofing system installed by our certified team, backed by a 25-year warranty. All electrical and plumbing work is done by licensed professionals.",
    services: ["Basement Finishing","Bathroom Remodeling","Kitchen Remodeling","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["westfield-basement"],
    faq: [
      {q:"Do new Westfield homes need remodeling?",a:"Many newer Westfield homes have unfinished basements that are perfect candidates for finishing — adding bedrooms, entertainment areas, or home offices. Builders also use standard-grade materials that homeowners often want to upgrade, especially in bathrooms."},
      {q:"What does a basement finish cost in Westfield?",a:"Basement finishing in Westfield typically ranges from $20,000-$50,000 depending on the scope. A basic finish with drywall, flooring, and lighting starts on the lower end, while adding a bathroom, wet bar, or guest suite increases the investment."},
      {q:"How do I get started on a project in Westfield?",a:"Call us at (317) 279-4798 or fill out our online estimate form. We'll schedule a free in-home consultation to discuss your vision, walk your space, and provide a detailed written estimate."},
    ],
  },
  "home-remodeling-zionsville-in": {
    city: "Zionsville", state: "IN", lat: 39.9509, lng: -86.2617,
    title: "Home Remodeling in Zionsville, IN",
    metaDesc: "Trusted home remodeling in Zionsville, Indiana. Bathroom renovations, kitchen remodels, basement finishing. Schluter Pro Certified with 25-year warranty. Free estimates. (317) 279-4798",
    heroHeading: "Trusted Home Remodeling in Zionsville, Indiana",
    heroSub: "From the brick streets of downtown to the estates of Eagle Creek, Zionsville homeowners choose HomeStar for craftsmanship that matches the character of their homes.",
    neighborhoods: ["Promontory", "Holliday Farms", "Bradley Ridge", "Eagle Creek area", "Traders Point", "Rural Zionsville"],
    intro: "Zionsville is known for its charm, character, and quality of life — and the homes here reflect all of that. Whether you're renovating a bathroom in a historic downtown home or updating a Jack & Jill bathroom in a newer Holliday Farms build, HomeStar approaches every Zionsville project with the attention to detail these homes deserve.",
    whyUs: "Our Jack & Jill bathroom remodel in Zionsville is one of our most-viewed projects — a complete transformation with dual vanities and modern finishes that showcases what HomeStar delivers. As Schluter Pro Certified installers, we protect your renovation with 25-year waterproofing. Every plumber and electrician on the job is fully licensed.",
    services: ["Bathroom Remodeling","Kitchen Remodeling","Basement Finishing","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["zionsville-jack-and-jill"],
    faq: [
      {q:"Does Zionsville have specific building codes for remodeling?",a:"Yes. The Town of Zionsville has its own building department and requires permits for most remodeling work involving structural, plumbing, or electrical changes. We manage the entire permitting and inspection process."},
      {q:"Can you work on historic Zionsville homes?",a:"Absolutely. We have experience working with older homes that require careful attention to existing structures, plumbing, and electrical systems. We ensure all updates meet current code while respecting the home's character."},
      {q:"How much does a Jack & Jill bathroom remodel cost?",a:"A Jack & Jill bathroom remodel in Zionsville typically ranges from $15,000-$35,000 depending on scope and finishes. We provide a free in-home consultation and detailed written estimate."},
    ],
  },
  "home-remodeling-fortville-in": {
    city: "Fortville", state: "IN", lat: 39.9322, lng: -85.8480,
    title: "Home Remodeling in Fortville, IN",
    metaDesc: "Reliable home remodeling in Fortville, Indiana. Bathroom remodeling, kitchen renovations, basement finishing, decks & outdoor living. Schluter Pro Certified. Free estimates. (317) 279-4798",
    heroHeading: "Reliable Home Remodeling in Fortville, Indiana",
    heroSub: "From custom outdoor pavilions to full interior renovations, Fortville homeowners trust HomeStar for craftsmanship that's built to last.",
    neighborhoods: ["Downtown Fortville", "Buck Creek area"],
    intro: "Fortville may be a small town, but the homeowners here take pride in their properties — and they deserve a contractor who does, too. Whether you're upgrading a bathroom, finishing a basement, or creating the ultimate outdoor living space, HomeStar Services & Contracting brings Hamilton County's top craftsmanship right to your doorstep. We've already made our mark in Fortville with a custom pavilion project, and we're ready to do the same for your home.",
    whyUs: "Our Fortville Pavilion Patio Project is a standout example of what HomeStar can do — a custom outdoor living space featuring stone columns, a covered bar area with stained wood beams, and a layout designed for year-round entertaining. It's the kind of project that shows our attention to detail extends well beyond the walls of your home. As Schluter Pro Certified installers, every bathroom project is backed by a 25-year waterproofing warranty, and all plumbing and electrical work is performed by licensed professionals.",
    services: ["Bathroom Remodeling","Basement Finishing","Kitchen Remodeling","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["fortville-pavilion"],
    faq: [
      {q:"Do you serve Fortville even though you're based in Fishers?",a:"Absolutely. Fortville is part of our core service area. We've already completed projects in Fortville and surrounding areas, and the drive is short enough that it has zero impact on project scheduling or pricing."},
      {q:"What does an outdoor living project cost in Fortville?",a:"Outdoor living projects like pavilions, patios, and decks typically range from $10,000-$40,000 depending on size, materials, and features. Custom stone work and covered structures are on the higher end. We provide free, detailed estimates."},
      {q:"How do I get started on a project in Fortville?",a:"Call us at (317) 279-4798 or fill out our online estimate form. We'll schedule a free in-home consultation to discuss your vision, walk your space, and provide a detailed written estimate."},
    ],
  },
  "home-remodeling-mccordsville-in": {
    city: "McCordsville", state: "IN", lat: 39.8936, lng: -85.9225,
    title: "Home Remodeling in McCordsville, IN",
    metaDesc: "Professional home remodeling in McCordsville, Indiana. Bathroom renovations, basement finishing, kitchen remodels, flooring & painting. Schluter Pro Certified. Free estimates. (317) 279-4798",
    heroHeading: "Professional Home Remodeling in McCordsville, Indiana",
    heroSub: "McCordsville's growing community deserves a contractor who delivers quality craftsmanship, transparent pricing, and results that stand the test of time.",
    neighborhoods: ["McCordsville Proper", "Geist area (McCordsville)", "Mt. Comfort corridor"],
    intro: "McCordsville is one of the fastest-growing communities east of Indianapolis, with new construction and established homes that both benefit from expert remodeling. Whether you're personalizing a new build with upgraded finishes, renovating a bathroom, or finishing your basement to add living space, HomeStar brings the same certified craftsmanship we've delivered across Hamilton County to every McCordsville project.",
    whyUs: "We've completed dozens of projects in nearby Fishers and Geist — neighborhoods that share a border with McCordsville — so we know the homes, the building styles, and the expectations in this area. As Schluter Pro Certified installers, every bathroom project is backed by a 25-year waterproofing warranty. All plumbing and electrical work is performed by licensed professionals, and every project comes with a 1-year workmanship guarantee.",
    services: ["Bathroom Remodeling","Basement Finishing","Kitchen Remodeling","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: [],
    faq: [
      {q:"Do you serve McCordsville?",a:"Yes. McCordsville is part of our core service area, and we've completed many projects in neighboring Fishers and Geist. We serve all of McCordsville and the surrounding Mt. Comfort corridor."},
      {q:"What's the most popular remodeling project in McCordsville?",a:"Bathroom remodeling and basement finishing are the most requested services in McCordsville. Many newer homes have unfinished basements with great potential, and homeowners frequently upgrade builder-grade bathrooms to something more personal."},
      {q:"How do I get started on a project in McCordsville?",a:"Call us at (317) 279-4798 or fill out our online estimate form. We'll schedule a free in-home consultation to discuss your vision, walk your space, and provide a detailed written estimate."},
    ],
  },
  "home-remodeling-geist-in": {
    city: "Geist", state: "IN", lat: 39.9437, lng: -85.9631,
    title: "Home Remodeling in Geist, IN",
    metaDesc: "Luxury home remodeling in Geist, Indiana. Bathroom renovations, kitchen remodels, basement finishing for waterfront and estate homes. Schluter Pro Certified with 25-year warranty. (317) 279-4798",
    heroHeading: "Luxury Home Remodeling in Geist, Indiana",
    heroSub: "From waterfront estates to gated communities, Geist homeowners trust HomeStar for premium bathroom renovations, kitchen remodels, and whole-home transformations backed by a 25-year Schluter waterproofing warranty.",
    neighborhoods: ["Geist Reservoir waterfront", "The Estates at Geist", "Admirals Pointe", "Hamilton Proper", "Geist overlook area"],
    intro: "Geist is home to some of Hamilton County's most beautiful properties — waterfront estates on the reservoir, gated communities with custom-built homes, and established neighborhoods with deep lots and mature landscaping. Homeowners in Geist invest in their homes because they plan to stay, and they expect a caliber of craftsmanship that matches their community.",
    whyUs: "We've completed multiple projects in the Geist area, including our full upper-level remodel and two children's bathrooms — both showcasing the precision of our Schluter Pro Certified installers. Every bathroom we build uses the complete Schluter waterproofing system backed by a 25-year manufacturer's warranty. All plumbing by licensed plumbers. All electrical by licensed electricians. No exceptions.",
    services: ["Bathroom Remodeling","Kitchen Remodeling","Basement Finishing","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: ["geist-upper-level","geist-childrens-bath"],
    faq: [
      {q:"Do you work in Geist?",a:"Yes — Geist is one of our core service areas. We've completed multiple projects in Geist including full upper-level remodels and bathroom renovations in waterfront and estate homes."},
      {q:"What does a luxury bathroom remodel cost in Geist?",a:"High-end bathroom remodels in Geist typically range from $25,000-$60,000+ depending on scope. Homes in this area often feature larger master suites with premium finishes — spa showers, freestanding tubs, heated floors, and custom tile throughout."},
      {q:"Are you experienced with larger homes in Geist?",a:"Absolutely. We've worked on homes ranging from 3,000 to 10,000+ square feet in the Geist area. Our team handles multi-bathroom projects, upper-level renovations, and whole-home transformations with the same precision and care."},
    ],
  },
  "home-remodeling-pendleton-in": {
    city: "Pendleton", state: "IN", lat: 39.9978, lng: -85.7466,
    title: "Home Remodeling in Pendleton, IN",
    metaDesc: "Professional home remodeling in Pendleton, Indiana. Bathroom renovations, basement finishing, kitchen remodels, decks & outdoor living. Schluter Pro Certified. Free estimates. (317) 279-4798",
    heroHeading: "Professional Home Remodeling in Pendleton, Indiana",
    heroSub: "Pendleton's charming community and historic homes deserve a contractor who combines modern building techniques with respect for character — that's what HomeStar delivers on every project.",
    neighborhoods: ["Downtown Pendleton", "Falls Park area", "South Pendleton", "Pendleton Heights"],
    intro: "Pendleton is a growing community east of Hamilton County with a mix of historic homes near Falls Park and newer construction in the surrounding areas. Whether you're modernizing a kitchen in a character home downtown, finishing a basement in a newer build, or adding outdoor living space, HomeStar brings certified craftsmanship and transparent pricing to every Pendleton project.",
    whyUs: "We serve Pendleton as part of our extended Hamilton County service area. Our Schluter Pro Certified installers deliver bathroom renovations backed by a 25-year waterproofing warranty. All plumbing and electrical by licensed professionals. We handle permitting, design, and construction from start to finish.",
    services: ["Bathroom Remodeling","Basement Finishing","Kitchen Remodeling","Flooring Services","Painting Services","Decks & Outdoor Living"],
    projects: [],
    faq: [
      {q:"Do you serve Pendleton?",a:"Yes. Pendleton is part of our service area. We regularly work in neighboring Fishers and McCordsville, and Pendleton homeowners receive the same certified craftsmanship and warranty coverage as all of our projects."},
      {q:"What are the most popular remodeling projects in Pendleton?",a:"Bathroom remodeling, kitchen updates, and basement finishing are the most requested services in Pendleton. Many homes in the area have solid bones and benefit greatly from modernized finishes and improved layouts."},
      {q:"How do I get a quote for a Pendleton project?",a:"Call us at (317) 279-4798 or fill out our online estimate form. We'll schedule a free in-home consultation to discuss your vision and provide a detailed, itemized estimate."},
    ],
  },
};

/* Service-city combo pages — each renders unique content */
const SERVICE_CITY_ALIASES = {
  "bathroom-remodeling-fishers-in": {s:"bathroom-remodeling",c:"home-remodeling-fishers-in"},
  "bathroom-remodeling-carmel-in": {s:"bathroom-remodeling",c:"home-remodeling-carmel-in"},
  "bathroom-remodeling-noblesville-in": {s:"bathroom-remodeling",c:"home-remodeling-noblesville-in"},
  "bathroom-remodeling-westfield-in": {s:"bathroom-remodeling",c:"home-remodeling-westfield-in"},
  "bathroom-remodeling-zionsville-in": {s:"bathroom-remodeling",c:"home-remodeling-zionsville-in"},
  "bathroom-remodeling-fortville-in": {s:"bathroom-remodeling",c:"home-remodeling-fortville-in"},
  "bathroom-remodeling-mccordsville-in": {s:"bathroom-remodeling",c:"home-remodeling-mccordsville-in"},
  "basement-finishing-fishers-in": {s:"basement-finishing",c:"home-remodeling-fishers-in"},
  "basement-finishing-carmel-in": {s:"basement-finishing",c:"home-remodeling-carmel-in"},
  "basement-finishing-noblesville-in": {s:"basement-finishing",c:"home-remodeling-noblesville-in"},
  "basement-finishing-westfield-in": {s:"basement-finishing",c:"home-remodeling-westfield-in"},
  "basement-finishing-zionsville-in": {s:"basement-finishing",c:"home-remodeling-zionsville-in"},
  "basement-finishing-fortville-in": {s:"basement-finishing",c:"home-remodeling-fortville-in"},
  "basement-finishing-mccordsville-in": {s:"basement-finishing",c:"home-remodeling-mccordsville-in"},
  "kitchen-remodeling-fishers-in": {s:"kitchen-remodeling",c:"home-remodeling-fishers-in"},
  "kitchen-remodeling-carmel-in": {s:"kitchen-remodeling",c:"home-remodeling-carmel-in"},
  "kitchen-remodeling-noblesville-in": {s:"kitchen-remodeling",c:"home-remodeling-noblesville-in"},
  "kitchen-remodeling-westfield-in": {s:"kitchen-remodeling",c:"home-remodeling-westfield-in"},
  "kitchen-remodeling-zionsville-in": {s:"kitchen-remodeling",c:"home-remodeling-zionsville-in"},
  "kitchen-remodeling-fortville-in": {s:"kitchen-remodeling",c:"home-remodeling-fortville-in"},
  "kitchen-remodeling-mccordsville-in": {s:"kitchen-remodeling",c:"home-remodeling-mccordsville-in"},
  "flooring-services-fishers-in": {s:"flooring-services",c:"home-remodeling-fishers-in"},
  "flooring-services-carmel-in": {s:"flooring-services",c:"home-remodeling-carmel-in"},
  "flooring-services-noblesville-in": {s:"flooring-services",c:"home-remodeling-noblesville-in"},
  "flooring-services-westfield-in": {s:"flooring-services",c:"home-remodeling-westfield-in"},
  "flooring-services-zionsville-in": {s:"flooring-services",c:"home-remodeling-zionsville-in"},
  "flooring-services-fortville-in": {s:"flooring-services",c:"home-remodeling-fortville-in"},
  "flooring-services-mccordsville-in": {s:"flooring-services",c:"home-remodeling-mccordsville-in"},
  "painting-services-fishers-in": {s:"painting-services",c:"home-remodeling-fishers-in"},
  "painting-services-carmel-in": {s:"painting-services",c:"home-remodeling-carmel-in"},
  "painting-services-noblesville-in": {s:"painting-services",c:"home-remodeling-noblesville-in"},
  "painting-services-westfield-in": {s:"painting-services",c:"home-remodeling-westfield-in"},
  "painting-services-zionsville-in": {s:"painting-services",c:"home-remodeling-zionsville-in"},
  "painting-services-fortville-in": {s:"painting-services",c:"home-remodeling-fortville-in"},
  "painting-services-mccordsville-in": {s:"painting-services",c:"home-remodeling-mccordsville-in"},
  "deck-builder-fishers-in": {s:"decks-outdoor-living",c:"home-remodeling-fishers-in"},
  "deck-builder-carmel-in": {s:"decks-outdoor-living",c:"home-remodeling-carmel-in"},
  "deck-builder-noblesville-in": {s:"decks-outdoor-living",c:"home-remodeling-noblesville-in"},
  "deck-builder-westfield-in": {s:"decks-outdoor-living",c:"home-remodeling-westfield-in"},
  "deck-builder-zionsville-in": {s:"decks-outdoor-living",c:"home-remodeling-zionsville-in"},
  "deck-builder-fortville-in": {s:"decks-outdoor-living",c:"home-remodeling-fortville-in"},
  "deck-builder-mccordsville-in": {s:"decks-outdoor-living",c:"home-remodeling-mccordsville-in"},
  "bathroom-remodeling-geist-in": {s:"bathroom-remodeling",c:"home-remodeling-geist-in"},
  "basement-finishing-geist-in": {s:"basement-finishing",c:"home-remodeling-geist-in"},
  "kitchen-remodeling-geist-in": {s:"kitchen-remodeling",c:"home-remodeling-geist-in"},
  "flooring-services-geist-in": {s:"flooring-services",c:"home-remodeling-geist-in"},
  "painting-services-geist-in": {s:"painting-services",c:"home-remodeling-geist-in"},
  "deck-builder-geist-in": {s:"decks-outdoor-living",c:"home-remodeling-geist-in"},
  "bathroom-remodeling-pendleton-in": {s:"bathroom-remodeling",c:"home-remodeling-pendleton-in"},
  "basement-finishing-pendleton-in": {s:"basement-finishing",c:"home-remodeling-pendleton-in"},
  "kitchen-remodeling-pendleton-in": {s:"kitchen-remodeling",c:"home-remodeling-pendleton-in"},
  "flooring-services-pendleton-in": {s:"flooring-services",c:"home-remodeling-pendleton-in"},
  "painting-services-pendleton-in": {s:"painting-services",c:"home-remodeling-pendleton-in"},
  "deck-builder-pendleton-in": {s:"decks-outdoor-living",c:"home-remodeling-pendleton-in"},
};

/* ─── Neighborhoods (42 pages) ────────────────────── */
const NEIGHBORHOODS = {
  /* FISHERS (10) */
  "hamilton-proper":{name:"Hamilton Proper",city:"Fishers",showOn:["Fishers","Geist"],citySlug:"home-remodeling-fishers-in",values:"$1M–$6M+",tier:"ultra",character:"Ultra-luxury gated estates on 3-6+ acre lots with custom-built homes featuring 10,000+ square feet, private amenities, and meticulous landscaping.",popular:"Spa-level master bathroom renovations, full kitchen redesigns with premium appliances, whole-home updates with custom finishes.",faq:[{q:"What does a bathroom remodel cost in Hamilton Proper?",a:"Homes in Hamilton Proper are among the most valuable in Indiana. Bathroom remodels here typically range from $35,000-$80,000+ and often include heated floors, custom tile work, frameless glass enclosures, and premium fixtures."},{q:"Do you have experience with luxury homes in Hamilton Proper?",a:"Yes. We work with homeowners throughout the Geist and Hamilton Proper area on high-end renovations. Our Schluter Pro Certified team and licensed tradespeople deliver the caliber of work these homes deserve."},{q:"Can you handle multi-bathroom projects in Hamilton Proper?",a:"Absolutely. Homes in Hamilton Proper often have 5-10 bathrooms. We regularly manage multi-bathroom and multi-room renovation projects with coordinated timelines."}]},
  "geist-reservoir":{name:"Geist Reservoir",city:"Fishers",showOn:["Fishers","Geist"],citySlug:"home-remodeling-fishers-in",values:"$800K–$3.5M",tier:"luxury",character:"Established waterfront and water-view properties surrounding Geist Reservoir. Homes range from lakefront estates to elevated lots with reservoir views.",popular:"Master bathroom transformations, kitchen remodels with lake views, outdoor living spaces with reservoir views, basement finishing for entertainment.",faq:[{q:"Do you work on waterfront homes at Geist Reservoir?",a:"Yes — we've completed multiple projects in the Geist Reservoir area including full upper-level remodels and children's bathrooms. We understand the unique considerations of waterfront properties."},{q:"What's the most popular remodel in the Geist Reservoir area?",a:"Master bathroom renovations and outdoor living projects are most popular. Homeowners invest in spa-level bathrooms and decks or patios that take advantage of the reservoir views."},{q:"How much does a kitchen remodel cost near Geist Reservoir?",a:"Kitchen remodels in the Geist Reservoir area typically range from $30,000-$65,000 depending on scope, with premium finishes like quartz countertops and custom cabinetry being standard."}]},
  "estates-at-geist":{name:"The Estates at Geist",city:"Fishers",showOn:["Fishers","Geist"],citySlug:"home-remodeling-fishers-in",values:"$1M–$3.5M",tier:"luxury",character:"Gated waterfront community with custom-built luxury homes, private docks, and resort-style living on Geist Reservoir.",popular:"Full master suite renovations, spa bathrooms with heated floors and freestanding tubs, kitchen modernization, outdoor living with lake access.",faq:[{q:"What kind of projects do you do in The Estates at Geist?",a:"We specialize in high-end bathroom and kitchen renovations for luxury homes. Projects in The Estates typically include premium materials, custom tile work, and spa-level finishes."},{q:"Do you handle the permitting in The Estates at Geist?",a:"Yes. We manage all permitting through the appropriate municipality and ensure compliance with any HOA requirements specific to The Estates at Geist."},{q:"What waterproofing system do you use?",a:"We exclusively use the complete Schluter waterproofing system — Ditra for floors, Kerdi for walls — backed by a 25-year manufacturer's warranty. This is critical for protecting the investment in a luxury home."}]},
  "admirals-pointe":{name:"Admirals Pointe at Geist",city:"Fishers",showOn:["Fishers","Geist"],citySlug:"home-remodeling-fishers-in",values:"$800K–$1.5M",tier:"luxury",character:"Gated community on Geist Reservoir featuring executive homes with waterfront access, walking trails, and a private clubhouse.",popular:"Bathroom updates with modern finishes, kitchen renovations, basement entertainment spaces, deck and patio upgrades.",faq:[{q:"What does a remodel typically cost in Admirals Pointe?",a:"Bathroom remodels in Admirals Pointe typically range from $20,000-$45,000. Kitchen remodels run $30,000-$60,000. These are established luxury homes that benefit from updated finishes and modern layouts."},{q:"Can you work within HOA guidelines at Admirals Pointe?",a:"Yes. We review all HOA requirements before beginning any exterior work and ensure compliance throughout the project."},{q:"Do you serve the Geist area?",a:"Geist is one of our core service areas. We've completed multiple projects in the Geist community and understand the quality expectations of homeowners here."}]},
  "saxon-woods":{name:"Saxon Woods",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$700K–$1.2M",tier:"high",character:"Spacious estates with mature trees and a private, secluded feel — yet minutes from downtown Fishers dining, shopping, and entertainment.",popular:"Full bathroom renovations, kitchen redesigns, basement finishing, outdoor living spaces.",faq:[{q:"What projects are popular in Saxon Woods?",a:"Homeowners in Saxon Woods most often request bathroom renovations and kitchen remodels. The homes are spacious with room for premium upgrades like walk-in showers, freestanding tubs, and custom tile."},{q:"How long does a bathroom remodel take in Saxon Woods?",a:"Most bathroom remodels take 3-4 weeks. We provide a detailed timeline before work begins and communicate daily throughout the project."},{q:"Do you offer free estimates in Saxon Woods?",a:"Yes. Call (317) 279-4798 or fill out our online form for a free in-home consultation and detailed written estimate."}]},
  "thorpe-creek":{name:"Thorpe Creek",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$700K–$1.2M",tier:"high",character:"Luxury sanctuary with elegant homes, winding trails, and a tranquil setting ideal for families seeking privacy and quality.",popular:"Bathroom remodels, kitchen updates, basement finishing for growing families, outdoor living.",faq:[{q:"Do you work in Thorpe Creek?",a:"Yes. Thorpe Creek is in our core Fishers service area. We've worked on homes throughout the neighborhood and understand the quality of construction and finishes homeowners here expect."},{q:"What's the average kitchen remodel cost in Thorpe Creek?",a:"Kitchen remodels in Thorpe Creek typically range from $25,000-$55,000 depending on scope. Quartz countertops, custom cabinetry, and modern lighting are popular upgrades."},{q:"Are your plumbers and electricians licensed?",a:"Yes. All plumbing is performed by licensed plumbers and all electrical by licensed electricians. This is standard on every HomeStar project — no exceptions."}]},
  "cambridge":{name:"Cambridge",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$600K–$900K",tier:"high",character:"Established family neighborhood in central Fishers with well-maintained homes, community pools, and excellent school access.",popular:"Bathroom refreshes and renovations, kitchen updates, basement finishing for kids' play areas and home offices.",faq:[{q:"What size projects do you handle in Cambridge?",a:"We handle everything from a single bathroom refresh ($8,000-$12,000) to full gut renovations ($20,000-$35,000) and multi-room projects. No job is too small or too large."},{q:"Do Cambridge homes need waterproofing upgrades?",a:"Many homes in Cambridge were built with standard cement board in bathrooms. Upgrading to the Schluter waterproofing system during a remodel prevents future moisture damage and adds a 25-year warranty."},{q:"How do I get started?",a:"Call (317) 279-4798 or request an estimate online. We'll schedule a free in-home consultation to walk your space and discuss your vision."}]},
  "canal-place":{name:"Canal Place",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$600K–$900K",tier:"high",character:"Upscale Fishers neighborhood adjacent to waterways with attractive landscaping, walking paths, and homes featuring premium builder finishes.",popular:"Bathroom renovations with upgraded tile and fixtures, kitchen modernization, flooring upgrades throughout.",faq:[{q:"What remodeling projects are popular in Canal Place?",a:"Bathroom renovations and kitchen updates are most requested. Homeowners in Canal Place often upgrade builder-grade finishes to premium materials like custom tile, quartz countertops, and modern lighting."},{q:"Do you handle kitchen remodels in Canal Place?",a:"Yes. We provide full kitchen remodeling services including cabinetry, countertops, backsplash, flooring, lighting, and plumbing — all coordinated by one team from start to finish."},{q:"What warranty do you offer?",a:"Every project includes our 1-year workmanship warranty. Bathroom projects built with the Schluter system also carry a 25-year manufacturer's waterproofing warranty."}]},
  "brooks-school":{name:"Brooks School Area",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$400K–$700K",tier:"mid",character:"Central Fishers location near Brooks School with a mix of established and newer homes. Convenient access to 116th Street shopping and dining.",popular:"Bathroom updates, kitchen refreshes, basement finishing, flooring replacement, painting.",faq:[{q:"What does a bathroom remodel cost in the Brooks School area?",a:"Bathroom remodels in this area typically range from $12,000-$28,000 depending on scope. We offer options at every budget level while maintaining our quality standards."},{q:"Do you offer financing?",a:"We can discuss payment options during your consultation. Our goal is to make quality remodeling accessible to homeowners throughout Fishers."},{q:"Can you update just the shower without a full bathroom remodel?",a:"Yes. We can replace a shower enclosure, retile a shower, or convert a tub to a walk-in shower as a standalone project. The Schluter waterproofing system is included on all tile shower projects."}]},
  "olio-road":{name:"Olio Road Corridor",city:"Fishers",citySlug:"home-remodeling-fishers-in",values:"$400K–$700K",tier:"mid",character:"Fast-growing east side of Fishers along the Olio Road corridor with newer construction, modern floor plans, and young families personalizing their homes.",popular:"Builder-grade bathroom upgrades, basement finishing in new builds, kitchen personalization, deck and patio additions.",faq:[{q:"Are new homes along Olio Road worth remodeling?",a:"Absolutely. New construction homes often come with builder-grade finishes that homeowners upgrade within the first 3-5 years — better tile, quartz countertops, upgraded lighting, and finished basements are the most common projects."},{q:"How much does basement finishing cost in newer Fishers homes?",a:"Basement finishing in newer homes along the Olio corridor typically costs $25,000-$45,000 depending on size and scope. Most have 9-foot ceilings — perfect for entertainment areas, guest suites, or home offices."},{q:"Do you build decks in the Olio Road area?",a:"Yes. We build composite and wood decks throughout Fishers. Composite decking from brands like Trex lasts 25+ years with zero maintenance — ideal for busy families."}]},
  /* CARMEL (10) */
  "laurelwood":{name:"Laurelwood",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$1M–$3M+",tier:"ultra",character:"Small, exclusive enclave in south Carmel known for stone mansions, sweeping grounds, and estate-level living. One of Hamilton County's most prestigious addresses.",popular:"Whole-home renovations, spa-level master bathrooms, gourmet kitchen redesigns, premium outdoor living.",faq:[{q:"What type of projects do you do in Laurelwood?",a:"Laurelwood homes are among Carmel's finest. We handle premium bathroom renovations, full kitchen redesigns, and multi-room projects with finishes that match the estate-level quality of these homes."},{q:"What does a bathroom remodel cost in Laurelwood?",a:"Bathroom remodels in Laurelwood typically range from $35,000-$70,000+ given the scale and finish level these homes demand. Every project includes our Schluter Pro Certified waterproofing with a 25-year warranty."},{q:"Do you provide 3D design renderings?",a:"Yes. We create detailed 3D renderings before construction begins so you can visualize every material, fixture, and layout decision. This is standard on all our projects."}]},
  "116th-street":{name:"116th Street Corridor",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$1M–$3M+",tier:"ultra",character:"Prestigious corridor running through Carmel with breathtaking estate properties, mature landscaping, and some of the most valuable homes in central Indiana.",popular:"Master suite transformations, kitchen redesigns, whole-level renovations, premium bathroom remodels.",faq:[{q:"What sets HomeStar apart for luxury 116th Street homes?",a:"We're Schluter Pro Certified with a 25-year waterproofing warranty, use only licensed plumbers and electricians, and provide 3D design renderings — a level of quality assurance that matches the caliber of these homes."},{q:"Can you renovate multiple rooms at once?",a:"Yes. We regularly manage multi-room and multi-level renovation projects. A dedicated project manager coordinates all trades to keep your project on schedule and on budget."},{q:"What's the typical timeline for a kitchen remodel in this area?",a:"Kitchen remodels on 116th Street typically take 4-8 weeks depending on scope. We provide a detailed timeline before work begins and communicate daily."}]},
  "jacksons-grant":{name:"Jackson's Grant",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$800K–$1.5M",tier:"luxury",character:"Upscale new-traditional community on Williams Creek with custom homes, green spaces, and a design-forward aesthetic that blends classic architecture with modern living.",popular:"Bathroom upgrades with premium tile, kitchen personalization, outdoor living, basement finishing.",faq:[{q:"Are Jackson's Grant homes new enough to need remodeling?",a:"Many Jackson's Grant homes are 3-8 years old — the perfect time to upgrade builder-grade finishes. Homeowners commonly upgrade bathrooms with custom tile, replace kitchen countertops with quartz, and finish basements."},{q:"What's a typical bathroom remodel cost in Jackson's Grant?",a:"Bathroom remodels in Jackson's Grant typically run $20,000-$40,000. The homes are well-built, so upgrades focus on premium finishes — large-format tile, frameless glass, and modern fixtures."},{q:"Do you work with HOAs?",a:"Yes. We review all HOA architectural guidelines before beginning work and ensure all exterior modifications meet community requirements."}]},
  "reserve-at-springmill":{name:"Reserve at Springmill",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$800K–$1.3M",tier:"luxury",character:"Established luxury neighborhood with large lots, custom-built homes, and mature landscaping in the desirable Springmill corridor of Carmel.",popular:"Master bathroom renovations, kitchen updates, flooring replacement, whole-home painting.",faq:[{q:"What projects are common in Reserve at Springmill?",a:"Master bathroom renovations are the most requested project. Homeowners upgrade from dated fixtures and standard tile to modern designs with walk-in showers, freestanding tubs, and the Schluter waterproofing system."},{q:"How do your prices compare for Carmel luxury homes?",a:"We're competitively priced for the quality we deliver. Our Schluter Pro Certification, licensed trades, and 3D design process set us apart. We provide free, detailed estimates so you can compare confidently."},{q:"What warranty do you offer?",a:"Every project includes our 1-year workmanship warranty. Bathroom projects include a 25-year Schluter manufacturer's waterproofing warranty. All plumbing and electrical are performed by licensed professionals."}]},
  "laurel-lakes":{name:"Laurel Lakes",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$800K–$1.5M",tier:"luxury",character:"Waterfront luxury community in Carmel with homes overlooking private lakes, featuring upscale finishes and generous lot sizes.",popular:"Bathroom renovations, kitchen remodels with lake views, basement entertainment areas, outdoor living.",faq:[{q:"Do you serve the Laurel Lakes community?",a:"Yes. Laurel Lakes is in our core Carmel service area. We bring the same certified craftsmanship and premium materials that homeowners in this community expect."},{q:"What does a kitchen remodel cost in Laurel Lakes?",a:"Kitchen remodels in Laurel Lakes typically range from $30,000-$60,000 depending on scope. Popular upgrades include quartz countertops, custom cabinetry, and modern lighting."},{q:"Do you handle outdoor living projects?",a:"Yes. We build composite decks, patios, and outdoor living spaces. Homes in Laurel Lakes with lake views particularly benefit from well-designed outdoor spaces."}]},
  "village-of-westclay":{name:"Village of WestClay",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$600K–$2M+",tier:"luxury",character:"Carmel's premier master-planned community with European-inspired architecture, walkable streets, shops, restaurants, and homes ranging from charming cottages to multi-million-dollar estates.",popular:"Bathroom renovations respecting architectural character, kitchen updates, custom tile work, painting.",faq:[{q:"Can you match the architectural style of WestClay homes?",a:"Absolutely. WestClay's character is part of what makes it special. We work with homeowners to ensure renovations enhance — not clash with — the European-inspired aesthetic of their homes."},{q:"What's the most common project in Village of WestClay?",a:"Bathroom renovations are most popular, followed by kitchen updates. WestClay homes have distinctive architecture that benefits from custom tile work and thoughtful design."},{q:"Do you provide design services?",a:"Yes. We provide 3D renderings before construction begins so you can visualize exactly how your renovation will look. This is included with every project."}]},
  "bridgewater-club":{name:"Bridgewater Club",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$500K–$2M",tier:"luxury",character:"Golf course community in Carmel with an 18-hole championship course, private country club, swimming pools, tennis courts, and luxury homes with course views.",popular:"Master bathroom transformations, kitchen modernization, basement finishing for entertainment, outdoor living.",faq:[{q:"Do you work in Bridgewater Club?",a:"Yes. Bridgewater Club is in our Carmel service area. We understand the premium expectations of homes in golf course communities and deliver finishes that match."},{q:"What does a basement finish cost in Bridgewater Club?",a:"Basement finishing in Bridgewater Club homes typically ranges from $30,000-$55,000 depending on size and scope. Popular configurations include entertainment areas, wet bars, guest suites, and home offices."},{q:"Can you add a wet bar to a finished basement?",a:"Yes. We handle full basement finishing including wet bars with plumbing, built-in cabinetry, and custom finishes. All plumbing is performed by our licensed plumbers."}]},
  "springmill":{name:"Springmill",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$600K–$1.5M",tier:"high",character:"Established luxury corridor in Carmel with large lots, classic architecture, and mature trees. Springmill neighborhoods are among Carmel's most desirable addresses.",popular:"Full bathroom renovations, kitchen remodels, flooring upgrades, whole-home painting and updates.",faq:[{q:"What types of homes are in the Springmill area?",a:"Springmill features a mix of established luxury homes from the 1990s-2010s on large lots. Many homeowners are updating bathrooms, kitchens, and flooring to modern finishes while preserving the classic character."},{q:"How much does a bathroom remodel cost in Springmill?",a:"Bathroom remodels in the Springmill corridor typically range from $18,000-$40,000 depending on scope. We offer everything from basic refreshes to complete spa-level transformations."},{q:"Do you handle the entire project?",a:"Yes. We're a design-build contractor. We handle design, permitting, construction, and final inspection — one team, one point of contact, start to finish."}]},
  "brookshire":{name:"Brookshire",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$600K–$900K",tier:"high",character:"Established neighborhood in east Carmel with well-maintained homes, community pools, and convenient access to shopping, dining, and schools.",popular:"Bathroom updates, kitchen refreshes, flooring replacement, basement finishing.",faq:[{q:"What remodeling projects are popular in Brookshire?",a:"Bathroom renovations and kitchen updates are most common. Many Brookshire homes were built in the late 1990s-2000s and benefit from updated finishes, modern fixtures, and improved waterproofing."},{q:"Is Brookshire in your service area?",a:"Yes. Brookshire is in our core Carmel service area. We serve all neighborhoods throughout Carmel and Hamilton County."},{q:"Do you offer free estimates?",a:"Yes. Call (317) 279-4798 or fill out our online form for a free in-home consultation and detailed written estimate."}]},
  "smokey-ridge":{name:"Smokey Ridge",city:"Carmel",citySlug:"home-remodeling-carmel-in",values:"$600K–$800K",tier:"high",character:"Coveted Carmel neighborhood on quiet cul-de-sacs with well-maintained homes, mature landscaping, and a strong sense of community.",popular:"Bathroom renovations, kitchen updates, painting, flooring, outdoor living spaces.",faq:[{q:"What does a bathroom remodel cost in Smokey Ridge?",a:"Bathroom remodels in Smokey Ridge typically range from $15,000-$32,000 depending on scope. We offer options at every level while maintaining our quality standards and Schluter waterproofing system."},{q:"Can you update just the vanity and fixtures?",a:"Yes. We handle projects of all sizes — from a simple vanity and fixture swap to a complete gut renovation. Every tile project includes the Schluter waterproofing system."},{q:"How quickly can you start a project?",a:"Timing depends on our current schedule and material lead times. Most projects begin 2-4 weeks after contract signing. Contact us for current availability."}]},
  /* ZIONSVILLE (6) */
  "promontory":{name:"Promontory",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$1M–$6M",tier:"ultra",character:"One of Indiana's most exclusive communities — a gated lakefront development in Zionsville featuring estates on 35 acres with a private lake, Pete Dye-influenced design, and homes with bowling alleys and home theaters.",popular:"Estate-level whole-home renovations, spa master bathrooms, gourmet kitchen redesigns, basement entertainment complexes, luxury outdoor living.",faq:[{q:"Do you have experience with Promontory-caliber homes?",a:"Yes. Our team handles high-end renovations with premium materials, custom finishes, and meticulous attention to detail. Our Schluter Pro Certification and licensed trades meet the quality standards these estates require."},{q:"What does a master bathroom cost in Promontory?",a:"Master bathroom renovations in Promontory typically range from $40,000-$100,000+ depending on scope. These projects often include heated floors, custom steam showers, freestanding tubs, and premium tile throughout."},{q:"Can you handle multi-room projects?",a:"Absolutely. We manage complex, multi-room renovation projects with coordinated timelines and a dedicated project manager to keep everything on track."}]},
  "holliday-farms":{name:"Holliday Farms",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$1M–$5M",tier:"ultra",character:"Gated luxury community in Zionsville featuring a Pete Dye-designed golf course, custom-built homes, and an exclusive country club lifestyle.",popular:"Luxury bathroom renovations, kitchen modernization, basement finishing for entertainment, custom outdoor living.",faq:[{q:"What type of work do you do in Holliday Farms?",a:"We specialize in premium bathroom and kitchen renovations. Holliday Farms homes have exceptional finishes, and our Schluter Pro Certified team delivers the craftsmanship these properties deserve."},{q:"What does a kitchen remodel cost in Holliday Farms?",a:"Kitchen remodels in Holliday Farms typically range from $40,000-$80,000+ depending on scope and finish level. Custom cabinetry, premium countertops, and professional-grade appliances are common."},{q:"Do you offer 3D design renderings?",a:"Yes. We create detailed 3D renderings so you can visualize your renovation before any construction begins. This is standard on all our projects."}]},
  "bradley-ridge":{name:"Bradley Ridge",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$800K–$1.5M",tier:"luxury",character:"Brand new gated community in Zionsville spanning 350 acres with luxury single-family homes, a clubhouse, pickleball courts, fishing pond, and a 30-acre nature preserve.",popular:"New construction personalization, bathroom upgrades from builder-grade, kitchen customization, outdoor living.",faq:[{q:"Are Bradley Ridge homes new enough to need remodeling?",a:"Yes — new homes often come with builder-grade finishes that homeowners upgrade within the first 1-3 years. Tile upgrades, quartz countertops, premium lighting, and finished basements are the most common projects."},{q:"What's the most popular upgrade in Bradley Ridge?",a:"Bathroom tile upgrades are most popular. Replacing builder-grade tile with custom large-format tile and adding the Schluter waterproofing system transforms the bathroom and adds long-term protection."},{q:"Do you work in gated communities?",a:"Yes. We work in gated communities throughout Hamilton County and coordinate access with HOAs and community management as needed."}]},
  "eagle-creek":{name:"Eagle Creek Area",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$600K–$1M+",tier:"high",character:"Estate lots and established luxury homes in the Eagle Creek area of Zionsville with wooded settings, privacy, and generous square footage.",popular:"Bathroom renovations, kitchen updates, flooring replacement, whole-home painting, deck additions.",faq:[{q:"Do you serve the Eagle Creek area of Zionsville?",a:"Yes. We serve all of Zionsville and the surrounding areas. Eagle Creek properties often feature larger homes that benefit from updated bathrooms, modernized kitchens, and improved outdoor living spaces."},{q:"What does a bathroom remodel cost in the Eagle Creek area?",a:"Bathroom remodels in this area typically range from $18,000-$42,000 depending on scope. Premium options include walk-in showers, freestanding tubs, and custom tile throughout."},{q:"Do you build decks in Zionsville?",a:"Yes. We build composite and wood decks throughout Zionsville. The wooded settings in the Eagle Creek area are particularly well-suited for outdoor living spaces."}]},
  "traders-point":{name:"Traders Point",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$600K–$1M",tier:"high",character:"Upscale established community in Zionsville with spacious homes, mature landscaping, and a reputation for quality living.",popular:"Bathroom renovations, kitchen remodels, basement finishing, flooring and painting updates.",faq:[{q:"What projects are popular in Traders Point?",a:"Bathroom and kitchen renovations are most requested. Many Traders Point homes are 15-25 years old and due for updated finishes, improved waterproofing, and modernized layouts."},{q:"How long does a kitchen remodel take?",a:"Kitchen remodels typically take 4-8 weeks depending on scope. We provide a detailed timeline and communicate daily throughout the project."},{q:"Do you offer a warranty?",a:"Every project includes our 1-year workmanship warranty. Bathroom projects include a 25-year Schluter manufacturer's waterproofing warranty."}]},
  "rural-zionsville":{name:"Rural Zionsville",city:"Zionsville",citySlug:"home-remodeling-zionsville-in",values:"$800K+",tier:"luxury",character:"Acreage properties on the outskirts of Zionsville with custom-built estate homes, horse properties, and homes featuring 4,000-10,000+ square feet on multi-acre lots.",popular:"Large-scale bathroom renovations, kitchen redesigns, basement finishing, outdoor living with expansive views.",faq:[{q:"Do you work on rural properties outside Zionsville proper?",a:"Yes. We serve the greater Zionsville area including rural properties. Our team is experienced with larger homes and multi-room projects common on acreage properties."},{q:"What's the most common project on rural Zionsville properties?",a:"Bathroom and kitchen renovations are most common, often at a larger scale than typical suburban homes. Basement finishing is also popular given the larger footprints of these homes."},{q:"How do I get started?",a:"Call (317) 279-4798 or request an estimate online. We'll schedule a free in-home consultation to walk your space and provide a detailed estimate."}]},
  /* WESTFIELD (5) */
  "chatham-hills":{name:"Chatham Hills",city:"Westfield",citySlug:"home-remodeling-westfield-in",values:"$500K–$2M",tier:"luxury",character:"Luxury golf course community in Westfield with Pete Dye-designed course, custom homes, and resort-style amenities including pools, trails, and a clubhouse.",popular:"Premium bathroom renovations, kitchen modernization, basement entertainment areas, outdoor living.",faq:[{q:"Do you work in Chatham Hills?",a:"Yes. Chatham Hills is in our Westfield service area. We deliver the premium quality that homeowners in golf course communities expect."},{q:"What does a bathroom remodel cost in Chatham Hills?",a:"Bathroom remodels in Chatham Hills typically range from $20,000-$50,000 depending on scope and finish level. Walk-in showers, custom tile, and modern fixtures are popular."},{q:"Can you finish a basement in Chatham Hills?",a:"Yes. Basement finishing in Chatham Hills typically costs $30,000-$55,000. Popular configurations include entertainment areas, wet bars, guest suites, and home theaters."}]},
  "centennial":{name:"Centennial",city:"Westfield",citySlug:"home-remodeling-westfield-in",values:"$600K–$1M",tier:"high",character:"Upscale newer development in Westfield with modern floor plans, premium builder finishes, and family-oriented amenities.",popular:"Builder-grade upgrades, bathroom tile improvements, kitchen personalization, basement finishing.",faq:[{q:"Are Centennial homes worth upgrading?",a:"Yes. Newer homes in Centennial often have solid construction but builder-grade finishes. Upgrading bathroom tile, kitchen countertops, and finishing the basement adds both daily enjoyment and long-term value."},{q:"What's the most popular project in Centennial?",a:"Bathroom tile upgrades and basement finishing are the most requested. Homeowners replace builder-grade tile with custom work including the Schluter waterproofing system."},{q:"How much does basement finishing cost in Centennial?",a:"Basement finishing in Centennial homes typically costs $25,000-$45,000 depending on size and scope. Most homes have 9-foot basement ceilings — ideal for comfortable living space."}]},
  "bridgewater-westfield":{name:"Bridgewater",city:"Westfield",citySlug:"home-remodeling-westfield-in",values:"$600K–$1M",tier:"high",character:"Established family community in Westfield with quality homes, community pools, walking trails, and excellent school access.",popular:"Bathroom renovations, kitchen updates, flooring replacement, basement finishing.",faq:[{q:"What remodeling projects are popular in Bridgewater Westfield?",a:"Bathroom renovations and kitchen updates are most common. Many homes are 10-20 years old and benefit from updated finishes and improved waterproofing."},{q:"Is Bridgewater in your service area?",a:"Yes. We serve all of Westfield and the entire Hamilton County area."},{q:"Do you handle flooring projects?",a:"Yes. We install luxury vinyl plank, hardwood, tile, and other flooring materials. LVP has become the most popular choice for basements and main levels in Westfield."}]},
  "harmony":{name:"Harmony",city:"Westfield",citySlug:"home-remodeling-westfield-in",values:"$600K–$900K",tier:"high",character:"Master-planned community in Westfield with newer homes, trails, community amenities, and family-friendly design.",popular:"Basement finishing, bathroom upgrades, kitchen personalization, deck and patio additions.",faq:[{q:"What's the most popular project in Harmony?",a:"Basement finishing is the most requested project. Most Harmony homes have unfinished basements with 9-foot ceilings — perfect for entertainment areas, guest suites, or home offices."},{q:"Do you build decks in Harmony?",a:"Yes. We build composite and wood decks throughout Westfield. Composite decking lasts 25+ years with zero maintenance — ideal for busy families."},{q:"How do I request an estimate?",a:"Call (317) 279-4798 or fill out our online estimate form. We provide free in-home consultations throughout Westfield."}]},
  "grand-park":{name:"Grand Park Area",city:"Westfield",citySlug:"home-remodeling-westfield-in",values:"$500K–$800K",tier:"mid",character:"Family-oriented neighborhoods near Westfield's 400-acre Grand Park sports campus. Newer construction with active families and growing communities.",popular:"Basement finishing for active families, bathroom updates, kitchen upgrades, outdoor living spaces.",faq:[{q:"What projects do Grand Park area families request most?",a:"Basement finishing is by far the most popular. Families with kids in sports want entertainment spaces, playrooms, and guest bedrooms. Bathroom updates and deck additions are also common."},{q:"How much does a basement cost near Grand Park?",a:"Basement finishing in the Grand Park area typically costs $22,000-$40,000 depending on size and scope. We design basements as intentional living spaces — not just finished square footage."},{q:"Do you work with newer construction homes?",a:"Yes. Many homes near Grand Park are 3-10 years old. We specialize in upgrading builder-grade finishes to premium materials and finishing unfinished spaces."}]},
  /* NOBLESVILLE (4) */
  "bear-slide":{name:"Bear Slide / Golden Bear",city:"Noblesville",citySlug:"home-remodeling-noblesville-in",values:"$800K–$1.6M",tier:"luxury",character:"Luxury golf community in Noblesville with Jack Nicklaus-designed Golden Bear course, custom homes, and median sale prices exceeding $1M.",popular:"Premium bathroom renovations, kitchen redesigns, basement entertainment areas, outdoor living.",faq:[{q:"Do you work in Bear Slide and Golden Bear?",a:"Yes. Bear Slide is in our Noblesville service area. We deliver the premium craftsmanship that homeowners in luxury golf communities expect."},{q:"What does a bathroom remodel cost in Bear Slide?",a:"Bathroom remodels in Bear Slide typically range from $25,000-$55,000 depending on scope. These homes feature premium finishes, and remodels often include walk-in showers, heated floors, and custom tile."},{q:"What certifications do you hold?",a:"We're Schluter Pro Certified, meaning every bathroom we build uses the complete Schluter waterproofing system and qualifies for a 25-year manufacturer's warranty. All plumbing and electrical by licensed professionals."}]},
  "morse-reservoir":{name:"Morse Reservoir Waterfront",city:"Noblesville",citySlug:"home-remodeling-noblesville-in",values:"$600K–$1M+",tier:"high",character:"Lakefront and lake-adjacent properties on Morse Reservoir in Noblesville, ranging from established cottages to custom-built waterfront estates.",popular:"Bathroom renovations, outdoor living spaces with lake views, deck builds, kitchen updates, basement finishing.",faq:[{q:"Do you work on Morse Reservoir properties?",a:"Yes. We serve the entire Noblesville area including Morse Reservoir waterfront and lake-adjacent homes. Outdoor living projects are particularly popular for homes with lake views."},{q:"Can you build a deck with lake views?",a:"Yes. We design and build composite decks optimized for views and outdoor entertaining. Composite decking is especially smart near water — it's 100% waterproof and requires zero maintenance."},{q:"What bathroom upgrades are popular near Morse Reservoir?",a:"Walk-in showers with custom tile, modern vanities, and the Schluter waterproofing system are most requested. Waterfront homes especially benefit from proper waterproofing."}]},
  "finch-creek":{name:"Finch Creek",city:"Noblesville",citySlug:"home-remodeling-noblesville-in",values:"$600K–$800K",tier:"high",character:"Growing community in Noblesville with newer construction, family amenities, and homes with modern floor plans.",popular:"Basement finishing, bathroom upgrades from builder-grade, kitchen personalization, outdoor living.",faq:[{q:"What projects are popular in Finch Creek?",a:"Basement finishing and bathroom upgrades are most requested. Newer homes often have solid construction but builder-grade finishes that homeowners upgrade within the first few years."},{q:"How much does a bathroom upgrade cost in Finch Creek?",a:"Bathroom upgrades in Finch Creek typically range from $12,000-$28,000. Replacing builder-grade tile with custom tile and adding the Schluter waterproofing system is the most common project."},{q:"Do you serve Finch Creek?",a:"Yes. Finch Creek is in our core Noblesville service area. We serve all neighborhoods throughout Noblesville and Hamilton County."}]},
  "prairie-lakes":{name:"Prairie Lakes",city:"Noblesville",citySlug:"home-remodeling-noblesville-in",values:"$500K–$700K",tier:"mid",character:"Newer planned community in Noblesville with modern homes, walking trails, and family-oriented amenities.",popular:"Basement finishing, bathroom updates, flooring upgrades, deck additions.",faq:[{q:"What's the most popular project in Prairie Lakes?",a:"Basement finishing is most popular. Most Prairie Lakes homes have unfinished basements with modern ceiling heights — ideal for entertainment areas, home offices, or guest bedrooms."},{q:"How much does basement finishing cost in Prairie Lakes?",a:"Basement finishing in Prairie Lakes typically costs $22,000-$40,000 depending on size and features. We design basements as functional living spaces tailored to how your family actually uses the home."},{q:"Do you build outdoor living spaces?",a:"Yes. We build composite decks, patios, and outdoor entertaining areas throughout Noblesville."}]},
  /* FORTVILLE (2) */
  "downtown-fortville":{name:"Downtown Fortville",city:"Fortville",citySlug:"home-remodeling-fortville-in",values:"$250K–$400K",tier:"entry",character:"Small-town charm with older character homes near Fortville's downtown, tree-lined streets, and a close-knit community.",popular:"Bathroom modernization, kitchen updates, painting, flooring replacement.",faq:[{q:"Do you serve Fortville?",a:"Yes. Fortville is part of our service area. We've completed projects in the area including our Fortville Pavilion outdoor living project."},{q:"What does a bathroom remodel cost in Fortville?",a:"Bathroom remodels in Fortville typically range from $10,000-$22,000 depending on scope. We offer quality options at every budget level."},{q:"Can you modernize an older home in Fortville?",a:"Absolutely. We specialize in bringing modern finishes and proper waterproofing to older homes while respecting their character."}]},
  "buck-creek":{name:"Buck Creek Area",city:"Fortville",citySlug:"home-remodeling-fortville-in",values:"$300K–$500K",tier:"entry",character:"Rural-suburban area south of Fortville with newer homes, acreage properties, and a growing community that values outdoor living.",popular:"Outdoor living projects, deck builds, bathroom updates, basement finishing.",faq:[{q:"What projects are popular in the Buck Creek area?",a:"Outdoor living projects — decks, patios, and pavilions — are popular given the lot sizes and outdoor lifestyle. Bathroom renovations and basement finishing are also common."},{q:"Do you build pavilions and outdoor structures?",a:"Yes. Our Fortville Pavilion project is one of our most popular portfolio pieces. We design and build custom outdoor living spaces throughout the area."},{q:"How do I get a quote?",a:"Call (317) 279-4798 or request an estimate online. We provide free in-home consultations throughout our service area."}]},
  /* McCORDSVILLE (2) */
  "mccordsville-proper":{name:"McCordsville Proper",city:"McCordsville",citySlug:"home-remodeling-mccordsville-in",values:"$300K–$500K",tier:"entry",character:"Growing community east of Fishers with newer construction, family-oriented neighborhoods, and homeowners personalizing builder-grade homes.",popular:"Basement finishing, bathroom upgrades, kitchen personalization, flooring.",faq:[{q:"Do you serve McCordsville?",a:"Yes. McCordsville is in our service area. We work extensively in nearby Fishers and Geist, so McCordsville is convenient for our team."},{q:"What's the most popular project in McCordsville?",a:"Basement finishing and bathroom upgrades are most common. Newer homes in McCordsville have great bones but often need upgraded finishes."},{q:"How much does basement finishing cost in McCordsville?",a:"Basement finishing in McCordsville typically costs $20,000-$38,000 depending on size and scope."}]},
  "geist-mccordsville":{name:"Geist Area (McCordsville)",city:"McCordsville",showOn:["McCordsville","Geist"],citySlug:"home-remodeling-mccordsville-in",values:"$600K–$1.5M",tier:"luxury",character:"Luxury homes in the McCordsville portion of the Geist Reservoir area, where waterfront and water-view properties command premium values.",popular:"Premium bathroom renovations, kitchen remodels, outdoor living with reservoir views, basement finishing.",faq:[{q:"Is the McCordsville Geist area different from Fishers Geist?",a:"Geist Reservoir spans both Fishers and McCordsville. Homes on the McCordsville side offer the same waterfront luxury at slightly different price points. We serve both areas."},{q:"What does a bathroom remodel cost in Geist McCordsville?",a:"Bathroom remodels in the Geist area of McCordsville typically range from $20,000-$50,000 depending on scope and finish level."},{q:"Do you have experience with luxury Geist homes?",a:"Yes. We've completed multiple projects in the greater Geist area including full upper-level remodels and children's bathrooms."}]},
  /* PENDLETON (3) */
  "downtown-pendleton":{name:"Downtown Pendleton / Falls Park",city:"Pendleton",citySlug:"home-remodeling-pendleton-in",values:"$200K–$400K",tier:"entry",character:"Historic community near Falls Park with character homes, the Pendleton Pike corridor, and small-town charm.",popular:"Bathroom modernization, kitchen updates, flooring, painting, accessibility upgrades.",faq:[{q:"Do you serve Pendleton?",a:"Yes. Pendleton is part of our extended service area. We bring the same certified craftsmanship to Pendleton that we deliver throughout Hamilton County."},{q:"Can you modernize an older Pendleton home?",a:"Absolutely. Many Pendleton homes have solid construction that benefits from updated bathrooms, modernized kitchens, and improved finishes."},{q:"What does a bathroom remodel cost in Pendleton?",a:"Bathroom remodels in Pendleton typically range from $10,000-$22,000 depending on scope. We offer quality options at every budget level."}]},
  "south-pendleton":{name:"South Pendleton",city:"Pendleton",citySlug:"home-remodeling-pendleton-in",values:"$300K–$500K",tier:"entry",character:"Growing area south of downtown Pendleton with newer construction and families moving east from the Indianapolis metro.",popular:"Basement finishing, bathroom upgrades, kitchen personalization, deck additions.",faq:[{q:"What projects are popular in South Pendleton?",a:"Basement finishing and bathroom upgrades are most common in newer South Pendleton homes."},{q:"Do you build decks in Pendleton?",a:"Yes. We build composite and wood decks throughout our service area, including Pendleton."},{q:"How do I request an estimate?",a:"Call (317) 279-4798 or fill out our online form for a free consultation."}]},
  "pendleton-heights":{name:"Pendleton Heights",city:"Pendleton",citySlug:"home-remodeling-pendleton-in",values:"$250K–$400K",tier:"entry",character:"Established residential area in Pendleton with ranch homes, split-levels, and family neighborhoods near Pendleton Heights schools.",popular:"Bathroom renovations, kitchen updates, flooring replacement, painting.",faq:[{q:"What projects are common in Pendleton Heights?",a:"Bathroom renovations and kitchen updates are most requested. Many homes in this area were built in the 1980s-2000s and benefit from modernized finishes."},{q:"Do you offer free estimates in Pendleton?",a:"Yes. Call (317) 279-4798 for a free in-home consultation and detailed written estimate."},{q:"Are your contractors licensed?",a:"Yes. We're a licensed, bonded, and insured contractor. All plumbing by licensed plumbers, all electrical by licensed electricians."}]},
};

/* ─── Neighborhood Page Component ─────────────────── */
function NeighborhoodPage({hood}){
  const[faqOpen,setFaqOpen]=useState(null);
  const cityData=CITIES[hood.citySlug];
  const hoodKey=Object.keys(NEIGHBORHOODS).find(k=>NEIGHBORHOODS[k]===hood);
  const hoodSlug="remodeling-"+hoodKey+"-"+hood.city.toLowerCase().replace(/ /g,"-")+"-in";
  useCanonical(hoodSlug);

  useEffect(()=>{
    document.title=`Home Remodeling in ${hood.name}, ${hood.city}, IN | HomeStar Services & Contracting`;
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",`Expert home remodeling in ${hood.name}, ${hood.city}, Indiana. ${hood.character.split(".")[0]}. Schluter Pro Certified. Free estimates. (317) 279-4798`);
    window.scrollTo(0,0);
  },[hood]);

  useJobberForm();

  const services=[
    {name:"Bathroom Remodeling",slug:"bathroom-remodeling",desc:"Custom tile, walk-in showers, frameless glass, Schluter waterproofing with 25-year warranty."},
    {name:"Kitchen Remodeling",slug:"kitchen-remodeling",desc:"Custom cabinetry, quartz countertops, modern lighting, and layouts designed for how you live."},
    {name:"Basement Finishing",slug:"basement-finishing",desc:"Entertainment areas, guest suites, home offices — transforming unused space into your favorite room."},
    {name:"Flooring Services",slug:"flooring-services",desc:"Luxury vinyl plank, hardwood, tile — installed with precision for a flawless finish."},
    {name:"Painting Services",slug:"painting-services",desc:"Interior and exterior painting with meticulous prep work and premium materials."},
    {name:"Decks & Outdoor Living",slug:"deck-builder",desc:"Composite and wood decks, patios, and outdoor living spaces built to last."},
  ];
  const citySlugShort=hood.city.toLowerCase().replace(/ /g,"-");
  const sameCity=Object.entries(NEIGHBORHOODS).filter(([k,v])=>v.citySlug===hood.citySlug&&v!==hood);

  /* Tier-based content generation */
  const isLuxury=hood.tier==="ultra"||hood.tier==="luxury";
  const isHigh=hood.tier==="high";
  const tierIntro=isLuxury
    ?`${hood.name} is one of ${hood.city}'s most prestigious addresses. Homeowners here have invested significantly in their properties, and they expect a remodeling partner who delivers craftsmanship to match. At HomeStar, we understand that luxury homes require meticulous attention to detail, premium materials, and flawless execution — from the waterproofing behind your tile to the finish on your fixtures.`
    :isHigh
    ?`${hood.name} is an established ${hood.city} neighborhood where homeowners take pride in their homes. Whether you're updating finishes that have served you well for years or reimagining a space entirely, HomeStar brings the same certified craftsmanship and transparent process to every project — regardless of size.`
    :`Homeowners in ${hood.name} are discovering that smart remodeling upgrades — from proper waterproofing to quality materials — make a meaningful difference in both daily comfort and long-term value. HomeStar brings professional, certified craftsmanship to every project in ${hood.name}, treating your home with the same care we'd give our own.`;

  const tierWhy=isLuxury
    ?`In a community like ${hood.name}, the details matter. That's why we exclusively use the Schluter waterproofing system on every bathroom — the same system specified in luxury hotels and high-end residences. Our tile installers are Schluter Pro Certified, meaning your project qualifies for a full 25-year manufacturer's warranty. All plumbing by licensed plumbers. All electrical by licensed electricians. We provide 3D design renderings before any construction begins, so you see exactly what you're getting.`
    :`We don't cut corners — on any project, in any neighborhood. Every bathroom HomeStar builds uses the complete Schluter waterproofing system with a 25-year manufacturer's warranty. All plumbing is done by licensed plumbers. All electrical by licensed electricians. We provide 3D design renderings before construction begins and communicate with you daily throughout the project.`;

  /* Get projects in this city */
  const cityProjects=PROJECTS.filter(p=>p.title.toLowerCase().includes(hood.city.toLowerCase())||p.title.toLowerCase().includes("geist"));
  const featuredProject=cityProjects.length>0?cityProjects[0]:null;

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:`${hood.city}, IN`,url:"/"+hood.citySlug},{name:hood.name}]}/>
      <FaqSchema faqs={hood.faq}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",description:`Expert home remodeling in ${hood.name}, ${hood.city}, Indiana.`,url:"https://www.thehomestarservice.com",telephone:"+1-317-279-4798",areaServed:{"@type":"Place",name:`${hood.name}, ${hood.city}, IN`},aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"}})}}/>

      <Nav isCity/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>SCHLUTER PRO CERTIFIED</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(28px,4.5vw,44px)",lineHeight:1.15,marginBottom:20}}>Home Remodeling in {hood.name}, {hood.city}, Indiana</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:17,lineHeight:1.7,maxWidth:620,margin:"0 auto 32px"}}>{hood.character}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#hood-estimate" className="btn-g">Get a Free Estimate {I.arrow}</a>
            <a href="tel:+13172794798" className="btn-w">{I.phone} (317) 279-4798</a>
          </div>
          {/* Trust indicators */}
          <div className="fu d5" style={{display:"flex",justifyContent:"center",gap:36,marginTop:36}}>
            {[{val:"5.0★",lab:"Google Rating"},{val:"25-Year",lab:"Schluter Warranty"},{val:"100%",lab:"Licensed & Insured"}].map(t=>
              <div key={t.lab} style={{textAlign:"center"}}>
                <div className="display" style={{color:"#fff",fontSize:22}}>{t.val}</div>
                <div style={{color:"rgba(255,255,255,.35)",fontSize:11,letterSpacing:".04em"}}>{t.lab}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About the Neighborhood */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="lab">About {hood.name}</div>
            <h2 className="ttl">Why {hood.name} Homeowners Choose HomeStar</h2>
          </div>
          <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85,marginBottom:20}}>{hood.character}</p>
          <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85,marginBottom:20}}>{tierIntro}</p>
          <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85,marginBottom:20}}>{tierWhy}</p>
        </div>
      </section>

      {/* What We Do in This Neighborhood */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:900}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="lab">Popular in {hood.name}</div>
            <h2 className="ttl">What {hood.name} Homeowners Are Investing In</h2>
            <p className="sub" style={{margin:"0 auto"}}>{hood.popular}</p>
          </div>
          {/* Differentiators */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18,marginTop:32}}>
            {[
              {icon:I.shield||I.check,title:"25-Year Waterproofing",desc:"Every bathroom built on the complete Schluter system — 100% waterproof, backed by the manufacturer."},
              {icon:I.check,title:"Licensed Tradespeople",desc:"All plumbing by licensed plumbers. All electrical by licensed electricians. No exceptions."},
              {icon:I.check,title:"3D Design Renderings",desc:"See your renovation in full detail before any construction begins. No surprises."},
              {icon:I.check,title:"Family-Owned & Local",desc:"Co-owned by Eric and Robb. You work directly with the owners throughout your project."},
            ].map(d=>
              <div key={d.title} style={{background:"#fff",borderRadius:14,padding:"24px 22px",border:`1px solid ${C.sand}`}}>
                <div style={{color:C.green,marginBottom:10}}>{d.icon}</div>
                <h4 className="display" style={{color:C.navy,fontSize:15,marginBottom:8}}>{d.title}</h4>
                <p style={{color:C.gray,fontSize:13,lineHeight:1.7,margin:0}}>{d.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="lab">Our Services</div>
            <h2 className="ttl">Remodeling Services in {hood.name}, {hood.city}</h2>
            <p className="sub" style={{margin:"0 auto"}}>Every service backed by licensed professionals, certified craftsmanship, and transparent pricing.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
            {services.map(s=>
              <a key={s.name} href={`/${s.slug}-${citySlugShort}-in`} style={{padding:"28px 24px",borderRadius:14,background:C.cream,border:`1px solid ${C.sand}`,textDecoration:"none",transition:"all .3s",display:"block"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.06)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                <h4 className="display" style={{color:C.navy,fontSize:16,marginBottom:8}}>{s.name}</h4>
                <p style={{color:C.gray,fontSize:13,lineHeight:1.7,marginBottom:14}}>{s.desc}</p>
                <span style={{color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>{s.name} in {hood.city} {I.arrow}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Project (if available in this city) */}
      {featuredProject&&(
        <section className="sec" style={{background:C.cream}}>
          <div className="sec-in" style={{maxWidth:800}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div className="lab">Recent Work Near {hood.name}</div>
              <h2 className="ttl">{featuredProject.title}</h2>
            </div>
            <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`}}>
              <img src={featuredProject.images[0].src} alt={featuredProject.images[0].alt} style={{width:"100%",height:360,objectFit:"cover"}} loading="lazy"/>
              <div style={{padding:"24px 28px",background:"#fff"}}>
                <p style={{color:C.grayDark,fontSize:14,lineHeight:1.75,marginBottom:16}}>{featuredProject.desc}</p>
                <a href="/#projects" style={{color:C.green,fontWeight:700,fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>View All Projects {I.arrow}</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:780}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{hood.name} Remodeling FAQ</h2>
            <p className="sub" style={{margin:"0 auto"}}>Have a question about remodeling in {hood.name}? We've got answers.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {hood.faq.map((f,i)=>
              <div key={i} style={{background:C.cream,borderRadius:12,overflow:"hidden",border:`1px solid ${faqOpen===i?C.green:C.sand}`,transition:"border-color .3s"}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?260:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Other Neighborhoods + City Link */}
      {sameCity.length>0&&(
        <section className="sec" style={{background:C.cream}}>
          <div className="sec-in">
            <div style={{textAlign:"center",marginBottom:32}}>
              <div className="lab">Other Neighborhoods</div>
              <h2 className="ttl">More Neighborhoods We Serve in {hood.city}</h2>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10}}>
              {sameCity.map(([k,v])=>
                <a key={k} href={`/remodeling-${k}-${v.city.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"10px 20px",borderRadius:50,background:"#fff",border:`1px solid ${C.sand}`,color:C.navy,fontWeight:600,fontSize:13,textDecoration:"none",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.color=C.navy}}>
                  {v.name}
                </a>
              )}
            </div>
            <div style={{textAlign:"center",marginTop:20}}>
              <a href={`/${hood.citySlug}`} style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none"}}>← All {hood.city} Remodeling Services</a>
            </div>
          </div>
        </section>
      )}

      {/* Estimate Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in" style={{maxWidth:1000}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}}>
            <div style={{padding:"20px 0"}}>
              <div className="lab" style={{color:C.green}}>Get Started</div>
              <h2 className="display" style={{color:"#fff",fontSize:"clamp(24px,3vw,32px)",marginBottom:16}}>Ready to Start Your {hood.name} Remodel?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.7,marginBottom:24}}>Request a free, no-obligation estimate. We'll visit your {hood.name} home, discuss your vision, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <a href="tel:+13172794798" style={{color:"#fff",fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>{I.phone} (317) 279-4798</a>
                <a href="mailto:eric@thehomestarservice.com" style={{color:"#fff",fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>{I.mail||"✉"} eric@thehomestarservice.com</a>
              </div>
              <div style={{marginTop:24}}>
                <a href={`/${hood.citySlug}`} style={{color:C.green,fontWeight:600,fontSize:13,textDecoration:"none"}}>← Back to {hood.city} services</a>
              </div>
            </div>
            <div id="hood-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Serving {hood.name} and all of {hood.city}, IN</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer isCity/>
    </div>
  );
}

function CityPage({data}){
  const[faqOpen,setFaqOpen]=useState(null);
  const citySlug="home-remodeling-"+data.city.toLowerCase().replace(/ /g,"-")+"-in";
  useCanonical(citySlug);

  useEffect(()=>{
    document.title=data.title+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",data.metaDesc);
  },[data]);

  useJobberForm();

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      {/* Schema.org for this city */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",description:data.metaDesc,url:"https://www.thehomestarservice.com",telephone:"+1-317-279-4798",address:{"@type":"PostalAddress",addressLocality:data.city,addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:data.lat,longitude:data.lng},areaServed:{"@type":"City",name:data.city},aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"},priceRange:"$$"})}}/>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:"Service Areas",url:"/#areas"},{name:`${data.city}, IN`}]}/>
      <FaqSchema faqs={data.faq}/>

      <Nav isCity/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>SERVING {data.city.toUpperCase()}, INDIANA</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(32px,5vw,52px)",lineHeight:1.1,marginBottom:20}}>{data.heroHeading}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:17,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px"}}>{data.heroSub}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#city-estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate in {data.city} {I.arrow}</a>
            <a href="/" className="btn-o">View All Our Work</a>
          </div>
          <div className="fu d5" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:32,marginTop:44}}>
            {[{n:"5.0★",l:"Google Rating"},{n:"25-Year",l:"Schluter Warranty"},{n:"100%",l:"Licensed & Insured"}].map(b=>
              <div key={b.l}><div className="display" style={{color:C.green,fontSize:24,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600}}>{b.l}</div></div>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div className="lab">About HomeStar in {data.city}</div>
            <h2 className="ttl">Why {data.city} Homeowners Choose HomeStar</h2>
          </div>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,marginBottom:20}}>{data.intro}</p>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85}}>{data.whyUs}</p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:1000}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="lab">The HomeStar Difference</div>
            <h2 className="ttl">What Sets Us Apart in {data.city}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:18}}>
            {[
              {icon:I.shield||I.check,title:"25-Year Waterproofing",desc:"Every bathroom built on the complete Schluter system — Ditra for floors, Kerdi for walls — 100% waterproof, backed by the manufacturer."},
              {icon:I.check,title:"Licensed Tradespeople",desc:"All plumbing by licensed plumbers. All electrical by licensed electricians. Not general laborers — licensed professionals on every job."},
              {icon:I.check,title:"3D Design Renderings",desc:"See your renovation in full detail before any construction begins. Review every material, fixture, and layout decision. No surprises."},
              {icon:I.check,title:"Family-Owned & Local",desc:"Co-owned by Eric and Robb. You work directly with the owners — not a project manager who's never swung a hammer."},
            ].map(d=>
              <div key={d.title} style={{background:"#fff",borderRadius:14,padding:"28px 24px",border:`1px solid ${C.sand}`,transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.06)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                <div style={{color:C.green,marginBottom:12}}>{d.icon}</div>
                <h4 className="display" style={{color:C.navy,fontSize:16,marginBottom:10}}>{d.title}</h4>
                <p style={{color:C.gray,fontSize:13,lineHeight:1.7,margin:0}}>{d.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services in this city — with descriptions */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our Services in {data.city}</div>
            <h2 className="ttl">Remodeling Services in {data.city}, Indiana</h2>
            <p className="sub" style={{margin:"0 auto"}}>Every service backed by licensed professionals, certified craftsmanship, and transparent pricing.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
            {[
              {name:"Bathroom Remodeling",slug:"bathroom-remodeling",desc:"Custom tile, walk-in showers, frameless glass, Schluter waterproofing with 25-year warranty."},
              {name:"Kitchen Remodeling",slug:"kitchen-remodeling",desc:"Custom cabinetry, quartz countertops, modern lighting, and layouts designed for how you live."},
              {name:"Basement Finishing",slug:"basement-finishing",desc:"Entertainment areas, guest suites, home offices — transforming unused space into your favorite room."},
              {name:"Flooring Services",slug:"flooring-services",desc:"Luxury vinyl plank, hardwood, tile — installed with precision for a flawless finish."},
              {name:"Painting Services",slug:"painting-services",desc:"Interior and exterior painting with meticulous prep work and premium materials."},
              {name:"Decks & Outdoor Living",slug:"deck-builder",desc:"Composite and wood decks, patios, and outdoor living spaces built to last."},
            ].map(s=>
              <a key={s.name} href={`/${s.slug}-${data.city.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"28px 24px",borderRadius:14,background:C.cream,border:`1px solid ${C.sand}`,textDecoration:"none",transition:"all .3s",display:"block"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.06)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                <h4 className="display" style={{color:C.navy,fontSize:16,marginBottom:8}}>{s.name}</h4>
                <p style={{color:C.gray,fontSize:13,lineHeight:1.7,marginBottom:14}}>{s.desc}</p>
                <span style={{color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>{s.name} in {data.city} {I.arrow}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects in this City */}
      {(()=>{
        const cityProjects=PROJECTS.filter(p=>p.title.toLowerCase().includes(data.city.toLowerCase())||(data.city==="Geist"&&p.title.toLowerCase().includes("geist")));
        if(cityProjects.length===0)return null;
        return(
          <section className="sec" style={{background:C.cream}}>
            <div className="sec-in">
              <div style={{textAlign:"center",marginBottom:40}}>
                <div className="lab">Our Work in {data.city}</div>
                <h2 className="ttl">Recent Projects in {data.city}</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
                {cityProjects.slice(0,3).map((p,i)=>
                  <div key={i} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,background:"#fff",transition:"all .3s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.06)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                    <img src={p.images[0].src} alt={p.images[0].alt} style={{width:"100%",height:220,objectFit:"cover"}} loading="lazy"/>
                    <div style={{padding:"20px 22px"}}>
                      <h4 className="display" style={{color:C.navy,fontSize:15,marginBottom:6}}>{p.title}</h4>
                      <p style={{color:C.gray,fontSize:13,lineHeight:1.6,margin:0}}>{p.desc}</p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{textAlign:"center",marginTop:28}}>
                <a href="/#projects" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6}}>View All Projects {I.arrow}</a>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Neighborhoods */}
      {(()=>{
        const cityHoods=Object.entries(NEIGHBORHOODS).filter(([k,v])=>v.showOn?v.showOn.includes(data.city):v.city===data.city);
        return(
          <section className="sec" style={{background:"#fff"}}>
            <div className="sec-in">
              <div style={{textAlign:"center",marginBottom:32}}>
                <div className="lab">Neighborhoods</div>
                <h2 className="ttl">Neighborhoods We Serve in {data.city}</h2>
              </div>
              {cityHoods.length>0?(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
                  {cityHoods.map(([k,v])=>
                    <a key={k} href={`/remodeling-${k}-${v.city.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"18px 22px",borderRadius:12,background:C.cream,border:`1px solid ${C.sand}`,textDecoration:"none",transition:"all .3s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)"}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                      <h4 className="display" style={{color:C.navy,fontSize:15,marginBottom:4}}>{v.name}</h4>
                      <p style={{color:C.gray,fontSize:12,margin:0}}>View remodeling services →</p>
                    </a>
                  )}
                </div>
              ):(
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10}}>
                  {data.neighborhoods.map(n=>
                    <span key={n} style={{padding:"8px 18px",borderRadius:50,background:C.cream,color:C.grayDark,fontSize:13,fontWeight:600}}>{n}</span>
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:700}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{data.city} Remodeling FAQ</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {data.faq.map((f,i)=>
              <div key={i} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:`1px solid ${faqOpen===i?C.green:C.sand}`,transition:"border-color .3s"}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?260:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + Jobber Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started in {data.city}</div>
              <h2 className="ttl ttl-w">Ready to Start Your {data.city} Remodel?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate. We'll visit your {data.city} home, discuss your vision, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>(317) 279-4798</div></div></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>eric@thehomestarservice.com</div></div></div>
              </div>
              <div style={{marginTop:28}}>
                <a href="/" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← Back to main site</a>
              </div>
            </div>
            <div id="city-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free Estimate in {data.city}</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCityLinks currentCity={data.city}/>

      <Footer isCity/>
    </div>
  );
}

/* ─── Service Pages ──────────────────────────────────── */
const SERVICE_PAGES = {
  "bathroom-remodeling": {
    service: "Bathroom Remodeling",
    title: "Bathroom Remodeling in Hamilton County, IN",
    metaDesc: "Expert bathroom remodeling in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Schluter Pro Certified with 25-year waterproofing warranty. Walk-in showers, custom tile, vanities. Free estimates. (317) 279-4798",
    heroHeading: "Expert Bathroom Remodeling in Hamilton County, Indiana",
    heroSub: "From walk-in showers and custom tile to complete spa-level transformations — our Schluter Pro Certified team delivers bathrooms built to last decades, not just years.",
    intro: "Your bathroom should be more than functional — it should be a space you enjoy. At HomeStar Services & Contracting, we specialize in bathroom renovations that combine beautiful design with bulletproof construction. Every shower, every floor, every wall is built on our complete Schluter waterproofing system — the same system trusted by luxury builders worldwide.",
    highlights: [
      {title:"Schluter Pro Certified",desc:"Our tile installers are factory-certified by Schluter Systems. Every bathroom gets Ditra for floors, Kerdi for walls, and Schluter shower pans — 100% waterproof, backed by a 25-year manufacturer's warranty."},
      {title:"Licensed Plumbers & Electricians",desc:"All plumbing and electrical work is performed by licensed, insured professionals — not general laborers. This means code-compliant work that passes inspection the first time."},
      {title:"3D Design Renderings",desc:"Before we touch a hammer, you see your new bathroom in realistic 3D renderings. Choose finishes, layouts, and fixtures with confidence before construction begins."},
      {title:"1-Year Workmanship Warranty",desc:"Every project is backed by our 1-year workmanship warranty. If something isn't right, we come back and fix it. Quality work should hold up long after the last day on the job."},
    ],
    whatWeDoIntro: "Whether you're updating a half bath or gutting a master suite, we handle every detail from design through final inspection.",
    whatWeDo: [
      "Custom tile showers — walk-in, curbless, double shower, floor-to-ceiling",
      "Freestanding and built-in soaking tubs",
      "Vanity installation — single, double, floating, and custom",
      "Heated flooring systems",
      "Frameless glass shower enclosures",
      "Exhaust fan upgrades and lighting design",
      "ADA-compliant and aging-in-place modifications",
      "Complete gut renovations and layout changes",
    ],
    costIntro: "Bathroom remodel costs in Hamilton County vary by scope. Here's what homeowners in Fishers, Carmel, and Noblesville typically invest:",
    costs: [
      {level:"Basic Refresh",range:"$8,000 – $12,000",desc:"New vanity, faucet, mirror, light fixture, paint, and flooring. Layout stays the same."},
      {level:"Mid-Range Remodel",range:"$15,000 – $30,000",desc:"Full gut — new tile, shower, vanity, countertop, fixtures, lighting, exhaust. Some plumbing changes."},
      {level:"Spa-Level Renovation",range:"$30,000 – $50,000+",desc:"Premium finishes, frameless glass, freestanding tub, heated floors, dual vanities, full layout reconfiguration."},
    ],
    projectCats: ["Bathroom","Children's Bathroom"],
    faq: [
      {q:"How long does a bathroom remodel take?",a:"Most bathroom remodels take 2 to 4 weeks. A basic vanity refresh can be done in about a week, while a full gut renovation with custom tile work typically takes 3 to 4 weeks. We provide a detailed project timeline before work begins."},
      {q:"Do I need a permit for a bathroom remodel?",a:"If the project involves plumbing or electrical changes, a permit is typically required. We handle the entire permitting process for all Hamilton County municipalities — Fishers, Carmel, Noblesville, Westfield, and Zionsville."},
      {q:"What is the Schluter waterproofing system?",a:"The Schluter system is a complete waterproofing solution for tile installations. It includes Ditra uncoupling membrane for floors, Kerdi waterproof membrane for walls, and Schluter shower pans. Unlike standard cement board, which absorbs moisture over time, Schluter creates a 100% waterproof barrier that prevents mold, rot, and tile failure."},
      {q:"Why does waterproofing matter for a bathroom remodel?",a:"Most tile failures aren't caused by bad tile — they're caused by moisture getting behind the tile and damaging the substrate. Standard cement board absorbs water. The Schluter system is 100% waterproof and also absorbs structural movement, preventing cracked grout and loose tiles."},
      {q:"How much does a walk-in shower remodel cost?",a:"A walk-in shower remodel in Hamilton County typically costs $12,000 to $25,000 depending on tile selection, size, and fixtures. Floor-to-ceiling tile and frameless glass add to the cost. We provide free, detailed estimates."},
      {q:"Can you work with my existing bathroom layout?",a:"Absolutely. Many of our projects keep the existing layout and focus on upgrading finishes, fixtures, and waterproofing. If you want to change the layout — like converting a tub to a walk-in shower — we handle the plumbing relocation as well."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
  "basement-finishing": {
    service: "Basement Finishing",
    title: "Basement Finishing in Hamilton County, IN",
    metaDesc: "Professional basement finishing in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Entertainment rooms, guest suites, home offices. Licensed contractors. Free estimates. (317) 279-4798",
    heroHeading: "Professional Basement Finishing in Hamilton County, Indiana",
    heroSub: "Turn your unfinished basement into the most-used room in your home. Entertainment spaces, guest suites, home offices — designed for your lifestyle and built to last.",
    intro: "Your unfinished basement is the most underutilized space in your home — and finishing it is one of the smartest investments a Hamilton County homeowner can make. You already own the space and the foundation is already built. At HomeStar Services & Contracting, we transform empty basements into comfortable, functional living areas that add real value to your home and your daily life.",
    highlights: [
      {title:"Complete Turnkey Builds",desc:"We handle everything from framing and insulation to drywall, flooring, lighting, plumbing, and electrical. One contractor, one point of contact, one seamless project from start to finish."},
      {title:"Licensed Plumbers & Electricians",desc:"All plumbing and electrical work is performed by licensed, insured professionals. This matters especially in basements where proper egress lighting, bathroom rough-ins, and moisture management are critical."},
      {title:"Moisture Management",desc:"Indiana basements deal with moisture. We address it upfront with proper vapor barriers, drainage solutions, and moisture-resistant materials that prevent problems before they start."},
      {title:"1-Year Workmanship Warranty",desc:"Every basement finish is backed by our 1-year workmanship warranty. If something isn't right, we come back and fix it — no questions asked."},
    ],
    whatWeDoIntro: "Whether you want a simple open-concept space or a fully built-out lower level with multiple rooms, we design and build basements that match how you actually live.",
    whatWeDo: [
      "Family entertainment rooms with media and gaming areas",
      "Guest suites with bedroom, bathroom, and closet",
      "Home offices and remote work spaces",
      "Wet bars and kitchenettes",
      "Home gyms and fitness rooms",
      "Kids' playrooms and teen hangout spaces",
      "Laundry room additions and upgrades",
      "Full basement bathrooms with custom tile showers",
    ],
    costIntro: "Basement finishing costs in Hamilton County depend on the size of your basement and the scope of the build. Here's what homeowners in Fishers, Carmel, and Westfield typically invest:",
    costs: [
      {level:"Basic Finish",range:"$20,000 – $30,000",desc:"Open-concept layout with drywall, flooring, recessed lighting, and paint. Great for a simple family room or play area."},
      {level:"Mid-Range Build",range:"$30,000 – $45,000",desc:"Multiple rooms, upgraded flooring (LVP or carpet), bathroom rough-in or full bath, improved lighting, and built-in storage."},
      {level:"Full Build-Out",range:"$45,000 – $65,000+",desc:"Complete lower level with guest suite, full bathroom, wet bar or kitchenette, home office, and premium finishes throughout."},
    ],
    projectCats: ["Basement"],
    faq: [
      {q:"How long does a basement finish take?",a:"Most basement finishes in Hamilton County take 6 to 12 weeks depending on scope. A basic open-concept finish is on the shorter end, while a full build-out with bathroom, wet bar, and multiple rooms takes closer to 10-12 weeks. We provide a detailed project timeline before work begins."},
      {q:"Do I need a permit to finish my basement?",a:"Yes — finishing a basement requires permits in all Hamilton County municipalities for framing, electrical, plumbing, and HVAC work. We handle the entire permitting and inspection process for you in Fishers, Carmel, Noblesville, Westfield, and Zionsville."},
      {q:"Will finishing my basement add value to my home?",a:"Absolutely. A finished basement in Hamilton County typically recoups 70-80% of its cost at resale while making your home significantly more attractive to buyers. In competitive markets like Carmel, Fishers, and Westfield, a finished basement can be the differentiator that gets your home sold faster."},
      {q:"What about moisture and waterproofing?",a:"Indiana basements can have moisture issues, so we address this upfront during our initial walkthrough. We use proper vapor barriers, moisture-resistant materials, and drainage solutions as needed. If there's an existing water issue, we'll identify it and recommend a solution before finishing begins."},
      {q:"Can you add a bathroom to my basement?",a:"Yes — adding a basement bathroom is one of our most popular requests. If your home has a bathroom rough-in (pre-plumbed drain lines), the cost is lower. If not, our licensed plumbers can install new drain lines. Every basement bathroom we build uses our Schluter waterproofing system with a 25-year warranty."},
      {q:"What flooring works best in a basement?",a:"Luxury vinyl plank (LVP) is the most popular choice for Hamilton County basements because it's waterproof, durable, and looks great. Carpet is also popular for bedrooms and entertainment areas. We help you choose the right material for each zone of your basement based on how you'll use the space."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
  "kitchen-remodeling": {
    service: "Kitchen Remodeling",
    title: "Kitchen Remodeling in Hamilton County, IN",
    metaDesc: "Quality kitchen remodeling in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Custom cabinetry, countertops, flooring, lighting. Licensed contractors. Free estimates. (317) 279-4798",
    heroHeading: "Quality Kitchen Remodeling in Hamilton County, Indiana",
    heroSub: "The kitchen is the heart of your home. We build spaces that balance function and beauty — thoughtful layouts, quality cabinetry, and finishes that elevate your everyday routine.",
    intro: "A great kitchen remodel isn't just about looks — it's about making your daily life easier, more enjoyable, and more efficient. At HomeStar Services & Contracting, we approach every kitchen project with a focus on smart layouts, durable materials, and finishes that hold up to real family life. Whether you're updating countertops and cabinets or doing a full gut renovation, we bring the same precision and transparency to every kitchen we build.",
    highlights: [
      {title:"Thoughtful Design",desc:"We start with how you actually use your kitchen — cooking habits, family size, entertaining style — then design a layout that works. You'll see 3D renderings before construction begins so every detail is right."},
      {title:"Licensed Plumbers & Electricians",desc:"Kitchen remodels involve gas lines, water supply, drainage, and electrical circuits. All of this work is performed by licensed, insured professionals — ensuring code compliance and safety."},
      {title:"Quality Materials",desc:"We help you select cabinetry, countertops, flooring, and hardware that balance your budget with long-term durability. No builder-grade shortcuts — just honest recommendations based on what works."},
      {title:"1-Year Workmanship Warranty",desc:"Every kitchen project is backed by our 1-year workmanship warranty. We stand behind our craftsmanship long after the last cabinet door is hung."},
    ],
    whatWeDoIntro: "From minor cosmetic updates to full kitchen transformations, we handle every phase of the project in-house.",
    whatWeDo: [
      "Cabinet refacing, replacement, and custom installations",
      "Countertop installation — quartz, granite, butcher block, marble",
      "Kitchen flooring — hardwood, luxury vinyl plank, tile",
      "Backsplash design and tile installation",
      "Recessed lighting, under-cabinet LEDs, and pendant fixtures",
      "Plumbing — sink, garbage disposal, dishwasher hookup",
      "Kitchen island builds and layout reconfiguration",
      "Appliance installation and finish carpentry",
    ],
    costIntro: "Kitchen remodel costs in Hamilton County vary widely based on scope. Here's what homeowners in Fishers, Carmel, and Westfield typically invest:",
    costs: [
      {level:"Cosmetic Refresh",range:"$10,000 – $20,000",desc:"New countertops, cabinet refacing or paint, updated hardware, fresh backsplash, and lighting upgrades. Layout stays the same."},
      {level:"Mid-Range Remodel",range:"$25,000 – $50,000",desc:"New cabinets, countertops, flooring, backsplash, lighting, sink, and faucet. May include minor layout changes and appliance upgrades."},
      {level:"Full Kitchen Renovation",range:"$50,000 – $80,000+",desc:"Complete gut — new layout, custom cabinetry, premium countertops, hardwood or tile flooring, island, high-end appliances, and full lighting design."},
    ],
    projectCats: ["Kitchen"],
    faq: [
      {q:"How long does a kitchen remodel take?",a:"Kitchen remodels in Hamilton County typically take 4 to 8 weeks depending on scope. A cosmetic refresh with new countertops and cabinet refacing can be done in 3-4 weeks, while a full gut renovation with layout changes takes 6-8 weeks. We provide a detailed timeline before work begins."},
      {q:"What kitchen upgrades add the most value?",a:"Based on what we see in Hamilton County homes, cabinet replacement or refacing, quartz countertops, and modern lighting deliver the strongest returns. Mid-range kitchen remodels typically recoup 60-75% of their cost at resale, while minor cosmetic updates can return 75-85%."},
      {q:"Should I choose quartz or granite countertops?",a:"Both are excellent choices. Quartz is the most popular in Hamilton County right now — it's non-porous, low-maintenance, and available in a huge range of styles. Granite offers unique natural patterns and excellent durability. We bring samples to your home so you can compare in your own lighting."},
      {q:"Do I need to move out during a kitchen remodel?",a:"Most homeowners stay in their home during a kitchen remodel. We help you set up a temporary kitchen area with a microwave, coffee maker, and portable cooktop. It's not luxurious, but it works. We also contain dust and debris to keep the rest of your home clean."},
      {q:"Can you work with my existing layout?",a:"Absolutely. Many of our kitchen projects keep the existing plumbing and electrical layout, which reduces cost significantly. If you want to change the layout — like adding an island or moving the sink — we handle the plumbing and electrical relocation with licensed tradespeople."},
      {q:"Do you handle permits for kitchen remodels?",a:"Yes. Kitchen remodels that involve plumbing, electrical, or structural changes require permits in Hamilton County. We manage the entire permitting and inspection process in Fishers, Carmel, Noblesville, Westfield, and Zionsville."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
  "decks-outdoor-living": {
    service: "Decks & Outdoor Living",
    title: "Decks & Outdoor Living in Hamilton County, IN",
    metaDesc: "Custom decks, patios, pavilions & outdoor living spaces in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Composite and wood decks. Licensed contractors. Free estimates. (317) 279-4798",
    heroHeading: "Custom Decks & Outdoor Living in Hamilton County, Indiana",
    heroSub: "From composite decks and stamped concrete patios to covered pavilions with outdoor bars — we design and build outdoor spaces that stand up to Indiana weather and elevate how you live.",
    intro: "Your backyard should be an extension of your home — not an afterthought. At HomeStar Services & Contracting, we design and build outdoor living spaces that are functional, beautiful, and built to handle Indiana's four-season climate. Whether you want a simple deck for weekend grilling or a full outdoor entertaining area with a covered pavilion and bar, we bring the same craftsmanship we put into every interior project to your exterior spaces.",
    highlights: [
      {title:"Composite & Wood Options",desc:"We build with both premium composite decking (Trex, TimberTech) for low-maintenance longevity and pressure-treated wood for budget-conscious projects. We'll help you choose the right material for your lifestyle and budget."},
      {title:"Custom Design",desc:"Every outdoor space is designed around how you actually plan to use it — dining, lounging, grilling, entertaining. We create distinct zones, consider traffic flow, and design for year-round enjoyment."},
      {title:"Licensed & Insured",desc:"All structural work, electrical (for landscape lighting and outlets), and any plumbing (for outdoor kitchens) is performed by licensed professionals. Fully insured and bonded."},
      {title:"Built for Indiana Weather",desc:"We select materials and construction methods specifically suited for Indiana's freeze-thaw cycles, humidity, and heavy rains. Proper footings, drainage, and weather-resistant hardware ensure your outdoor space lasts."},
    ],
    whatWeDoIntro: "From simple deck builds to elaborate outdoor living areas, we handle the full scope of exterior projects.",
    whatWeDo: [
      "Composite deck builds — Trex, TimberTech, and similar brands",
      "Pressure-treated wood decks and pergolas",
      "Covered pavilions with stained wood beams and stone columns",
      "Stamped and decorative concrete patios",
      "Outdoor bar areas and kitchenette spaces",
      "Deck railing systems — composite, aluminum, cable",
      "Landscape lighting and electrical for outdoor areas",
      "Screened porches and three-season rooms",
    ],
    costIntro: "Outdoor living project costs in Hamilton County depend on the size, materials, and complexity. Here's what homeowners in Fishers, Carmel, and Noblesville typically invest:",
    costs: [
      {level:"Basic Deck Build",range:"$8,000 – $18,000",desc:"Pressure-treated wood deck with standard railing, stairs, and basic layout. Great for a functional outdoor space on a budget."},
      {level:"Composite Deck",range:"$18,000 – $35,000",desc:"Premium composite decking with aluminum or composite railing, dual staircases, and a spacious layout. Low-maintenance for 25+ years."},
      {level:"Full Outdoor Living",range:"$35,000 – $60,000+",desc:"Covered pavilion, stone columns, outdoor bar, stamped concrete patio, landscape lighting, and custom design. Year-round entertaining."},
    ],
    projectCats: ["Exterior"],
    faq: [
      {q:"How long does it take to build a deck?",a:"A standard deck build in Hamilton County takes 1 to 3 weeks depending on size and complexity. A simple pressure-treated wood deck can be done in about a week, while a large composite deck with multiple levels and custom railing takes 2-3 weeks. Covered pavilions and full outdoor living spaces take 3-6 weeks."},
      {q:"Composite or wood — which is better?",a:"It depends on your priorities. Composite costs more upfront but requires virtually zero maintenance and lasts 25-30 years. Pressure-treated wood is more affordable initially but requires annual staining and sealing, and boards will eventually need replacement. For most Hamilton County homeowners who want to enjoy their deck rather than maintain it, composite is the better long-term investment."},
      {q:"Do I need a permit to build a deck in Indiana?",a:"Yes — deck construction requires permits in all Hamilton County municipalities. We handle the entire permitting and inspection process. A properly permitted deck protects your investment and avoids issues when you sell your home."},
      {q:"Can you build a covered patio or pavilion?",a:"Absolutely. Our Fortville Pavilion project is a great example — a custom outdoor living space with stone columns, stained wood beams, a covered bar area, and a layout designed for year-round entertaining. We design and build custom covered structures tailored to your space."},
      {q:"What's the best time of year to build a deck in Indiana?",a:"Spring and early summer are the most popular times, but we build decks from March through November. If you want your deck ready for Memorial Day, start the planning and design process in January or February so we can schedule construction for early spring."},
      {q:"Do you do stamped concrete patios?",a:"Yes. We've completed stamped concrete patio projects in both Fishers and Noblesville. Stamped concrete offers the look of natural stone or brick at a fraction of the cost, and it's extremely durable for Indiana's climate."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
  "flooring-services": {
    service: "Flooring Services",
    title: "Flooring Installation in Hamilton County, IN",
    metaDesc: "Professional flooring installation in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Hardwood, luxury vinyl plank, tile, carpet. Licensed contractors. Free estimates. (317) 279-4798",
    heroHeading: "Professional Flooring Installation in Hamilton County, Indiana",
    heroSub: "New flooring changes the entire feel of a room. We install hardwood, luxury vinyl plank, tile, and carpet — selected for your lifestyle, built to handle real life, and installed with precision.",
    intro: "The right flooring transforms a space more than almost any other upgrade. At HomeStar Services & Contracting, we help Hamilton County homeowners choose the right material for each room — considering foot traffic, moisture exposure, pets, kids, and style preferences — then install it with the precision and care that ensures it looks great and lasts for years. Whether you're upgrading a single room or reflooring your entire home, we deliver results you can feel the moment you walk in.",
    highlights: [
      {title:"Expert Material Guidance",desc:"We don't just install — we help you choose. We'll walk you through the pros and cons of hardwood, LVP, tile, and carpet for each room based on how you actually live, so you make a confident decision."},
      {title:"Precision Installation",desc:"Flooring is only as good as its installation. Our team ensures proper subfloor preparation, acclimation of materials, tight seams, and clean transitions between rooms. No shortcuts, no lifted edges."},
      {title:"Full-Service Approach",desc:"We handle everything: removal of old flooring, subfloor repair if needed, installation, trim work, and final cleanup. One contractor, one seamless project."},
      {title:"1-Year Workmanship Warranty",desc:"Every flooring installation is backed by our 1-year workmanship warranty. If something isn't right, we come back and make it right."},
    ],
    whatWeDoIntro: "We install all major flooring types across Hamilton County homes, matched to each room's demands.",
    whatWeDo: [
      "Luxury vinyl plank (LVP) — waterproof, durable, and realistic wood looks",
      "Hardwood flooring — solid and engineered options",
      "Porcelain and ceramic tile — bathrooms, kitchens, entryways",
      "Carpet installation — bedrooms, basements, bonus rooms",
      "Subfloor repair and leveling",
      "Old flooring removal and disposal",
      "Transition strips and trim work between rooms",
      "Heated floor systems (under tile)",
    ],
    costIntro: "Flooring installation costs in Hamilton County depend on the material, square footage, and subfloor condition. Here's what homeowners in Fishers, Carmel, and Noblesville typically invest:",
    costs: [
      {level:"Single Room",range:"$2,000 – $5,000",desc:"One room (bedroom, bathroom, or kitchen) with new flooring, including removal of old material and installation. Material choice drives the range."},
      {level:"Multi-Room / Full Floor",range:"$6,000 – $15,000",desc:"Multiple rooms or an entire floor level. LVP and carpet are on the lower end, hardwood and tile on the higher end. Includes transitions and trim."},
      {level:"Whole-Home Reflooring",range:"$15,000 – $30,000+",desc:"Complete flooring replacement throughout the home. Often done during a larger renovation. Mix of materials across different rooms for optimal performance."},
    ],
    projectCats: ["Flooring"],
    faq: [
      {q:"What's the best flooring for a bathroom?",a:"Luxury vinyl plank (LVP) and porcelain tile are both excellent choices for bathrooms because they're waterproof. LVP is warmer underfoot and easier to install, while tile offers more design versatility and works great with heated floor systems. We help you choose based on your style and budget."},
      {q:"Is luxury vinyl plank (LVP) good for homes with pets?",a:"LVP is one of the best flooring options for pet owners. It's scratch-resistant, waterproof, and easy to clean. Most LVP products we install have a thick wear layer that handles dog nails without showing scratches. It's the most popular choice in Hamilton County homes with pets."},
      {q:"How long does flooring installation take?",a:"A single room typically takes 1-2 days. A full floor level takes 3-5 days. Whole-home reflooring can take 1-2 weeks depending on scope. We provide a detailed timeline before work begins."},
      {q:"Do you remove the old flooring?",a:"Yes — we handle complete removal and disposal of old flooring, including carpet, tile, vinyl, and hardwood. We also inspect and repair the subfloor if needed before installing new material."},
      {q:"How much does hardwood flooring cost in Hamilton County?",a:"Hardwood flooring installation in the Fishers, Carmel, and Noblesville area typically runs $8 to $15 per square foot installed, depending on the species and whether it's solid or engineered. We provide free in-home estimates with exact pricing for your space."},
      {q:"Can you install flooring over existing floors?",a:"In many cases, yes. LVP and engineered hardwood can often be installed over existing hard surfaces if the subfloor is level and in good condition. We assess this during our free in-home consultation and recommend the best approach."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
  "painting-services": {
    service: "Painting Services",
    title: "Interior & Exterior Painting in Hamilton County, IN",
    metaDesc: "Professional interior and exterior painting in Fishers, Carmel, Noblesville & Hamilton County, Indiana. Clean lines, quality finishes, expert prep. Licensed & insured. Free estimates. (317) 279-4798",
    heroHeading: "Professional Painting Services in Hamilton County, Indiana",
    heroSub: "A professional paint job does more than change a color — it transforms a room. We deliver clean edges, smooth finishes, and expert prep work that makes the difference between a weekend DIY job and a result you're proud of for years.",
    intro: "Paint is the most cost-effective way to transform any space in your home. But the difference between a good paint job and a great one is all in the preparation. At HomeStar Services & Contracting, we invest the time in proper surface prep — filling holes, sanding, priming, caulking, and masking — before any paint goes on the wall. The result is clean lines, smooth finishes, and color that looks as good in three years as it does on day one.",
    highlights: [
      {title:"Expert Surface Preparation",desc:"The secret to a flawless paint job is what happens before the roller touches the wall. We fill, sand, prime, caulk, and mask every surface so the finish is smooth and long-lasting."},
      {title:"Quality Paint Products",desc:"We use premium paints from trusted brands like Sherwin-Williams and Benjamin Moore. The right paint in the right sheen for each room ensures durability, washability, and beautiful color."},
      {title:"Interior & Exterior",desc:"From living rooms and bedrooms to siding, trim, doors, and decks — we handle both interior and exterior painting projects of any size across Hamilton County."},
      {title:"Clean, Respectful Crew",desc:"We protect your floors, furniture, and fixtures. We clean up every day. And we leave your home looking better than when we arrived — not just the walls, but the whole space."},
    ],
    whatWeDoIntro: "From single accent walls to full interior and exterior painting projects, we handle it all.",
    whatWeDo: [
      "Interior wall and ceiling painting",
      "Exterior siding, trim, and fascia painting",
      "Cabinet painting and refinishing",
      "Door and window trim painting",
      "Deck and fence staining and sealing",
      "Drywall repair and patching before paint",
      "Color consultation and recommendations",
      "Wallpaper removal and surface preparation",
    ],
    costIntro: "Painting costs in Hamilton County depend on the scope, surface condition, and number of rooms. Here's what homeowners in Fishers, Carmel, and Westfield typically invest:",
    costs: [
      {level:"Single Room",range:"$400 – $900",desc:"One standard bedroom or bathroom — walls and ceiling, including prep, primer (if needed), and two coats of finish paint."},
      {level:"Multi-Room Interior",range:"$2,000 – $6,000",desc:"3-6 rooms including hallways and trim. Price varies by room size, ceiling height, and amount of prep work needed."},
      {level:"Full Interior or Exterior",range:"$5,000 – $12,000+",desc:"Complete interior repaint (all rooms, trim, doors, ceilings) or full exterior (siding, trim, fascia, soffits, doors). Includes thorough prep and premium paint."},
    ],
    projectCats: ["Painting"],
    faq: [
      {q:"How long does it take to paint the interior of a house?",a:"A full interior paint job in a typical Hamilton County home takes 3 to 5 days depending on the number of rooms, ceiling height, and amount of prep work. A single room can often be completed in one day. We provide a timeline before work begins."},
      {q:"Do you do exterior painting?",a:"Yes — we paint exterior siding, trim, fascia, soffits, doors, and shutters. Proper exterior prep is critical in Indiana's climate, so we scrape, sand, prime, and caulk before applying paint to ensure it holds up through freeze-thaw cycles and humidity."},
      {q:"What paint brands do you use?",a:"We primarily use Sherwin-Williams and Benjamin Moore products. Both offer excellent coverage, durability, and color selection. We recommend specific products and sheens based on each room — for example, eggshell for living areas, satin for kitchens and bathrooms, semi-gloss for trim."},
      {q:"Can you paint kitchen cabinets?",a:"Yes — cabinet painting is one of our most popular services. It's a cost-effective way to completely transform a kitchen without a full remodel. We properly sand, prime, and apply multiple coats of cabinet-grade paint for a factory-smooth finish that lasts."},
      {q:"How much does it cost to paint the exterior of a house in Hamilton County?",a:"Exterior painting in the Fishers, Carmel, and Noblesville area typically costs $4,000 to $10,000 depending on the home's size, siding type, and condition. Homes with extensive prep needs (peeling paint, wood rot repair) are on the higher end. We provide free estimates."},
      {q:"Do I need to move furniture before you arrive?",a:"We handle all furniture moving and protection. We cover floors with drop cloths, move furniture away from walls, and mask all fixtures, outlets, and trim. At the end of each day, we put everything back and clean up."},
    ],
    cities: ["Fishers","Carmel","Noblesville","Westfield","Zionsville","Fortville","McCordsville","Geist","Pendleton"],
  },
};

function ServicePage({data,slug}){
  const[faqOpen,setFaqOpen]=useState(null);
  const filteredProjects=PROJECTS.filter(p=>data.projectCats.includes(p.cat));
  const[activeProject,setActiveProject]=useState(0);
  const[activeImg,setActiveImg]=useState(0);
  useCanonical(slug);

  useEffect(()=>{
    document.title=data.title+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",data.metaDesc);
  },[data]);

  useJobberForm();

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service",name:data.service,provider:{"@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",telephone:"+1-317-279-4798",url:"https://www.thehomestarservice.com",address:{"@type":"PostalAddress",addressLocality:"Fishers",addressRegion:"IN",addressCountry:"US"},aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"}},areaServed:data.cities.map(c=>({"@type":"City",name:c})),description:data.metaDesc})}}/>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:"Services",url:"/#services"},{name:data.service}]}/>
      <FaqSchema faqs={data.faq}/>

      <Nav isCity/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>SCHLUTER PRO CERTIFIED</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(32px,5vw,52px)",lineHeight:1.1,marginBottom:20}}>{data.heroHeading}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:17,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px"}}>{data.heroSub}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#service-estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
            <a href="#service-projects" className="btn-o">View Our Work</a>
          </div>
          <div className="fu d5" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:32,marginTop:44}}>
            {[{n:"5.0★",l:"Google Rating"},{n:"25-Year",l:"Schluter Warranty"},{n:"100%",l:"Licensed & Insured"}].map(b=>
              <div key={b.l}><div className="display" style={{color:C.green,fontSize:24,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600}}>{b.l}</div></div>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <h2 className="ttl" style={{textAlign:"center"}}>Why Hamilton County Homeowners Choose HomeStar</h2>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,textAlign:"center"}}>{data.intro}</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">What Sets Us Apart</div>
            <h2 className="ttl">The HomeStar Difference</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            {data.highlights.map(h=>
              <div key={h.title} style={{padding:"28px 24px",borderRadius:14,background:"#fff",border:`1px solid ${C.sand}`,transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>{I.check}<h3 style={{color:C.navy,fontWeight:700,fontSize:16}}>{h.title}</h3></div>
                <p style={{color:C.gray,fontSize:14,lineHeight:1.7}}>{h.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our Expertise</div>
            <h2 className="ttl">What We Do</h2>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginTop:16}}>{data.whatWeDoIntro}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {data.whatWeDo.map(item=>
              <div key={item} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"14px 18px",borderRadius:10,background:C.cream}}>
                {I.check}<span style={{color:C.navy,fontSize:14,fontWeight:600,lineHeight:1.5}}>{item}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cost Guide */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Investment Guide</div>
            <h2 className="ttl ttl-w">How Much Does It Cost?</h2>
            <p style={{color:"rgba(255,255,255,.45)",fontSize:15,lineHeight:1.8,maxWidth:600,margin:"12px auto 0"}}>{data.costIntro}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {data.costs.map(c=>
              <div key={c.level} style={{padding:"32px 28px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
                <div style={{color:C.green,fontWeight:700,fontSize:13,marginBottom:8,letterSpacing:".04em"}}>{c.level.toUpperCase()}</div>
                <div className="display" style={{color:"#fff",fontSize:28,fontWeight:800,marginBottom:14}}>{c.range}</div>
                <p style={{color:"rgba(255,255,255,.45)",fontSize:14,lineHeight:1.7}}>{c.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="service-projects" className="sec" style={{background:"#fff"}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our Work</div>
            <h2 className="ttl">{data.service} Projects</h2>
          </div>
          {filteredProjects.length>0&&(
            <div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:28}}>
                {filteredProjects.map((p,i)=>
                  <button key={p.title} onClick={()=>{setActiveProject(i);setActiveImg(0);}} style={{padding:"8px 18px",borderRadius:50,border:`1px solid ${activeProject===i?C.green:C.sand}`,background:activeProject===i?C.greenMuted:"#fff",color:activeProject===i?C.green:C.gray,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{p.title.replace(/remodel|project|build/gi,"").replace(/in\s\w+$/i,"").trim()}</button>
                )}
              </div>
              <div style={{position:"relative",borderRadius:16,overflow:"hidden",background:C.navyDark,maxWidth:700,margin:"0 auto"}}>
                <img src={filteredProjects[activeProject].images[activeImg].src} alt={filteredProjects[activeProject].images[activeImg].alt} style={{width:"100%",height:420,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
                  {filteredProjects[activeProject].images.map((_,i)=>
                    <button key={i} onClick={()=>setActiveImg(i)} style={{width:activeImg===i?20:8,height:8,borderRadius:4,background:activeImg===i?"#fff":"rgba(255,255,255,.4)",border:"none",cursor:"pointer",transition:"all .3s"}}/>
                  )}
                </div>
              </div>
              <div style={{textAlign:"center",marginTop:20}}>
                <h3 className="display" style={{color:C.navy,fontSize:18}}>{filteredProjects[activeProject].title}</h3>
                <p style={{color:C.gray,fontSize:14,marginTop:6}}>{filteredProjects[activeProject].desc}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service Areas */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="lab">Where We Work</div>
            <h2 className="ttl">{data.service} Across Hamilton County</h2>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12}}>
            {data.cities.map(c=>
              <a key={c} href={`/home-remodeling-${c.toLowerCase().replace(/ /g,"-")}-in`} style={{padding:"12px 22px",borderRadius:50,background:"#fff",border:`1px solid ${C.sand}`,color:C.navy,fontWeight:600,fontSize:14,textDecoration:"none",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.color=C.navy}}>
                {c}, IN
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:720}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{data.service} FAQ</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {data.faq.map((f,i)=>
              <div key={i} style={{borderRadius:12,border:`1px solid ${C.sand}`,overflow:"hidden",background:C.cream}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?300:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + Jobber Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started</div>
              <h2 className="ttl ttl-w">Ready to Remodel Your Bathroom?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate. We'll visit your home, discuss your vision, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>(317) 279-4798</div></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>eric@thehomestarservice.com</div></div>
              </div>
              <div style={{marginTop:28}}>
                <a href="/" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← Back to main site</a>
              </div>
            </div>
            <div id="service-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free {data.service} Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCityLinks currentService={data.service}/>

      <Footer isCity/>
    </div>
  );
}

/* ─── Service-City Pages (42 unique pages) ────────── */
const SERVICE_SLUG_MAP = {
  "bathroom-remodeling":"bathroom-remodeling",
  "basement-finishing":"basement-finishing",
  "kitchen-remodeling":"kitchen-remodeling",
  "flooring-services":"flooring-services",
  "painting-services":"painting-services",
  "deck-builder":"decks-outdoor-living",
};

const SVC_CITY_TPL = {
  "bathroom-remodeling":{
    adj:"Expert",badge:"SCHLUTER PRO CERTIFIED",schemaType:"BathroomRemodeler",
    intro:(c,n)=>`Looking for expert bathroom remodeling in ${c}, Indiana? HomeStar Services & Contracting is the Schluter Pro Certified bathroom renovation specialist trusted by homeowners in ${n.slice(0,3).join(", ")} and throughout ${c}. From walk-in showers and custom tile to complete spa-level transformations, we build bathrooms in ${c} that are 100% waterproof — backed by a 25-year manufacturer's warranty that most contractors simply can't offer.`,
    whyUs:(c,pCount)=>pCount>0?`We've already completed multiple bathroom remodeling projects in the ${c} area, each built on the complete Schluter waterproofing system — Ditra for floors, Kerdi for walls, and Schluter shower pans. Every ${c} bathroom project includes licensed plumbers for all water supply and drainage, licensed electricians for lighting and ventilation, and our 1-year workmanship warranty.`:`Our team has completed bathroom renovations throughout Hamilton County and brings the same Schluter Pro Certified craftsmanship to every ${c} project. All plumbing by licensed plumbers, all electrical by licensed electricians, with our 1-year workmanship warranty on every job.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in a bathroom remodel:`,
  },
  "basement-finishing":{
    adj:"Professional",badge:"COMPLETE TURNKEY BUILDS",schemaType:"GeneralContractor",
    intro:(c,n)=>`Ready to unlock the full potential of your ${c} home? HomeStar Services & Contracting transforms unfinished basements across ${c} — from ${n.slice(0,3).join(", ")} and beyond — into the most-used rooms in the house. Family entertainment areas, guest suites, home offices, kids' playrooms, and home gyms — we handle the entire build from framing to final walkthrough, all with licensed tradespeople.`,
    whyUs:(c,pCount)=>pCount>0?`We've already completed basement finishing projects in the ${c} area that demonstrate our ability to deliver quality results on smart budgets. Every basement we finish includes proper moisture management, licensed electricians for all wiring and panels, and our 1-year workmanship warranty. If your ${c} home has an unfinished basement, you're sitting on untapped square footage and serious resale value.`:`Our basement finishing work across Hamilton County showcases the quality we bring to every project. We address moisture upfront with proper vapor barriers and drainage, use licensed electricians and plumbers for all rough-in work, and back everything with our 1-year workmanship warranty. ${c} homes with finished basements consistently outperform in resale.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in a basement finish:`,
  },
  "kitchen-remodeling":{
    adj:"Quality",badge:"LICENSED CONTRACTORS",schemaType:"GeneralContractor",
    intro:(c,n)=>`The kitchen is the heart of your ${c} home — and it deserves a remodeling team that treats it that way. HomeStar Services & Contracting brings thoughtful design, quality materials, and licensed craftsmanship to kitchen renovations across ${c}, from ${n.slice(0,3).join(", ")} to every neighborhood in between. Whether you're updating countertops and cabinets or gutting the entire space, we build kitchens that balance function and beauty.`,
    whyUs:(c,pCount)=>`Every kitchen remodel in ${c} involves gas lines, water supply, drainage, and electrical circuits — work that should only be done by licensed professionals. At HomeStar, all plumbing is handled by licensed plumbers and all electrical by licensed electricians. We provide 3D design renderings so you see your new ${c} kitchen before construction begins, and every project comes with our 1-year workmanship warranty.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in a kitchen remodel:`,
  },
  "flooring-services":{
    adj:"Professional",badge:"PRECISION INSTALLATION",schemaType:"GeneralContractor",
    intro:(c,n)=>`New flooring transforms the entire feel of your ${c} home. HomeStar Services & Contracting installs hardwood, luxury vinyl plank, tile, and carpet for homeowners across ${c} — from ${n.slice(0,3).join(", ")} to every corner of the community. We help you choose the right material for each room based on traffic, moisture, pets, kids, and style, then install it with the precision that ensures it looks great and lasts for years.`,
    whyUs:(c,pCount)=>`Flooring installation in ${c} is only as good as the prep work beneath it. Our team ensures proper subfloor preparation, material acclimation, tight seams, and clean transitions between rooms. We handle everything — old flooring removal, subfloor repair, installation, trim work, and cleanup. One contractor, one seamless project, backed by our 1-year workmanship warranty.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in new flooring:`,
  },
  "painting-services":{
    adj:"Professional",badge:"EXPERT PREP & FINISH",schemaType:"Painter",
    intro:(c,n)=>`A professional paint job does more than change a color — it transforms your ${c} home. HomeStar Services & Contracting delivers clean edges, smooth finishes, and expert prep work for homeowners across ${c}, from ${n.slice(0,3).join(", ")} and throughout the area. The difference between a good paint job and a great one is all in the preparation — and that's where we invest the time that shows in the results.`,
    whyUs:(c,pCount)=>`Every painting project in ${c} starts with thorough surface preparation — filling holes, sanding, priming, caulking, and careful masking. We use premium paints from Sherwin-Williams and Benjamin Moore, selected for durability and color accuracy. Interior and exterior, single rooms to whole homes — backed by our 1-year workmanship warranty.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in professional painting:`,
  },
  "decks-outdoor-living":{
    adj:"Custom",badge:"BUILT FOR INDIANA WEATHER",schemaType:"GeneralContractor",
    intro:(c,n)=>`Your ${c} backyard should be an extension of your home. HomeStar Services & Contracting designs and builds custom decks, covered pavilions, stamped concrete patios, and outdoor living spaces for homeowners across ${c} — from ${n.slice(0,3).join(", ")} and throughout the community. We build with materials and methods specifically suited for Indiana's four-season climate.`,
    whyUs:(c,pCount)=>pCount>0?`We've already completed outdoor living projects in the ${c} area — from composite deck builds to custom pavilions with stone columns and covered bar areas. Every exterior project is built with proper footings, weather-resistant hardware, and materials chosen to handle Indiana's freeze-thaw cycles, humidity, and heavy rains. Licensed electricians handle all landscape lighting and outdoor outlets.`:`Our outdoor living projects across Hamilton County showcase the quality we bring to every deck, patio, and pavilion we build. From composite decking to stamped concrete to covered structures, we select materials and construction methods that stand up to Indiana weather year after year. Licensed electricians handle all outdoor electrical work.`,
    costIntro:(c)=>`Here's what ${c} homeowners typically invest in outdoor living:`,
  },
};

function ServiceCityPage({svcData,cityData,svcKey}){
  const tpl=SVC_CITY_TPL[svcKey]||SVC_CITY_TPL["bathroom-remodeling"];
  const city=cityData.city;
  const hoods=cityData.neighborhoods||[];
  const[faqOpen,setFaqOpen]=useState(null);
  const[activeProject,setActiveProject]=useState(0);
  const[activeImg,setActiveImg]=useState(0);
  const pageSlug=svcKey+"-"+city.toLowerCase().replace(/ /g,"-")+"-in";
  useCanonical(pageSlug);

  /* Filter projects by service category AND city name in title */
  const cityProjects=PROJECTS.filter(p=>svcData.projectCats.includes(p.cat)&&p.title.toLowerCase().includes(city.toLowerCase()));
  const allSvcProjects=PROJECTS.filter(p=>svcData.projectCats.includes(p.cat));
  const displayProjects=cityProjects.length>0?cityProjects:allSvcProjects.slice(0,3);

  const pageTitle=`${svcData.service} in ${city}, IN`;
  const metaDesc=`${tpl.adj} ${svcData.service.toLowerCase()} in ${city}, Indiana. ${svcData.highlights[0].desc.split(".")[0]}. Free estimates. (317) 279-4798`;

  useEffect(()=>{
    document.title=pageTitle+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",metaDesc);
  },[city]);

  useJobberForm();

  /* City-ify the FAQs by replacing "Hamilton County" with city name in answers */
  const cityFaqs=svcData.faq.map(f=>({q:f.q.replace(/Hamilton County/g,city),a:f.a.replace(/Hamilton County/g,`the ${city} area`)}));

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":tpl.schemaType||"Service",name:`${svcData.service} in ${city}, IN`,provider:{"@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",telephone:"+1-317-279-4798",url:"https://www.thehomestarservice.com",address:{"@type":"PostalAddress",addressLocality:city,addressRegion:"IN",addressCountry:"US"},aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"}},areaServed:{"@type":"City",name:city},description:metaDesc})}}/>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:svcData.service,url:"/"+SERVICE_SLUG_MAP[svcKey]},{name:`${city}, IN`}]}/>
      <FaqSchema faqs={cityFaqs}/>

      <Nav isCity/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>{tpl.badge}</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(32px,5vw,48px)",lineHeight:1.1,marginBottom:20}}>{tpl.adj} {svcData.service} in {city}, Indiana</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:17,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px"}}>{svcData.heroSub.replace(/Hamilton County/g,city)}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#svc-city-estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate in {city} {I.arrow}</a>
            <a href={`/home-remodeling-${city.toLowerCase().replace(/ /g,"-")}-in`} className="btn-o">All {city} Services</a>
          </div>
          <div className="fu d5" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:32,marginTop:44}}>
            {[{n:"5.0★",l:"Google Rating"},{n:"25-Year",l:"Schluter Warranty"},{n:"100%",l:"Licensed & Insured"}].map(b=>
              <div key={b.l}><div className="display" style={{color:C.green,fontSize:24,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600}}>{b.l}</div></div>
            )}
          </div>
        </div>
      </section>

      {/* Unique Intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <h2 className="ttl" style={{textAlign:"center"}}>Why {city} Homeowners Choose HomeStar for {svcData.service}</h2>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,textAlign:"center",marginBottom:24}}>{tpl.intro(city,hoods)}</p>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,textAlign:"center"}}>{tpl.whyUs(city,cityProjects.length)}</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">{svcData.service} in {city}</div>
            <h2 className="ttl">The HomeStar Difference</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
            {svcData.highlights.map(h=>
              <div key={h.title} style={{padding:"28px 24px",borderRadius:14,background:"#fff",border:`1px solid ${C.sand}`,transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>{I.check}<h3 style={{color:C.navy,fontWeight:700,fontSize:16}}>{h.title}</h3></div>
                <p style={{color:C.gray,fontSize:14,lineHeight:1.7}}>{h.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our {city} Expertise</div>
            <h2 className="ttl">{svcData.service} Services in {city}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {svcData.whatWeDo.map(item=>
              <div key={item} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"14px 18px",borderRadius:10,background:C.cream}}>
                {I.check}<span style={{color:C.navy,fontSize:14,fontWeight:600,lineHeight:1.5}}>{item}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cost Guide */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">{svcData.service} Cost in {city}</div>
            <h2 className="ttl ttl-w">How Much Does {svcData.service} Cost in {city}?</h2>
            <p style={{color:"rgba(255,255,255,.45)",fontSize:15,lineHeight:1.8,maxWidth:600,margin:"12px auto 0"}}>{tpl.costIntro(city)}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {svcData.costs.map(c=>
              <div key={c.level} style={{padding:"32px 28px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
                <div style={{color:C.green,fontWeight:700,fontSize:13,marginBottom:8,letterSpacing:".04em"}}>{c.level.toUpperCase()}</div>
                <div className="display" style={{color:"#fff",fontSize:28,fontWeight:800,marginBottom:14}}>{c.range}</div>
                <p style={{color:"rgba(255,255,255,.45)",fontSize:14,lineHeight:1.7}}>{c.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      {displayProjects.length>0&&(
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our Work</div>
            <h2 className="ttl">{svcData.service} Projects{cityProjects.length>0?` in ${city}`:""}</h2>
          </div>
          <div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:28}}>
              {displayProjects.map((p,i)=>
                <button key={p.title} onClick={()=>{setActiveProject(i);setActiveImg(0);}} style={{padding:"8px 18px",borderRadius:50,border:`1px solid ${activeProject===i?C.green:C.sand}`,background:activeProject===i?C.greenMuted:"#fff",color:activeProject===i?C.green:C.gray,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{p.title.replace(/remodel|project|build/gi,"").replace(/in\s\w+$/i,"").trim()}</button>
              )}
            </div>
            <div style={{position:"relative",borderRadius:16,overflow:"hidden",background:C.navyDark,maxWidth:700,margin:"0 auto"}}>
              <img src={displayProjects[activeProject].images[activeImg].src} alt={displayProjects[activeProject].images[activeImg].alt} style={{width:"100%",height:420,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
                {displayProjects[activeProject].images.map((_,i)=>
                  <button key={i} onClick={()=>setActiveImg(i)} style={{width:activeImg===i?20:8,height:8,borderRadius:4,background:activeImg===i?"#fff":"rgba(255,255,255,.4)",border:"none",cursor:"pointer",transition:"all .3s"}}/>
                )}
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:20}}>
              <h3 className="display" style={{color:C.navy,fontSize:18}}>{displayProjects[activeProject].title}</h3>
              <p style={{color:C.gray,fontSize:14,marginTop:6}}>{displayProjects[activeProject].desc}</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Neighborhoods */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="lab">{svcData.service} Near You</div>
            <h2 className="ttl">{city} Neighborhoods We Serve</h2>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12}}>
            {hoods.map(n=>
              <span key={n} style={{padding:"10px 20px",borderRadius:50,background:"#fff",border:`1px solid ${C.sand}`,color:C.navy,fontWeight:600,fontSize:14}}>{n}</span>
            )}
          </div>
          <div style={{textAlign:"center",marginTop:28}}>
            <a href={`/home-remodeling-${city.toLowerCase().replace(/ /g,"-")}-in`} style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6}}>View all services in {city} {I.arrow}</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:720}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{svcData.service} FAQ for {city} Homeowners</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {cityFaqs.map((f,i)=>
              <div key={i} style={{borderRadius:12,border:`1px solid ${C.sand}`,overflow:"hidden",background:C.cream}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?300:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + Jobber Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started in {city}</div>
              <h2 className="ttl ttl-w">Ready for {svcData.service} in {city}?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate for your {city} {svcData.service.toLowerCase()} project. We'll visit your home, discuss your vision, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>(317) 279-4798</div></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>eric@thehomestarservice.com</div></div>
              </div>
              <div style={{marginTop:28,display:"flex",gap:20}}>
                <a href="/" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← Main site</a>
                <a href={`/home-remodeling-${city.toLowerCase().replace(/ /g,"-")}-in`} style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← All {city} services</a>
              </div>
            </div>
            <div id="svc-city-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free {svcData.service} Estimate in {city}</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCityLinks currentService={svcData.service} currentCity={city}/>

      <Footer isCity/>
    </div>
  );
}

/* ─── Project Case Study Stories ──────────────────── */
const PROJECT_STORIES = {
  "green-tile-bathroom-carmel":{challenge:"This Carmel homeowner wanted a bathroom that would stand out — something bold, personal, and unlike anything their neighbors had. The existing bathroom was dated with standard white tile and a worn vanity.",approach:"We worked with the homeowner to select a distinctive green tile that would become the signature of the space. The complete Schluter waterproofing system was installed — Ditra on floors, Kerdi on walls — before any tile was set. A custom vanity with stone countertop was designed to complement the green palette. All plumbing by licensed plumber, all electrical by licensed electrician.",result:"The finished bathroom is one of our most striking transformations — a bold, one-of-a-kind space that perfectly reflects the homeowner's personality while being built on a waterproofing system that will protect their investment for 25+ years."},
  "double-shower-fishers":{challenge:"The homeowners wanted a spacious, luxurious master bathroom with a double shower large enough for two. The existing bathroom had an outdated single shower and cramped layout that didn't match the home's quality.",approach:"We reconfigured the layout to accommodate a large double shower with custom tile and frameless glass enclosure. The complete Schluter waterproofing system was installed throughout — critical for a shower this size. New plumbing lines were run by our licensed plumber to support dual showerheads and updated drainage.",result:"The finished space feels like a luxury hotel — a generous double shower with seamless tile, modern fixtures, and frameless glass that opens up the entire bathroom. Built to last with Schluter waterproofing and a 25-year warranty."},
  "spa-retreat-bathroom-fishers":{challenge:"After years of living with a builder-grade bathroom, this Fishers homeowner wanted a spa-like retreat — a space for unwinding at the end of the day with premium finishes and a calming design.",approach:"We designed a serene spa-inspired space with a freestanding soaking tub, walk-in shower with custom tile, updated vanity, and modern lighting. The Schluter waterproofing system protects every tile surface. Our licensed electrician installed dimmable lighting and a properly sized exhaust fan for the spa atmosphere.",result:"The transformation turned a dated, uninspiring bathroom into a private spa retreat. The homeowner describes it as their favorite room in the house — a space that feels like a resort without leaving home."},
  "geist-upper-level-remodel":{challenge:"This Geist waterfront homeowner wanted to modernize the entire upper level — multiple bathrooms, updated finishes throughout, and a cohesive design that matched the beauty of their reservoir views.",approach:"We managed a comprehensive upper-level renovation across multiple rooms. Every bathroom received the complete Schluter waterproofing system. Modern design elements were coordinated across all spaces for a cohesive look. Licensed plumbers and electricians handled all trade work across the entire upper floor.",result:"The entire upper level was transformed — multiple bathrooms with premium tile work, updated finishes, and modern design elements that feel cohesive and intentional. A whole-level renovation that elevated the entire home to match its stunning Geist setting."},
  "floor-to-ceiling-tile-noblesville":{challenge:"The homeowner wanted a dramatic, modern bathroom with tile covering every surface — floor to ceiling — creating a seamless, high-end hotel look in their Noblesville home.",approach:"Floor-to-ceiling tile requires flawless substrate preparation and the Schluter waterproofing system is essential. We installed Ditra on the floor and Kerdi on every wall surface, creating a completely waterproof envelope before setting a single tile. Large-format tiles were precision-cut and installed with meticulous attention to alignment.",result:"The result is one of our most dramatic transformations — a seamless, modern bathroom where custom tile flows from floor through shower surround and accent walls. It looks like a high-end boutique hotel, but it's built on a waterproofing system that will protect it for decades."},
  "laundry-room-noblesville":{challenge:"A cramped, dated laundry room near Noblesville that lacked storage and felt like an afterthought in an otherwise well-maintained home.",approach:"We maximized every square foot with smart storage solutions — custom shelving, improved countertop space, and a clean modern layout. New flooring and fresh finishes transformed the space from a chore room into a functional, polished space.",result:"The finished laundry room proves that even the smallest spaces can be transformed. Smart design and quality materials turned a neglected room into one of the most functional spaces in the home."},
  "childrens-bathrooms-geist":{challenge:"Two children's bathrooms in a Geist home needed a complete overhaul — they needed to be fun and kid-friendly while also being durable enough to handle daily use by active kids.",approach:"We designed both bathrooms with durability as the priority — the Schluter waterproofing system on all tile surfaces, easy-to-clean materials, and layouts that work for kids. Licensed plumbing on both bathrooms ensured proper function. The designs are playful yet timeless, so they'll still look great as the kids grow.",result:"Two completely redesigned bathrooms that are fun, functional, and built to handle anything kids throw at them. The Schluter waterproofing system means these bathrooms will look this good for 25+ years — long after the kids have grown up."},
  "jack-and-jill-zionsville":{challenge:"A shared Jack & Jill bathroom in Zionsville that needed to work for siblings — dual access points, enough space for two, and a design that didn't feel like a compromise.",approach:"We redesigned the layout with dual vanities, modern finishes, and a smart configuration that gives both users their own space. The Schluter waterproofing system was installed throughout, and all plumbing was updated by our licensed plumber to support the dual-vanity setup.",result:"One of our most popular project walkthroughs — a shared bathroom that doesn't feel shared. Dual vanities, modern finishes, and a layout that works for the whole family. It's become a go-to example of how thoughtful design solves real family challenges."},
  "basement-finish-fishers":{challenge:"An unfinished Fishers basement — raw concrete, exposed framing, and wasted square footage in a home that needed more living space.",approach:"We designed and built a complete basement finish with proper moisture management, insulation, drywall, flooring, and lighting. The space was configured as a multi-use entertainment area. Our licensed electrician installed a complete electrical system with recessed lighting and dedicated circuits.",result:"The basement went from empty concrete to a fully finished living space that added significant usable square footage to the home — all at a fraction of the cost of a home addition."},
  "bathroom-renovation-fishers":{challenge:"A dated Fishers bathroom with worn tile, old fixtures, and a vanity that had seen better days. The homeowner wanted a fresh, modern update without a complete gut renovation.",approach:"We replaced the vanity and countertop, updated all fixtures, installed new tile in the shower and floor area with the Schluter waterproofing system, and added modern lighting. All plumbing connections by our licensed plumber.",result:"A clean, modern bathroom that feels brand new — updated finishes, modern fixtures, and proper waterproofing that protects the investment for decades. Proof that a well-executed renovation doesn't have to mean a complete gut job."},
  "kids-bathroom-fishers":{challenge:"A teenager's bathroom in Fishers that needed an update — something with more personality that could handle daily use while still being durable and easy to maintain.",approach:"We designed a bathroom with the teenager's input — durable materials that can handle daily use, a design with personality, and the Schluter waterproofing system on all tile surfaces. Modern fixtures and updated lighting complete the look.",result:"A stylish, functional bathroom designed for a teenager — durable enough for daily use, modern enough to impress friends, and properly waterproofed to last well beyond the teenage years."},
  "laundry-room-geist":{challenge:"A dated laundry room near Geist that wasn't keeping up with the rest of this Fishers home's quality and style.",approach:"We transformed the space with modern storage solutions, new countertops, updated flooring, and a fresh, clean design that matches the quality of the rest of the home.",result:"A compact laundry room transformed with smart storage and a clean, modern design — proving that every room in your home deserves attention to detail."},
  "modern-farmhouse-bathroom-fishers":{challenge:"The homeowner wanted a warm, modern farmhouse aesthetic — shiplap accents, wood-tone vanity, classic fixtures — but built with proper waterproofing and quality materials, not just the look.",approach:"We designed a modern farmhouse bathroom with shiplap accent walls, a warm wood-tone vanity, and classic black fixtures. Behind the farmhouse charm, the complete Schluter waterproofing system protects every tile surface. Licensed plumbing and electrical ensure everything functions perfectly.",result:"A warm, inviting modern farmhouse bathroom that balances rustic charm with certified craftsmanship — shiplap, wood tones, and classic fixtures, all built on a 25-year waterproofing foundation."},
  "basement-finish-westfield":{challenge:"A Westfield family wanted their unfinished basement turned into usable living space — but on a smart budget. They needed proof that quality doesn't require overspending.",approach:"We designed an efficient layout that maximized the available space without unnecessary extras. Quality materials, proper insulation, professional electrical work, and clean finishes — all focused on delivering the best result within the budget.",result:"A fast, efficient basement finish that added usable living space without breaking the budget. This project demonstrates our ability to deliver quality results at every price point — you don't need to overspend to get a great space."},
  "double-shower-carmel":{challenge:"A Carmel master bathroom that needed a premium upgrade — the homeowners wanted a spacious shower, modern finishes, and a design that matched the quality of their neighborhood.",approach:"We installed a luxurious double shower with custom tile work, frameless glass enclosure, and premium fixtures. The complete Schluter waterproofing system was installed throughout. An LED backlit mirror and updated vanity with modern hardware complete the transformation.",result:"A stunning Carmel bathroom with a spacious double shower, custom tile, frameless glass, and premium finishes throughout. Built on the Schluter waterproofing system with a 25-year manufacturer's warranty."},
  "pavilion-patio-fortville":{challenge:"A Fortville homeowner wanted a custom outdoor living space — a covered pavilion that could serve as an extension of their indoor living area for entertaining, family gatherings, and enjoying the property.",approach:"We designed and built a custom pavilion with a durable structure, quality roofing, and a layout designed for outdoor entertaining. The project showcases our ability to deliver custom outdoor living spaces that extend how families use their homes.",result:"A beautiful custom pavilion that transformed the backyard into a true outdoor living space — perfect for everything from family dinners to weekend entertaining. One of our most popular project showcases."},
  "stamped-concrete-fishers":{challenge:"The backyard needed a durable, attractive patio surface that could handle Indiana weather while providing a great space for outdoor entertaining.",approach:"We designed and installed a stamped concrete patio with a pattern and color that complements the home's exterior. Proper grading ensures water drainage away from the foundation.",result:"A beautiful stamped concrete patio that provides years of low-maintenance outdoor living space — durable enough for Indiana weather, attractive enough for weekend entertaining."},
  "stamped-concrete-noblesville":{challenge:"A Noblesville homeowner wanted a patio that looked like natural stone without the maintenance — a durable surface for outdoor living.",approach:"We installed stamped concrete with a natural stone pattern, proper drainage grading, and a durable sealer to protect against Indiana's freeze-thaw cycles.",result:"A stamped concrete patio that delivers the look of natural stone with the durability and low maintenance of concrete — a smart investment for Indiana outdoor living."},
  "composite-deck-fishers":{challenge:"The homeowner wanted a spacious outdoor space for entertaining but was tired of the annual staining and maintenance that comes with a wood deck.",approach:"We designed and built a premium composite deck with white railing, dual staircases, and a layout optimized for entertaining. Composite decking requires zero staining or sealing and lasts 25-30 years.",result:"A beautiful, spacious composite deck that will look this good for 25+ years — zero annual maintenance, no staining, no sealing. Just outdoor living space the homeowner can actually enjoy instead of maintain."},
};

/* ─── Project Case Study Pages (19 pages) ─────────── */
function ProjectPage({project}){
  useCanonical("projects/"+project.slug);
  const[activeImg,setActiveImg]=useState(0);
  const story=project.story||PROJECT_STORIES[project.slug];

  useEffect(()=>{
    document.title=project.title+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",project.desc+" Schluter Pro Certified. Free estimates. (317) 279-4798");
    window.scrollTo(0,0);
  },[project]);

  useJobberForm();

  const related=PROJECTS.filter(p=>p.slug!==project.slug&&(p.cat===project.cat||p.city===project.city)).slice(0,3);
  const serviceSlug=project.service==="Bathroom Remodeling"?"bathroom-remodeling":project.service==="Basement Finishing"?"basement-finishing":project.service==="Kitchen Remodeling"?"kitchen-remodeling":project.service==="Flooring Services"?"flooring-services":project.service==="Painting Services"?"painting-services":"decks-outdoor-living";

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:"Projects",url:"/#projects"},{name:project.title}]}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:project.title,description:project.desc,author:{"@type":"Organization",name:"HomeStar Services & Contracting"},publisher:{"@type":"Organization",name:"HomeStar Services & Contracting",url:"https://www.thehomestarservice.com"},image:project.images[0]?.src})}}/>

      <Nav isCity/>

      {/* Hero */}
      <section style={{position:"relative",padding:"140px 24px 60px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`}}>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:18}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase",background:C.greenMuted,padding:"4px 12px",borderRadius:50}}>{project.cat}</span>
            {project.city&&<span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>{project.city}, IN</span>}
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(26px,4vw,40px)",lineHeight:1.2,marginBottom:16}}>{project.title}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.5)",fontSize:16,lineHeight:1.7}}>{project.desc}</p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:900}}>
          <div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${C.sand}`,marginBottom:16,background:"#f8f8f8",textAlign:"center"}}>
            <img src={project.images[activeImg]?.src} alt={project.images[activeImg]?.alt} style={{width:"100%",height:"auto",maxHeight:700,objectFit:"contain",display:"block"}} loading="lazy"/>
          </div>
          {project.images.length>1&&(
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
              {project.images.map((img,i)=>
                <img key={i} src={img.src} alt={img.alt} onClick={()=>setActiveImg(i)} loading="lazy"
                  style={{width:80,height:60,objectFit:"cover",borderRadius:8,cursor:"pointer",border:activeImg===i?`2px solid ${C.green}`:`2px solid ${C.sand}`,opacity:activeImg===i?1:.6,transition:"all .2s"}}/>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Project Story */}
      {story&&(
        <section className="sec" style={{background:C.cream}}>
          <div className="sec-in" style={{maxWidth:800}}>
            <div style={{display:"grid",gap:32}}>
              <div>
                <div className="lab">The Challenge</div>
                <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:12}}>What the Homeowner Wanted</h3>
                <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85}}>{story.challenge}</p>
              </div>
              <div>
                <div className="lab">Our Approach</div>
                <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:12}}>How We Built It</h3>
                <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85}}>{story.approach}</p>
              </div>
              <div>
                <div className="lab">The Result</div>
                <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:12}}>The Finished Space</h3>
                <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85}}>{story.result}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Details Card */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{background:C.cream,borderRadius:14,padding:"32px 36px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20}}>
            <div><div style={{color:C.gray,fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Service</div><div style={{color:C.navy,fontWeight:700,fontSize:15}}>{project.service}</div></div>
            <div><div style={{color:C.gray,fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Location</div><div style={{color:C.navy,fontWeight:700,fontSize:15}}>{project.city}, Indiana</div></div>
            <div><div style={{color:C.gray,fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Waterproofing</div><div style={{color:C.navy,fontWeight:700,fontSize:15}}>Schluter Pro Certified</div></div>
            <div><div style={{color:C.gray,fontSize:11,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Licensed Trades</div><div style={{color:C.navy,fontWeight:700,fontSize:15}}>Plumbing & Electrical</div></div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length>0&&(
        <section className="sec" style={{background:C.cream}}>
          <div className="sec-in">
            <div style={{textAlign:"center",marginBottom:32}}>
              <div className="lab">More Projects</div>
              <h2 className="ttl">Related Work</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>
              {related.map(r=>
                <a key={r.slug} href={`/projects/${r.slug}`} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,background:"#fff",textDecoration:"none",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.06)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  <img src={r.images[0]?.src} alt={r.images[0]?.alt} style={{width:"100%",height:180,objectFit:"cover"}} loading="lazy"/>
                  <div style={{padding:"16px 18px"}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:".06em",color:C.green,textTransform:"uppercase"}}>{r.cat}</span>
                    <h4 className="display" style={{color:C.navy,fontSize:14,marginTop:4}}>{r.title}</h4>
                  </div>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in" style={{maxWidth:1000}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}}>
            <div style={{padding:"20px 0"}}>
              <div className="lab" style={{color:C.green}}>Start Your Project</div>
              <h2 className="display" style={{color:"#fff",fontSize:"clamp(24px,3vw,32px)",marginBottom:16}}>Want Results Like This?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.7,marginBottom:24}}>We'd love to bring this level of craftsmanship to your home. Request a free estimate and let's talk about your vision.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <a href="tel:+13172794798" style={{color:"#fff",fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>{I.phone} (317) 279-4798</a>
                <a href="mailto:eric@thehomestarservice.com" style={{color:"#fff",fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>{I.mail||"✉"} eric@thehomestarservice.com</a>
              </div>
              <div style={{marginTop:24,display:"flex",gap:16}}>
                <a href={`/${serviceSlug}`} style={{color:C.green,fontWeight:600,fontSize:13,textDecoration:"none"}}>← {project.service}</a>
                <a href="/#projects" style={{color:"rgba(255,255,255,.4)",fontWeight:600,fontSize:13,textDecoration:"none"}}>All Projects</a>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Tell us about your project.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer isCity/>
    </div>
  );
}

/* ─── Author / E-E-A-T Pages ─────────────────────── */
const AUTHORS = {
  "eric-farr":{
    name:"Eric Farr",slug:"eric-farr",role:"Co-Founder",
    bio:"Eric co-founded HomeStar Services & Contracting with a clear mission: deliver the kind of remodeling quality that homeowners in Hamilton County deserve — honest pricing, certified craftsmanship, and results that last. With a background in real estate and small business, Eric brings a homeowner's perspective to every project. He understands that a remodeling project isn't just about tile and fixtures — it's about trust, communication, and protecting one of your biggest investments.",
    credentials:["Schluter Pro Certified","Licensed & Insured Contractor","Member, Better Business Bureau","50+ Hamilton County Projects Completed"],
    philosophy:"Every home we work on gets treated like it's our own. That means no shortcuts on waterproofing, no unlicensed tradespeople, and no vague estimates. We show you exactly what you're getting before we start — with 3D renderings, itemized pricing, and a timeline we actually stick to.",
    email:"eric@thehomestarservice.com",
  },
  "robb-rice":{
    name:"Robb Rice",slug:"robb-rice",role:"Co-Founder",
    bio:"Robb co-founded HomeStar Services & Contracting alongside Eric with a shared commitment to quality and integrity. Together, they've built HomeStar into a trusted name across Hamilton County — known for bathroom transformations, basement finishes, and kitchen remodels that are built to last. Robb's hands-on approach and attention to detail ensure that every project meets the high standard HomeStar is known for.",
    credentials:["Schluter Pro Certified","Licensed & Insured Contractor","Experienced in Residential Construction","Serving Hamilton County Communities"],
    philosophy:"We started HomeStar because we saw too many homeowners getting burned by contractors who cut corners. Our promise is simple: we use the best materials, hire licensed professionals for every trade, and stand behind our work with real warranties — not empty promises.",
    email:"thehomestarservice@gmail.com",
  },
};

function AuthorPage({author}){
  useCanonical("about/"+author.slug);

  useEffect(()=>{
    document.title=author.name+" — "+author.role+" | HomeStar Services & Contracting";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",`${author.name}, ${author.role} of HomeStar Services & Contracting. Schluter Pro Certified home remodeling in Hamilton County, Indiana.`);
    window.scrollTo(0,0);
  },[author]);

  const authorPosts=BLOG.filter(()=>true); /* All posts attributed to both founders */

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <BreadcrumbSchema items={[{name:"Home",url:"/"},{name:"About",url:"/#about"},{name:author.name}]}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Person",name:author.name,jobTitle:author.role,worksFor:{"@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",url:"https://www.thehomestarservice.com"},knowsAbout:["bathroom remodeling","kitchen remodeling","basement finishing","Schluter waterproofing system","home renovation"],email:author.email})}}/>

      <Nav isCity/>

      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`}}>
        <div style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>{author.role.toUpperCase()}</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(32px,5vw,48px)",lineHeight:1.1,marginBottom:16}}>{author.name}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.5)",fontSize:17,lineHeight:1.7}}>{author.role}, HomeStar Services & Contracting</p>
        </div>
      </section>

      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div className="lab">Background</div>
            <h2 className="ttl">About {author.name}</h2>
          </div>
          <p style={{color:C.grayDark,fontSize:16,lineHeight:1.85,marginBottom:24}}>{author.bio}</p>
          <div style={{background:C.cream,borderRadius:14,padding:"28px 32px",marginBottom:24}}>
            <h3 className="display" style={{color:C.navy,fontSize:17,marginBottom:16}}>Credentials & Certifications</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
              {author.credentials.map(c=>
                <div key={c} style={{display:"flex",alignItems:"center",gap:10,color:C.grayDark,fontSize:14}}>{I.check} {c}</div>
              )}
            </div>
          </div>
          <div style={{background:C.cream,borderRadius:14,padding:"28px 32px"}}>
            <h3 className="display" style={{color:C.navy,fontSize:17,marginBottom:12}}>Philosophy</h3>
            <p style={{color:C.grayDark,fontSize:15,lineHeight:1.85,margin:0,fontStyle:"italic"}}>"{author.philosophy}"</p>
          </div>
        </div>
      </section>

      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div className="lab">Articles</div>
            <h2 className="ttl">Written by {author.name}</h2>
          </div>
          <div style={{display:"grid",gap:12}}>
            {authorPosts.map(b=>
              <a key={b.slug} href={`/blog/${b.slug}`} style={{padding:"20px 24px",borderRadius:12,background:"#fff",border:`1px solid ${C.sand}`,textDecoration:"none",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand}}>
                <div>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:".06em",color:C.green,textTransform:"uppercase"}}>{b.cat} · {b.read}</span>
                  <h4 className="display" style={{color:C.navy,fontSize:15,marginTop:4}}>{b.title}</h4>
                </div>
                <span style={{color:C.green,flexShrink:0,marginLeft:16}}>{I.arrow}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{textAlign:"center"}}>
          <h2 className="ttl">Work With {author.name}</h2>
          <p className="sub" style={{margin:"0 auto 28px"}}>Ready to start your remodeling project? {author.name} and the HomeStar team are here to help.</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="/#estimate" className="btn-g">Get a Free Estimate {I.arrow}</a>
            <a href="tel:+13172794798" className="btn-w">{I.phone} (317) 279-4798</a>
          </div>
        </div>
      </section>

      <Footer isCity/>
    </div>
  );
}

export default function HomestarSite(){
  const[legalPage,setLegalPage]=useState(null);
  const[cityPage,setCityPage]=useState(null);
  const[servicePage,setServicePage]=useState(null);
  const[serviceCityPage,setServiceCityPage]=useState(null);
  const[blogPost,setBlogPost]=useState(null);
  const[neighborhoodPage,setNeighborhoodPage]=useState(null);
  const[projectPage,setProjectPage]=useState(null);
  const[authorPage,setAuthorPage]=useState(null);
  useCanonical("");

  useEffect(()=>{
    const path=window.location.pathname.replace(/^\//,"").replace(/\/$/,"");

    /* Blog posts */
    if(path.startsWith("blog/")){
      const slug=path.replace("blog/","");
      const post=BLOG.find(b=>b.slug===slug);
      if(post){setBlogPost(post);return;}
    }
    /* Project case studies */
    if(path.startsWith("projects/")){
      const slug=path.replace("projects/","");
      const proj=PROJECTS.find(p=>p.slug===slug);
      if(proj){setProjectPage(proj);return;}
    }
    /* Author pages */
    if(path.startsWith("about/")){
      const slug=path.replace("about/","");
      if(AUTHORS[slug]){setAuthorPage(slug);return;}
    }
    /* Neighborhood pages */
    if(path.startsWith("remodeling-")){
      const hoodPath=path.replace(/^remodeling-/,"").replace(/-in$/,"");
      for(const[key,hood] of Object.entries(NEIGHBORHOODS)){
        const citySlug=hood.city.toLowerCase().replace(/ /g,"-");
        if(hoodPath===key+"-"+citySlug){
          setNeighborhoodPage(key);return;
        }
      }
    }
    /* Service-city combos */
    const alias=SERVICE_CITY_ALIASES[path];
    if(alias&&alias.s&&alias.c&&CITIES[alias.c]&&SERVICE_PAGES[alias.s]){
      setServiceCityPage({service:alias.s,city:alias.c,svcKey:Object.keys(SERVICE_SLUG_MAP).find(k=>SERVICE_SLUG_MAP[k]===alias.s)||alias.s});
      return;
    }
    /* City pages */
    if(CITIES[path]){setCityPage(path);return;}
    /* Service pages */
    if(SERVICE_PAGES[path]){setServicePage(path);}
  },[]);

  useEffect(()=>{
    const handleHash=()=>{
      const hash=window.location.hash;
      if(hash==="#privacy"){setLegalPage("privacy");window.history.replaceState(null,"",window.location.pathname);}
      else if(hash==="#terms"){setLegalPage("terms");window.history.replaceState(null,"",window.location.pathname);}
    };
    handleHash();
    window.addEventListener("hashchange",handleHash);
    return()=>window.removeEventListener("hashchange",handleHash);
  },[]);

  if(blogPost){
    return <BlogPostPage post={blogPost}/>;
  }

  if(projectPage){
    return <ProjectPage project={projectPage}/>;
  }

  if(authorPage&&AUTHORS[authorPage]){
    return <AuthorPage author={AUTHORS[authorPage]}/>;
  }

  if(neighborhoodPage&&NEIGHBORHOODS[neighborhoodPage]){
    return <NeighborhoodPage hood={NEIGHBORHOODS[neighborhoodPage]}/>;
  }

  if(serviceCityPage){
    return <ServiceCityPage svcData={SERVICE_PAGES[serviceCityPage.service]} cityData={CITIES[serviceCityPage.city]} svcKey={serviceCityPage.svcKey}/>;
  }

  if(cityPage&&CITIES[cityPage]){
    return <CityPage data={CITIES[cityPage]}/>;
  }

  if(servicePage&&SERVICE_PAGES[servicePage]){
    return <ServicePage data={SERVICE_PAGES[servicePage]} slug={servicePage}/>;
  }

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",description:"Family-owned home remodeling company serving Hamilton County, Indiana. Kitchen & bath remodeling, basement finishing, flooring, painting, decks & outdoor living.",url:"https://www.thehomestarservice.com",telephone:"+1-317-279-4798",address:{"@type":"PostalAddress",addressLocality:"Carmel",addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:39.9784,longitude:-86.1180},areaServed:[{name:"Carmel"},{name:"Fishers"},{name:"Geist"},{name:"Westfield"},{name:"Noblesville"},{name:"Zionsville"},{name:"Brownsburg"},{name:"Pendleton"},{name:"McCordsville"},{name:"Fortville"}].map(c=>({"@type":"City",...c})),aggregateRating:{"@type":"AggregateRating",ratingValue:"5.0",reviewCount:"127"},openingHours:["Mo-Fr 07:00-18:00","Sa 08:00-14:00"],priceRange:"$$",sameAs:["https://www.facebook.com/people/HomeStar-Services-and-Contracting/61568970834535/","https://www.instagram.com/thehomestarservice/"],founder:[{"@type":"Person",name:"Robb"},{"@type":"Person",name:"Eric"}],hasOfferCatalog:{"@type":"OfferCatalog",name:"Home Remodeling Services",itemListElement:SVC.map((s,i)=>({"@type":"Offer",itemOffered:{"@type":"Service",name:s.title,description:s.desc}}))}})}}/>
      <Nav/>
      <Hero/>
      <Services/>
      <Difference/>
      <OurProcess/>
      <Projects/>
      <Videos/>
      <Blog/>
      <Testimonials/>
      <ServiceAreas/>
      <About/>
      <FAQ/>
      <Contact/>
      <Footer/>
      <LegalModal page={legalPage} onClose={()=>setLegalPage(null)}/>
    </div>
  );
}
