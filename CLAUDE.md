# Notes for Claude Code

## Story Series skills (`.claude/skills/`)
Skills: `threejs-story-series`, `story-rule-script`, `code-rig-characters`.
Python deps (once per container): `python3 -m pip install --user faster-whisper "edge-tts>=7"`.

### Rendering in Claude Code cloud sessions
Remotion cannot download its own Chrome here (remotion.media is blocked) and its default
headless shell rejects the proxy CA for Google Fonts. Use the preinstalled Chromium instead —
add these flags to every `npx remotion render` / `npx remotion still`, in place of `--gl=angle`:

```
--gl=swangle --chrome-mode=chrome-for-testing --browser-executable=/opt/pw-browsers/chromium
```

Voice (`tts.py edge` → speech.platform.bing.com) and transcription (faster-whisper model →
huggingface.co) need those hosts in the environment's network allowlist. On a local machine none
of this applies: follow the skill as written.
