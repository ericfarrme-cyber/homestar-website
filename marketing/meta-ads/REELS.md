# Organic Reels + boost — the route around the placement validator

Meta's ad builder cannot publish these videos (see LAUNCH.md: no aspect ratio
satisfies both Instagram Feed and Stories, and placements can't be restricted).
Posting them as Reels and boosting goes through a different flow that never hits
that validator, and changes nothing about the account or the eight live ads.

Both cuts carry Meta Sound Collection tracks. A Reel on Facebook/Instagram is a
Meta platform, so that licence is satisfied. These files still must not go to
YouTube or the website.

## The one step that needs Eric

Meta Business Suite's **Add Video** opens a native OS file picker. There is no
in-page media library and no file input in the DOM, so it cannot be driven
programmatically — the same wall as the ad uploader.

Everything else — captions, cross-posting targets, publish, and the boost — is
doable from here.

## Reel 1 — V1

**File:** `renders/V1-whole-home-three-baths--reels-video-music.mp4`
(1080x1920, 22s, Spacious Fields)

**Caption:**

> Three bathrooms in one Geist home, built by one contractor on one schedule.
>
> Most remodelers subcontract the plumbing and the electrical, then hope the two
> schedules line up. Ours are on our own payroll - which is why a multi-room
> project doesn't turn into three separate jobs.
>
> Whole-home and multi-room renovations across Hamilton County, Indiana.
> Schluter Pro Certified. Free in-home estimates: (317) 279-4798

## Reel 2 — V2

**File:** `renders/V2-entertaining-floor--reels-video-music.mp4`
(1080x1920, 22s, New Diggs)

**Caption:**

> This was storage.
>
> Now it's a custom bar with a kegerator, a shuffleboard court, a home theater
> and a gym - about $150K in Westfield, designed with Dovetail Group.
>
> Finished basements in Hamilton County run $45K to $200K and return 70-75% at
> resale, because you're only paying to finish space you already own.
>
> Free in-home consultations: (317) 279-4798

## Posting target

The composer posts to **HomeStar Services and Contracting AND thehomestarservice**
in one go — Facebook Page (2.1K followers) and Instagram (1.5K) together.

## After posting

Boost each Reel. Budget to match the video campaign thinking: **$20/day split
across the two**, or run them one at a time. Attribution is weaker than the
pixel-tracked campaign — this is reach, which is what CAMPAIGN.md says video is
for.

---

## Posted (2026-08-27)

Both Reels published, crossposted to the Facebook Page and Instagram:

| Reel | Published | Reach at check |
|------|-----------|----------------|
| Three bathrooms in one Geist home... | 3:32pm | 0 |
| This was storage. Now it's a custo... | 3:45pm | 0 |

Meta's copyright check passed on both — the Meta Sound Collection tracks are
clear for this use. Auto-captions on, which matters because Reels are watched
muted.

They went out 13 minutes apart. Eric asked to space them and the request landed
seconds after the second Share. Reach was 0 on both at the time, so pulling one
and reposting tomorrow costs nothing but the click.

## Boost — V1 draft, NOT published

Saved as a draft in the boost flow. Correct already:

- Button **Learn more** -> Website
- **Meta Pixel ON**, ID `275995906389395` — matches the site
- Phone contact `(317) 279-4798`
- **Special Ad Category: Housing left OFF.** Meta recommends it from the page
  category, but that category is for real-estate sales and rentals; it strips
  targeting controls and forces a wider radius. Remodeling services are not
  housing, and the eight live image ads cleared review without it.

Still unset — **do not publish until these are fixed**:

1. **Audience is `Location: United States, Minimum age 18`.** At $7/day this
   would scatter the budget nationwide. Same trap as the video ad set.
2. **Budget is not yet $7/day.**
3. Website URL reverted to bare `thehomestarservice.com` on reload — it needs
   the `#estimate` anchor and `utm_content=V1-reel-boost`.

Stopped because the Business Suite tab degraded again — screenshots timing out,
and the floating Meta AI launcher intercepting clicks aimed at the audience edit
control. Clicking blind next to a Publish button that spends money is not worth
it.
