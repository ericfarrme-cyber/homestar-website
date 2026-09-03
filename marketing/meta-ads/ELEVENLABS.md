# ElevenLabs — what we already have, and what is worth building

### Researched 2026-09-02

## The headline finding: no new connector is needed

**ElevenLabs is already reachable through the Higgsfield connector.** `generate_audio` takes
`model: "text2speech_v2"` with `variant: "elevenlabs"`, and voice cloning is there too via
`create_voice` / `create_voice_from_confirmed_audio`. `list_voices` returns 30+ preset voices.

That was not obvious. The MCP registry search returns nothing for *any* keyword here - including
Higgsfield and Gmail, which are demonstrably connected - so it cannot be used to answer "is X
available". The reliable check is a tool search for the capability itself.

**There is also a standalone option.** ElevenLabs ships an official hosted MCP in the Claude
connectors directory (OAuth, no API key to hand around). Its scope is mostly ElevenAgents - voice
agent management - plus text to speech. The older self-hosted server needs your own API key and
exposes the full audio toolset. Only worth adding if we go after the phone-agent idea below;
everything else is covered by what we have.

## Cost, for scale

| | |
|---|---|
| Text to speech | $0.10 / 1,000 chars (v2/v3), $0.05 (Flash/Turbo) |
| Speech to text (Scribe) | $0.22 / hour |
| Voice changer / isolator | $0.12 / minute |
| Music | $0.15 / minute |
| Dubbing | $0.33-0.50 / minute |

A 20-second Reel voiceover is about 230 characters - roughly **two cents**.

## What is worth integrating, ranked

**1. Auto-captions from Scribe.** Reels are largely watched muted. Our on-screen hook and beat
carry the message, but a voiceover reaches nobody on silent without burned captions. Cheapest item
on the list and the one that changes retention.

**2. A cloned voice for Eric.** A synthetic stock voice narrating *"our licensed trades are on our
own payroll"* is a small authenticity mismatch for a business whose pitch is personal
accountability. Cloning Eric's own voice removes the objection instead of working around it, and
makes every future Reel consistent without a recording session each time. Ten seconds to three
minutes of clean speech is enough.

**3. Transcribe the client testimonial videos.** The strongest strategic fit. The project schema
already carries `testimonialId` for YouTube testimonials. Transcribing them turns video we already
own into crawlable, quotable text on the project pages - which attacks the exact constraint the
whole SEO thesis rests on: AI engines cite text, and our corpus is thin. Same lever as the Houzz
reviews, from an asset that already exists.

**4. A voice agent for missed calls.** Highest revenue impact - a missed call on a $25K bathroom is
expensive - and the highest risk, because it is the first impression on a live prospect. A real
project, not an afternoon, and the one case that justifies adding the hosted MCP.

**Not worth it:** dubbing (one English-speaking county), sound effects, and their music generator -
Mureka covers that already.

## The first voiceover

Script, written to *add* to the on-screen plates rather than read them aloud:

> Most of what makes a bathroom expensive is moving water. Drains, vents, supply lines. Move those,
> and your budget disappears inside the walls. So we left them where they were, and spent it on
> everything you can actually see and touch.

Two preset reads rendered for comparison - Reid (15.65s, starts at 1.60s, lands clear of the end
card) and Grady (19.23s, starts at 0.60s, runs slightly under the card).

**Mix.** The music bed is sidechain-ducked by the voice rather than dropped by a fixed envelope, so
it follows the actual phrasing. Voice normalised to -16 LUFS, bed already at -20. Finished files
measure -16.2 LUFS integrated with true peak under -3.6 dBTP; Meta normalises to about -14 on
playback, so this lands right.

**Not posted.** These are drafts pending a voice choice, and the scheduled Reel remains the
music-only cut.
