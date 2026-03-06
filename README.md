# HomeStar Services & Contracting — Website

Your new website, ready to deploy on Vercel.

---

## QUICK DEPLOY (15 minutes, no coding needed)

### Step 1: Create Free Accounts (5 min)

1. **GitHub** — Go to [github.com](https://github.com) and sign up (free)
2. **Vercel** — Go to [vercel.com](https://vercel.com) and sign up with your GitHub account (free)

### Step 2: Upload This Project to GitHub (5 min)

1. Log into GitHub
2. Click the **+** button (top right) → **New repository**
3. Name it `homestar-website`
4. Keep it **Private**
5. Click **Create repository**
6. On the next screen, click **"uploading an existing file"**
7. Drag and drop ALL the files from this folder (everything inside `homestar-site/`)
8. Click **Commit changes**

> **Important:** Make sure you upload the files *inside* the folder, not the folder itself.
> Your repo should show: `package.json`, `vite.config.js`, `index.html`, `src/`, `public/` at the top level.

### Step 3: Deploy on Vercel (5 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `homestar-website` repository
3. Vercel auto-detects it's a Vite project — leave all settings as default
4. Click **Deploy**
5. Wait ~60 seconds. Done! You'll get a live URL like: `homestar-website.vercel.app`

That's it. Your site is live.

---

## HOW TO MAKE CHANGES

### Option A: Edit directly on GitHub (easiest)
1. Go to your repository on GitHub
2. Navigate to `src/App.jsx`
3. Click the pencil icon to edit
4. Make your changes
5. Click **Commit changes**
6. Vercel automatically rebuilds and deploys (takes ~30 seconds)

### Option B: Edit locally on your computer (more control)
1. Install [Node.js](https://nodejs.org) (LTS version)
2. Install [VS Code](https://code.visualstudio.com) (free code editor)
3. Clone your repo: `git clone https://github.com/YOUR-USERNAME/homestar-website.git`
4. Open the folder in VS Code
5. Open a terminal and run:
   ```
   npm install
   npm run dev
   ```
6. Your site opens at `http://localhost:5173` — changes update live as you edit
7. When happy, commit and push to GitHub — Vercel deploys automatically

---

## ADDING YOUR REAL PHOTOS

Replace the placeholder project images in `src/App.jsx`:

1. Download your photos from the image URLs listed in the backup document
2. Add them to the `public/images/` folder (create it if needed)
3. In `App.jsx`, find the project cards and replace the gradient placeholder `<div>` with:
   ```jsx
   <img src="/images/your-photo-name.jpg" alt="Kitchen remodel in Carmel IN"
        style={{width:"100%",height:210,objectFit:"cover"}} />
   ```

> **SEO tip:** Always include descriptive alt text with your city name, like
> "bathroom remodel in Fishers Indiana" — this helps Google Image search.

---

## CONNECTING YOUR REAL DOMAIN

When you're ready to switch from `homestar-website.vercel.app` to `thehomestarservice.com`:

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add `thehomestarservice.com` and `www.thehomestarservice.com`
3. Vercel gives you DNS records (usually an A record and CNAME)
4. Log into your domain registrar (GoDaddy, Namecheap, etc.)
5. Update DNS records to match what Vercel tells you
6. Wait 1-48 hours for DNS to propagate
7. Vercel automatically sets up free SSL (HTTPS)

---

## ADDING A BLOG (future)

This React site is great for a landing page, but for an ongoing blog with easy photo uploads,
you may eventually want to add a headless CMS like:

- **Sanity.io** (free tier) — great for small businesses
- **Contentful** (free tier) — popular and well-documented
- **WordPress as headless CMS** — use WordPress just for writing posts, display them on this site

These let you write blog posts in a friendly editor (like Word) without touching code.

---

## FILE STRUCTURE

```
homestar-site/
├── index.html          ← Main HTML with all SEO meta tags
├── package.json        ← Project dependencies
├── vite.config.js      ← Build tool config
├── public/
│   ├── favicon.svg     ← Browser tab icon
│   ├── robots.txt      ← Tells search engines what to crawl
│   └── sitemap.xml     ← Helps Google index all your pages
└── src/
    ├── main.jsx        ← App entry point
    └── App.jsx         ← Your entire website (edit this file)
```

---

## NEED HELP?

- **Vercel docs:** https://vercel.com/docs
- **Vite docs:** https://vitejs.dev/guide/
- **React docs:** https://react.dev

Or come back to Claude and ask — happy to help anytime.
