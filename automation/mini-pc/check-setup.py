#!/usr/bin/env python3
"""Preflight for the mini PC. Checks the things that actually break, and nothing else.

Publishes nothing, changes nothing, spends nothing. Safe to run any time - and worth
running after any token change, since a stale token fails silently until a reel is due.

    python check-setup.py

Exits non-zero if anything failed, so it can be wired into a scheduled task later.
"""
import json
import os
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
META = os.path.join(REPO, "marketing", "meta-ads")

results = []


def check(name, fn, advisory=False):
    """Run one check. A check returns (ok, detail) or raises.

    advisory=True reports the problem but does not fail the run - for things that are
    wrong on a dedicated box yet perfectly normal on the laptop you are reading this
    from. A preflight that cries wolf on a healthy machine stops being read.
    """
    try:
        ok, detail = fn()
    except Exception as exc:                      # a crashed check is a failed check
        ok, detail = False, "%s: %s" % (type(exc).__name__, exc)
    label = "OK" if ok else ("WARN" if advisory else "FAIL")
    results.append((ok or advisory, name, detail))
    print("  %-4s %-30s %s" % (label, name, detail))
    return ok


def read_token():
    path = os.path.join(META, ".token")
    if not os.path.exists(path):
        return None, "not found at %s" % path
    with open(path) as fh:
        raw = fh.read()
    token = raw.strip()
    if not token:
        return None, "file is empty"
    if token[0] in "\"'" or "=" in token.split("|")[0][:24]:
        return None, "looks like it has quotes or a NAME= prefix - it should be the raw token only"
    return token, None


def graph(path, params, token):
    url = "https://graph.facebook.com/v25.0/" + path
    if params:
        url += "?" + "&".join("%s=%s" % kv for kv in params.items())
    req = urllib.request.Request(url)
    req.add_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)


print("\nHomeStar mini PC preflight")
print("repo: %s\n" % REPO)

# ── the machine ─────────────────────────────────────────────────────────────
check("python version", lambda: (
    sys.version_info >= (3, 9),
    "%d.%d.%d" % sys.version_info[:3] + ("" if sys.version_info >= (3, 9) else "  - need 3.9+"),
))

check("repo checkout", lambda: (
    os.path.isdir(os.path.join(REPO, ".git")) and os.path.isdir(META),
    REPO if os.path.isdir(os.path.join(REPO, ".git")) else "no .git here - is this a clone?",
))

# Advisory: on the mini PC this must be true, but on Eric's main PC the working
# clone lives under OneDrive and always has. Failing there would train him to
# ignore the output.
check("not inside OneDrive", lambda: (
    "onedrive" not in REPO.lower(),
    "fine" if "onedrive" not in REPO.lower()
    else "under OneDrive - fine on your main PC, but on the mini PC clone to C:\\homestar "
         "instead: two machines syncing one git tree will corrupt it",
), advisory=True)

# ── credentials ─────────────────────────────────────────────────────────────
token, token_err = read_token()
check("token file", lambda: (token is not None, token_err or "present, %d chars" % len(token)))

if token:
    def token_valid():
        data = graph("debug_token", {"input_token": token}, token).get("data", {})
        if not data.get("is_valid", True):
            return False, "Meta says this token is not valid - it was probably regenerated elsewhere"
        expires = data.get("expires_at", 0)
        scopes = data.get("scopes", [])
        need = "instagram_content_publish"
        detail = "%s, expires: %s, %d scopes" % (
            data.get("type", "?"), "never" if expires == 0 else expires, len(scopes))
        if need not in scopes:
            return False, detail + "  - missing %s, reels cannot publish" % need
        return True, detail

    check("token valid with Meta", token_valid)

    check("Instagram account reachable", lambda: (
        True,
        "@" + graph("17841470404585555", {"fields": "username"}, token).get("username", "?"),
    ))

# ── the reel queue ──────────────────────────────────────────────────────────
queue_path = os.path.join(META, "ig-queue.json")
queue = None
if os.path.exists(queue_path):
    with open(queue_path, encoding="utf-8") as fh:
        queue = json.load(fh)["reels"]

check("reel queue parses", lambda: (
    queue is not None,
    "%d reels queued" % len(queue) if queue is not None else "missing %s" % queue_path,
))

if queue:
    def videos_reachable():
        """Instagram fetches each video from this URL. If it 404s, that reel silently fails."""
        bad = []
        for entry in queue:
            req = urllib.request.Request(entry["video_url"], method="HEAD")
            try:
                with urllib.request.urlopen(req, timeout=45) as r:
                    if r.status != 200:
                        bad.append("%s (%d)" % (entry["code"], r.status))
            except Exception as exc:
                bad.append("%s (%s)" % (entry["code"], exc))
        return not bad, "all %d reachable" % len(queue) if not bad else "unreachable: " + ", ".join(bad)

    check("queued videos reachable", videos_reachable)

    def captions_present():
        empty = [e["code"] for e in queue if not (e.get("caption") or "").strip()]
        return not empty, "all present" if not empty else "empty caption: " + ", ".join(empty)

    check("captions present", captions_present)

# ── verdict ─────────────────────────────────────────────────────────────────
failed = [name for ok, name, _ in results if not ok]
print()
if failed:
    print("%d of %d checks FAILED: %s" % (len(failed), len(results), ", ".join(failed)))
    print("Fix these before relying on the box. See SETUP.md troubleshooting.")
    sys.exit(1)
print("all %d checks passed - the box is ready" % len(results))
