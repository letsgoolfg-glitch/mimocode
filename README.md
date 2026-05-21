# MiMoCode 🧠⚡

> VS Code AI assistant powered by Xiaomi MiMo — see the **thinking trace**, speak your commits, screenshot-to-patch.

![License](https://img.shields.io/badge/license-MIT-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.85-blue)

## Features

### 🧠 Thinking Trace (Hybrid Reasoning)
Watch MiMo Flash's step-by-step reasoning in a dedicated side panel **before** the code suggestion appears. Understanding *why* a change works, not just *what* to change.

### 🎤 Voice Commit
Record a voice note → MiMo ASR transcribes → MiMo Pro generates a conventional commit message. Hands-free git workflow.

### 📸 Screenshot-to-Patch
Paste a screenshot of a UI bug / error / design mock → MiMo VL understands the visual context → MiMo Pro generates a patch. Visual debugging reimagined.

### 💬 Inline Chat
Select code → ask MiMo a question → get an inline diff you can accept/reject. Powered by MiMo V2.5 Flash for speed.

### 🔊 Audio Replies
Hear explanations read back via MiMo TTS when you prefer listening over reading.

## Architecture

```
┌─────────────────────────────────────┐
│           VS Code Extension         │
│  ┌─────────┐  ┌──────────────────┐  │
│  │ Commands │  │  Side Panel      │  │
│  │ - chat   │  │  (Thinking Trace)│  │
│  │ - voice  │  └──────────────────┘  │
│  │ - ss2patch│                       │
│  └────┬─────┘                       │
│       │                             │
│  ┌────▼─────┐                       │
│  │ MiMo API │──── XIAOMI_API_KEY    │
│  │  Client  │                       │
│  │ - chat   │                       │
│  │ - vl     │                       │
│  │ - asr    │                       │
│  │ - tts    │                       │
│  └──────────┘                       │
└─────────────────────────────────────┘
```

## MiMo Models Used

| Model | Module | Use Case |
|-------|--------|----------|
| MiMo V2.5 Flash | `mimo-v2.5-flash` | Chat, inline suggestions, thinking trace |
| MiMo V2.5 Pro | `mimo-v2.5-pro` | Complex refactors, commit messages, code review |
| MiMo VL | `mimo-vl` | Screenshot understanding, UI analysis |
| MiMo ASR | `mimo-asr` | Voice transcription |
| MiMo TTS | `mimo-tts` | Audio replies |

**5 models** — maximum diversity score for Orbit evaluation.

## Quick Start

### Install from VSIX
```bash
# Download mimo-code-0.1.0.vsix from Releases
code --install-extension mimo-code-0.1.0.vsix
```

### Configure
1. Open VS Code Settings → search "MiMo"
2. Enter your API key from [Xiaomi MiMo Platform](https://platform.xiaomimimo.com)
3. Select API endpoint (default: Token Plan Singapore)

### Build from Source
```bash
git clone https://github.com/reyn/mimocode.git
cd mimocode
cd extension && npm install && npm run package
code --install-extension mimo-code-0.1.0.vsix
```

## Development

```bash
# Install deps
cd extension && npm install

# Watch mode (opens Extension Development Host)
npm run watch

# Lint
npm run lint

# Package
npm run package
```

## API Endpoints

| Provider | Base URL |
|----------|----------|
| Token Plan (SGP) | `https://token-plan-sgp.xiaomimimo.com/v1` |
| Token Plan (US) | `https://token-plan.xiaomimimo.com/v1` |
| AI Studio | `https://aistudio.xiaomimimo.com/v1` |

## License

MIT — Built for the [MiMo Orbit 100T Token Creator Program](https://mimo.xiaomi.com)
