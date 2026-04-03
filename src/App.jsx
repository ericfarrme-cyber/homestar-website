import { useState, useEffect, useRef } from "react";

/* ─── Brand Tokens ────────────────────────────────── */
const C = {
  navy: "#2D3E46", navyMid: "#374A52", navyLight: "#45585F", navyDark: "#1E2D34",
  green: "#A0917F", greenDark: "#8C7E6E", greenLight: "#B3A594", greenMuted: "rgba(160,145,127,0.10)",
  white: "#FFFFFF", cream: "#FAF8F5", sand: "#F0EDE8",
  gray: "#7A8A8F", grayDark: "#4B5563", text: "#2D3E46",
};

/* ─── Icons (inline SVG) ──────────────────────────── */
const I = {
  phone: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  mail: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
  pin: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star: <svg width="16" height="16" fill="#A0917F" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  check: <svg width="18" height="18" fill="none" stroke="#A0917F" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  arrow: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  menu: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>,
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
  { title: "Stamped & Decorative Concrete", tag: "Our specialty", desc: "Transform any surface with the look of natural stone, brick, slate, or tile. We specialize in stamped concrete with custom colors, patterns, and textures — delivering high-end results that elevate your property at a fraction of the cost of natural materials.", color: "#8B7A5A", href: "/stamped-decorative-concrete" },
  { title: "Patios & Outdoor Living", tag: "Your backyard, reimagined", desc: "Custom-designed concrete patios built for how you actually live outdoors. From simple entertaining pads to full outdoor living spaces with fire pit pads, seating walls, and decorative borders — we create backyards people never want to leave.", color: "#6A8B7A", href: "/concrete-patios-outdoor-living" },
  { title: "Pavilions, Pergolas & Enclosed Patios", tag: "Outdoor living, year-round", desc: "Extend your outdoor season with a custom pavilion, pergola, or fully enclosed 3- or 4-season room. We build the concrete foundation and partner with trusted local builders to deliver complete covered and enclosed outdoor living spaces — from open-air pergolas to insulated sunrooms you can enjoy all year.", color: "#7A6A8B", href: "/pavilions-pergolas-enclosed-patios" },
  { title: "Concrete Driveways", tag: "Curb appeal that lasts", desc: "Durable, professionally poured driveways in standard broom finish, stamped patterns, exposed aggregate, or colored concrete. Designed to complement your home and built to handle Indiana weather for decades.", color: "#6A8B9B", href: "/concrete-driveways" },
  { title: "Sidewalks & Walkways", tag: "Safe & beautiful pathways", desc: "Level, durable, and attractive sidewalks and walkways for residential and commercial properties. New pours, replacements, and decorative options that connect your spaces beautifully.", color: "#5A7A6A", href: "/concrete-sidewalks-walkways" },
  { title: "Garage Floors & Slabs", tag: "Built for heavy use", desc: "High-performance garage floor pours, shop slabs, and resurfacing. Proper grading, reinforcement, and finishing that stands up to vehicles, equipment, and daily wear.", color: "#6A6A8B", href: "/garage-floors-concrete-slabs" },
  { title: "Concrete Removal & Replacement", tag: "Out with the old", desc: "Complete tear-out and hauling of old, cracked, or sunken concrete. We prep the site properly with grading and compaction so your new pour starts on a solid foundation.", color: "#7A8B6A", href: "/concrete-removal-replacement" },
];

const PROCESS = [
  { icon: I.bulb, step: "01", title: "Consultation & Site Evaluation", sub: "Understanding Your Property.", text: "Every project starts with an on-site visit. We walk your property, assess soil conditions and drainage, discuss your goals, and help you understand what's possible within your budget. No pressure — just an honest conversation about the best approach for your property.", bullets: ["On-site walkthrough and property assessment", "Discussion of design options and finishes", "Drainage and grading evaluation", "Clear understanding of budget and timeline"] },
  { icon: I.calc, step: "02", title: "Design, Materials & Estimate", sub: "Your Project Takes Shape.", text: "With a clear picture of what you want, we put together a detailed plan — including layout, finish options, reinforcement specs, and a transparent, itemized estimate. You'll know exactly what you're getting and what it costs before any work begins.", bullets: ["Detailed project layout and design plan", "Material options: standard, stamped, colored, exposed aggregate", "Itemized estimate with clear, honest pricing", "Defined project timeline from start to finish"] },
  { icon: I.cal, step: "03", title: "Schedule, Pour & Finish", sub: "Your Project, Built Right.", text: "Once the plan is set, we lock in your start date and handle everything — excavation, grading, forming, reinforcement, pour, and finish. Our crew arrives on time, works clean, and keeps you informed every step of the way.", bullets: ["Confirmed start date that works for you", "Professional excavation and site prep", "Expert forming, pouring, and finishing", "Final walkthrough and curing instructions"] },
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
    title: "Stamped Concrete Patio in Fishers",
    cat: "Stamped Concrete",
    color: "#8B7A5A",
    desc: "A beautiful stamped concrete patio installation for a Fishers home — expertly poured with decorative pattern and seamless finish that transforms the backyard.",
    images: [
      { src: "/images/fishers-concrete-1.jpg", alt: "Stamped concrete patio installation in Fishers Indiana" },
      { src: "/images/fishers-concrete-2.jpg", alt: "Stamped concrete patio detail Fishers IN" },
      { src: "/images/stamped-concrete-fishers.jpg", alt: "Stamped concrete patio finished pour Fishers Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Patio in Noblesville",
    cat: "Stamped Concrete",
    color: "#6A8B7A",
    desc: "A full backyard stamped concrete patio in Noblesville with a natural stone pattern, custom color, and clean edges — designed for outdoor living and entertaining.",
    images: [
      { src: "/images/noblesville-concrete-1.jpg", alt: "Stamped concrete patio in Noblesville Indiana" },
      { src: "/images/noblesville-concrete-2.jpg", alt: "Stamped concrete patio installation Noblesville IN" },
      { src: "/images/noblesville-concrete-3.jpg", alt: "Stamped concrete backyard patio Noblesville Indiana" },
      { src: "/images/noblesville-concrete-4.jpg", alt: "Completed stamped concrete patio Noblesville IN" },
      { src: "/images/stamped-concrete-noblesville.jpg", alt: "Stamped concrete patio wet finish Noblesville Indiana" },
      { src: "/images/stamped-concrete-noblesville-patio.jpg", alt: "Stamped concrete patio completed Noblesville Indiana" },
    ],
  },
  {
    title: "Custom Pavilion & Patio in Fortville",
    cat: "Pavilion",
    color: "#7A6A8B",
    desc: "A custom-built pavilion with stone columns, stained wood ceiling, and stamped concrete pad — a complete outdoor living space built for year-round enjoyment in Fortville.",
    images: [
      { src: "/images/fortville-pavilion-1.jpg", alt: "Custom pavilion with stamped concrete patio in Fortville Indiana" },
      { src: "/images/fortville-pavilion-2.jpg", alt: "Pavilion stone column detail Fortville IN" },
      { src: "/images/fortville-pavilion-3.jpg", alt: "Covered pavilion outdoor living space Fortville Indiana" },
    ],
  },
  {
    title: "Fire Pit & Outdoor Living Space in Noblesville",
    cat: "Outdoor Living",
    color: "#8B6A5A",
    desc: "A cozy outdoor living space featuring a custom fire pit, Adirondack seating area, and stamped concrete patio — designed for relaxing evenings in a Noblesville backyard.",
    images: [
      { src: "/images/outdoor-living-noblesville.jpg", alt: "Outdoor living space with fire pit in Noblesville Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Walkway in Carmel",
    cat: "Stamped Concrete",
    color: "#6A8B9B",
    desc: "A stunning cobblestone-pattern stamped concrete walkway winding through the landscape — custom color with rich texture and hand-tooled edges in a beautiful Carmel property.",
    images: [
      { src: "/images/stamped-concrete-carmel.jpg", alt: "Stamped concrete walkway in Carmel Indiana" },
    ],
  },
  {
    title: "Brushed Concrete Patio in Fishers",
    cat: "Patio",
    color: "#5A7A9B",
    desc: "A clean, modern brushed concrete patio with precise control joints and smooth broom finish — a functional backyard space built for everyday use in Fishers.",
    images: [
      { src: "/images/brushed-concrete-fishers.jpg", alt: "Brushed concrete patio in Fishers Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Sidewalk in Fishers",
    cat: "Stamped Concrete",
    color: "#8B8A6A",
    desc: "A decorative stamped concrete sidewalk curving around the front of a Fishers home — seamless pattern with a natural stone look that elevates the curb appeal.",
    images: [
      { src: "/images/stamped-concrete-sidewalk-fishers.jpg", alt: "Stamped concrete sidewalk in Fishers Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Patio in McCordsville",
    cat: "Stamped Concrete",
    color: "#9B6A6A",
    desc: "A custom stamped concrete patio with natural stone pattern and clean border detail — a beautiful outdoor living surface for a McCordsville home.",
    images: [
      { src: "/images/stamped-concrete-mccordsville.jpg", alt: "Stamped concrete patio in McCordsville Indiana" },
    ],
  },
  {
    title: "Stamped Concrete Patio in Zionsville",
    cat: "Stamped Concrete",
    color: "#6A9B8B",
    desc: "An elegant stamped concrete patio with outdoor dining space in Zionsville — natural stone pattern with rich color and expert finishing that blends seamlessly with the home's architecture.",
    images: [
      { src: "/images/stamped-concrete-patio-zionsville.jpg", alt: "Stamped concrete patio with outdoor dining in Zionsville Indiana" },
    ],
  },
  {
    title: "Outdoor Living Space & Pavilion in Westfield",
    cat: "Outdoor Living",
    color: "#7A8B5A",
    desc: "A complete outdoor living space in Westfield featuring a covered pavilion with cedar accents, stamped concrete pad, fire pit area, and evening lighting — built for year-round entertaining.",
    images: [
      { src: "/images/outdoor-living-stamped-westfield-1.jpg", alt: "Outdoor living pavilion with stamped concrete in Westfield Indiana" },
      { src: "/images/outdoor-living-stamped-westfield.jpg", alt: "Covered pavilion outdoor living space Westfield IN" },
    ],
  },
  {
    title: "Brushed Concrete Sidewalk & Driveway in Westfield",
    cat: "Patio",
    color: "#5A8B7A",
    desc: "A clean brushed concrete sidewalk with natural stone border connecting to the driveway — precise edges, proper grading, and a professional finish in a Westfield neighborhood.",
    images: [
      { src: "/images/brushed-concrete-sidewalk-and-driveway-westfield.jpg", alt: "Brushed concrete sidewalk and driveway in Westfield Indiana" },
    ],
  },
  {
    title: "Brushed Concrete Driveway in Carmel",
    cat: "Driveway",
    color: "#6A8B9B",
    desc: "A fresh brushed concrete driveway pour in Carmel — clean control joints, smooth broom finish, and proper grading for a durable, professional result.",
    images: [
      { src: "/images/brushed-concrete-driveway-carmel.jpg", alt: "Brushed concrete driveway in Carmel Indiana" },
      { src: "/images/brushed-concrete-carmel.jpg", alt: "Brushed concrete pour in progress Carmel IN" },
    ],
  },
  {
    title: "Composite Deck Build in Fishers",
    cat: "Deck",
    color: "#6A7A8B",
    desc: "A custom composite deck with white railing, dual staircases, and spacious multi-level layout — built for a Fishers family that loves outdoor entertaining. Low-maintenance composite decking designed to look great for decades without staining or sealing.",
    images: [
      { src: "/images/fishers-composite-deck-1.jpg", alt: "Composite deck build in Fishers Indiana" },
      { src: "/images/fishers-composite-deck-2.jpg", alt: "Composite deck with white railing Fishers IN" },
      { src: "/images/fishers-composite-deck-3.jpg", alt: "Multi-level composite deck Fishers Indiana" },
    ],
  },
];

const BLOG = [
  { title: "Stamped vs. Standard Concrete: Which Is Right for Your Patio?", date: "Mar 10, 2026", read: "5 min", cat: "Patios", excerpt: "Stamped concrete looks incredible — but is it worth the extra cost? We break down the pros, cons, and real cost difference so you can make the right call for your backyard.",
    body: [
      "If you're planning a new patio, one of the first decisions you'll face is whether to go with standard broom-finish concrete or upgrade to stamped concrete. Both are durable, long-lasting options — but they serve different purposes and come at different price points.",
      "Standard concrete with a broom finish is the workhorse of residential concrete. It's clean, functional, slip-resistant, and cost-effective. For homeowners who want a solid patio without the premium price tag, it's hard to beat. A well-poured broom-finish patio will last 25–30 years with minimal maintenance.",
      "Stamped concrete takes things up a notch by imprinting patterns into the wet concrete that replicate the look of natural stone, brick, slate, or tile. Add integral color and a release agent, and you've got a surface that looks like high-end hardscape at a fraction of the material cost.",
      "The real cost difference? Standard concrete typically runs $8–12 per square foot installed in Hamilton County. Stamped concrete ranges from $14–20 per square foot depending on the pattern complexity and color choices. For a 400 sq ft patio, that's the difference between roughly $3,600 and $7,200.",
      "Maintenance is another consideration. Standard concrete needs occasional sealing every 2–3 years. Stamped concrete should be resealed every 2–3 years as well, but the sealer also refreshes the color and keeps the pattern looking sharp. Both surfaces may develop hairline cracks over time — that's normal for concrete in Indiana's freeze-thaw climate.",
      "Our recommendation? If your patio is in a high-visibility area — like right off the back of your house where you entertain — stamped concrete delivers a dramatic visual upgrade. For utility areas, side yards, or budget-focused projects, standard concrete gives you excellent value.",
      "Not sure which direction to go? Call Hamilton County Concrete and Patios at (317) 279-5643 for a free on-site consultation. We'll show you real samples and help you pick the best option for your space and budget."
    ]},
  { title: "5 Signs Your Driveway Needs to Be Replaced (Not Just Patched)", date: "Feb 22, 2026", read: "4 min", cat: "Driveways", excerpt: "Cracks, sinking, and crumbling edges aren't always fixable with a patch job. Here are five signs it's time for a full driveway replacement.",
    body: [
      "Concrete driveways are built to last — but nothing lasts forever. Indiana's freeze-thaw cycles, road salt, heavy vehicles, and time all take their toll. The question most homeowners face isn't whether to fix their driveway, but whether a patch job will hold or whether it's time for a full replacement.",
      "1. Widespread Cracking — A single hairline crack is cosmetic. But when cracks are spreading across the entire surface, intersecting, or widening over time, the structural integrity of the slab is compromised. Patching widespread cracks is like putting tape on a crumbling wall — it looks okay for a month but doesn't address the underlying issue.",
      "2. Sinking or Uneven Sections — If sections of your driveway have sunk, creating uneven surfaces or trip hazards, the base beneath the concrete has failed. This usually means poor compaction during original installation, soil erosion, or water undermining the base. Mudjacking can sometimes help, but if multiple sections are affected, replacement is the better long-term investment.",
      "3. Crumbling Edges — When the edges of your driveway start breaking apart, it's usually a sign the concrete was poured too thin at the perimeter or the forms weren't properly set. Edge crumbling tends to accelerate over time, especially with lawn equipment and vehicle tires hitting those weak spots.",
      "4. Large Potholes or Spalling — Surface spalling — where the top layer flakes and peels away — is common on driveways that weren't properly finished or sealed. Deep potholes indicate the slab has broken through entirely. Both conditions worsen every winter as water gets in, freezes, and expands.",
      "5. The Driveway Is 25+ Years Old — Concrete driveways in Indiana have a typical lifespan of 25–30 years. If yours is approaching that age and showing any of the signs above, replacement will give you another three decades of reliable service versus years of escalating repairs.",
      "Hamilton County Concrete and Patios provides free driveway evaluations across Carmel, Fishers, Noblesville, Westfield, and Zionsville. Call us at (317) 279-5643 and we'll tell you honestly whether a repair or replacement makes the most sense."
    ]},
  { title: "How to Prepare Your Property for a Concrete Pour", date: "Feb 8, 2026", read: "4 min", cat: "Tips", excerpt: "A little prep goes a long way. Here's what homeowners should know before the crew arrives to pour your new concrete.",
    body: [
      "You've scheduled your concrete project — now what? While our crew handles the heavy lifting, there are a few things homeowners can do to make sure everything goes smoothly on pour day.",
      "Clear the area. Remove any furniture, planters, vehicles, grills, or items near the work zone. We need clear access not just to the pour area but also to the path our equipment will use to reach it. If we're pouring a backyard patio, make sure the gate is accessible and the path is clear.",
      "Mark any underground utilities. Before we dig, we'll call 811 to have public utilities marked. But if you have private irrigation lines, invisible fence wires, or landscape lighting wiring, please flag those for us. It saves time and prevents accidental damage.",
      "Talk to your neighbors. Concrete trucks are large and loud, and the process can temporarily block part of the street or shared driveway. A quick heads-up to your neighbors goes a long way. We're always respectful of the neighborhood, but advance notice helps everyone.",
      "Plan for curing time. Fresh concrete needs time to cure — typically 24–48 hours before foot traffic and 7 days before vehicle traffic. Plan accordingly if we're pouring your driveway. You'll want to arrange alternate parking for about a week.",
      "Check the weather with us. We monitor forecasts closely and will reschedule if rain is likely. Concrete and rain don't mix well during the pour and finishing process. If there's a chance of weather, we'll communicate early so you're not caught off guard.",
      "Questions about your upcoming project? Call Hamilton County Concrete and Patios at (317) 279-5643. We walk every customer through the process so there are no surprises."
    ]},
  { title: "Why Proper Base Prep Is the Most Important Step in Any Concrete Job", date: "Jan 25, 2026", read: "5 min", cat: "Education", excerpt: "The concrete you see is only as good as the base you don't. Here's why we spend more time on what goes underneath.",
    body: [
      "Ask most homeowners what makes a great concrete driveway or patio, and they'll talk about the finish — how smooth it is, the stamp pattern, the color. But ask any experienced concrete contractor the same question, and the answer is always the same: the base.",
      "What goes under your concrete determines how long it lasts, whether it cracks, and whether it settles unevenly over time. A perfect finish poured on a bad base will fail. A basic finish poured on a properly prepared base will last decades.",
      "Proper base preparation starts with excavation to the correct depth — removing topsoil, organic material, and any unstable soil. In Hamilton County, we're typically working with clay-heavy soils that expand and contract with moisture. That makes base prep even more critical.",
      "After excavation, we compact the existing subgrade to create a stable foundation. Then we add a layer of compactable aggregate — usually 4–6 inches of crushed stone — and compact it in lifts using a plate compactor. This creates a uniform, well-drained base that supports the concrete evenly.",
      "Proper grading is the next critical step. Water should always drain away from structures — your house, garage, or any adjacent buildings. We grade the base to ensure positive drainage, which prevents water from pooling under or against the concrete.",
      "Finally, we install reinforcement. For driveways, that means rebar or welded wire mesh positioned in the slab, plus fiber mesh in the concrete mix for additional crack resistance. For patios and walkways, fiber mesh and proper joint spacing are usually sufficient.",
      "When a contractor rushes through base prep — or skips it — you end up with settling, cracking, and drainage problems that no amount of surface repair can fix. At Hamilton County Concrete and Patios, we spend the time to do it right because everything we pour depends on it."
    ]},
  { title: "Concrete vs. Pavers: Making the Right Choice for Your Project", date: "Jan 10, 2026", read: "5 min", cat: "Education", excerpt: "Both have their place. Here's an honest comparison to help you decide between poured concrete and pavers for your next project.",
    body: [
      "Concrete and pavers are the two most popular options for driveways, patios, and walkways in Hamilton County. Both are excellent materials — but they serve different needs, come at different price points, and require different maintenance.",
      "Poured concrete gives you a seamless, uniform surface. It's faster to install, typically more affordable per square foot, and requires very little ongoing maintenance beyond occasional sealing. With stamped or colored options, you can achieve a wide range of looks without the premium cost of natural stone pavers.",
      "Pavers offer a modular look with individual units that can be arranged in patterns. They're easier to repair individually — if one paver cracks, you replace that single unit. However, pavers require a more complex installation with edge restraints and polymeric sand, and weeds can grow between joints over time.",
      "Cost comparison for Hamilton County: Standard concrete runs $8–12 per square foot installed. Stamped concrete runs $14–20. Basic concrete pavers start around $15–20 per square foot installed, while premium natural stone pavers can reach $25–40+.",
      "For driveways, poured concrete is our go-to recommendation. It handles vehicle weight better than pavers (which can shift and settle under repeated loads), it's faster to install, and it provides a smooth, continuous surface that's easy to plow in winter.",
      "For patios and walkways, the choice is more personal. If you want a specific modular look and don't mind the higher cost and ongoing maintenance, pavers are a great option. If you want a beautiful, low-maintenance surface at a better price point, stamped concrete delivers exceptional results.",
      "Still deciding? Call Hamilton County Concrete and Patios at (317) 279-5643 for a free consultation. We'll help you weigh the options based on your specific project and budget."
    ]},
];

const TESTIMONIALS = [
  { name: "Mike & Sarah T.", loc: "Carmel, IN", text: "Hamilton County Concrete and Patios replaced our entire driveway and added a stamped patio in the backyard. The crew was professional, on time, and the finished product looks incredible. Highly recommend.", rating: 5 },
  { name: "Jennifer R.", loc: "Fishers, IN", text: "We got three quotes for a new patio and these guys were the most thorough in explaining the process and what to expect. Fair price, excellent work, and they cleaned up perfectly when done.", rating: 5 },
  { name: "David & Lisa K.", loc: "Westfield, IN", text: "From the first phone call to the final walkthrough, everything was smooth and professional. Our new sidewalk and front porch landing look amazing. Would absolutely use them again.", rating: 5 },
];

const FAQS = [
  { q: "How do I get a free estimate?", a: "Give us a call at (317) 279-5643 or submit a request through the form on this page. We'll set up a time to visit your property, discuss your project, and provide a detailed written estimate at no cost." },
  { q: "Are you licensed and insured?", a: "Yes — Hamilton County Concrete and Patios holds full licensing, bonding, and insurance in Indiana, including general liability and workers' compensation. Your property and our crew are fully protected." },
  { q: "How long does a typical concrete project take?", a: "Most residential pours take 1–3 days depending on scope — but total project time including excavation, forming, and curing runs about 1–2 weeks. We'll give you a clear timeline before any work begins." },
  { q: "How long before I can walk on or drive on new concrete?", a: "Foot traffic is typically safe after 24–48 hours. Vehicle traffic should wait at least 7 days, and heavy loads 14 days. We'll provide specific curing instructions based on your project and weather conditions." },
  { q: "What areas do you serve?", a: "We work throughout Hamilton County and surrounding communities — including Carmel, Fishers, Noblesville, Westfield, Zionsville, Brownsburg, Pendleton, McCordsville, and Fortville." },
  { q: "Do you offer stamped or colored concrete?", a: "Absolutely. We offer a full range of decorative options including stamped patterns, integral color, stained finishes, exposed aggregate, and decorative borders. We'll bring samples to your consultation so you can see and feel the options." },
];

const AREAS = ["Carmel", "Fishers", "Noblesville", "Westfield", "Zionsville", "Brownsburg", "Pendleton", "McCordsville", "Fortville"];

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
.btn-g:hover{background:${C.greenDark};transform:translateY(-2px);box-shadow:0 8px 24px rgba(160,145,127,.35)}
.btn-n{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:${C.navy};color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:none;border-radius:8px;cursor:pointer;text-decoration:none;transition:all .25s}
.btn-n:hover{background:${C.navyMid};transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,62,70,.3)}
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
  const links=[{l:"Services",h:"#services"},{l:"Why Us",h:"#difference"},{l:"Our Process",h:"#process"},{l:"Projects",h:"#projects"},{l:"Blog",h:"#blog"},{l:"Service Areas",h:"#areas"},{l:"Contact",h:"#contact"}];

  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:sc?"rgba(250,248,245,.97)":"rgba(250,248,245,.95)",backdropFilter:"blur(14px)",transition:"all .35s",borderBottom:sc?`1px solid ${C.sand}`:"1px solid transparent",boxShadow:sc?"0 2px 20px rgba(0,0,0,.06)":"none"}}>
      {/* Top bar */}
      <div style={{background:C.sand,transition:"background .35s",borderBottom:`1px solid ${C.sand}`}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",height:sc?0:32,overflow:"hidden",transition:"height .3s"}}>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            <a href="tel:+13172795643" style={{color:C.gray,fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>{I.phone} (317) 279-5643</a>
            <span style={{color:C.gray,fontSize:12}}>Serving Hamilton County, IN</span>
          </div>
          <a href="#estimate" style={{color:C.navy,fontSize:12,fontWeight:700,textDecoration:"none",letterSpacing:".04em"}}>REQUEST A FREE ESTIMATE</a>
        </div>
      </div>
      {/* Main bar */}
      <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:sc?60:68,transition:"height .3s"}}>
        <a href="#hero" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <img src="/images/indiana-icon.png" alt="" style={{height:sc?36:42,objectFit:"contain",transition:"all .3s"}} />
          <div style={{lineHeight:1.15}}>
            <div className="display" style={{color:C.navy,fontSize:sc?13:15,fontWeight:800,letterSpacing:".02em"}}>HAMILTON COUNTY</div>
            <div className="display" style={{color:C.navy,fontSize:sc?13:15,fontWeight:800,letterSpacing:".02em",opacity:.6}}>CONCRETE AND PATIOS</div>
          </div>
        </a>
        <div className="desk" style={{display:"flex",alignItems:"center",gap:26}}>
          {links.map(l=><a key={l.h} href={l.h} style={{color:C.navy,textDecoration:"none",fontSize:13,fontWeight:600,transition:"color .2s",opacity:.7}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.color=C.green}} onMouseLeave={e=>{e.currentTarget.style.opacity=".7";e.currentTarget.style.color=C.navy}}>{l.l}</a>)}
          <a href="#estimate" className="btn-n" style={{padding:"9px 20px",fontSize:13}}>Free Estimate</a>
        </div>
        <button className="mob-btn" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",color:C.navy,cursor:"pointer",display:"flex",alignItems:"center"}}>{open?I.close:I.menu}</button>
      </div>
      {open&&<div className="mob-menu" style={{background:C.cream,padding:"16px 24px 28px",display:"flex",flexDirection:"column",gap:14,borderTop:`1px solid ${C.sand}`}}>
        {links.map(l=><a key={l.h} href={l.h} onClick={()=>setOpen(false)} style={{color:C.navy,textDecoration:"none",fontSize:15,fontWeight:600,padding:"6px 0",borderBottom:`1px solid ${C.sand}`}}>{l.l}</a>)}
        <a href="#estimate" className="btn-n" style={{textAlign:"center",marginTop:8}}>Get a Free Estimate</a>
      </div>}
    </nav>
  );
}

/* ─── Hero Photo Showcase ──────────────────────────── */
const HERO_PHOTOS = [
  { src: "/images/stamped-concrete-patio-zionsville.jpg", alt: "Stamped concrete patio with outdoor dining in Zionsville Indiana" },
  { src: "/images/outdoor-living-stamped-westfield-1.jpg", alt: "Outdoor living pavilion with stamped concrete in Westfield Indiana" },
  { src: "/images/stamped-concrete-carmel.jpg", alt: "Stamped concrete walkway in Carmel Indiana" },
  { src: "/images/fortville-pavilion-1.jpg", alt: "Custom pavilion with stamped concrete in Fortville Indiana" },
  { src: "/images/noblesville-concrete-1.jpg", alt: "Stamped concrete patio in Noblesville Indiana" },
  { src: "/images/outdoor-living-noblesville.jpg", alt: "Outdoor living space with fire pit in Noblesville Indiana" },
  { src: "/images/fishers-concrete-1.jpg", alt: "Stamped concrete patio in Fishers Indiana" },
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
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,background:"linear-gradient(transparent,rgba(30,45,52,.6))"}}/>
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:6}}>
        {HERO_PHOTOS.map((_,i)=>(
          <div key={i} style={{width:idx===i?20:6,height:6,borderRadius:3,background:idx===i?"#fff":"rgba(255,255,255,.35)",transition:"all .4s ease"}}/>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────── */
function Hero(){
  return(
    <section id="hero" style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",background:`linear-gradient(155deg,${C.navyLight} 0%,#4E666F 35%,#5E7680 65%,#6E8690 100%)`,overflow:"hidden"}}>
      {/* Large warm cream glows */}
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:900,height:900,borderRadius:"50%",background:"radial-gradient(circle,rgba(250,248,245,.18) 0%,rgba(250,248,245,.06) 40%,transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:"-25%",left:"-15%",width:1000,height:1000,borderRadius:"50%",background:"radial-gradient(circle,rgba(250,248,245,.14) 0%,rgba(250,248,245,.04) 40%,transparent 70%)"}}/>
      <div style={{position:"absolute",top:"30%",left:"40%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,237,232,.10) 0%,transparent 60%)"}}/>
      {/* Subtle grid */}
      <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>

      <div style={{maxWidth:1160,margin:"0 auto",padding:"140px 24px 100px",position:"relative",zIndex:2,width:"100%"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}} className="hero-grid">
          {/* Left: Text */}
          <div>
            <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.12)",borderRadius:50,padding:"7px 16px",marginBottom:26}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"rgba(255,255,255,.7)"}}/>
              <span style={{color:"rgba(255,255,255,.85)",fontWeight:700,fontSize:12,letterSpacing:".06em"}}>LOCALLY OWNED • HAMILTON COUNTY, IN</span>
            </div>

            <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(36px,5.5vw,60px)",lineHeight:1.06,marginBottom:22}}>
              Stunning Patios.<br/><span style={{color:"rgba(255,255,255,.55)"}}>Built to Last.</span>
            </h1>

            <p className="fu d3" style={{color:"rgba(255,255,255,.75)",fontSize:18,lineHeight:1.7,maxWidth:520,marginBottom:36}}>
              Stamped concrete patios, decorative outdoor living spaces, driveways, and more across Hamilton County, Indiana. Specializing in the finishes that make your property unforgettable.
            </p>

            <div className="fu d4" style={{display:"flex",flexWrap:"wrap",gap:14}}>
              <a href="#estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
              <a href="#services" className="btn-o">View Our Services</a>
            </div>

            <div className="fu d5" style={{display:"flex",flexWrap:"wrap",gap:36,marginTop:52}}>
              {[{n:"Local",l:"Hamilton County Born & Raised"},{n:"100%",l:"Licensed & Insured"},{n:"5.0★",l:"Google Rating"},{n:"Free",l:"On-Site Estimates"}].map(b=>
                <div key={b.l}><div className="display" style={{color:"#fff",fontSize:26,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:600,letterSpacing:".03em",marginTop:2}}>{b.l}</div></div>
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
          <h2 className="ttl">Stamped Concrete, Patios & More</h2>
          <p className="sub" style={{margin:"0 auto"}}>We specialize in stamped and decorative concrete patios — plus driveways, walkways, and full concrete replacement across Hamilton County.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:22}}>
          {SVC.map((s,i)=>
            <div key={s.title} className={vis?`fu d${i%6+1}`:""} style={{padding:"32px 28px",borderRadius:14,border:`1px solid ${C.sand}`,background:"#fff",transition:"all .3s",cursor:"pointer",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 40px rgba(240,232,220,.15)"}}
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

/* ─── The Difference ──────────────────────────────── */
function Difference(){
  const[ref,vis]=useVis();
  const items = [
    {
      title: "Proper Base Preparation — Every Time",
      desc: "We don't pour on dirt. Every project starts with full excavation, compactable aggregate base, and mechanical compaction. It costs more and takes longer, but it's why our concrete stays level and crack-free for decades while cheaper pours fail in a few years.",
      highlight: "The Foundation of Quality",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
    },
    {
      title: "Reinforced Concrete Standard",
      desc: "Every driveway and high-load surface we pour includes rebar or welded wire mesh reinforcement plus fiber mesh in the mix. This isn't an upgrade — it's our standard. Reinforcement prevents cracking and extends the life of your concrete by decades.",
      highlight: "Rebar + Fiber Mesh Standard",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    },
    {
      title: "Proper Grading & Drainage",
      desc: "Water is concrete's worst enemy. We grade every surface for positive drainage away from your home and structures. Proper slope, strategic control joints, and correct thickness prevent pooling, erosion, and the freeze-thaw damage that destroys poorly planned pours.",
      highlight: "Protects Your Investment",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    },
    {
      title: "Clear Communication & Accountability",
      desc: "You'll never be left wondering what's happening with your project. We provide a detailed written estimate, a clear timeline, and keep you informed from excavation through final finish. One point of contact, no runaround.",
      highlight: "Always In The Loop",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      title: "Quality Materials, Not Shortcuts",
      desc: "We use the right PSI concrete mix for every application — 4,000 PSI minimum for driveways, proper air entrainment for freeze-thaw resistance, and quality sealers that protect your finish. Cheap materials lead to early failure. We don't cut those corners.",
      highlight: "4,000+ PSI Standard",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    },
    {
      title: "Locally Owned & Community Rooted",
      desc: "We're a small business rooted in Hamilton County. Your neighbors are our clients, and our reputation is built on every project we complete. Licensed with the State of Indiana, fully insured, and committed to this community.",
      highlight: "Your Neighbors Trust Us",
      icon: <svg width="28" height="28" fill="none" stroke={C.green} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    },
  ];

  return(
    <section id="difference" className="sec" style={{background:C.cream,position:"relative",overflow:"hidden"}} ref={ref}>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className="lab">Why Hamilton County Concrete and Patios</div>
          <h2 className="ttl">The Difference Is in the Details</h2>
          <p className="sub" style={{margin:"0 auto"}}>Stamped concrete and decorative finishes demand a higher level of skill. Here's what sets our work apart.</p>
        </div>

        {/* Stamped concrete callout */}
        <div className={vis?"fu d1":""} style={{background:C.navy,borderRadius:16,padding:"32px 36px",marginBottom:36,display:"flex",flexWrap:"wrap",gap:32,alignItems:"center"}}>
          <div style={{flex:"1 1 400px"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(160,145,127,.2)",borderRadius:50,padding:"6px 14px",marginBottom:16}}>
              <span style={{color:C.green,fontWeight:800,fontSize:11,letterSpacing:".08em"}}>STAMPED & DECORATIVE SPECIALISTS</span>
            </div>
            <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:10}}>Beautiful Finishes Start With a Perfect Foundation</h3>
            <p style={{color:"rgba(255,255,255,.55)",fontSize:14,lineHeight:1.75}}>Stamped concrete is only as good as the pour beneath it. We <strong style={{color:"#fff"}}>excavate to full depth</strong>, install compactable aggregate base, and mechanically compact before pouring. Then our finishing crew applies patterns, color hardeners, and release agents with the precision that decorative work demands. The result is a surface that looks stunning <em>and</em> lasts decades.</p>
          </div>
          <div style={{flex:"0 0 auto",display:"flex",gap:20}}>
            {[{label:"Our Method",sub:"Full excavation + aggregate base",color:C.green},{label:"The Shortcut",sub:"Pour on existing soil",color:"#888"}].map(c=>
              <div key={c.label} style={{textAlign:"center",padding:"20px 24px",borderRadius:12,background:"rgba(255,255,255,.06)",border:`1px solid ${c.color}33`,minWidth:130}}>
                <div className="display" style={{color:c.color,fontSize:14,fontWeight:700,marginBottom:4}}>{c.label}</div>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:11}}>{c.sub}</div>
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20}}>
          {items.map((item,i)=>
            <div key={item.title} className={vis?`fu d${i%6+1}`:""} style={{padding:"28px 26px",borderRadius:14,background:"#fff",border:`1px solid ${C.sand}`,transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,.06)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:10,background:C.greenMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.icon}</div>
                <div>
                  <h3 className="display" style={{color:C.navy,fontSize:16,lineHeight:1.3}}>{item.title}</h3>
                  <span style={{color:C.green,fontSize:11,fontWeight:700,letterSpacing:".04em"}}>{item.highlight}</span>
                </div>
              </div>
              <p style={{color:C.gray,fontSize:13,lineHeight:1.7}}>{item.desc}</p>
            </div>
          )}
        </div>

        <div style={{textAlign:"center",marginTop:44}}>
          <a href="#estimate" className="btn-n" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Our Process ──────────────────────────────────── */
function OurProcess(){
  const[ref,vis]=useVis();
  return(
    <section id="process" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className="lab">How We Work</div>
          <h2 className="ttl">A Clear Process from Start to Finish</h2>
          <p className="sub" style={{margin:"0 auto"}}>No surprises, no guesswork. Here's exactly how we take your project from idea to completion.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:32}}>
          {PROCESS.map((p,i)=>
            <div key={p.step} className={vis?`fu d${i+1}`:""} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:40,alignItems:"center",background:C.cream,borderRadius:16,padding:"40px 36px",boxShadow:"0 2px 16px rgba(0,0,0,.04)",border:`1px solid ${C.sand}`}}>
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
          <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:8}}>We Stand Behind Every Pour</h3>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:14,lineHeight:1.7,maxWidth:560,margin:"0 auto 20px"}}>Quality concrete should last for decades — and ours does. If anything needs attention after we're done, we come back and take care of it. That's our commitment to you.</p>
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
        <span style={{color:"rgba(255,255,255,.25)",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>Project Photo Coming Soon</span>
      </div>
    );
  }

  return (
    <div style={{position:"relative",height:230,overflow:"hidden",background:C.navyDark}}>
      <img src={images[idx].src} alt={images[idx].alt || title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity .3s ease"}} loading="lazy"/>
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
          <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
            {images.map((_,j)=>(
              <button key={j} onClick={(e)=>{e.stopPropagation();setIdx(j)}}
                style={{width:idx===j?18:7,height:7,borderRadius:4,background:idx===j?"#fff":"rgba(255,255,255,.45)",border:"none",cursor:"pointer",transition:"all .25s",padding:0}}/>
            ))}
          </div>
          <div style={{position:"absolute",top:10,right:12,background:"rgba(0,0,0,.55)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,backdropFilter:"blur(4px)"}}>{idx+1} / {images.length}</div>
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
    <section id="projects" className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="lab">Our Portfolio</div>
          <h2 className="ttl">Stamped Patios, Decorative Concrete & More</h2>
          <p className="sub" style={{margin:"0 auto"}}>See the custom stamped patios, decorative finishes, and concrete work we've completed across Hamilton County.</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginBottom:36}}>
          {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"9px 20px",borderRadius:50,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,letterSpacing:".02em",fontFamily:"'Plus Jakarta Sans',sans-serif",background:filter===c?C.navy:"#fff",color:filter===c?"#fff":C.grayDark,transition:"all .2s",boxShadow:filter===c?"0 4px 14px rgba(45,62,70,.2)":"0 1px 4px rgba(0,0,0,.06)"}}>{c}</button>)}
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
          <a href="#contact" className="btn-n">Discuss Your Project {I.arrow}</a>
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
          <h2 className="ttl">From the HCC Blog</h2>
          <p className="sub" style={{margin:"0 auto"}}>Helpful guides, project inspiration, and homeowner tips from our team.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22}}>
          {BLOG.map((b,i)=>
            <article key={b.title} className={vis?`fu d${i+1}`:""} onClick={()=>setOpenPost(b)} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,background:"#fff",transition:"all .3s",cursor:"pointer"}}
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
            <button onClick={()=>setOpenPost(null)} style={{position:"absolute",top:18,right:18,width:36,height:36,borderRadius:"50%",background:C.cream,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.sand}
              onMouseLeave={e=>e.currentTarget.style.background=C.cream}>{I.close}</button>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",color:C.green,textTransform:"uppercase",background:C.greenMuted,padding:"4px 12px",borderRadius:50}}>{openPost.cat}</span>
              <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:C.gray}}>{I.clock} {openPost.read}</span>
              <span style={{color:C.gray,fontSize:12}}>• {openPost.date}</span>
            </div>

            <h2 className="display" style={{fontSize:28,color:C.navy,lineHeight:1.25,marginBottom:8}}>{openPost.title}</h2>
            <div style={{height:4,width:60,background:C.green,borderRadius:2,marginBottom:28}}/>

            {openPost.body&&openPost.body.map((p,i)=>
              <p key={i} style={{color:C.grayDark,fontSize:15,lineHeight:1.85,marginBottom:18}}>{p}</p>
            )}

            <div style={{marginTop:32,padding:"24px 28px",background:C.cream,borderRadius:12,textAlign:"center"}}>
              <p className="display" style={{color:C.navy,fontSize:17,marginBottom:12}}>Ready to start your project?</p>
              <a href="#estimate" className="btn-g" onClick={()=>setOpenPost(null)}>Get a Free Estimate {I.arrow}</a>
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
  /* TODO: Replace with Elfsight widget once you have a widget ID */
  /* useEffect(()=>{
    if(!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')){
      const s=document.createElement("script");
      s.src="https://elfsightcdn.com/platform.js";
      s.async=true;
      document.body.appendChild(s);
    }
  },[]); */
  return(
    <section className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Trusted by Homeowners</div>
          <h2 className="ttl">What Our Clients Say</h2>
          <p className="sub" style={{margin:"0 auto"}}>Real reviews from real homeowners across Hamilton County.</p>
        </div>
        {/* Placeholder testimonials — replace with Elfsight widget */}
        {/* <div className="elfsight-app-YOUR_WIDGET_ID" data-elfsight-app-lazy></div> */}
        <div className={vis?"fu d1":""} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:22}}>
          {TESTIMONIALS.map((t,i)=>
            <div key={i} style={{padding:"32px 28px",borderRadius:14,background:"#fff",border:`1px solid ${C.sand}`}}>
              <div style={{display:"flex",gap:2,marginBottom:14}}>{Array.from({length:t.rating}).map((_,j)=><span key={j}>{I.star}</span>)}</div>
              <p style={{color:C.grayDark,fontSize:14,lineHeight:1.75,fontStyle:"italic",marginBottom:18}}>"{t.text}"</p>
              <div><div style={{fontWeight:700,fontSize:14,color:C.navy}}>{t.name}</div><div style={{fontSize:12,color:C.gray}}>{t.loc}</div></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Service Areas ────────────────────────────────── */
function ServiceAreas(){
  const[ref,vis]=useVis();
  const cities=[
    {name:"Carmel",slug:"concrete-services-carmel-in",desc:"West Clay, Arts District, City Center & more",projects:"Driveways, patios & walkways"},
    {name:"Fishers",slug:"concrete-services-fishers-in",desc:"Geist, Saxony, Britton Falls & more",projects:"Full concrete services"},
    {name:"Noblesville",slug:"concrete-services-noblesville-in",desc:"Downtown, Morse Reservoir, Millstone & more",projects:"Residential & commercial"},
    {name:"Westfield",slug:"concrete-services-westfield-in",desc:"Grand Park, Chatham Hills, Bridgewater & more",projects:"New construction & replacement"},
    {name:"Zionsville",slug:"concrete-services-zionsville-in",desc:"Village, Holliday Farms, Traders Point & more",projects:"Premium concrete finishes"},
  ];
  return(
    <section id="areas" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Where We Work</div>
          <h2 className="ttl">Serving Hamilton County & Beyond</h2>
          <p className="sub" style={{margin:"0 auto"}}>Stamped concrete patios, decorative outdoor living spaces, driveways, and more across central Indiana's top communities.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {cities.map((c,i)=>
            <a key={c.name} href={`/${c.slug}`} className={vis?`fu d${i+1}`:""} style={{padding:"28px 22px",borderRadius:14,background:C.cream,border:`1px solid ${C.sand}`,textDecoration:"none",transition:"all .3s",display:"block"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,.06)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,color:C.green}}>
                {I.pin}
                <h3 className="display" style={{color:C.navy,fontSize:18}}>{c.name}, IN</h3>
              </div>
              <p style={{color:C.gray,fontSize:12,lineHeight:1.6,marginBottom:12}}>{c.desc}</p>
              <span style={{color:C.green,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>View {c.name} Services {I.arrow}</span>
            </a>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <p style={{color:C.gray,fontSize:13}}>Also serving Brownsburg, Pendleton, McCordsville, Fortville, and surrounding communities.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── About ────────────────────────────────────────── */
function About(){
  const[ref,vis]=useVis();
  return(
    <section id="about" className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:56,alignItems:"center"}}>
          <div className={vis?"fu d1":""}>
            <div className="lab">Who We Are</div>
            <h2 className="ttl">Stamped Concrete &<br/>Patio Specialists</h2>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:22}}>
              Hamilton County Concrete and Patios is a locally owned company serving Carmel, Fishers, Noblesville, Westfield, Zionsville, and surrounding communities. We specialize in stamped and decorative concrete — patios, outdoor living spaces, driveways, and walkways that stand out.
            </p>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:28}}>
              While we handle all types of concrete work, our passion is creating outdoor spaces people love. Custom stamp patterns, integral colors, decorative borders, and expert finishing — that's where we really shine. No shortcuts, no pressure, no surprises — just beautiful concrete and honest service.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {["Licensed, Bonded & Insured","Proper Base Prep Every Time","Transparent, Honest Pricing","Reinforced Concrete Standard","Clean Job Sites Always","Free On-Site Estimates"].map(item=>
                <div key={item} style={{display:"flex",alignItems:"center",gap:8}}>{I.check}<span style={{fontSize:13,fontWeight:600,color:C.grayDark}}>{item}</span></div>
              )}
            </div>
          </div>
          <div className={vis?"sl d2":""} style={{height:440,borderRadius:16,overflow:"hidden",position:"relative",background:`linear-gradient(135deg,${C.navyDark},${C.navyLight})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* Replace with team photo: <img src="/images/team-photo.jpg" alt="Hamilton County Concrete and Patios team" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/> */}
            <img src="/images/logo-horizontal-light.png" alt="Hamilton County Concrete and Patios" style={{width:"70%",objectFit:"contain",opacity:.85}} loading="lazy"/>
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
    <section id="faq" className="sec" style={{background:"#fff"}} ref={ref}>
      <div className="sec-in" style={{maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Common Questions</div>
          <h2 className="ttl">Frequently Asked Questions</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {FAQS.map((f,i)=>
            <div key={i} className={vis?`fu d${Math.min(i+1,5)}`:""} style={{background:C.cream,borderRadius:12,overflow:"hidden",border:`1px solid ${open===i?C.green:C.sand}`,transition:"border-color .3s"}}>
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
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");link.rel="stylesheet";link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";link.media="screen";document.head.appendChild(link);
    }
    if(!document.querySelector('script[src*="work_request_embed_snippet"]')){
      const s=document.createElement("script");s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
      s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
      s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
      document.body.appendChild(s);
    }
  },[]);
  return(
    <section id="contact" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`,position:"relative",overflow:"hidden"}} ref={ref}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:70,background:"#fff",clipPath:"polygon(0 0,100% 0,100% 100%)"}}/>
      <div style={{position:"absolute",top:-80,right:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,232,220,.12) 0%,transparent 70%)"}}/>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:56}}>
          <div className={vis?"fu d1":""}>
            <div className="lab">Get Started</div>
            <h2 className="ttl ttl-w">Let's Talk About<br/>Your Project</h2>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:36,maxWidth:420}}>
              Whether it's a custom stamped patio, a decorative driveway, or a full outdoor living space — we're here to help. Reach out for a free estimate. No obligation, no pressure, just an honest conversation about what's possible.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:22}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{color:C.green,flexShrink:0,marginTop:2}}>{I.phone}</div>
                <div><a href="tel:+13172795643" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>(317) 279-5643</a><div style={{color:"rgba(255,255,255,.35)",fontSize:12}}>Mon–Fri 7am–6pm, Sat 8am–2pm</div></div>
              </div>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{color:C.green,flexShrink:0,marginTop:2}}>{I.mail}</div>
                <div><a href="mailto:eric@hamiltoncountyconcrete.com" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>eric@hamiltoncountyconcrete.com</a><div style={{color:"rgba(255,255,255,.35)",fontSize:12}}>We respond within 24 hours</div></div>
              </div>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{color:C.green,flexShrink:0,marginTop:2}}>{I.pin}</div>
                <div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>Hamilton County, Indiana</div><div style={{color:"rgba(255,255,255,.35)",fontSize:12}}>Carmel • Fishers • Westfield • Noblesville • Zionsville</div></div>
              </div>
            </div>
            {/* Social media links — uncomment and add real URLs when profiles are created
            <div style={{display:"flex",gap:14,marginTop:32}}>
              {[{icon:I.fb,label:"Facebook",href:"https://facebook.com/YOUR_PAGE"},{icon:I.ig,label:"Instagram",href:"https://instagram.com/YOUR_HANDLE"},{icon:I.gg,label:"Google",href:"https://g.page/YOUR_PAGE/review"}].map(s=>
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{width:42,height:42,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.45)",transition:"all .25s",textDecoration:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(160,145,127,.15)";e.currentTarget.style.color=C.green}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.45)"}}>{s.icon}</a>
              )}
            </div>
            */}
          </div>
          <div className={vis?"sl d2":""} style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* Quick contact options */}
            <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"28px 24px",textAlign:"center"}}>
              <h3 className="display" style={{color:"#fff",fontSize:18,marginBottom:6}}>Quick Contact</h3>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:20}}>Skip the form — reach us directly.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="tel:+13172795643" className="btn-g" style={{flex:"1 1 140px",justifyContent:"center",padding:"14px 20px",fontSize:14}}>
                  {I.phone} Call Us
                </a>
                <a href="sms:+13172795643" className="btn-o" style={{flex:"1 1 140px",justifyContent:"center",padding:"14px 20px",fontSize:14,borderColor:"rgba(160,145,127,.5)",color:C.green}}>
                  {I.mail} Text Us
                </a>
              </div>
              <p style={{color:"rgba(255,255,255,.25)",fontSize:10,lineHeight:1.6,marginTop:14,textAlign:"center"}}>
                By texting us, you agree to receive project reminders and updates from Hamilton County Concrete and Patios. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out at any time. View our <a href="#privacy" style={{color:"rgba(255,255,255,.4)",textDecoration:"underline"}}>Privacy Policy</a> and <a href="#terms" style={{color:"rgba(255,255,255,.4)",textDecoration:"underline"}}>Terms & Conditions</a>.
              </p>
            </div>
            {/* Jobber form placeholder */}
            <div id="estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Request a Free Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
              <p style={{color:C.gray,fontSize:10,lineHeight:1.6,marginTop:14,textAlign:"center"}}>
                By submitting this form, you agree to receive project-related text messages from Hamilton County Concrete and Patios. Message frequency varies. Msg & data rates may apply. Reply <strong>STOP</strong> to opt out. Reply <strong>HELP</strong> for help. Consent is not a condition of service. View our <a href="#privacy" style={{color:C.green,textDecoration:"underline",fontSize:10}}>Privacy Policy</a> and <a href="#terms" style={{color:C.green,textDecoration:"underline",fontSize:10}}>Terms & Conditions</a>.
              </p>
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
              <img src="/images/indiana-icon.png" alt="" style={{height:36,objectFit:"contain",filter:"brightness(3)"}} />
              <div style={{lineHeight:1.15}}>
                <div className="display" style={{color:"#fff",fontSize:13,fontWeight:800,letterSpacing:".02em"}}>HAMILTON COUNTY</div>
                <div className="display" style={{color:"#fff",fontSize:13,fontWeight:800,letterSpacing:".02em",opacity:.5}}>CONCRETE AND PATIOS</div>
              </div>
            </div>
            <p style={{color:"rgba(255,255,255,.3)",fontSize:12,lineHeight:1.7,maxWidth:260}}>Stamped concrete patios, decorative outdoor living spaces, driveways & more. Licensed, bonded, and insured in Hamilton County, Indiana.</p>
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Services</h4>
            {SVC.map(s=><a key={s.title} href={s.href} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{s.title}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Company</h4>
            {[["About Us","#about"],["Our Process","#process"],["Projects","#projects"],["Blog","#blog"],["Contact","#contact"],["Request Estimate","#estimate"]].map(([label,href])=><a key={label} href={href} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{label}</a>)}
          </div>
          <div>
            <h4 style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:16,letterSpacing:".03em"}}>Service Areas</h4>
            {[{name:"Carmel",slug:"concrete-services-carmel-in"},{name:"Fishers",slug:"concrete-services-fishers-in"},{name:"Noblesville",slug:"concrete-services-noblesville-in"},{name:"Westfield",slug:"concrete-services-westfield-in"},{name:"Zionsville",slug:"concrete-services-zionsville-in"}].map(a=><a key={a.name} href={`/${a.slug}`} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,textDecoration:"none",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.green} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>{a.name}, IN</a>)}
            {["Brownsburg","Pendleton","McCordsville","Fortville"].map(a=><span key={a} style={{display:"block",color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:9}}>{a}, IN</span>)}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <p style={{color:"rgba(255,255,255,.2)",fontSize:11}}>© 2026 Hamilton County Concrete and Patios. All rights reserved.</p>
          <div style={{display:"flex",gap:18}}>{[{l:"Privacy Policy",h:"#privacy"},{l:"Terms & Conditions",h:"#terms"}].map(item=><a key={item.l} href={item.h} style={{color:"rgba(255,255,255,.2)",fontSize:11,textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.2)"}>{item.l}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Legal Page Modal ──────────────────────────────── */
function LegalModal({page,onClose}){
  if(!page)return null;

  const privacy = [
    {t:"Introduction",c:"Hamilton County Concrete and Patios (\"HCC,\" \"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at hamiltoncountyconcrete.com or communicate with us via phone, text, email, or our online forms."},
    {t:"Information We Collect",c:"We may collect personal information you voluntarily provide, including: your name, phone number, email address, home address, and project details when you request a free estimate or contact us. We also automatically collect certain information when you visit our site, including IP address, browser type, pages visited, and time spent on pages through analytics tools."},
    {t:"How We Use Your Information",c:"We use the information we collect to: respond to your estimate requests and inquiries, communicate with you about your project, send project reminders and updates via text message (if you opt in), improve our website and services, and comply with legal obligations."},
    {t:"Text Messaging",c:"By texting Hamilton County Concrete and Patios at (317) 279-5643, you consent to receive project reminders and updates. Message frequency varies based on your project status. Message and data rates may apply. You may opt out at any time by replying STOP to any message. Reply HELP for assistance. Text messaging is not required to use our services."},
    {t:"Information Sharing",c:"We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect our rights."},
    {t:"Cookies and Analytics",c:"Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. We use Google Analytics and similar tools to understand how visitors interact with our site. You can control cookies through your browser settings."},
    {t:"Third-Party Services",c:"Our website may contain embedded content from third parties including Google Reviews widgets, YouTube videos, and contact forms. These services may collect information about you according to their own privacy policies, which we encourage you to review."},
    {t:"Data Security",c:"We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."},
    {t:"Your Rights",c:"You may request access to, correction of, or deletion of your personal information by contacting us at eric@hamiltoncountyconcrete.com or (317) 279-5643. We will respond to your request within a reasonable timeframe."},
    {t:"Children's Privacy",c:"Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children."},
    {t:"Changes to This Policy",c:"We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after changes are posted constitutes your acceptance of the updated policy."},
    {t:"Contact Us",c:"If you have questions about this Privacy Policy, contact us at: Hamilton County Concrete and Patios, Hamilton County, Indiana, Phone: (317) 279-5643, Email: eric@hamiltoncountyconcrete.com"},
  ];

  const terms = [
    {t:"Acceptance of Terms",c:"By accessing and using the website at hamiltoncountyconcrete.com (the \"Site\"), operated by Hamilton County Concrete and Patios (\"HCC,\" \"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our Site."},
    {t:"Services Description",c:"Hamilton County Concrete and Patios provides concrete installation and replacement services in Hamilton County, Indiana and surrounding areas, including but not limited to driveways, patios, sidewalks, walkways, garage floors, stamped concrete, and decorative concrete. All services are subject to a separate written contract between HCC and the client."},
    {t:"Free Estimates",c:"Estimates provided through our website, phone, or in-person consultations are non-binding and provided for informational purposes. Final project pricing is determined by a written contract that outlines the full scope of work, materials, timeline, and payment terms. Estimates are valid for 30 days unless otherwise stated."},
    {t:"Text Messaging Terms",c:"By initiating a text message to Hamilton County Concrete and Patios at (317) 279-5643, you consent to receive text messages related to your project inquiry, including reminders and updates. Message frequency varies depending on project status and communication needs. Standard message and data rates may apply depending on your mobile carrier plan. You may opt out at any time by replying STOP. Reply HELP for assistance. Text messaging consent is not a condition of purchasing any service from HCC."},
    {t:"Intellectual Property",c:"All content on this Site, including text, images, graphics, logos, videos, and design elements, is the property of Hamilton County Concrete and Patios unless otherwise noted. Project photographs depict actual work completed by HCC. You may not reproduce, distribute, or use any content from this Site without our written permission."},
    {t:"User-Submitted Information",c:"By submitting information through our contact forms, estimate requests, or text messages, you represent that the information provided is accurate and that you are authorized to share it. You grant HCC permission to use this information to respond to your inquiry and provide services."},
    {t:"Third-Party Links and Services",c:"Our Site may contain links to or embedded content from third-party websites and services. We are not responsible for the content, privacy practices, or terms of these third-party services. We encourage you to review their respective policies."},
    {t:"Limitation of Liability",c:"Hamilton County Concrete and Patios and its owners, employees, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this Site or reliance on any information provided herein. Our total liability for any claim related to the Site shall not exceed the amount you have paid to HCC in the preceding 12 months."},
    {t:"Indemnification",c:"You agree to indemnify and hold harmless Hamilton County Concrete and Patios, its owners, employees, and agents from any claims, damages, losses, or expenses arising from your use of this Site or violation of these Terms."},
    {t:"Governing Law",c:"These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of Indiana. Any disputes arising from these terms shall be resolved in the courts of Hamilton County, Indiana."},
    {t:"Changes to Terms",c:"We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Site after changes are posted constitutes acceptance of the updated terms."},
    {t:"Contact Us",c:"For questions about these Terms & Conditions, contact: Hamilton County Concrete and Patios, Hamilton County, Indiana, Phone: (317) 279-5643, Email: eric@hamiltoncountyconcrete.com"},
  ];

  const content = page==="privacy" ? {title:"Privacy Policy",date:"March 21, 2026",sections:privacy} : {title:"Terms & Conditions",date:"March 21, 2026",sections:terms};

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"60px 20px",overflowY:"auto"}}
      onClick={onClose}>
      <div style={{background:"#fff",borderRadius:18,maxWidth:720,width:"100%",padding:"48px 40px",position:"relative",animation:"fu .4s ease-out"}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:18,right:18,width:36,height:36,borderRadius:"50%",background:C.cream,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.close}</button>
        <h2 className="display" style={{fontSize:28,color:C.navy,marginBottom:6}}>{content.title}</h2>
        <p style={{color:C.gray,fontSize:13,marginBottom:6}}>Effective Date: {content.date}</p>
        <p style={{color:C.gray,fontSize:13,marginBottom:28}}>Hamilton County Concrete and Patios — Hamilton County, Indiana</p>
        <div style={{height:4,width:60,background:C.green,borderRadius:2,marginBottom:28}}/>
        {content.sections.map((s,i)=>
          <div key={i} style={{marginBottom:22}}>
            <h3 style={{color:C.navy,fontSize:16,fontWeight:700,marginBottom:8}}>{s.t}</h3>
            <p style={{color:C.grayDark,fontSize:14,lineHeight:1.8}}>{s.c}</p>
          </div>
        )}
        <div style={{marginTop:32,padding:"20px 24px",background:C.cream,borderRadius:12}}>
          <p style={{color:C.gray,fontSize:13,lineHeight:1.7}}>Questions? Contact us at <strong style={{color:C.navy}}>eric@hamiltoncountyconcrete.com</strong> or call <strong style={{color:C.navy}}>(317) 279-5643</strong>.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── City Pages ────────────────────────────────────── */
const CITIES = {
  "concrete-services-carmel-in": {
    city: "Carmel", state: "IN", lat: 39.9784, lng: -86.1180,
    title: "Concrete Services in Carmel, IN",
    metaDesc: "Stamped concrete patios & decorative concrete specialist in Carmel, Indiana. Driveways, patios, sidewalks, stamped concrete & more. Licensed & insured. Free estimates. (317) 279-5643",
    heroHeading: "Stamped Concrete & Custom Patios in Carmel, Indiana",
    heroSub: "From the Arts & Design District to the Village of WestClay, Carmel homeowners trust Hamilton County Concrete and Patios for driveways, patios, and decorative concrete that lasts.",
    neighborhoods: ["Village of WestClay", "Arts & Design District", "Carmel City Center", "Home Place", "West Carmel", "Springmill", "Clay Township"],
    intro: "Carmel has been named one of the best places to live in America, and the homes here reflect that reputation. Whether you're replacing a cracked driveway in WestClay, adding a stamped patio in West Carmel, or pouring a new walkway near City Center, Hamilton County Concrete and Patios delivers the quality craftsmanship that Carmel homeowners expect.",
    whyUs: "We've completed numerous concrete projects across Carmel — from standard driveways to decorative stamped patios with custom colors and patterns. Every project starts with proper excavation, aggregate base, and mechanical compaction. We use reinforced concrete with fiber mesh on every pour, and we grade for proper drainage away from your home. The result is concrete that stays level, crack-free, and beautiful for decades.",
    services: ["Stamped & Decorative Concrete","Patios & Outdoor Living","Pavilions, Pergolas & Enclosed Patios","Concrete Driveways","Sidewalks & Walkways","Garage Floors & Slabs","Concrete Removal & Replacement"],
    faq: [
      {q:"Do I need a permit for a concrete driveway in Carmel?",a:"In most cases, yes. The City of Carmel requires permits for driveway installations and replacements. We handle the entire permitting process for you and ensure all work meets local code requirements."},
      {q:"How much does a concrete driveway cost in Carmel?",a:"A standard broom-finish driveway in Carmel typically runs $8–12 per square foot. Stamped or decorative driveways range from $14–20 per square foot. We provide free on-site estimates with exact pricing for your specific project."},
      {q:"How long does a patio pour take in Carmel?",a:"Most residential patios can be excavated, formed, and poured in 1–3 days. Total project time including curing is about 1–2 weeks. We provide a detailed timeline before work begins."},
    ],
  },
  "concrete-services-fishers-in": {
    city: "Fishers", state: "IN", lat: 39.9568, lng: -86.0131,
    title: "Concrete Services in Fishers, IN",
    metaDesc: "Stamped concrete patios & outdoor living specialist in Fishers, Indiana. Driveways, patios, sidewalks, stamped & decorative concrete. Free estimates. (317) 279-5643",
    heroHeading: "Stamped Patios & Decorative Concrete in Fishers, Indiana",
    heroSub: "From Geist to Saxony, Fishers homeowners count on Hamilton County Concrete and Patios for driveways, patios, and walkways built to last.",
    neighborhoods: ["Geist", "Saxony", "Britton Falls", "Fishers District", "Olio Road corridor", "Brooks School area", "Southeastern Fishers"],
    intro: "Fishers is one of the fastest-growing communities in Indiana, and homeowners here expect quality that matches the standard of their neighborhoods. Whether you're in a newer Saxony build that needs a patio addition or an established Geist home ready for a full driveway replacement, Hamilton County Concrete and Patios brings the same level of precision and care to every project.",
    whyUs: "As a locally owned company based in Hamilton County, we know Fishers properties inside and out. Our standard process includes full excavation, compactable aggregate base, mechanical compaction, reinforced concrete, and proper drainage grading. We don't cut corners — and the results speak for themselves in neighborhoods across Fishers.",
    services: ["Stamped & Decorative Concrete","Patios & Outdoor Living","Pavilions, Pergolas & Enclosed Patios","Concrete Driveways","Sidewalks & Walkways","Garage Floors & Slabs","Concrete Removal & Replacement"],
    faq: [
      {q:"Do I need a permit for concrete work in Fishers?",a:"It depends on the scope. Driveway replacements and new patio pours typically require a permit through the City of Fishers. We handle the entire permitting process for you."},
      {q:"How long does a driveway replacement take in Fishers?",a:"A typical driveway replacement in Fishers takes 2–4 days for demolition and new pour. Add 7 days for curing before vehicle traffic. We provide a full timeline upfront."},
      {q:"What concrete finish options do you offer?",a:"We offer broom finish, stamped patterns, exposed aggregate, colored concrete, and decorative borders. We bring samples to your consultation so you can see the options in person."},
    ],
  },
  "concrete-services-noblesville-in": {
    city: "Noblesville", state: "IN", lat: 40.0456, lng: -86.0086,
    title: "Concrete Services in Noblesville, IN",
    metaDesc: "Stamped patios, decorative concrete & outdoor living in Noblesville, Indiana. Driveways, patios, sidewalks, stamped concrete. Licensed & insured. Free estimates. (317) 279-5643",
    heroHeading: "Custom Patios & Stamped Concrete in Noblesville, Indiana",
    heroSub: "From the Historic Square to Morse Reservoir, Noblesville homeowners count on Hamilton County Concrete and Patios for quality pours that last.",
    neighborhoods: ["Downtown Noblesville", "Morse Reservoir area", "Hinkle Creek", "Millstone", "Federal Hill", "Oakmont", "Prairie Lakes"],
    intro: "Noblesville blends small-town charm with modern growth, and the properties here range from historic downtown homes to newer developments around Morse Reservoir. Whether your home needs a driveway replacement, a new backyard patio, or a connecting walkway, Hamilton County Concrete and Patios understands Noblesville properties and delivers concrete built to handle Indiana weather for decades.",
    whyUs: "Our Noblesville projects showcase the quality that comes from doing things right — proper excavation, aggregate base, reinforced concrete, and expert finishing. We grade every surface for positive drainage and use control joints to manage natural concrete movement. The result is a pour that looks great and performs for 25–30 years.",
    services: ["Stamped & Decorative Concrete","Patios & Outdoor Living","Pavilions, Pergolas & Enclosed Patios","Concrete Driveways","Sidewalks & Walkways","Garage Floors & Slabs","Concrete Removal & Replacement"],
    faq: [
      {q:"Does Noblesville require permits for concrete work?",a:"Yes, the City of Noblesville requires permits for most concrete work including driveway installations and replacements. Our team handles the permit application and all required inspections."},
      {q:"How much does a concrete patio cost in Noblesville?",a:"A standard patio in Noblesville runs $8–12 per square foot. Stamped or decorative patios range from $14–20 per square foot. We provide free estimates with exact pricing."},
      {q:"Do you serve areas around Morse Reservoir?",a:"Absolutely. We serve all of Noblesville including the Morse Reservoir area, downtown, Millstone, Federal Hill, and all surrounding neighborhoods."},
    ],
  },
  "concrete-services-westfield-in": {
    city: "Westfield", state: "IN", lat: 40.0428, lng: -86.1275,
    title: "Concrete Services in Westfield, IN",
    metaDesc: "Stamped concrete & patio specialist in Westfield, Indiana. Driveways, patios, sidewalks, decorative concrete. Licensed, insured. Free estimates. (317) 279-5643",
    heroHeading: "Stamped Patios & Outdoor Living in Westfield, Indiana",
    heroSub: "Grand Park families trust Hamilton County Concrete and Patios for driveways, patios, and walkways built with quality materials and honest pricing.",
    neighborhoods: ["Grand Park area", "Maple Knoll", "Chatham Hills", "Bridgewater", "Westfield Village", "Osborne Trails", "Wheeler Landing"],
    intro: "Westfield is booming — and with all that growth comes homeowners looking to enhance their properties. Whether you bought a new build near Grand Park that needs a patio, or you're replacing a worn driveway in Chatham Hills, Hamilton County Concrete and Patios brings the same quality process and transparent pricing to every Westfield project.",
    whyUs: "Our Westfield projects demonstrate how we deliver excellent results at fair prices. Every pour starts with proper base preparation, uses reinforced concrete, and is finished to the highest standards. We handle everything from excavation through final cleanup — and we stand behind every project.",
    services: ["Stamped & Decorative Concrete","Patios & Outdoor Living","Pavilions, Pergolas & Enclosed Patios","Concrete Driveways","Sidewalks & Walkways","Garage Floors & Slabs","Concrete Removal & Replacement"],
    faq: [
      {q:"Do new Westfield homes need concrete work?",a:"Many newer Westfield homes have basic builder-grade concrete that homeowners want to upgrade — adding patios, extending driveways, or replacing thin walkways with properly reinforced concrete."},
      {q:"What does a driveway cost in Westfield?",a:"Driveway costs in Westfield depend on size and finish. Standard broom finish runs $8–12/sq ft, stamped runs $14–20/sq ft. We provide free on-site estimates with exact pricing."},
      {q:"How do I get started on a project in Westfield?",a:"Call us at (317) 279-5643 or fill out our online estimate form. We'll schedule a free on-site consultation to discuss your project and provide a detailed written estimate."},
    ],
  },
  "concrete-services-zionsville-in": {
    city: "Zionsville", state: "IN", lat: 39.9509, lng: -86.2617,
    title: "Concrete Services in Zionsville, IN",
    metaDesc: "Stamped patios, decorative concrete & outdoor living in Zionsville, Indiana. Driveways, patios, sidewalks, stamped & decorative concrete. Licensed & insured. Free estimates. (317) 279-5643",
    heroHeading: "Stamped Patios & Decorative Concrete in Zionsville, Indiana",
    heroSub: "From the brick streets of downtown to the estates of Eagle Creek, Zionsville homeowners choose Hamilton County Concrete and Patios for quality that matches the character of their homes.",
    neighborhoods: ["Downtown Zionsville", "Eagle Creek area", "Traders Point", "Holliday Farms", "Willow Glen", "Brookside Park", "Rural Zionsville"],
    intro: "Zionsville is known for its charm, character, and quality of life — and the homes here reflect all of that. Whether you're adding a stamped patio to a historic downtown property or replacing the driveway on a Holliday Farms estate, Hamilton County Concrete and Patios approaches every Zionsville project with the attention to detail these homes deserve.",
    whyUs: "Zionsville homeowners appreciate quality — and that's exactly what we deliver. From proper base preparation and reinforced concrete to expert finishing and clean job sites, every detail matters. Our decorative concrete options allow you to match the aesthetic of your home, whether that's a classic broom finish or an elegant stamped stone pattern.",
    services: ["Stamped & Decorative Concrete","Patios & Outdoor Living","Pavilions, Pergolas & Enclosed Patios","Concrete Driveways","Sidewalks & Walkways","Garage Floors & Slabs","Concrete Removal & Replacement"],
    faq: [
      {q:"Does Zionsville have specific requirements for concrete work?",a:"Yes. The Town of Zionsville has its own building department and requires permits for most concrete work. We manage the entire permitting and inspection process."},
      {q:"Can you match existing concrete or hardscape?",a:"We can get very close with color matching using integral color and stain options. We'll bring samples to your consultation so you can compare options against your existing surfaces."},
      {q:"How much does stamped concrete cost in Zionsville?",a:"Stamped concrete in Zionsville typically ranges from $14–20 per square foot depending on pattern complexity and color options. We provide a free consultation and detailed written estimate."},
    ],
  },
};

/* ─── Service-City Combo Pages (35 unique pages) ─── */
const SVC_SLUG_MAP = {
  "stamped-concrete": "stamped-decorative-concrete",
  "concrete-patios": "concrete-patios-outdoor-living",
  "pavilions-pergolas": "pavilions-pergolas-enclosed-patios",
  "concrete-driveways": "concrete-driveways",
  "concrete-sidewalks": "concrete-sidewalks-walkways",
  "garage-floors": "garage-floors-concrete-slabs",
  "concrete-removal": "concrete-removal-replacement",
};
const CITY_SLUG_MAP = {
  "carmel-in": "concrete-services-carmel-in",
  "fishers-in": "concrete-services-fishers-in",
  "noblesville-in": "concrete-services-noblesville-in",
  "westfield-in": "concrete-services-westfield-in",
  "zionsville-in": "concrete-services-zionsville-in",
};

/* Unique intros per service-city combo — what makes each page distinct */
const SVC_CITY_INTROS = {
  "stamped-concrete-carmel-in": "Carmel homeowners in WestClay, Springmill, and the Arts & Design District know that a stamped concrete patio or walkway sets their property apart. Our stamped and decorative concrete work across Carmel delivers the natural stone, slate, and cobblestone aesthetics that complement Carmel's upscale architecture — with the durability to handle Indiana's freeze-thaw cycles for decades.",
  "stamped-concrete-fishers-in": "From Geist waterfront properties to new builds in Saxony, Fishers homeowners choose stamped concrete for outdoor spaces that look like natural stone without the maintenance. Our stamped patios, walkways, and pool decks across Fishers feature custom patterns and colors selected to complement each home's unique style.",
  "stamped-concrete-noblesville-in": "Noblesville properties from the Historic Square to Morse Reservoir deserve concrete that's as beautiful as it is durable. Our stamped concrete work in Noblesville transforms ordinary pours into stunning stone-look surfaces with custom patterns, integral colors, and expert finishing that lasts decades.",
  "stamped-concrete-westfield-in": "Westfield's newer communities around Grand Park and Chatham Hills are the perfect canvas for decorative stamped concrete. We help Westfield homeowners upgrade builder-grade patios into custom stamped surfaces with natural stone patterns, rich colors, and hand-tooled details that elevate the entire backyard.",
  "stamped-concrete-zionsville-in": "Zionsville's charming brick-street downtown and estate homes in Holliday Farms and Eagle Creek call for decorative concrete that matches the character of the neighborhood. Our stamped concrete work in Zionsville delivers elegance — ashlar slate, flagstone, and cobblestone patterns with custom colors chosen to complement your home's architecture.",
  "concrete-patios-carmel-in": "Carmel backyards deserve outdoor living spaces built for entertaining, relaxing, and enjoying Indiana's best seasons. Whether you're in WestClay, West Carmel, or near City Center, our custom concrete patios are designed around how you actually live outdoors — with options from simple broom-finish entertaining pads to multi-level stamped patios with fire pit pads and seating walls.",
  "concrete-patios-fishers-in": "Fishers families in Geist, Britton Falls, and the Fishers District are turning their backyards into outdoor living destinations with custom concrete patios. We design patio layouts that maximize usable space, ensure proper drainage away from your foundation, and create natural transitions between entertaining zones.",
  "concrete-patios-noblesville-in": "Noblesville homeowners near Morse Reservoir, Federal Hill, and Millstone are expanding their outdoor living space with custom concrete patios designed for Indiana's climate. From stamped stone-look surfaces to clean broom-finish entertaining pads, we build patios that become the center of your outdoor life.",
  "concrete-patios-westfield-in": "With Westfield growing as fast as it is, homeowners in Grand Park, Maple Knoll, and Bridgewater are investing in backyard spaces that match the energy of the community. Our custom concrete patios in Westfield give you a durable, low-maintenance outdoor living area built on a properly prepared foundation.",
  "concrete-patios-zionsville-in": "Zionsville properties in Traders Point, Holliday Farms, and downtown deserve patio spaces as refined as the homes themselves. Our custom patios in Zionsville feature premium finishes — stamped stone patterns, exposed aggregate borders, and decorative color work that blend seamlessly with the character of your property.",
  "pavilions-pergolas-carmel-in": "Carmel homeowners in WestClay, Springmill, and West Carmel are extending their outdoor season with custom pavilions and pergolas built on reinforced concrete foundations. From open-air pergolas that add shade and ambiance to fully enclosed 4-season rooms, we build complete outdoor structures that become the centerpiece of your property.",
  "pavilions-pergolas-fishers-in": "Fishers families in Geist, Saxony, and Britton Falls are investing in covered outdoor structures that let them enjoy the backyard rain or shine. Our pavilion and pergola projects in Fishers include everything from the concrete foundation to the finished structure — stone columns, cedar ceilings, lighting, and optional fireplace integration.",
  "pavilions-pergolas-noblesville-in": "Noblesville properties near Morse Reservoir and throughout the city are perfect settings for custom pavilions and pergolas. Imagine entertaining under a covered cedar pavilion with a stamped concrete pad, fire pit, and landscape lighting — we build that entire vision from the ground up for Noblesville homeowners.",
  "pavilions-pergolas-westfield-in": "Westfield's growing neighborhoods around Grand Park and Chatham Hills feature spacious lots that are perfect for pavilion and pergola additions. We design and build covered outdoor structures on properly engineered concrete foundations, giving Westfield families a year-round outdoor living space.",
  "pavilions-pergolas-zionsville-in": "Zionsville's estate-style properties in Eagle Creek, Holliday Farms, and rural Zionsville provide the space and setting for stunning custom pavilions and pergolas. Our outdoor structure projects in Zionsville pair natural stone columns and cedar accents with expertly poured stamped concrete foundations.",
  "concrete-driveways-carmel-in": "Carmel driveways in WestClay, Springmill, and West Carmel take a beating from daily traffic, salt, and Indiana's freeze-thaw cycles. Our driveway installations and replacements in Carmel are engineered to handle it all — with 4,000+ PSI air-entrained concrete, rebar reinforcement, and proper base preparation that prevents the settling and cracking that plagues poorly built driveways.",
  "concrete-driveways-fishers-in": "Fishers driveways from Geist to Saxony need to stand up to years of daily use and harsh Indiana winters. We pour driveways in Fishers with the correct concrete mix, proper reinforcement, and a prepared aggregate base that prevents the settling and heaving common with builder-grade pours.",
  "concrete-driveways-noblesville-in": "Whether you're replacing a cracked driveway near downtown Noblesville or installing a new stamped driveway at a Morse Reservoir property, our Noblesville driveway projects start with full excavation and proper base preparation — the foundation that makes the difference between a 10-year driveway and a 30-year driveway.",
  "concrete-driveways-westfield-in": "Many newer Westfield homes near Grand Park and Maple Knoll were built with thin, unreinforced driveways that start cracking within a few years. Our driveway replacements in Westfield address the root cause — we excavate properly, install compacted aggregate base, add rebar reinforcement, and pour with a concrete mix designed for Indiana weather.",
  "concrete-driveways-zionsville-in": "Zionsville homes in Holliday Farms, Traders Point, and downtown Zionsville deserve driveways that match the quality of the property. Our driveway work in Zionsville delivers clean lines, proper drainage grading, and a finish — standard broom or decorative stamped — that enhances your home's curb appeal for decades.",
  "concrete-sidewalks-carmel-in": "Carmel sidewalks and walkways connect your spaces and set the tone for your entire property. Whether you need a front walkway replacement in WestClay, a decorative stamped path in West Carmel, or a connecting walkway from patio to garden, our Carmel walkway projects combine function with curb appeal.",
  "concrete-sidewalks-fishers-in": "Fishers homeowners in Geist, Saxony, and the Fishers District rely on us for sidewalk and walkway projects that are level, properly drained, and built to last. From front walkway replacements to decorative stamped garden paths, we pour walkways in Fishers that stay smooth and trip-free for decades.",
  "concrete-sidewalks-noblesville-in": "Noblesville properties near downtown, Morse Reservoir, and Federal Hill benefit from properly built sidewalks and walkways that handle foot traffic and weather without settling or cracking. We pour walkways in Noblesville with the same base preparation and reinforcement standards we apply to every project.",
  "concrete-sidewalks-westfield-in": "Westfield's growing neighborhoods need sidewalks and walkways built to handle the community's active lifestyle. We pour residential and commercial walkways in Westfield with proper grading, reinforcement, and finish options from standard broom to decorative stamped cobblestone patterns.",
  "concrete-sidewalks-zionsville-in": "Zionsville's charming streetscapes and estate properties deserve walkways that match the neighborhood's character. Our walkway projects in Zionsville range from clean broom-finish front walks to elegant stamped cobblestone paths with decorative borders and hand-tooled edges.",
  "garage-floors-carmel-in": "Carmel homeowners in WestClay, Springmill, and West Carmel need garage floors that perform under daily vehicle traffic, road salt, and temperature swings. Our garage floor pours in Carmel include vapor barriers, rebar reinforcement, and proper thickness specifications designed for real-world use.",
  "garage-floors-fishers-in": "Fishers garage floors take a beating — vehicles, equipment, salt, chemicals, and temperature extremes. Our garage floor pours and replacements in Fishers are built to handle it with proper thickness, vapor barriers, and reinforcement that standard builder-grade floors don't provide.",
  "garage-floors-noblesville-in": "Noblesville homeowners and shop owners need garage floors and slabs that can handle heavy use without cracking or settling. We pour garage floors in Noblesville with proper excavation, vapor barriers, rebar reinforcement, and finishes suited to the intended use.",
  "garage-floors-westfield-in": "Many newer Westfield homes have garage floors that are already showing cracks from inadequate base prep and thin pours. Our garage floor replacements in Westfield address those root issues with proper excavation, compacted base, vapor barrier, and reinforced concrete built for decades of daily use.",
  "garage-floors-zionsville-in": "Zionsville properties with oversized garages, workshops, and outbuildings need concrete floors engineered for the intended load. Our garage and shop slab pours in Zionsville include proper thickness, reinforcement, vapor barriers, and drainage grading for heavy-duty performance.",
  "concrete-removal-carmel-in": "When Carmel driveways, patios, and sidewalks have reached the end of their life — cracked, sunken, spalling, or simply worn out — a full removal and replacement is the right call. We handle the entire process for Carmel homeowners: sawcutting, demo, hauling, base correction, and a fresh reinforced pour.",
  "concrete-removal-fishers-in": "Fishers properties with failing concrete need more than a patch — they need a fresh start. Our concrete removal and replacement projects in Fishers address the root cause of failure (usually poor base prep), and rebuild with proper excavation, aggregate base, and reinforced concrete that won't repeat the same problems.",
  "concrete-removal-noblesville-in": "Cracked driveways, sunken patios, and trip-hazard sidewalks across Noblesville need full removal and replacement to be fixed properly. Our Noblesville removal projects include complete tear-out, debris hauling, soil correction, and a new reinforced pour on a properly prepared base.",
  "concrete-removal-westfield-in": "Westfield's rapid growth means many properties have concrete that was poured too quickly on poorly prepared soil — and it's starting to show. Our concrete removal and replacement in Westfield corrects those shortcuts with proper excavation, compacted aggregate base, and reinforced concrete that lasts.",
  "concrete-removal-zionsville-in": "When Zionsville driveways, walkways, or patios have deteriorated beyond repair, our removal and replacement process starts fresh — complete demo, hauling, base preparation, and a new reinforced pour that restores your property's appearance and function for decades.",
};

function resolveServiceCity(path) {
  for (const [svcSlug, svcKey] of Object.entries(SVC_SLUG_MAP)) {
    for (const [citySlug, cityKey] of Object.entries(CITY_SLUG_MAP)) {
      if (path === `${svcSlug}-${citySlug}`) {
        return { svcKey, cityKey, slug: path };
      }
    }
  }
  return null;
}

function ServiceCityPage({svcKey, cityKey, slug}){
  const svc = SERVICE_PAGES[svcKey];
  const city = CITIES[cityKey];
  const intro = SVC_CITY_INTROS[slug] || "";
  const [faqOpen, setFaqOpen] = useState(null);

  const pageTitle = `${svc.title} in ${city.city}, ${city.state}`;
  const metaTitle = `${svc.title} in ${city.city}, IN | Hamilton County Concrete and Patios`;
  const metaDesc = `Professional ${svc.title.toLowerCase()} in ${city.city}, Indiana. ${svc.options.slice(0,4).join(", ")}. Serving ${city.neighborhoods.slice(0,3).join(", ")} and all of ${city.city}. Licensed and insured. Free estimates. (317) 279-5643`;

  useEffect(()=>{
    document.title = metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute("content", metaDesc);
    window.scrollTo(0, 0);
  },[metaTitle, metaDesc]);

  useEffect(()=>{
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");link.rel="stylesheet";link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";link.media="screen";document.head.appendChild(link);
    }
    if(!document.querySelector('script[src*="work_request_embed_snippet"]')){
      const s=document.createElement("script");s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
      s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
      s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
      document.body.appendChild(s);
    }
  },[]);

  /* Merge FAQs: first 2 from service page (rewritten for city), plus city-specific */
  const faqs = [
    {q:`How much does ${svc.title.toLowerCase()} cost in ${city.city}?`, a: svc.faq.find(f=>f.q.toLowerCase().includes("cost"))?.a.replace(/Hamilton County/g, city.city) || `Costs vary by project scope and finish. Call (317) 279-5643 for a free estimate in ${city.city}.`},
    ...svc.faq.filter(f=>!f.q.toLowerCase().includes("cost")).slice(0,2).map(f=>({...f, a: f.a.replace(/Hamilton County/gi, city.city)})),
    ...city.faq.slice(0,2),
  ];

  /* Filter projects matching this service */
  const serviceProjects = svc.projects.length > 0 ? PROJECTS.filter(p=>svc.projects.some(cat=>p.cat===cat||p.cat.includes(cat))) : [];

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service","name":`${svc.title} in ${city.city}, Indiana`,"provider":{"@type":"HomeAndConstructionBusiness","name":"Hamilton County Concrete and Patios","telephone":"+1-317-279-5643","url":"https://www.hamiltoncountyconcrete.com","address":{"@type":"PostalAddress","addressLocality":city.city,"addressRegion":"IN","addressCountry":"US"}},"areaServed":{"@type":"City","name":city.city},"description":metaDesc})}}/>

      <Nav/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(155deg,${C.navyLight} 0%,#4E666F 35%,#5E7680 65%,#6E8690 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(250,248,245,.14) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.12)",borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"rgba(255,255,255,.7)"}}/>
            <span style={{color:"rgba(255,255,255,.85)",fontWeight:700,fontSize:12,letterSpacing:".06em"}}>{svc.title.toUpperCase()} • {city.city.toUpperCase()}, IN</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(30px,4.5vw,48px)",lineHeight:1.1,marginBottom:20}}>{svc.title} in {city.city}, Indiana</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.7)",fontSize:17,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px"}}>{svc.heroSub}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#sc-estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate in {city.city} {I.arrow}</a>
            <a href={`/${svcKey}`} className="btn-o">Learn About {svc.title}</a>
          </div>
        </div>
      </section>

      {/* Unique intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div className="lab" style={{textAlign:"center"}}>{svc.title} in {city.city}</div>
          <h2 className="ttl" style={{textAlign:"center"}}>{svc.title} for {city.city} Homeowners</h2>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,marginBottom:28}}>{intro}</p>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85}}>{svc.details}</p>
        </div>
      </section>

      {/* Options */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:800,textAlign:"center"}}>
          <div className="lab">{svc.optionsLabel} in {city.city}</div>
          <h2 className="ttl">{svc.title} Options</h2>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginTop:24}}>
            {svc.options.map(opt=>
              <span key={opt} style={{padding:"10px 20px",borderRadius:50,background:"#fff",color:C.navy,fontSize:14,fontWeight:600,border:`1px solid ${C.sand}`}}>{opt}</span>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      {serviceProjects.length>0&&(
        <section className="sec" style={{background:"#fff"}}>
          <div className="sec-in">
            <div style={{textAlign:"center",marginBottom:48}}>
              <div className="lab">Our Work Near {city.city}</div>
              <h2 className="ttl">{svc.title} Projects</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:22}}>
              {serviceProjects.map(p=>
                <div key={p.title} style={{borderRadius:14,overflow:"hidden",background:C.cream,boxShadow:"0 2px 10px rgba(0,0,0,.05)",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 44px rgba(0,0,0,.1)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"}}>
                  <Carousel images={p.images} color={p.color} title={p.title} />
                  <div style={{padding:"20px 24px 24px"}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:C.green,textTransform:"uppercase"}}>{p.cat}</span>
                    <h3 className="display" style={{fontSize:17,color:C.navy,marginTop:6}}>{p.title}</h3>
                    {p.desc&&<p style={{color:C.gray,fontSize:13,lineHeight:1.6,marginTop:8}}>{p.desc}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Neighborhoods */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:800,textAlign:"center"}}>
          <div className="lab">{city.city} Areas We Serve</div>
          <h2 className="ttl">{svc.title} Across {city.city}</h2>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginTop:24}}>
            {city.neighborhoods.map(n=>
              <span key={n} style={{padding:"10px 20px",borderRadius:50,background:"#fff",color:C.navy,fontSize:14,fontWeight:600,border:`1px solid ${C.sand}`}}>{n}</span>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:700}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{svc.title} in {city.city} FAQ</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {faqs.map((f,i)=>
              <div key={i} style={{background:C.cream,borderRadius:12,overflow:"hidden",border:`1px solid ${faqOpen===i?C.green:C.sand}`,transition:"border-color .3s"}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?400:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started</div>
              <h2 className="ttl ttl-w">Ready for {svc.title} in {city.city}?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate. We'll visit your {city.city} property, discuss your vision, and provide a detailed quote.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><a href="tel:+13172795643" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>(317) 279-5643</a></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><a href="mailto:eric@hamiltoncountyconcrete.com" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>eric@hamiltoncountyconcrete.com</a></div>
              </div>
              <div style={{marginTop:28,display:"flex",gap:16,flexWrap:"wrap"}}>
                <a href={`/${svcKey}`} style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none"}}>← {svc.title} overview</a>
                <a href={`/${cityKey}`} style={{color:"rgba(255,255,255,.4)",fontWeight:700,fontSize:14,textDecoration:"none"}}>All services in {city.city}</a>
                <a href="/" style={{color:"rgba(255,255,255,.4)",fontWeight:700,fontSize:14,textDecoration:"none"}}>Main site</a>
              </div>
            </div>
            <div id="sc-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free {svc.title} Estimate in {city.city}</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function CityPage({data}){
  const[faqOpen,setFaqOpen]=useState(null);

  useEffect(()=>{
    document.title=data.title+" | Hamilton County Concrete and Patios";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",data.metaDesc);
  },[data]);

  useEffect(()=>{
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");link.rel="stylesheet";link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";link.media="screen";document.head.appendChild(link);
    }
    if(!document.querySelector('script[src*="work_request_embed_snippet"]')){
      const s=document.createElement("script");s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
      s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
      s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
      document.body.appendChild(s);
    }
  },[]);

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"Hamilton County Concrete and Patios",description:data.metaDesc,url:"https://www.hamiltoncountyconcrete.com",telephone:"+1-317-279-5643",address:{"@type":"PostalAddress",addressLocality:data.city,addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:data.lat,longitude:data.lng},areaServed:{"@type":"City",name:data.city},priceRange:"$$"})}}/>

      <Nav/>

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
            {[{n:"Local",l:"Hamilton County Born & Raised"},{n:"100%",l:"Licensed & Insured"},{n:"Free",l:"On-Site Estimates"}].map(b=>
              <div key={b.l}><div className="display" style={{color:C.green,fontSize:24,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontWeight:600}}>{b.l}</div></div>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <h2 className="ttl" style={{textAlign:"center"}}>Why {data.city} Homeowners Choose Hamilton County Concrete and Patios</h2>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,marginBottom:28,textAlign:"center"}}>{data.intro}</p>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,textAlign:"center"}}>{data.whyUs}</p>
        </div>
      </section>

      {/* Services in this city */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in">
          <div style={{textAlign:"center",marginBottom:48}}>
            <div className="lab">Our Services in {data.city}</div>
            <h2 className="ttl">What We Do in {data.city}, Indiana</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
            {data.services.map(s=>
              <div key={s} style={{padding:"24px 22px",borderRadius:12,background:"#fff",border:`1px solid ${C.sand}`,transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {I.check}
                  <h3 style={{color:C.navy,fontWeight:700,fontSize:16}}>{s}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800,textAlign:"center"}}>
          <div className="lab">Areas We Serve</div>
          <h2 className="ttl">{data.city} Neighborhoods We Serve</h2>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginTop:24}}>
            {data.neighborhoods.map(n=>
              <span key={n} style={{padding:"8px 18px",borderRadius:50,background:C.cream,color:C.grayDark,fontSize:13,fontWeight:600}}>{n}</span>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:700}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{data.city} Concrete FAQ</h2>
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

      {/* CTA */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started in {data.city}</div>
              <h2 className="ttl ttl-w">Ready to Start Your {data.city} Project?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate. We'll visit your {data.city} property, discuss your project, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>(317) 279-5643</div></div></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>eric@hamiltoncountyconcrete.com</div></div></div>
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

      <Footer/>
    </div>
  );
}

/* ─── Service Pages ────────────────────────────────── */
const SERVICE_PAGES = {
  "stamped-decorative-concrete": {
    title: "Stamped & Decorative Concrete",
    metaTitle: "Stamped & Decorative Concrete in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Expert stamped and decorative concrete in Hamilton County, Indiana. Natural stone, brick, slate, and custom patterns. Color hardener, exposed aggregate, and hand-tooled borders. Free estimates. (317) 279-5643",
    heroHeading: "Stamped & Decorative Concrete Specialists",
    heroSub: "Transform any surface with the look of natural stone, brick, or slate — at a fraction of the cost. Custom patterns, colors, and textures that make your property unforgettable.",
    intro: "Stamped concrete is our specialty — and it shows in every project we complete. Unlike standard broom-finish concrete, stamped and decorative concrete uses precision-applied patterns, integral colors, color hardeners, and release agents to replicate the look of natural stone, brick, slate, tile, or even wood planks. The result is a surface that delivers high-end aesthetics with the durability and low maintenance of concrete.",
    details: "Our decorative concrete process starts long before the stamp hits the surface. Every stamped project begins with full excavation, compactable aggregate base, and mechanical compaction — because even the most beautiful finish will fail on a poorly prepared base. We pour with the correct PSI mix for the application, add fiber mesh reinforcement, and then apply color hardener to the fresh concrete for rich, UV-stable color that penetrates the surface. Next, we apply a release agent — either powder or liquid — that prevents the stamps from sticking and adds an antiqued, multi-tonal look to the finished surface. Our crew then presses the stamp mats into the concrete with precision, ensuring consistent pattern alignment and depth. After curing, we pressure wash the excess release and apply a high-quality sealer that protects the color and provides a subtle sheen.",
    options: ["Ashlar Slate","Flagstone","Cobblestone","European Fan","Random Stone","Wood Plank","Brick Running Bond","Herringbone","Seamless Texture","Custom Patterns"],
    optionsLabel: "Popular Stamp Patterns",
    projects: ["Stamped Concrete","Stamped Driveway"],
    faq: [
      {q:"How long does stamped concrete last?",a:"With proper base preparation, quality materials, and regular sealing every 2-3 years, stamped concrete will last 25-30+ years in Indiana's climate. Our process includes full excavation, aggregate base, and reinforced concrete — the foundation that makes the finish last."},
      {q:"Is stamped concrete slippery when wet?",a:"When properly sealed with a non-skid additive (which we include as standard), stamped concrete provides excellent traction even when wet. The texture of the stamp pattern itself also adds natural slip resistance."},
      {q:"How much does stamped concrete cost in Hamilton County?",a:"Stamped concrete in Hamilton County typically ranges from $14-20 per square foot depending on pattern complexity, number of colors, and project size. Standard broom-finish concrete runs $8-12 per square foot for comparison. Call (317) 279-5643 for a free on-site estimate."},
      {q:"Can you stamp an existing concrete surface?",a:"Stamping must be done on fresh, wet concrete — you can't stamp existing hardened concrete. However, we can apply a stampable overlay to some existing surfaces, or we can tear out and replace with a new stamped pour. We'll evaluate your specific situation during a free consultation."},
      {q:"What colors are available for stamped concrete?",a:"We offer a wide range of integral colors (mixed into the concrete) and color hardeners (applied to the surface). Popular choices in Hamilton County include sandstone, walnut, charcoal, terra cotta, and slate gray. We bring physical samples to every consultation so you can see the options in person."},
    ],
  },
  "concrete-patios-outdoor-living": {
    title: "Patios & Outdoor Living Spaces",
    metaTitle: "Concrete Patios & Outdoor Living in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Custom concrete patios and outdoor living spaces in Hamilton County, Indiana. Stamped, brushed, and decorative options. Fire pit pads, seating walls, multi-level designs. Free estimates. (317) 279-5643",
    heroHeading: "Custom Patios & Outdoor Living Spaces",
    heroSub: "From simple entertaining pads to full outdoor living environments with fire pits, seating walls, and multi-level transitions — we create backyards people never want to leave.",
    intro: "A well-designed patio is the foundation of outdoor living. Whether you're looking for a simple, clean space for a table and chairs or a full outdoor living environment with multiple zones for dining, lounging, and gathering around a fire pit, the concrete patio is where it all starts. At Hamilton County Concrete and Patios, we design and pour patios that match how you actually live outdoors.",
    details: "Every patio we pour begins with an on-site consultation where we walk your property, discuss your vision, and evaluate drainage, grading, and soil conditions. We then design a layout that maximizes your usable space, ensures proper water flow away from your home, and creates natural transitions between zones. Our patio pours include full excavation to proper depth, compactable aggregate base installed in lifts and mechanically compacted, fiber mesh reinforcement, and your choice of finish — from clean broom finish to decorative stamped patterns with custom colors. We also pour integrated features like fire pit pads, step-downs, landing pads, and connecting walkways as part of a unified project.",
    options: ["Stamped Patio","Broom Finish Patio","Exposed Aggregate","Fire Pit Pad","Multi-Level Patio","Seating Wall Integration","Step-Down Transitions","Connecting Walkways"],
    optionsLabel: "Patio Options We Offer",
    projects: ["Patio","Stamped Concrete","Outdoor Living"],
    faq: [
      {q:"How much does a concrete patio cost in Hamilton County?",a:"A standard broom-finish patio in Hamilton County runs $8-12 per square foot installed. Stamped or decorative patios range from $14-20 per square foot. A typical 400 sq ft patio costs $3,200-$8,000 depending on finish. Call (317) 279-5643 for a free estimate specific to your project."},
      {q:"How long does it take to pour a patio?",a:"Most residential patios can be excavated, formed, and poured in 1-3 days. Stamped patios may add an extra day for the finishing process. Total project time including curing is about 1-2 weeks. You can walk on it in 24-48 hours, and place furniture after 7 days."},
      {q:"What's better for a patio — concrete or pavers?",a:"Both are excellent options. Concrete is faster to install, more affordable per square foot, and offers a seamless surface with no weeds between joints. Pavers offer a modular look but cost more and require ongoing maintenance (re-sanding, re-leveling). For most Hamilton County homeowners, stamped concrete delivers a similar aesthetic at a better price point."},
      {q:"Can you add a fire pit to a concrete patio?",a:"Absolutely. We pour integrated fire pit pads as part of the patio project, with proper reinforcement and heat-resistant specifications. We can design the fire pit area as a focal point of your outdoor living space with surrounding seating areas."},
      {q:"Do concrete patios crack?",a:"All concrete develops minor hairline cracks over time — that's normal. However, the severity and frequency of cracking depends almost entirely on base preparation. Our process of full excavation, aggregate base, compaction, reinforcement, and proper control joint placement minimizes cracking dramatically compared to pours done on unprepared soil."},
    ],
  },
  "pavilions-pergolas-enclosed-patios": {
    title: "Pavilions, Pergolas & Enclosed Patios",
    metaTitle: "Pavilions, Pergolas & Enclosed Patios in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Custom pavilions, pergolas, and 3/4-season enclosed patios in Hamilton County, Indiana. Complete outdoor structures with stamped concrete foundations. Free estimates. (317) 279-5643",
    heroHeading: "Pavilions, Pergolas & Enclosed Patios",
    heroSub: "Extend your outdoor season with a custom-built structure — from open-air pergolas to fully insulated 3/4-season rooms. We build the foundation and the complete outdoor environment.",
    intro: "An outdoor structure transforms your patio from a seasonal space into a year-round destination. Whether it's an open-air pergola for shade and ambiance, a covered pavilion for rain-or-shine entertaining, or a fully enclosed 3-season or 4-season room that extends your living space, the structure starts with a solid foundation — and that's where we come in.",
    details: "We handle the complete project from the concrete foundation up through the finished structure. Our pavilion and pergola builds start with a properly engineered stamped or standard concrete pad, with footings sized for the structural loads above. We then build the structure with quality materials — natural stone veneer columns, cedar or composite beams, architectural-grade roofing, and optional features like ceiling fans, lighting, screens, and fireplace integration. For enclosed patios (3-season and 4-season rooms), we work with trusted local builders to deliver a fully weatherized space with insulated walls, windows, HVAC integration, and finished interiors — all on a concrete foundation built to support the structure for decades.",
    options: ["Open-Air Pergola","Covered Pavilion","3-Season Room","4-Season Room","Stone Column Pavilion","Cedar Pavilion","Screened-In Patio","Pavilion with Fireplace","Pavilion with Outdoor Kitchen"],
    optionsLabel: "Structure Options",
    projects: ["Pavilion","Outdoor Living"],
    faq: [
      {q:"How much does a pavilion cost in Hamilton County?",a:"Pavilion projects in Hamilton County typically range from $25,000-$75,000+ depending on size, materials, and features. A basic 12x16 cedar pavilion on a stamped concrete pad starts around $25,000. A premium stone-column pavilion with fireplace and lighting can reach $60,000+. Call (317) 279-5643 for a detailed estimate."},
      {q:"Do I need a permit for a pavilion or pergola?",a:"In most Hamilton County municipalities, yes. Covered structures typically require a building permit and may need to meet setback requirements. We handle the entire permitting process for you and ensure the structure meets local building codes."},
      {q:"What's the difference between a 3-season and 4-season room?",a:"A 3-season room has screens or windows that provide protection from insects and rain but is not heated — it's comfortable from spring through fall. A 4-season room is fully insulated with HVAC, making it usable year-round like an extension of your home. The 4-season option costs more but adds significant living space and resale value."},
      {q:"Can you add a pavilion to an existing patio?",a:"It depends on the existing patio's condition and thickness. If the concrete is in good shape and thick enough to support footings, we can often build directly on it. If not, we may need to pour new footings adjacent to the existing pad. We evaluate this during our free on-site consultation."},
    ],
  },
  "concrete-driveways": {
    title: "Concrete Driveways",
    metaTitle: "Concrete Driveways in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Professional concrete driveway installation and replacement in Hamilton County, Indiana. Standard, stamped, exposed aggregate, and colored options. Free estimates. (317) 279-5643",
    heroHeading: "Concrete Driveways Built to Last",
    heroSub: "New installations, full replacements, and extensions — poured with proper base preparation, reinforcement, and finishing that handles Indiana weather for decades.",
    intro: "Your driveway is the first thing people see when they pull up to your home — and it takes more abuse than any other concrete surface on your property. Vehicles, salt, freeze-thaw cycles, and UV exposure all take their toll. That's why driveway concrete demands the highest standards of base preparation, mix design, reinforcement, and finishing. At Hamilton County Concrete and Patios, we build driveways that look great on day one and perform for 25-30 years.",
    details: "Our driveway process starts with complete removal of the old surface (if replacing), followed by excavation to the proper depth — typically 8-10 inches below finished grade to accommodate base material and concrete thickness. We install 4-6 inches of compactable aggregate base and compact in lifts using a plate compactor. We then set forms to the proper grade, ensuring positive drainage away from your garage and home. Every driveway we pour includes rebar or welded wire mesh reinforcement plus fiber mesh in the concrete mix, and we use a minimum 4,000 PSI concrete with air entrainment for freeze-thaw resistance. Control joints are cut at proper intervals to manage natural cracking, and the finished surface receives a professional broom finish for slip resistance or your choice of decorative finish.",
    options: ["Standard Broom Finish","Stamped Driveway","Exposed Aggregate","Colored Concrete","Stamped Border with Broom Center","Turnaround Pad","Driveway Extension","Apron Replacement"],
    optionsLabel: "Driveway Options",
    projects: ["Driveway"],
    faq: [
      {q:"How much does a concrete driveway cost in Hamilton County?",a:"A standard broom-finish driveway in Hamilton County typically costs $8-12 per square foot installed. Stamped or decorative driveways range from $14-20 per square foot. A typical two-car driveway (600-800 sq ft) costs $5,000-$16,000 depending on finish. Call (317) 279-5643 for a free estimate."},
      {q:"How long does a driveway replacement take?",a:"A typical driveway replacement takes 2-4 days: day 1 for demolition and hauling, day 2 for base prep and forming, and day 3 for the pour. Add 7 days of curing before vehicle traffic. We provide a detailed timeline upfront."},
      {q:"How long before I can drive on new concrete?",a:"We recommend waiting at least 7 days before passenger vehicle traffic and 14 days before heavy vehicles. Foot traffic is safe after 24-48 hours. We'll provide specific curing instructions based on weather conditions at the time of your pour."},
      {q:"Should I seal my new driveway?",a:"Yes. We recommend sealing your new driveway 30 days after the pour, and then every 2-3 years thereafter. Sealing protects against salt damage, UV fading, and moisture penetration — all critical in Indiana's climate. We can apply the initial sealer as part of your project."},
      {q:"Can you match my existing concrete color?",a:"We can get very close using integral color or stain options. New concrete next to old will always look slightly different initially due to aging and weathering, but they'll converge over time. We bring color samples to your consultation."},
    ],
  },
  "concrete-sidewalks-walkways": {
    title: "Sidewalks & Walkways",
    metaTitle: "Concrete Sidewalks & Walkways in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Professional concrete sidewalk and walkway installation in Hamilton County, Indiana. Standard and decorative stamped options. New pours and replacements. Free estimates. (317) 279-5643",
    heroHeading: "Concrete Sidewalks & Walkways",
    heroSub: "Safe, level, and beautiful pathways that connect your spaces — from front walkways that elevate curb appeal to backyard paths that complete your outdoor living area.",
    intro: "Sidewalks and walkways serve a dual purpose: they provide safe, level passage between spaces, and they contribute significantly to your property's curb appeal and overall landscape design. Whether you need a new front walkway, a replacement sidewalk, or a decorative stamped path connecting your patio to a garden or pool area, we pour walkways built for both function and beauty.",
    details: "Our walkway process follows the same quality standards as our larger pours — full excavation, compactable aggregate base, compaction, and reinforced concrete. We grade every walkway for positive drainage and proper slope, ensuring water flows away from structures and doesn't pool on the surface. For standard walkways, we apply a clean broom finish with precise control joints. For decorative walkways, we offer stamped patterns, colored concrete, exposed aggregate borders, and hand-tooled edge details. We also handle ADA-compliant installations for commercial properties, with proper slopes, widths, and surface textures that meet code requirements.",
    options: ["Standard Broom Finish","Stamped Walkway","Cobblestone Pattern","Exposed Aggregate Border","Colored Concrete","Front Porch Landing","Step Integration","ADA-Compliant Commercial"],
    optionsLabel: "Walkway Options",
    projects: ["Stamped Concrete","Patio"],
    faq: [
      {q:"How much does a concrete walkway cost?",a:"Standard broom-finish walkways in Hamilton County run $8-12 per square foot. Stamped or decorative walkways range from $14-20 per square foot. A typical 4-foot-wide, 30-foot-long front walkway (120 sq ft) costs $960-$2,400. Call (317) 279-5643 for a free estimate."},
      {q:"Can you replace just part of a sidewalk?",a:"Yes. We can remove and replace individual sections of sidewalk without disturbing the sections that are still in good condition. We color-match as closely as possible and cut clean joints at the transition points."},
      {q:"How wide should a walkway be?",a:"For residential front walkways, we recommend 4 feet minimum — wide enough for two people to walk side by side. For secondary paths and garden walkways, 3 feet works well. ADA-compliant commercial walkways require a minimum of 5 feet."},
      {q:"Do you pour steps and landings?",a:"Absolutely. We pour concrete steps, landings, and stoops as part of walkway projects. All steps are built to code with proper rise, run, and railing attachment points if needed."},
    ],
  },
  "garage-floors-concrete-slabs": {
    title: "Garage Floors & Concrete Slabs",
    metaTitle: "Garage Floors & Concrete Slabs in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Garage floor pours, shop slabs, and concrete resurfacing in Hamilton County, Indiana. Proper grading, reinforcement, and professional finishing. Free estimates. (317) 279-5643",
    heroHeading: "Garage Floors & Concrete Slabs",
    heroSub: "High-performance floor pours for garages, shops, barns, and outbuildings — built with proper grading, vapor barriers, and reinforcement to handle heavy loads.",
    intro: "Garage floors and concrete slabs take more abuse than most surfaces — vehicle weight, equipment loads, chemical spills, road salt, and temperature extremes. A garage floor that's too thin, poured on poor base, or lacks proper reinforcement will crack, settle, and deteriorate within a few years. We pour garage floors and slabs that handle real-world use for decades.",
    details: "Our garage floor process starts with excavation and base preparation — removing unstable soil and installing compactable aggregate base compacted in lifts. We install a vapor barrier to prevent moisture from wicking through the slab, which is critical for preventing efflorescence, coating failure, and moisture problems in the space above. We pour with a minimum 4-inch thickness (6-inch for heavy equipment or vehicle lifts), using 4,000+ PSI concrete with rebar or welded wire mesh reinforcement. Control joints are placed at proper intervals, and the surface receives a steel trowel or broom finish depending on the intended use. We grade the floor to drain toward the garage door opening for water management.",
    options: ["Standard Garage Floor","Heavy-Duty Shop Slab","Barn/Outbuilding Pad","Equipment Pad","Smooth Trowel Finish","Broom Finish","Apron Pour","Slab Replacement"],
    optionsLabel: "Slab Options",
    projects: [],
    faq: [
      {q:"How thick should a garage floor be?",a:"Standard residential garage floors should be a minimum of 4 inches thick. For shops with heavy equipment, vehicle lifts, or commercial use, we recommend 6 inches with heavier reinforcement. We evaluate your specific use case during the consultation."},
      {q:"How much does a garage floor cost?",a:"Garage floor pours in Hamilton County typically run $8-12 per square foot for a standard broom or trowel finish. A typical 2-car garage (400-600 sq ft) costs $3,200-$7,200. Tear-out of an existing slab adds $2-4 per square foot. Call (317) 279-5643 for a detailed estimate."},
      {q:"Do you install vapor barriers?",a:"Yes — we install a vapor barrier (typically 6-mil poly sheeting) under every garage floor and interior slab. This prevents ground moisture from wicking through the concrete, which can cause coating failure, efflorescence, and moisture problems in the space above."},
      {q:"Can you pour over an existing garage floor?",a:"In most cases, no. Pouring over existing concrete creates a thin overlay that's prone to delamination and cracking. We typically recommend full tear-out and replacement for the best long-term result. We'll evaluate your specific situation during the consultation."},
    ],
  },
  "concrete-removal-replacement": {
    title: "Concrete Removal & Replacement",
    metaTitle: "Concrete Removal & Replacement in Hamilton County, IN | Hamilton County Concrete and Patios",
    metaDesc: "Complete concrete removal, tear-out, and replacement in Hamilton County, Indiana. Driveways, patios, sidewalks, and slabs. Proper base prep on every pour. Free estimates. (317) 279-5643",
    heroHeading: "Concrete Removal & Replacement",
    heroSub: "Out with the old, in with the new. Complete tear-out, hauling, base preparation, and fresh concrete — done right from the ground up.",
    intro: "Sometimes the best fix is a fresh start. When your existing concrete is severely cracked, sunken, spalling, or simply past its lifespan, patching and mudjacking only delay the inevitable. A full removal and replacement gives you a brand-new surface built on a properly prepared base — and it's often more cost-effective than years of ongoing repairs.",
    details: "Our removal and replacement process is comprehensive. We start by sawcutting clean edges to define the work area, then use skid steers and concrete saws to break up and remove the old slab. All debris is loaded and hauled away — you never have to deal with disposal. Once the old concrete is removed, we excavate to the proper depth, evaluate and correct any drainage or soil issues that contributed to the original failure, install compactable aggregate base, compact in lifts, and pour new concrete with proper reinforcement and finishing. The result is a surface that addresses the root cause of the original failure, not just the symptoms.",
    options: ["Full Driveway Replacement","Patio Tear-Out & Replace","Sidewalk Section Replacement","Garage Floor Replacement","Apron Replacement","Pool Deck Replacement","Sunken Slab Correction","Trip Hazard Elimination"],
    optionsLabel: "Replacement Services",
    projects: [],
    faq: [
      {q:"How much does concrete removal and replacement cost?",a:"Removal and replacement in Hamilton County typically runs $10-16 per square foot including tear-out, hauling, base prep, and new concrete. The total depends on thickness, access, reinforcement, and finish. A typical driveway replacement runs $7,000-$14,000. Call (317) 279-5643 for a free estimate."},
      {q:"How long does a replacement project take?",a:"Most residential replacements take 2-4 days: demo and hauling, base prep and forming, and the new pour. Larger projects or those with drainage corrections may take longer. Add 7 days of curing before vehicle traffic on driveways."},
      {q:"Why did my old concrete fail?",a:"The most common causes in Hamilton County are: poor base preparation (pouring on unprepared soil), insufficient thickness, lack of reinforcement, poor drainage causing water to undermine the slab, tree root pressure, and simply reaching the end of a 25-30 year lifespan. We address all of these root causes in our replacement process."},
      {q:"Can you replace just a section of my driveway?",a:"Yes. We can remove and replace individual sections without disturbing the rest. We sawcut clean edges, match the thickness, and use control joints at the transition. The new section may look slightly different in color initially but will blend over time."},
    ],
  },
};

function ServicePage({data}){
  const[faqOpen,setFaqOpen]=useState(null);

  useEffect(()=>{
    document.title=data.metaTitle;
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",data.metaDesc);
  },[data]);

  useEffect(()=>{
    if(!document.querySelector('link[href*="work_request_embed.css"]')){
      const link=document.createElement("link");link.rel="stylesheet";link.href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";link.media="screen";document.head.appendChild(link);
    }
    if(!document.querySelector('script[src*="work_request_embed_snippet"]')){
      const s=document.createElement("script");s.src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
      s.setAttribute("clienthub_id","53500fa6-27db-4da1-a477-d8eaf804d81e-1520740");
      s.setAttribute("form_url","https://clienthub.getjobber.com/client_hubs/53500fa6-27db-4da1-a477-d8eaf804d81e/public/work_request/embedded_work_request_form?form_id=1520740");
      document.body.appendChild(s);
    }
  },[]);

  /* Filter projects matching this service's categories */
  const serviceProjects = data.projects.length > 0 ? PROJECTS.filter(p=>data.projects.some(cat=>p.cat===cat||p.cat.includes(cat))) : [];

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service","name":data.title,"provider":{"@type":"HomeAndConstructionBusiness","name":"Hamilton County Concrete and Patios","telephone":"+1-317-279-5643","url":"https://www.hamiltoncountyconcrete.com","address":{"@type":"PostalAddress","addressLocality":"Carmel","addressRegion":"IN","addressCountry":"US"}},"areaServed":[{name:"Carmel"},{name:"Fishers"},{name:"Noblesville"},{name:"Westfield"},{name:"Zionsville"},{name:"Hamilton County"}].map(c=>({"@type":"City",...c})),"description":data.metaDesc})}}/>

      <Nav/>

      {/* Hero */}
      <section style={{position:"relative",padding:"160px 24px 80px",background:`linear-gradient(155deg,${C.navyLight} 0%,#4E666F 35%,#5E7680 65%,#6E8690 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(250,248,245,.14) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.12)",borderRadius:50,padding:"7px 16px",marginBottom:22}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"rgba(255,255,255,.7)"}}/>
            <span style={{color:"rgba(255,255,255,.85)",fontWeight:700,fontSize:12,letterSpacing:".06em"}}>HAMILTON COUNTY, INDIANA</span>
          </div>
          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(32px,5vw,52px)",lineHeight:1.1,marginBottom:20}}>{data.heroHeading}</h1>
          <p className="fu d3" style={{color:"rgba(255,255,255,.7)",fontSize:17,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px"}}>{data.heroSub}</p>
          <div className="fu d4" style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:14}}>
            <a href="#svc-estimate" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
            <a href="/" className="btn-o">View All Services</a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:800}}>
          <div className="lab" style={{textAlign:"center"}}>About This Service</div>
          <h2 className="ttl" style={{textAlign:"center"}}>{data.title} in Hamilton County</h2>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85,marginBottom:28}}>{data.intro}</p>
          <p style={{color:C.gray,fontSize:16,lineHeight:1.85}}>{data.details}</p>
        </div>
      </section>

      {/* Options */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:800,textAlign:"center"}}>
          <div className="lab">{data.optionsLabel}</div>
          <h2 className="ttl">Options Available</h2>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginTop:24}}>
            {data.options.map(opt=>
              <span key={opt} style={{padding:"10px 20px",borderRadius:50,background:"#fff",color:C.navy,fontSize:14,fontWeight:600,border:`1px solid ${C.sand}`}}>{opt}</span>
            )}
          </div>
        </div>
      </section>

      {/* Projects for this service */}
      {serviceProjects.length>0&&(
        <section className="sec" style={{background:"#fff"}}>
          <div className="sec-in">
            <div style={{textAlign:"center",marginBottom:48}}>
              <div className="lab">Our {data.title} Work</div>
              <h2 className="ttl">Recent {data.title} Projects</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:22}}>
              {serviceProjects.map((p,i)=>
                <div key={p.title} style={{borderRadius:14,overflow:"hidden",background:C.cream,boxShadow:"0 2px 10px rgba(0,0,0,.05)",transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 44px rgba(0,0,0,.1)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.05)"}}>
                  <Carousel images={p.images} color={p.color} title={p.title} />
                  <div style={{padding:"20px 24px 24px"}}>
                    <span style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:C.green,textTransform:"uppercase"}}>{p.cat}</span>
                    <h3 className="display" style={{fontSize:17,color:C.navy,marginTop:6}}>{p.title}</h3>
                    {p.desc&&<p style={{color:C.gray,fontSize:13,lineHeight:1.6,marginTop:8}}>{p.desc}</p>}
                    {p.images&&p.images.length>1&&<div style={{marginTop:10,color:C.gray,fontSize:11,fontWeight:600}}>{p.images.length} photos</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      <section className="sec" style={{background:C.cream}}>
        <div className="sec-in" style={{maxWidth:800,textAlign:"center"}}>
          <div className="lab">Where We Offer {data.title}</div>
          <h2 className="ttl">Service Areas</h2>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginTop:24}}>
            {["Carmel","Fishers","Noblesville","Westfield","Zionsville","Brownsburg","Pendleton","McCordsville","Fortville"].map(city=>
              <span key={city} style={{padding:"10px 20px",borderRadius:50,background:"#fff",color:C.navy,fontSize:14,fontWeight:600,border:`1px solid ${C.sand}`}}>{city}, IN</span>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{background:"#fff"}}>
        <div className="sec-in" style={{maxWidth:700}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="lab">Common Questions</div>
            <h2 className="ttl">{data.title} FAQ</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {data.faq.map((f,i)=>
              <div key={i} style={{background:C.cream,borderRadius:12,overflow:"hidden",border:`1px solid ${faqOpen===i?C.green:C.sand}`,transition:"border-color .3s"}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:C.navy}}>
                  {f.q}<span style={{transform:faqOpen===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s",flexShrink:0,marginLeft:14}}>{I.chevDown}</span>
                </button>
                <div style={{maxHeight:faqOpen===i?400:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                  <div style={{padding:"0 24px 20px",color:C.gray,lineHeight:1.75,fontSize:14}}>{f.a}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`}}>
        <div className="sec-in">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <div>
              <div className="lab">Get Started</div>
              <h2 className="ttl ttl-w">Ready for Your {data.title} Project?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:28}}>Request a free, no-obligation estimate. We'll visit your property, discuss your vision, and provide a detailed quote with transparent pricing.</p>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.phone}</div><div><a href="tel:+13172795643" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>(317) 279-5643</a></div></div>
                <div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{color:C.green}}>{I.mail}</div><div><a href="mailto:eric@hamiltoncountyconcrete.com" style={{color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>eric@hamiltoncountyconcrete.com</a></div></div>
              </div>
              <div style={{marginTop:28}}>
                <a href="/" style={{color:C.green,fontWeight:700,fontSize:14,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>← Back to main site</a>
              </div>
            </div>
            <div id="svc-estimate" style={{background:"#fff",borderRadius:16,padding:"28px 24px",minHeight:400}}>
              <h3 className="display" style={{color:C.navy,fontSize:20,marginBottom:6,textAlign:"center"}}>Free {data.title} Estimate</h3>
              <p style={{color:C.gray,fontSize:13,marginBottom:20,textAlign:"center"}}>Fill out the form and we'll get back to you quickly.</p>
              <div id="53500fa6-27db-4da1-a477-d8eaf804d81e-1520740"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

export default function HamiltonCountyConcreteSite(){
  const[legalPage,setLegalPage]=useState(null);
  const[cityPage,setCityPage]=useState(null);
  const[servicePage,setServicePage]=useState(null);
  const[serviceCityPage,setServiceCityPage]=useState(null);

  useEffect(()=>{
    const path=window.location.pathname.replace(/^\//,"").replace(/\/$/,"");
    /* Check service-city combo first (most specific) */
    const svcCity = resolveServiceCity(path);
    if(svcCity){ setServiceCityPage(svcCity); }
    else if(CITIES[path]){ setCityPage(path); }
    else if(SERVICE_PAGES[path]){ setServicePage(path); }
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

  if(serviceCityPage){
    return <ServiceCityPage svcKey={serviceCityPage.svcKey} cityKey={serviceCityPage.cityKey} slug={serviceCityPage.slug}/>;
  }
  if(cityPage&&CITIES[cityPage]){
    return <CityPage data={CITIES[cityPage]}/>;
  }
  if(servicePage&&SERVICE_PAGES[servicePage]){
    return <ServicePage data={SERVICE_PAGES[servicePage]}/>;
  }

  return(
    <div style={{overflowX:"hidden"}}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"Hamilton County Concrete and Patios",description:"Stamped concrete patios, decorative outdoor living spaces, driveways & more. Locally owned, serving Hamilton County, Indiana. Licensed & insured. Free estimates.",url:"https://www.hamiltoncountyconcrete.com",telephone:"+1-317-279-5643",address:{"@type":"PostalAddress",addressLocality:"Carmel",addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:39.9784,longitude:-86.1180},areaServed:[{name:"Carmel"},{name:"Fishers"},{name:"Westfield"},{name:"Noblesville"},{name:"Zionsville"},{name:"Brownsburg"},{name:"Pendleton"},{name:"McCordsville"},{name:"Fortville"}].map(c=>({"@type":"City",...c})),openingHours:["Mo-Fr 07:00-18:00","Sa 08:00-14:00"],priceRange:"$$",hasOfferCatalog:{"@type":"OfferCatalog",name:"Concrete Services",itemListElement:SVC.map((s,i)=>({"@type":"Offer",itemOffered:{"@type":"Service",name:s.title,description:s.desc}}))}})}}/>
      <Nav/>
      <Hero/>
      <Services/>
      <Difference/>
      <OurProcess/>
      <Projects/>
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
