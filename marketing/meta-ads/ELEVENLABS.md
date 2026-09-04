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

---

## Eric's cloned voice — created 2026-09-03

**`voice_id: 12958d49-c447-4ff2-94e2-ee2398acfdd8`, `voice_type: element`**, name
"Eric Farr - HomeStar". Status completed and audio-eligible on creation, usable immediately.

Use it with `generate_audio`, `model: text2speech_v2`, `variant: elevenlabs`,
`voice_type: "element"`, and that voice_id.

**Source prep matters, and less is more.** The memo was 3.1 minutes at -19.6 LUFS, mono 48 kHz,
78% speech, no clipping - good material. It was trimmed to 168s to sit inside the three-minute
ceiling, starting 0.4s in where speech actually begins.

Nothing else was done to it. A first attempt applied a limiter for peak headroom and that was
wrong twice over: cloning wants natural dynamics rather than a flattened signal, and the limiter
actually *raised* true peak from -0.53 to -0.24 dBTP because MP3 encoding introduces inter-sample
overshoot. The version used is a straight trim, transcoded to MP3 only because the signed upload
URL expects `audio/mpeg` and sending M4A bytes under that label would likely fail to decode.

The clone read the same script in **12.75s** against 15.65s for the Reid preset - noticeably
brisker, which left room to start the voiceover at 2.2s and still finish well clear of the end
card at 17.87s.

### Voiceover mix — three bugs worth remembering

Eric flagged that the voice started and stopped abruptly. Fixing that surfaced two worse faults
that a loudness measurement had hidden.

**1. The voice had no fades.** It cut in and out at full level. Now 0.15s in and 0.35s out - short
enough not to swallow the first or last word.

**2. The duck slammed, then dug a hole.** At `ratio=8, threshold=0.02` the bed dropped to about
-40 dB, which is a near-mute rather than space for a voice. It is now `ratio=4, threshold=0.05,
attack=120, release=800`, a 6-8 dB dip, with the sidechain key arriving 0.20s ahead of the voice so
the bed eases down *before* the first word instead of alongside it.

**3. The music died with the voice, and shipped that way.** `sidechaincompress` ends when its
shortest input ends, and the key was the voiceover - so the bed terminated at 14.95s and the file
carried two seconds of digital silence under the end card. **Integrated loudness looked fine**,
because it averaged straight across a dead tail. The fix pads the key with `apad=whole_dur`, and
the final mix is padded and trimmed to the video length as well, so the bed cannot end early again.

**The lesson: for audio, measure the timeline, not the average.** An integrated LUFS figure will
happily report a healthy number for a file that is silent for its last two seconds.

---

## Robb's cloned voice — created 2026-09-04

**`voice_id: b62742ce-5536-49f3-829d-46c6e05d8b94`, `voice_type: element`**, name
"Robb Rice - HomeStar". Completed and audio-eligible on creation.

Use it exactly as Eric's: `generate_audio`, `model: text2speech_v2`, `variant: elevenlabs`,
`voice_type: "element"`, and that voice_id.

Source kept at `Pending/voice/robb-rice-clone-source.mp3` (gitignored with the rest of `Pending/`).

| | source | prepared |
|---|---|---|
| length | 175.0s (2.92 min) | unchanged - inside the 3-minute ceiling, no trim needed |
| speech | 97% of frames, first word at 0.00s | unchanged |
| loudness | -16.5 LUFS | -21.1 LUFS |
| true peak | **+0.11 dBTP** | **-2.13 dBTP** |
| channels | stereo 48 kHz AAC | mono 44.1 kHz MP3 |

### Gain, not limiting - and it took two passes

The source peaks **above full scale** at +0.11 dBTP, so it could not be handed over untouched.

The fix is a **straight -4 dB gain**, which moves the level without altering the shape of anything.
That is a different operation from the limiter tried on Eric's clone, which was wrong twice over:
cloning wants natural dynamics rather than a flattened signal, and the limiter actually *raised*
true peak because MP3 encoding introduces inter-sample overshoot.

**That overshoot is exactly what made this take two passes.** At -2 dB the file measured -0.13 dBTP,
still hot: the MP3 encode had given back roughly 1.8 dB. Measuring after the encode rather than
before it is the only way to know - the arithmetic does not survive the codec.

### First use of Robb's voice — FH, 2026-09-04

`FH-fishers-double-shower--reels-vo-robb.mp4`. Script written to **add** to the on-screen plates
rather than read them aloud:

> Most primary showers get built for one person and used by two. So we ran a second head, a second
> control, and enough room that nobody's standing there waiting their turn.

9.48s of speech from 168 characters. Starts at 1.40s and the last word lands at 10.55s, clear of the
end card at 11.60s.

**A fourth mix bug, on top of the three from Eric's.** The first attempt measured **-22.3 LUFS** -
audible but noticeably quiet, where the comparable Eric mix sat at -16.2. Cause: `amix` applies
**1/n gain by default**, so two inputs come out 6 dB down. `normalize=0` disables it and the limiter
catches any sum overshoot. Result: **-16.3 LUFS, -2.36 dBTP**.

Everything else carried over from Eric's mix unchanged - voice fades 0.15/0.35, sidechain at
ratio=4 threshold=0.05 attack=120 release=800, the key delayed 0.20s ahead of the voice, and
`apad=whole_dur` on both the key and the final mix.

Verified per-half-second rather than by integrated loudness: voice sits -14.7 to -22.6 dB, the bed
continues -18.8 to -31.5 dB after the voice ends, and the tail is alive. **The music-only cut
remains the default**; this exists because Eric asked for Robb on this one specifically.
