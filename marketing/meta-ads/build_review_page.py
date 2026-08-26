#!/usr/bin/env python3
"""Generate the creative-review Artifact page from the rendered ads.

Self-contained: builds its own thumbnails and video filmstrips from
renders/, so the page can always be rebuilt after a re-render.

Run build_ads.py and build_video_ads.py first.
"""
import base64, glob, io, os, subprocess, html

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RENDERS = os.path.join(HERE, "renders")

from review_data import CONCEPTS, VIDEOS

# Frames pulled for each video's filmstrip, in seconds.
STRIP_FRAMES = {
    "V1-whole-home-three-baths": [1.5, 7, 12, 15, 20],
    "V2-entertaining-floor": [1.5, 5, 9, 14, 20],
}


def _uri(im, width, quality=76):
    im = im.convert("RGB")
    im.thumbnail((width, width * 4), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def _filmstrip(slug):
    """Pull key frames straight from the encoded ad and lay them side by side."""
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    mp4 = os.path.join(RENDERS, f"{slug}--reels-video.mp4")
    frames = []
    for t in STRIP_FRAMES[slug]:
        out = subprocess.run(
            [ff, "-loglevel", "error", "-ss", str(t), "-i", mp4, "-frames:v", "1",
             "-vf", "scale=300:-1", "-f", "image2pipe", "-vcodec", "mjpeg", "-"],
            capture_output=True, check=True).stdout
        frames.append(Image.open(io.BytesIO(out)))
    w, h, gap = frames[0].width, frames[0].height, 8
    strip = Image.new("RGB", (len(frames) * w + (len(frames) - 1) * gap, h), (12, 18, 30))
    for i, fr in enumerate(frames):
        strip.paste(fr, (i * (w + gap), 0))
    return strip


def build_thumbs():
    t = {}
    for f in sorted(glob.glob(os.path.join(RENDERS, "*.jpg"))):
        t[os.path.basename(f)] = _uri(Image.open(f), 400)
    repo_img = os.path.join(HERE, "..", "..", "public", "images")
    t["orig"] = _uri(Image.open(os.path.join(repo_img, "westfield-basement-masterpiece-1.jpg")), 540)
    t["ai_nano"] = _uri(Image.open(os.path.join(HERE, "higgsfield-tests", "test-nanobanana-basement.jpg")), 440)
    t["upcmp"] = _uri(Image.open(os.path.join(HERE, "higgsfield-tests", "_upscale-compare.jpg")), 540)
    for slug in STRIP_FRAMES:
        t["strip_" + slug[:2]] = _uri(_filmstrip(slug), 1180)
    return t


T = build_thumbs()

PLACEMENTS = [("feed", "Feed", "1080×1350"), ("square", "Square", "1080×1080"),
              ("reels", "Reels / Stories", "1080×1920")]


def concept_html(c):
    num, name, photo, focal, head, primary, mheadline, desc, why, slug = c
    shots = "".join(
        f'''<figure class="shot shot--{key}">
          <img src="{T[f'{slug}--{key}.jpg']}" alt="{html.escape(name)} — {label} placement" loading="lazy">
          <figcaption><span>{label}</span><code>{dim}</code></figcaption>
        </figure>''' for key, label, dim in PLACEMENTS)
    flag = '<span class="focal">Focal</span>' if focal else ""
    return f'''<article class="concept{' concept--focal' if focal else ''}" id="c{num}">
  <header class="concept__head">
    <span class="concept__num">{num}</span>
    <div>
      <h3>{name} {flag}</h3>
      <p class="concept__photo">Photograph — {photo}</p>
    </div>
  </header>
  <div class="concept__body">
    <div class="shots">{shots}</div>
    <div class="copy">
      <p class="why">{why}</p>
      <dl class="fields">
        <dt>On-image headline</dt><dd class="ondeck">{html.escape(head)}</dd>
        <dt>Primary text</dt><dd>{html.escape(primary)}</dd>
        <dt>Meta headline</dt><dd class="mono">{html.escape(mheadline)}</dd>
        <dt>Description</dt><dd class="mono">{desc}</dd>
      </dl>
    </div>
  </div>
</article>'''


def video_html(v):
    num, hook, strip, focal, source, length, why, craft = v
    flag = '<span class="focal">Lead creative</span>' if focal else ""
    return f'''<article class="vid{' vid--focal' if focal else ''}">
  <header class="vid__head">
    <span class="concept__num">{num}</span>
    <div>
      <h3>{html.escape(hook)} {flag}</h3>
      <p class="concept__photo">Cut from <code>{source}</code> &middot; {length} &middot; silent</p>
    </div>
  </header>
  <img class="strip" src="{T[strip]}" alt="Filmstrip of the {num} video ad" loading="lazy">
  <div class="vid__notes">
    <p class="why">{why}</p>
    <p class="craft">{craft}</p>
  </div>
</article>'''


PAGE = f'''<title>HomeStar Meta Creative</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
:root {{
  --ground:#F2F4F8; --surface:#FFFFFF; --surface-2:#E9EDF3;
  --ink:#121A29; --ink-soft:#59637A; --ink-faint:#8A93A6;
  --line:#D9E0EA; --navy:#1B2A4A; --accent:#3B8A1C; --accent-bright:#5CB832;
  --flag:#A93A30; --flag-bg:#F7E9E7;
  --shadow:0 1px 2px rgba(19,26,41,.05), 0 8px 24px rgba(19,26,41,.06);
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --ground:#0C1320; --surface:#141D2E; --surface-2:#1B2639;
    --ink:#E7ECF3; --ink-soft:#95A0B4; --ink-faint:#6C7789;
    --line:#26314A; --navy:#C9D6EA; --accent:#7BD147; --accent-bright:#6FD13C;
    --flag:#E8837A; --flag-bg:#2C1D1C;
    --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.35);
  }}
}}
:root[data-theme="dark"] {{
  --ground:#0C1320; --surface:#141D2E; --surface-2:#1B2639;
  --ink:#E7ECF3; --ink-soft:#95A0B4; --ink-faint:#6C7789;
  --line:#26314A; --navy:#C9D6EA; --accent:#7BD147; --accent-bright:#6FD13C;
  --flag:#E8837A; --flag-bg:#2C1D1C;
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.35);
}}
*,*::before,*::after {{ box-sizing:border-box; }}
body {{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased;
}}
.wrap {{ max-width:1120px; margin:0 auto; padding:0 24px; }}
h1,h2,h3 {{ font-family:'Bricolage Grotesque','Plus Jakarta Sans',sans-serif; text-wrap:balance; margin:0; }}
code,.mono {{ font-family:'IBM Plex Mono',ui-monospace,monospace; }}
a {{ color:var(--accent); }}
:focus-visible {{ outline:2px solid var(--accent-bright); outline-offset:3px; border-radius:3px; }}

.eyebrow {{
  font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
  color:var(--ink-faint); font-family:'IBM Plex Mono',monospace;
}}

/* ── Masthead ── */
.mast {{ padding:64px 0 40px; border-bottom:1px solid var(--line); }}
.mast h1 {{ font-size:clamp(34px,5vw,54px); font-weight:800; line-height:1.04; margin:14px 0 18px; letter-spacing:-.02em; }}
.mast p {{ max-width:62ch; color:var(--ink-soft); font-size:17px; margin:0; }}
.tally {{ display:flex; flex-wrap:wrap; gap:10px 28px; margin-top:28px; }}
.tally div {{ display:flex; align-items:baseline; gap:8px; }}
.tally b {{ font-family:'Bricolage Grotesque',sans-serif; font-size:26px; font-weight:800; color:var(--accent); font-variant-numeric:tabular-nums; }}
.tally span {{ font-size:13px; color:var(--ink-soft); font-weight:600; }}

section {{ padding:56px 0; border-bottom:1px solid var(--line); }}
.sec-head {{ margin-bottom:28px; }}
.sec-head h2 {{ font-size:clamp(24px,3vw,32px); font-weight:800; letter-spacing:-.015em; margin:10px 0 10px; }}
.sec-head p {{ max-width:66ch; color:var(--ink-soft); margin:0; }}

/* ── Verdict / evidence ── */
.verdict {{
  display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:8px;
}}
.card {{
  background:var(--surface); border:1px solid var(--line); border-radius:10px;
  overflow:hidden; box-shadow:var(--shadow);
}}
.card__label {{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:12px 16px; border-bottom:1px solid var(--line); background:var(--surface-2);
}}
.card__label strong {{ font-size:13px; font-weight:700; }}
.tag {{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:600;
  letter-spacing:.08em; text-transform:uppercase; padding:4px 9px; border-radius:4px;
}}
.tag--keep {{ background:color-mix(in srgb, var(--accent) 16%, transparent); color:var(--accent); }}
.tag--kill {{ background:var(--flag-bg); color:var(--flag); }}
.card img {{ display:block; width:100%; height:auto; }}
.card__note {{ padding:14px 16px; font-size:14px; color:var(--ink-soft); margin:0; }}

.garble {{ list-style:none; padding:0; margin:20px 0 0; display:grid; gap:10px; }}
.garble li {{
  display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);
  gap:12px; align-items:center; background:var(--surface); border:1px solid var(--line);
  border-left:3px solid var(--flag); border-radius:8px; padding:11px 14px; font-size:13.5px;
}}
.garble .was {{ color:var(--ink-soft); }}
.garble .arrow {{ color:var(--flag); font-weight:700; }}
.garble .now {{ font-family:'IBM Plex Mono',monospace; color:var(--flag); font-weight:600; word-break:break-word; }}

/* ── Concepts ── */
.concept {{ padding:36px 0; border-top:1px solid var(--line); }}
.concept:first-of-type {{ border-top:0; }}
.concept__head {{ display:flex; gap:16px; align-items:flex-start; margin-bottom:20px; }}
.concept__num {{
  font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600;
  color:var(--accent); border:1px solid var(--line); border-radius:6px;
  padding:5px 9px; flex:none; margin-top:2px;
}}
.concept__head h3 {{ font-size:23px; font-weight:800; letter-spacing:-.01em; }}
.concept__photo {{ margin:3px 0 0; font-size:13px; color:var(--ink-faint); }}
.concept__body {{ display:grid; grid-template-columns:minmax(0,1.05fr) minmax(0,1fr); gap:32px; align-items:start; }}
.shots {{ display:flex; gap:12px; align-items:flex-start; }}
.shot {{ margin:0; flex:1 1 0; min-width:0; }}
.shot img {{
  display:block; width:100%; height:auto; border-radius:7px;
  border:1px solid var(--line); box-shadow:var(--shadow);
}}
.shot figcaption {{
  display:flex; justify-content:space-between; gap:6px; margin-top:7px;
  font-size:10.5px; color:var(--ink-faint); font-family:'IBM Plex Mono',monospace;
}}
.shot--reels {{ flex:0 0 26%; }}

.focal {{
  display:inline-block; vertical-align:middle; font-family:'IBM Plex Mono',monospace;
  font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
  color:var(--accent); background:color-mix(in srgb, var(--accent) 14%, transparent);
  border-radius:4px; padding:4px 8px; margin-left:6px; position:relative; top:-2px;
}}
.concept--focal {{
  background:color-mix(in srgb, var(--accent) 5%, transparent);
  border-radius:12px; padding:30px 24px; margin:8px 0;
  border-top:0; box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent);
}}
.concept--focal + .concept--focal {{ border-top:0; }}

/* ── Video ── */
.vid {{ padding:30px 0; border-top:1px solid var(--line); }}
.vid:first-of-type {{ border-top:0; }}
.vid--focal {{
  background:color-mix(in srgb, var(--accent) 5%, transparent);
  border-radius:12px; padding:30px 24px; border-top:0;
  box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent);
}}
.vid__head {{ display:flex; gap:16px; align-items:flex-start; margin-bottom:18px; }}
.vid__head h3 {{ font-size:22px; font-weight:800; letter-spacing:-.01em; }}
.strip {{
  display:block; width:100%; height:auto; border-radius:8px;
  border:1px solid var(--line); box-shadow:var(--shadow);
}}
.vid__notes {{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:24px; margin-top:18px; }}
.craft {{ margin:0; font-size:14px; color:var(--ink-soft); }}

.why {{ margin:0 0 18px; font-size:15px; color:var(--ink); border-left:2px solid var(--accent-bright); padding-left:14px; }}
.fields {{ margin:0; display:grid; gap:4px; }}
.fields dt {{
  font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); margin-top:12px;
}}
.fields dd {{ margin:0; font-size:14px; color:var(--ink-soft); }}
.fields dd.ondeck {{ color:var(--ink); font-weight:600; }}
.fields dd.mono {{ font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:var(--ink); }}

/* ── Run notes ── */
.notes {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px; margin-top:6px; }}
.note {{ background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:18px 20px; box-shadow:var(--shadow); }}
.note h4 {{ margin:0 0 8px; font-family:'Bricolage Grotesque',sans-serif; font-size:15px; font-weight:800; }}
.note p {{ margin:0; font-size:14px; color:var(--ink-soft); }}
.note ul {{ margin:0; padding-left:18px; font-size:14px; color:var(--ink-soft); }}
.note li + li {{ margin-top:5px; }}
pre {{
  background:var(--surface-2); border:1px solid var(--line); border-radius:8px;
  padding:13px 15px; overflow-x:auto; font-family:'IBM Plex Mono',monospace;
  font-size:12.5px; margin:14px 0 0; color:var(--ink);
}}
footer {{ padding:34px 0 60px; color:var(--ink-faint); font-size:13px; }}

@media (max-width:860px) {{
  .verdict, .concept__body {{ grid-template-columns:1fr; }}
  .garble li {{ grid-template-columns:1fr; gap:4px; }}
  .garble .arrow {{ display:none; }}
}}
@media (prefers-reduced-motion:reduce) {{ *{{animation:none!important;transition:none!important}} }}
</style>

<div class="wrap">
<header class="mast">
  <p class="eyebrow">Creative review · 26 August 2026</p>
  <h1>Whole-home leads. Nine still concepts and two videos behind it.</h1>
  <p>Twenty-seven images across Facebook &amp; Instagram feed, square and Reels, plus two Reels cuts from the project walkthroughs — all built on HomeStar's own footage and photography, and on claims already published at thehomestarservice.com. Higgsfield was tested for this and given a narrower job.</p>
  <div class="tally">
    <div><b>27</b><span>images</span></div>
    <div><b>2</b><span>video ads</span></div>
    <div><b>4</b><span>whole-home variants</span></div>
    <div><b>0</b><span>AI-altered photographs</span></div>
  </div>
</header>

<section>
  <div class="sec-head">
    <p class="eyebrow">The decision</p>
    <h2>Higgsfield redraws the room. So it doesn't get to touch the room.</h2>
    <p>Both image models were given the Westfield basement photo with an explicit instruction not to alter it. Both rebuilt it from scratch — plausible at a glance, wrong everywhere it counts. You sell completed work to people who will stand in that room, so the photograph is the proof, and proof can't be regenerated.</p>
  </div>
  <div class="verdict">
    <div class="card">
      <div class="card__label"><strong>The actual photograph</strong><span class="tag tag--keep">Ships</span></div>
      <img src="{T['orig']}" alt="Original Westfield basement photograph as shot">
      <p class="card__note">Westfield Masterpiece, as photographed. The framed poster is <em>The Book of Mormon</em>; the table reads STIGA.</p>
    </div>
    <div class="card">
      <div class="card__label"><strong>Nano Banana Pro</strong><span class="tag tag--kill">Rejected</span></div>
      <img src="{T['ai_nano']}" alt="AI-regenerated version of the basement with corrupted detail">
      <p class="card__note">Clean typography — and a room that no longer exists. Wall art, bottle labels and geometry all reinvented.</p>
    </div>
  </div>
  <ul class="garble">
    <li><span class="was">Poster: “The Book of Mormon — The Best Musical of This Century”</span><span class="arrow">→</span><span class="now">HBKN · TAB AOFT CBVGJUS OF THE CUBTGIG</span></li>
    <li><span class="was">Same poster, Marketing Studio model</span><span class="arrow">→</span><span class="now">MBRM.N · THE BEST MUGICAL OF THIS CONTURY</span></li>
    <li><span class="was">Ping-pong table brand: STIGA</span><span class="arrow">→</span><span class="now">/TIGA · nGISTGVN</span></li>
    <li><span class="was">Requested headline copy, verbatim</span><span class="arrow">→</span><span class="now">YOUR BASEMENT IS 1,200 SQ FT SQ FT YOU ALREADY OWN</span></li>
  </ul>

  <div class="sec-head" style="margin-top:44px">
    <p class="eyebrow">The narrower job</p>
    <h2>Where it earns its keep: resolution, not invention.</h2>
    <p>The Westfield Masterpiece set is the strongest basement content in the library and the only set too small for a feed ad — 1080×720. Higgsfield's upscaler took it to 4096×2737 without reinventing anything, and concept 07 renders from that file.</p>
  </div>
  <div class="card">
    <div class="card__label"><strong>1080×720 original above · 4096×2737 upscale below</strong><span class="tag tag--keep">In production</span></div>
    <img src="{T['upcmp']}" alt="Detail comparison of original and upscaled photograph">
    <p class="card__note">Same ceiling planks, same flag, same fixtures, same window — wood grain genuinely resolves rather than being invented.</p>
  </div>
</section>

<section>
  <div class="sec-head">
    <p class="eyebrow">Video</p>
    <h2>Two walkthroughs, cut for Reels.</h2>
    <p>Both source files are already 1080&times;1920, so nothing is reframed or generated — the same rule as the stills. Each runs hook &rarr; footage &rarr; brand end card. Filmstrips below; the MP4s are in <code>renders/</code>.</p>
  </div>
  {''.join(video_html(v) for v in VIDEOS)}
  <div class="note" style="margin-top:24px">
    <h4>Both ship silent, on purpose</h4>
    <p>The Geist source carries a loud music bed (peaks at &minus;0.6&nbsp;dB) of unknown licence — a rights problem in a paid ad, and Meta may mute or reject it. The Westfield source is silent already at &minus;91&nbsp;dB. Add a track from Meta's own royalty-free library in Ads Manager, which is cleared for paid placements. Most Reels are watched muted anyway, which is why the hook and end card carry the message on screen.</p>
  </div>
</section>

<section>
  <div class="sec-head">
    <p class="eyebrow">The work</p>
    <h2>Nine still concepts</h2>
    <p>Every figure on these creatives is a range already published on the site. The three whole-home variants run as one ad set so Meta can pick the winner; the rest are ordered by how hard to push them at launch.</p>
  </div>
  {''.join(concept_html(c) for c in CONCEPTS)}
</section>

<section>
  <div class="sec-head">
    <p class="eyebrow">Launch</p>
    <h2>How to run these</h2>
  </div>
  <div class="notes">
    <div class="note"><h4>Objective</h4><p>Leads, optimised to estimate-form submit. Not Traffic — cheap clicks on a $60K purchase are the wrong clicks.</p></div>
    <div class="note"><h4>Audience</h4><p>8–12 mile radius on Carmel, Fishers, Westfield, Zionsville, Noblesville and Geist. Homeowners, 33+. Skip interest stacks on a radius this tight or you'll starve delivery.</p></div>
    <div class="note"><h4>Budget</h4><p>Whole-home is the focal: 45% of spend on the 01 / 01b / 01c / V1 set in one ad set. Give 02 and 06 another 35% between them as the trust plays, and split the rest across 03, 04, 05 and 07.</p></div>
    <div class="note"><h4>Lead with V1</h4><p>Video is the cheapest reach on Reels, and it's the only creative that proves multi-room scope by actually showing it. Start there before scaling the stills.</p></div>
    <div class="note"><h4>Placements</h4><ul><li>Feed 4:5 and Reels 9:16 drive volume</li><li>1:1 is for carousels and right column</li><li>Reels art is checked against Meta's 1500px safe zone on every render</li></ul></div>
  </div>
  <pre>python marketing/meta-ads/build_ads.py        # all 21
python marketing/meta-ads/build_ads.py founders   # one concept</pre>
</section>

<footer>
  Rendered by <code>marketing/meta-ads/build_ads.py</code> from <code>public/images/</code>.
  Copy and account notes in <code>marketing/meta-ads/CAMPAIGN.md</code>.
  Re-render if published pricing changes.
</footer>
</div>
'''

# The artifact wrapper owns <head>, so this file can't declare a charset of its
# own. Emitting pure ASCII with numeric character references means the em-dashes,
# curly quotes and multiplication signs survive whatever encoding the host picks.
PAGE = PAGE.encode("ascii", "xmlcharrefreplace").decode("ascii")

out = os.path.join(HERE, "creative-review.html")
open(out, "w", encoding="ascii").write(PAGE)
print("wrote", out, round(len(PAGE) / 1024 / 1024, 2), "MB")
