# Music library

Beds for Reels. Files live in `Pending/music/` (gitignored - audio stays out of the repo).

**Licensing:** "Quiet Neon" is Eric's own Mureka track and is unconstrained. The rest
were added by Eric on 2026-09-03 and are assumed to be his own generated tracks too -
**worth confirming before any of them go anywhere other than Meta.** Meta Sound Collection
audio is licensed for Meta surfaces only and must never be used on a cut that also has to
serve YouTube or the website.

## Best 20-second window per track

Scored as mean level minus level variation, so a loud but lurching window loses to a
slightly quieter, steadier one. `intro` is how far the first 6 seconds sit under the
track average - a large negative number means starting at 0 would open the Reel almost
silent, which is exactly the trap Quiet Neon sets.

| track | length | LUFS | true peak | best start | window mean | spread | intro vs avg |
|---|---|---|---|---|---|---|---|
| `Arco d_Avanguardia.mp3` | 198s | -9.8 | 0.2 | **69.2s** | -10.7 dB | 1.1 | -8.9 dB |
| `Before _ After (1).mp3` | 179s | -11.9 | -0.3 | **83.8s** | -12.2 dB | 1.4 | -3.7 dB |
| `Before _ After.mp3` | 168s | -12.5 | -0.2 | **92.5s** | -12.6 dB | 1.3 | -1.0 dB |
| `Brisa de Nylon (1).mp3` | 188s | -11.7 | -0.2 | **59.2s** | -12.7 dB | 1.3 | -1.6 dB |
| `Brisa de Nylon.mp3` | 183s | -11.1 | -0.2 | **48.8s** | -12.2 dB | 1.2 | -2.0 dB |
| `Quiet Neon.mp3` | 171s | -12.2 | -0.2 | **69.2s** | -12.5 dB | 1.7 | -11.9 dB |

## How to use

In a reel builder set `MUSIC_START` to the **best start** above and keep the existing
two-pass `loudnorm` to -20 LUFS. Always verify the finished mix per-second from decoded
PCM rather than trusting integrated loudness - an average happily reports a healthy
number for a file that is silent for its last two seconds.
