"""Copy and commentary for the creative-review page.

Kept separate from the page builder so the words can be edited without
touching layout code. Mirrors ADS in build_ads.py and VIDEO_ADS in
build_video_ads.py — if a headline changes there, change it here too.

Concept fields:
    num, name, photo_label, is_focal, on_image_headline,
    primary_text, meta_headline, meta_description, rationale, slug
"""

CONCEPTS = [
    ("01", "One contractor. One schedule. One warranty.", "Geist upper level", True,
     "One contractor. One schedule. One warranty.",
     "Renovating more than one room? Most contractors hand off the trades and hope the schedules line up. Because our plumbers and electricians are in-house, your kitchen, bathrooms, basement and flooring run as one project — one schedule, one point of contact, one warranty. Hamilton County, IN.",
     "One Contractor. One Warranty.", "Whole-home renovation",
     "The focal concept. Highest ticket in the set, and the in-house-trades fact is what makes the promise credible instead of a slogan.",
     "01-whole-home"),

    ("01b", "Four rooms shouldn't mean four schedules", "Zionsville great room", True,
     "Renovating four rooms shouldn't mean four schedules.",
     "A four-room renovation usually means four trades, four schedules and nobody who owns the whole thing. We run it differently: our licensed plumbers and electricians are on our payroll, so your project moves on one calendar with one person accountable for it. Kitchens, baths, basements and flooring across Hamilton County.",
     "Four Rooms, One Schedule", "Multi-room renovation",
     "The only still in the library that shows kitchen, great room and upper landing in a single frame — it proves multi-room scope without needing a caption.",
     "01b-whole-home-schedules"),

    ("01c", "Kitchen, baths, basement — one project", "Zionsville kitchen", True,
     "Your kitchen, your baths, your basement. One project.",
     "Your kitchen, your bathrooms, your basement — planned and built as one project instead of three separate jobs stacked end to end. One point of contact from design through final inspection, permits pulled and paid, and every trade licensed. Free in-home consultations across Hamilton County, Indiana.",
     "One Project, Not Three Jobs", "Design to final inspection",
     "Names the rooms explicitly, for homeowners who do not know “whole-home” is something you can buy.",
     "01c-whole-home-kitchen"),

    ("02", "In-house trades", "Zionsville lower level", False,
     "Your plumber doesn't work for your contractor. Ours does.",
     "Most remodelers subcontract your plumber and your electrician, then hope the two schedules line up. We don't. HomeStar employs its own licensed plumbers and licensed electricians, so your project runs on one schedule, with one point of contact, and one warranty behind all of it. Family-owned in Fishers. Free in-home estimates across Hamilton County.",
     "Our Licensed Trades Are In-House", "Free estimate · Hamilton County",
     "The sharpest wedge you have. Almost no remodeler in Hamilton County can say it, and it turns “who do I trust” into a factual claim a competitor cannot copy.",
     "02-in-house-trades"),

    ("03", "Basement square footage", "Zionsville media lounge", False,
     "You already own the square footage.",
     "The cheapest square footage you will ever add is already under your house. The foundation, walls and roof exist — you're only paying to finish the inside. Finished basements in Hamilton County run $45K–$200K, recoup 70–75% at resale, and add 600–1,500+ sq ft. We handle design, permits, licensed trades and inspections.",
     "Finish The Space You Already Own", "$45K–$200K · Real numbers",
     "Sells the idea before the service, so it reaches homeowners who were not yet shopping for a contractor.",
     "03-basement-sqft"),

    ("04", "25-year waterproofing", "Geist blue-tile bath", False,
     "A 25-year warranty on the part you'll never see.",
     "Every bathroom failure starts somewhere you can't see. HomeStar is Schluter Pro Certified, so the waterproofing behind your tile carries a 25-year warranty — plus our own 1-year workmanship warranty on the whole project. Walk-in showers, wet rooms, heated floors, custom vanities. Free in-home estimates.",
     "25-Year Waterproofing Warranty", "Schluter Pro Certified",
     "Names the exact fear — water behind tile — and answers it with a certification. The best-matched image in the set.",
     "04-waterproofing-warranty"),

    ("05", "Price transparency", "Zionsville wet bar", False,
     "Most contractors won't put a number on it. Here's ours.",
     "Most contractors won't give you a number until they're standing in your kitchen. Here are ours, in public: bathrooms $15K–$50K. Kitchens from $25K. Basements $45K–$200K. Every estimate is itemized, every permit is pulled and paid, and every trade is licensed. If your budget doesn't fit, we'll tell you on the phone instead of wasting your Saturday.",
     "Real 2026 Remodeling Prices", "Itemized · No surprises",
     "Publishing real ranges is rare in this trade. It doubles as a qualifier — it filters out the $8K-budget enquiries before they cost you a truck roll.",
     "05-price-transparency"),

    ("06", "Who we are", "Eric &amp; Robb", False,
     "HomeStar is two friends from Fishers with a licensed crew of their own.",
     "HomeStar Services &amp; Contracting is a family-owned remodeling company in Fishers, Indiana. Eric Farr and Robb Rice founded it after 20 years of friendship, and they still walk every estimate personally. We do kitchens, bathrooms, basements and whole-home renovations across Hamilton County — and unlike most remodelers, our plumbers and electricians are on our payroll rather than subcontracted. 5.0 on Google.",
     "A Fishers Remodeler, Owner-Run", "Family-owned · Hamilton County",
     "Rewritten. The first version opened “Two friends of 20 years” — which only lands if you already know the brand. This one names the company, the place and the difference before asking for trust.",
     "06-who-we-are"),

    ("07", "The entertaining floor", "Westfield Masterpiece", False,
     "The best room in the house was the one nobody used.",
     "This was an unfinished basement. Now it's a custom bar with a kegerator, a home theater, a gym, tongue-and-groove ceilings and a 14-foot stained red oak mantle over the fireplace — about $150K in Westfield, designed with Dovetail Group. Your lower level is the cheapest square footage you will ever add. Free in-home consultations across Hamilton County.",
     "From Storage To The Best Room", "Westfield, IN · ~$150K",
     "Flagship project and best imagery, rendered from the Higgsfield upscale. Sells the dream rather than the service.",
     "07-entertaining-floor"),
]

# num, hook, strip_key, is_focal, source_file, length, why, craft_note
VIDEOS = [
    ("V1", "Three bathrooms. One house. One contractor.", "strip_V1", True,
     "geist-three-bath-video.mp4", "~22s",
     "The strongest asset in the set, and the lead creative for the focal concept. Three visibly different bathrooms in eighteen seconds is multi-room proof that no single photograph can make.",
     "An earlier cut spent twelve seconds in one dark-tile room, which quietly broke the headline's own claim. This one moves maple vanity → dark-tile wet area → marble double vanity."),

    ("V2", "This was storage.", "strip_V2", False,
     "westfield-basement-masterpiece-video.mov", "~22s",
     "Before-and-after compressed into three words, over footage of the flagship build. Pairs with concept 07.",
     "The gym and the fireplace wall were both cut — they read as near-black on a phone in daylight, which is where Reels is actually watched."),
]
