# MiMoCode — VS Code AI Assistant with Thinking Trace

**Project:** MiMoCode
**Category:** Developer Tools / IDE Extension
**License:** MIT
**GitHub:** https://github.com/reyn/mimocode
**Live Demo:** https://web-ruby-tau-77.vercel.app

---

## 1. What is MiMoCode?

MiMoCode is a VS Code extension that brings Xiaomi MiMo's AI models directly into the editor — with a unique **hybrid thinking trace** that lets developers see the step-by-step reasoning behind every code suggestion before it appears.

Unlike other AI coding tools (Copilot, Cursor, Cody), MiMoCode shows the **"why"** — not just the **"what"**.

## 2. Problem Statement

Current AI coding assistants produce suggestions as black boxes. Developers accept or reject code without understanding the reasoning. This leads to:
- Blind acceptance of suggestions (code smell risk)
- Inability to learn from AI suggestions
- No visibility into failure modes or edge case handling
- Trust issues in production environments

## 3. Solution: Thinking Trace + Multimodal

MiMoCode solves this with **5 MiMo models** working together:

| Feature | MiMo Model | What It Does |
|---------|-----------|--------------|
| **Thinking Trace** | MiMo V2.5 Flash | Shows step-by-step reasoning in a side panel before the code suggestion appears |
| **Code Suggestions** | MiMo V2.5 Pro | Deep refactors, complex code generation, commit messages |
| **Screenshot-to-Patch** | MiMo VL | Paste a UI bug screenshot → VL analyzes visual context → Pro generates fix |
| **Voice Commit** | MiMo ASR | Speak your changes → ASR transcribes → Pro generates conventional commit |
| **Audio Replies** | MiMo TTS | Hear explanations read back when preferred over reading |

## 4. Technical Architecture

```
┌─────────────────────────────────────┐
│           VS Code Extension         │
│  ┌─────────┐  ┌──────────────────┐  │
│  │ Commands │  │  Side Panel      │  │
│  │ - chat   │  │  (Thinking Trace)│  │
│  │ - voice  │  │  ┌────────────┐  │  │
│  │ - ss2patch│  │  │ 🧠 Flash   │  │  │
│  │ - fix    │  │  │ reasoning  │  │  │
│  └────┬─────┘  │  ├────────────┤  │  │
│       │        │  │ ✨ Pro     │  │  │
│  ┌────▼─────┐  │  │ code fix   │  │  │
│  │ MiMo API │  │  └────────────┘  │  │
│  │  Client  │  └──────────────────┘  │
│  │ - chat   │                       │
│  │ - vl     │──── XIAOMI_API_KEY    │
│  │ - asr    │                       │
│  │ - tts    │                       │
│  └──────────┘                       │
└─────────────────────────────────────┘
```

### API Client
- TypeScript `MiMoClient` class with streaming SSE support
- Handles hybrid reasoning (`reasoning_content` delta field) for thinking trace
- Configurable endpoints: Token Plan SGP, US, AI Studio
- Graceful degradation: TTS/ASR 404 → user-facing "not available" message

### Extension Features
- **7 commands**: Chat, Explain, Refactor, Fix Error, Voice Commit, Screenshot-to-Patch, Show Thinking Trace
- **Keybindings**: `Ctrl+Shift+M` (chat), `Ctrl+Shift+V` (voice commit)
- **Context menu**: Right-click selection → Explain / Refactor
- **Diagnostics integration**: Fix Error reads VS Code squiggles automatically

## 5. Why This Matters for Xiaomi Ecosystem

### Developer Adoption Flywheel
1. Developers install MiMoCode (free, MIT)
2. Each user needs a MiMo API key → drives registrations on platform.xiaomimimo.com
3. Thinking Trace makes MiMo Flash's reasoning visible → unique differentiator vs OpenAI/Anthropic
4. Voice + Screenshot features showcase MiMo's multimodal capabilities Copilot lacks

### Token Consumption Estimate
- **Per developer/day**: ~50 chat interactions × 2K tokens avg = 100K tokens
- **100 pilot developers**: 10M tokens/day → **~300M tokens/month**
- **1,000 developers**: 3B tokens/month → **36B tokens/year**
- Thinking Trace doubles Flash consumption (thinking + response tokens)

### Ecosystem Alignment
- **Multi-model showcase**: 5 different MiMo models in one tool (Flash, Pro, VL, ASR, TTS)
- **Open source**: MIT license → community contributions, forks, extensions
- **VS Code marketplace**: 30M+ monthly active developers as addressable market
- **Xiaomi branding**: "Powered by MiMo" in status bar, thinking trace panel, settings

## 6. Key Differentiators vs Existing Tools

| Feature | MiMoCode | GitHub Copilot | Cursor | Cody |
|---------|----------|---------------|--------|------|
| Thinking Trace | ✅ Full reasoning | ❌ | ❌ | ❌ |
| Voice Commit | ✅ ASR→Pro | ❌ | ❌ | ❌ |
| Screenshot Debug | ✅ VL→Pro | ❌ | ❌ | ❌ |
| Audio Replies | ✅ TTS | ❌ | ❌ | ❌ |
| Open Source | ✅ MIT | ❌ | ❌ | Partial |
| Model Transparency | ✅ Shows model | ❌ | ❌ | ❌ |

**Unique selling point**: No other tool shows the reasoning trace. This is MiMo Flash's native capability exposed through the extension.

## 7. Build & Install

```bash
# From source
git clone https://github.com/reyn/mimocode.git
cd mimocode/extension
npm install && npm run package
code --install-extension mimo-code-0.1.0.vsix

# Configure
# Settings → search "MiMo" → enter API key from platform.xiaomimimo.com
```

## 8. Files & Structure

```
mimocode/
├── extension/              # VS Code extension
│   ├── src/
│   │   ├── extension.ts    # Entry point, command registration
│   │   ├── lib/
│   │   │   └── mimoClient.ts  # API client (chat, VL, ASR, TTS)
│   │   └── webview/
│   │       └── thinkingTrace.ts  # Side panel webview provider
│   ├── package.json        # Extension manifest
│   └── mimo-code-0.1.0.vsix  # Pre-built installer
├── web/                    # Landing page (Next.js 14)
│   └── app/
│       └── page.tsx        # Single-page marketing site
├── SUBMISSION.md           # This file
├── README.md               # Full documentation
└── LICENSE                 # MIT
```

## 9. Token Forecast

| Scale | Users | Tokens/Month | Notes |
|-------|-------|-------------|-------|
| Pilot | 100 | ~300M | Early adopters, beta feedback |
| Growth | 1,000 | ~3B | Community-driven |
| Scale | 10,000 | ~30B | Marketplace featured |
| Ecosystem | 100,000 | ~300B | VS Code marketplace integration |

Thinking Trace adds ~40% token overhead (reasoning_content in Flash responses), significantly increasing model utilization per interaction.

---

**Built for the MiMo Orbit 100T Token Creator Program**
**5 models · MIT license · Live demo · Open source**
