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
  { title: "Kitchen Remodeling", tag: "Cook in style and comfort", desc: "Your kitchen is where the magic (and the messes) happen. We'll help you create a space that's equal parts chef-worthy and family-friendly—with smart storage, better flow, and finishes that make you want to host brunch every weekend.", color: "#D4A76A", href: "/services/kitchen-remodeling/" },
  { title: "Bathroom Remodeling", tag: "Say hello to spa vibes", desc: "Say goodbye to leaky faucets and dated tile. We'll transform your bathroom into a serene space that works for your routine and looks good doing it. Think spa energy—without ever leaving the house.", color: "#6A9FD4", href: "/services/bathroom-remodeling/" },
  { title: "Basement Finishing", tag: "Turn \"blah\" into \"ta-da!\"", desc: "Let's turn that underused space into something special. Whether it's a family lounge, guest suite, or your long-awaited craft cave, we design basements that finally get the attention they deserve.", color: "#8B7EC4", href: "/services/basement-finishing/" },
  { title: "Flooring Services", tag: "Step into something stylish", desc: "From high-traffic durability to stylish charm, your floors should check all the boxes. We install everything from cozy carpet to stunning hardwood that can handle muddy shoes, busy feet, and life in between.", color: "#C49A6A", href: "/services/flooring-services/" },
  { title: "Painting Services", tag: "Color your world", desc: "Ready to ditch the builder beige? We deliver flawless finishes, clean lines, and eye-catching color that completely transforms your space—without you lifting a brush.", color: "#6AC4A8", href: "/services/painting-services/" },
  { title: "Decks & Outdoor Living", tag: "Let's bring the party outside", desc: "Extend your living space with decks, patios, and outdoor retreats made for lounging, laughing, and late-night stargazing. We bring the resort vibes—no suitcase required.", color: "#7AAF5A", href: "/services/decks-outdoor-living/" },
];

const PROCESS = [
  { icon: I.bulb, step: "01", title: "Inspiration & Understanding", sub: "We Listen. You Share. We Plan Together.", text: "Our process begins with a no-pressure in-home consultation. We want to get to know you—how you live, what you love about your home, and what you'd like to improve. This isn't just about measurements and materials—it's about building a relationship and understanding your vision.", bullets: ["A friendly walk-through of your space", "Open discussion about your goals & design inspiration", "Understanding of your timeline and budget", "Helpful advice, tips, and realistic possibilities"] },
  { icon: I.calc, step: "02", title: "Design, Details & Estimate", sub: "Turning Ideas into a Plan That Fits Your Life.", text: "Once we've nailed down the big-picture vision, we get to work designing your dream space—with visuals, textures, and real-life samples that help you make informed decisions with confidence.", bullets: ["Custom design renderings reflecting your style", "Material samples you can touch and compare", "A detailed, itemized estimate with transparent pricing", "A clear timeline for your project"] },
  { icon: I.cal, step: "03", title: "Sign, Schedule & Start", sub: "Let's Get to Work, On Your Terms.", text: "When everything is just right, we make it official. We'll finalize the contract, agree on your start date, and get the tools and team in place to bring your space to life.", bullets: ["Sign your proposal with confidence", "Set a clear, confirmed project start date", "Receive a preparation checklist for Day 1", "Stay in the loop with regular updates"] },
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
    title: "Bathroom Redesign – Complete",
    cat: "Bathroom",
    color: "#4A6A8B",
    desc: "Full gut renovation with modern tile, frameless glass shower, and custom vanity.",
    images: [
      { src: "/images/bathroom-green-tile-1.jpg", alt: "Bathroom remodel with green tile in Carmel Indiana" },
      { src: "/images/bathroom-green-tile-2.jpg", alt: "Beautiful green tile shower remodel Carmel IN" },
      { src: "/images/bathroom-green-tile-3.jpg", alt: "Custom bathroom tile work in Carmel Indiana" },
      { src: "/images/bathroom-green-tile-4.jpg", alt: "Completed bathroom renovation Carmel IN" },
    ],
  },
  {
    title: "Bathroom Vanity Refresh",
    cat: "Bathroom",
    color: "#5A7A6B",
    desc: "Quick-turnaround vanity swap with new countertop, fixtures, and mirror.",
    images: [
      // { src: "/images/vanity-refresh-1.webp", alt: "Bathroom vanity refresh in Fishers Indiana" },
    ],
  },
  {
    title: "Bath & Shower Remodel",
    cat: "Bathroom",
    color: "#6A5A7B",
    desc: "Tub-to-shower conversion with heated floors and rain showerhead.",
    images: [
      // { src: "/images/shower-remodel-1.webp", alt: "Shower remodel in Westfield Indiana" },
    ],
  },
  {
    title: "Full Home Remodel",
    cat: "Whole Home",
    color: "#7B5A4A",
    desc: "Complete interior transformation — kitchen, bathrooms, flooring, and paint throughout.",
    images: [
      // { src: "/images/full-home-1.webp", alt: "Full home remodel in Noblesville Indiana" },
      // { src: "/images/full-home-2.webp", alt: "Kitchen renovation Noblesville IN" },
    ],
  },
  {
    title: "Basement Finishing",
    cat: "Basement",
    color: "#4A5A7B",
    desc: "Unfinished basement converted to entertainment area with wet bar and guest suite.",
    images: [
      // { src: "/images/basement-1.webp", alt: "Basement finishing in Carmel Indiana" },
      // { src: "/images/basement-2.webp", alt: "Finished basement entertainment area Carmel IN" },
    ],
  },
  {
    title: "Deck & Patio Build",
    cat: "Outdoor",
    color: "#5A7B4A",
    desc: "Custom composite deck with pergola, built-in seating, and landscape lighting.",
    images: [
      // { src: "/images/deck-1.webp", alt: "Custom deck build in Zionsville Indiana" },
      // { src: "/images/deck-2.webp", alt: "Outdoor living space with pergola Zionsville IN" },
    ],
  },
];

const BLOG = [
  { title: "5 Signs Your Bathroom Needs a Remodel", date: "Feb 18, 2026", read: "5 min", cat: "Bathroom", excerpt: "Cracked grout, outdated fixtures, and poor ventilation aren't just eyesores—they're signs it's time to invest in your bathroom. Here's what to look for." },
  { title: "Kitchen Remodel ROI: What Actually Adds Value in Indiana", date: "Feb 4, 2026", read: "6 min", cat: "Kitchen", excerpt: "Not all upgrades are equal. We break down which kitchen improvements deliver the best return for Hamilton County homeowners." },
  { title: "Why Basement Finishing Is the Best Investment You'll Make This Year", date: "Jan 20, 2026", read: "4 min", cat: "Basement", excerpt: "Extra living space without moving? A finished basement adds square footage, comfort, and serious resale value to your home." },
  { title: "Deck Season Is Coming: How to Plan Your Outdoor Living Space", date: "Jan 8, 2026", read: "3 min", cat: "Outdoor", excerpt: "Spring is the perfect time to start planning your dream deck. Here's how to choose materials, layout, and features that last." },
];

const VIDEOS = [
  { title: "Full Kitchen Remodel Walkthrough", dur: "8:24", desc: "Watch the complete transformation of a dated kitchen into a modern culinary space with custom cabinetry and quartz counters." },
  { title: "Before & After: Basement Conversion", dur: "5:47", desc: "See how we turned an unfinished basement into a stunning family entertainment area with wet bar and guest suite." },
  { title: "Bathroom Renovation: Start to Finish", dur: "6:12", desc: "A behind-the-scenes look at our team completing a spa-inspired master bath remodel from demolition to final reveal." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", loc: "Carmel, IN", text: "HomeStar completely transformed our kitchen. The attention to detail was incredible, and they finished ahead of schedule. Robb and Eric are the real deal.", rating: 5 },
  { name: "James & Linda K.", loc: "Westfield, IN", text: "Professional from start to finish. The crew was respectful of our home, and the communication throughout the project was outstanding. No surprises, no hidden fees.", rating: 5 },
  { name: "David R.", loc: "Fishers, IN", text: "We've used HomeStar for three projects now—bathroom remodel, basement finish, and a deck build. Consistently excellent work at fair prices. They're our go-to.", rating: 5 },
];

const FAQS = [
  { q: "How do I get a free estimate?", a: "Simply call us at (317) 279-4798, fill out our contact form, or request a quote online. We'll schedule a convenient time to visit your property, discuss your vision, and provide a detailed written estimate—completely free." },
  { q: "Are you licensed and insured?", a: "Yes. HomeStar Services & Contracting is fully licensed, bonded, and insured in the state of Indiana. We carry general liability and workers' compensation coverage for your complete protection." },
  { q: "How long does a typical remodel take?", a: "Timelines vary by scope. A bathroom remodel typically takes 2–4 weeks, kitchens 4–8 weeks, and basement finishes 6–12 weeks. We provide a detailed project schedule before work begins." },
  { q: "Do you offer a warranty?", a: "Absolutely. All of our work is backed by a 1-year workmanship warranty. If something's not right, we'll make it right. Lasting results should come standard." },
  { q: "What areas do you serve?", a: "We proudly serve homeowners across Carmel, Fishers, Noblesville, Zionsville, Brownsburg, Pendleton, McCordsville, Fortville, and the greater Hamilton County area." },
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

@media(max-width:900px){.desk{display:none!important}.mob-btn{display:flex!important}}
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
  const links=[{l:"Services",h:"#services"},{l:"Our Process",h:"#process"},{l:"Projects",h:"#projects"},{l:"Videos",h:"#videos"},{l:"Blog",h:"#blog"},{l:"About",h:"#about"},{l:"Contact",h:"#contact"}];

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
          <div style={{background:C.green,width:36,height:36,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="display" style={{color:"#fff",fontSize:19,fontWeight:800,lineHeight:1}}>H</span>
          </div>
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
function Hero(){
  return(
    <section id="hero" style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",background:`linear-gradient(145deg,${C.navyDark} 0%,${C.navy} 45%,${C.navyLight} 100%)`,overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.1) 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:-120,left:-120,width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.06) 0%,transparent 65%)"}}/>
      <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>

      <div style={{maxWidth:1160,margin:"0 auto",padding:"140px 24px 100px",position:"relative",zIndex:2,width:"100%"}}>
        <div style={{maxWidth:680}}>
          <div className="fu d1" style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenMuted,borderRadius:50,padding:"7px 16px",marginBottom:26}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontWeight:700,fontSize:12,letterSpacing:".06em"}}>FAMILY-OWNED • HAMILTON COUNTY, IN</span>
          </div>

          <h1 className="display fu d2" style={{color:"#fff",fontSize:"clamp(36px,5.5vw,66px)",lineHeight:1.06,marginBottom:22}}>
            Transforming Houses<br/>Into <span style={{color:C.green}}>Dream Homes</span>
          </h1>

          <p className="fu d3" style={{color:"rgba(255,255,255,.6)",fontSize:18,lineHeight:1.7,maxWidth:520,marginBottom:36}}>
            From top-notch home remodeling to routine maintenance, we bring skill, care, and a splash of fun to every project in Hamilton County, Indiana and surrounding communities.
          </p>

          <div className="fu d4" style={{display:"flex",flexWrap:"wrap",gap:14}}>
            <a href="#contact" className="btn-g" style={{fontSize:15,padding:"16px 34px"}}>Get a Free Estimate {I.arrow}</a>
            <a href="#services" className="btn-o">View Our Services</a>
          </div>

          <div className="fu d5" style={{display:"flex",flexWrap:"wrap",gap:36,marginTop:52}}>
            {[{n:"500+",l:"Projects Completed"},{n:"1-Year",l:"Workmanship Warranty"},{n:"4.9★",l:"Google Rating"},{n:"100%",l:"Licensed & Insured"}].map(b=>
              <div key={b.l}><div className="display" style={{color:C.green,fontSize:26,fontWeight:800}}>{b.n}</div><div style={{color:"rgba(255,255,255,.4)",fontSize:12,fontWeight:600,letterSpacing:".03em",marginTop:2}}>{b.l}</div></div>
            )}
          </div>
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
          <h2 className="ttl">Expert Solutions for Every Corner of Your Home</h2>
          <p className="sub" style={{margin:"0 auto"}}>We provide a full range of remodeling and specialty trades designed to enhance your home's beauty, comfort, and value.</p>
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
              <div style={{marginTop:16,color:C.green,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6}}>Discover Our Expertise {I.arrow}</div>
            </div>
          )}
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
          <h2 className="ttl">From Vision to Completion—We Make It Simple</h2>
          <p className="sub" style={{margin:"0 auto"}}>At HomeStar, we believe every great project starts with listening and ends with lasting satisfaction.</p>
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
          <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:8}}>After the Project — We're Still Here for You</h3>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:14,lineHeight:1.7,maxWidth:560,margin:"0 auto 20px"}}>Every project comes with a 1-year workmanship warranty—because quality should last longer than the final invoice. If something's not right, we'll make it right.</p>
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
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24}}>
          {VIDEOS.map((v,i)=>
            <div key={v.title} className={vis?`fu d${i+1}`:""} style={{borderRadius:14,overflow:"hidden",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",transition:"all .3s",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(92,184,50,.35)";e.currentTarget.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{height:190,background:"linear-gradient(135deg,rgba(92,184,50,.12),rgba(27,42,74,.5))",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(92,184,50,.85)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(92,184,50,.3)"}}>{I.play}</div>
                <div style={{position:"absolute",bottom:10,right:12,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:4}}>{v.dur}</div>
              </div>
              <div style={{padding:"20px 22px"}}>
                <h3 className="display" style={{color:"#fff",fontSize:16,marginBottom:8}}>{v.title}</h3>
                <p style={{color:"rgba(255,255,255,.4)",fontSize:13,lineHeight:1.6}}>{v.desc}</p>
              </div>
            </div>
          )}
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
            <article key={b.title} className={vis?`fu d${i+1}`:""} style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.sand}`,transition:"all .3s",cursor:"pointer"}}
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
    </section>
  );
}

/* ─── Testimonials ─────────────────────────────────── */
function Testimonials(){
  const[ref,vis]=useVis();
  return(
    <section className="sec" style={{background:C.cream}} ref={ref}>
      <div className="sec-in">
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="lab">Trusted by Homeowners</div>
          <h2 className="ttl">What Our Clients Say</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24}}>
          {TESTIMONIALS.map((t,i)=>
            <div key={t.name} className={vis?`fu d${i+1}`:""} style={{padding:32,borderRadius:14,background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,.04)",position:"relative"}}>
              <div style={{position:"absolute",top:20,right:24,fontSize:50,fontFamily:"Georgia,serif",color:C.sand,lineHeight:1}}>"</div>
              <div style={{display:"flex",gap:2,marginBottom:16}}>{Array.from({length:t.rating}).map((_,j)=><span key={j}>{I.star}</span>)}</div>
              <p style={{color:C.grayDark,fontSize:14,lineHeight:1.75,marginBottom:22,fontStyle:"italic"}}>"{t.text}"</p>
              <div><div style={{fontWeight:700,color:C.navy,fontSize:14}}>{t.name}</div><div style={{color:C.gray,fontSize:12}}>{t.loc}</div></div>
            </div>
          )}
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
            <h2 className="ttl">Your Home. Our Passion.</h2>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:22}}>
              At HomeStar Services and Contracting, we don't just work on houses—we transform them into dream homes. Proudly family-owned and locally operated, we're here to help you love where you live.
            </p>
            <p style={{color:C.gray,fontSize:15,lineHeight:1.8,marginBottom:28}}>
              Founded by longtime friends <strong style={{color:C.navy}}>Robb and Eric</strong>—bringing together their experience in real estate and small business to serve families with honesty, integrity, and heart. At HomeStar, you're not just another job—you're part of the family.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {["Licensed, Bonded & Insured","1-Year Workmanship Warranty","Transparent, Honest Pricing","Customer-First Communication","Clean Job Sites Always","On-Time Completion"].map(item=>
                <div key={item} style={{display:"flex",alignItems:"center",gap:8}}>{I.check}<span style={{fontSize:13,fontWeight:600,color:C.grayDark}}>{item}</span></div>
              )}
            </div>
          </div>
          <div className={vis?"sl d2":""} style={{height:440,borderRadius:16,background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 14px,rgba(255,255,255,.5) 14px,rgba(255,255,255,.5) 15px)"}}/>
            <div style={{textAlign:"center",color:"rgba(255,255,255,.25)"}}>
              <div style={{fontSize:44,marginBottom:10}}>📸</div>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:".08em"}}>ROBB & ERIC<br/>TEAM PHOTO</div>
            </div>
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
  const[sent,setSent]=useState(false);
  return(
    <section id="contact" className="sec" style={{background:`linear-gradient(145deg,${C.navyDark},${C.navy})`,position:"relative",overflow:"hidden"}} ref={ref}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:70,background:C.cream,clipPath:"polygon(0 0,100% 0,100% 100%)"}}/>
      <div style={{position:"absolute",top:-80,right:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(92,184,50,.08) 0%,transparent 70%)"}}/>
      <div className="sec-in" style={{position:"relative",zIndex:2}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:56}}>
          <div className={vis?"fu d1":""}>
            <div className="lab">Get Started</div>
            <h2 className="ttl ttl-w">Ready to Love Your<br/>Home Again?</h2>
            <p style={{color:"rgba(255,255,255,.5)",fontSize:15,lineHeight:1.8,marginBottom:36,maxWidth:420}}>
              Whether you're planning a full remodel or just need a little extra help around the house, HomeStar is here to make it easy. Contact us today for a free estimate and discover how we can bring your vision to life.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:22}}>
              {[{icon:I.phone,label:"(317) 279-4798",sub:"Mon–Fri 7am–6pm, Sat 8am–2pm"},{icon:I.mail,label:"info@thehomestarservice.com",sub:"We respond within 24 hours"},{icon:I.pin,label:"Hamilton County, Indiana",sub:"Carmel • Fishers • Westfield • Noblesville • Zionsville"}].map(c=>
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
          <div className={vis?"sl d2":""} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:36}}>
            {sent?
              <div style={{textAlign:"center",padding:"56px 0"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:C.greenMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="32" height="32" fill="none" stroke={C.green} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
                <h3 className="display" style={{color:"#fff",fontSize:22,marginBottom:10}}>Thank You!</h3>
                <p style={{color:"rgba(255,255,255,.5)",fontSize:14}}>We'll be in touch within 24 hours to discuss your project.</p>
              </div>
            :<>
              <h3 className="display" style={{color:"#fff",fontSize:20,marginBottom:6}}>Request a Free Estimate</h3>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:13,marginBottom:24}}>Fill out the form and we'll get back to you quickly.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[{ph:"Full Name",t:"text"},{ph:"Phone Number",t:"tel"},{ph:"Email Address",t:"email"}].map(f=>
                  <input key={f.ph} type={f.t} placeholder={f.ph} style={{padding:"13px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.03)",color:"#fff",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",transition:"border-color .2s"}}
                    onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}/>
                )}
                <select style={{padding:"13px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.03)",color:"rgba(255,255,255,.45)",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",appearance:"none"}}>
                  <option value="">Select Service Type</option>
                  {SVC.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}
                </select>
                <textarea placeholder="Tell us about your project..." rows={3} style={{padding:"13px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.03)",color:"#fff",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",resize:"vertical",transition:"border-color .2s"}}
                  onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}/>
                <button className="btn-g" style={{width:"100%",justifyContent:"center",padding:"15px",fontSize:15}} onClick={()=>setSent(true)}>Send Request {I.arrow}</button>
                <p style={{color:"rgba(255,255,255,.25)",fontSize:11,textAlign:"center"}}>No spam. No obligation. Just a conversation about your project.</p>
              </div>
            </>}
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
              <div style={{background:C.green,width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><span className="display" style={{color:"#fff",fontSize:17,fontWeight:800}}>H</span></div>
              <div><div className="display" style={{color:"#fff",fontSize:14,fontWeight:800}}>HOMESTAR</div><div style={{color:C.green,fontSize:8,fontWeight:700,letterSpacing:".1em"}}>SERVICES & CONTRACTING</div></div>
            </div>
            <p style={{color:"rgba(255,255,255,.3)",fontSize:12,lineHeight:1.7,maxWidth:260}}>We make home remodeling projects simple and stress-free for families across Hamilton County, Indiana. Expert craftsmanship, honest pricing, and a 1-year workmanship warranty.</p>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"HomeStar Services & Contracting",description:"Family-owned home remodeling company serving Hamilton County, Indiana. Kitchen & bath remodeling, basement finishing, flooring, painting, decks & outdoor living.",url:"https://www.thehomestarservice.com",telephone:"+1-317-279-4798",address:{"@type":"PostalAddress",addressLocality:"Carmel",addressRegion:"IN",addressCountry:"US"},geo:{"@type":"GeoCoordinates",latitude:39.9784,longitude:-86.1180},areaServed:[{name:"Carmel"},{name:"Fishers"},{name:"Westfield"},{name:"Noblesville"},{name:"Zionsville"},{name:"Brownsburg"},{name:"Pendleton"},{name:"McCordsville"},{name:"Fortville"}].map(c=>({"@type":"City",...c})),aggregateRating:{"@type":"AggregateRating",ratingValue:"4.9",reviewCount:"127"},openingHours:["Mo-Fr 07:00-18:00","Sa 08:00-14:00"],priceRange:"$$",sameAs:["https://www.facebook.com/people/HomeStar-Services-and-Contracting/61568970834535/","https://www.instagram.com/thehomestarservice/"],founder:[{"@type":"Person",name:"Robb"},{"@type":"Person",name:"Eric"}],hasOfferCatalog:{"@type":"OfferCatalog",name:"Home Remodeling Services",itemListElement:SVC.map((s,i)=>({"@type":"Offer",itemOffered:{"@type":"Service",name:s.title,description:s.desc}}))}})}}/>
      <Nav/>
      <Hero/>
      <Services/>
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
