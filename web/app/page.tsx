'use client';

import { motion } from 'framer-motion';
import { Brain, Mic, Camera, MessageSquare, Volume2, Zap, Shield, Code2, ExternalLink } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Brain,
    title: 'Thinking Trace',
    desc: 'Watch MiMo Flash reason step-by-step before suggesting code. Understand the "why" behind every change.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Mic,
    title: 'Voice Commit',
    desc: 'Speak your changes. MiMo ASR transcribes → MiMo Pro writes the conventional commit message.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Camera,
    title: 'Screenshot-to-Patch',
    desc: 'Paste a UI bug screenshot. MiMo VL reads the visual context → Pro generates the fix.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Inline Chat',
    desc: 'Select code, ask a question, get an inline diff. Accept or reject with one click.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Volume2,
    title: 'Audio Replies',
    desc: 'Hear explanations read back via MiMo TTS. Great for complex refactors or learning.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    icon: Shield,
    title: 'Error Fix',
    desc: 'One command to fix diagnostic errors. MiMo reads the squiggle, understands the context, patches.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
];

const models = [
  { name: 'MiMo V2.5 Flash', module: 'mimo-v2.5-flash', use: 'Chat, inline suggestions, thinking trace', speed: 'Fast' },
  { name: 'MiMo V2.5 Pro', module: 'mimo-v2.5-pro', use: 'Refactors, commit messages, code review', speed: 'Deep' },
  { name: 'MiMo VL', module: 'mimo-vl', use: 'Screenshot understanding, visual debugging', speed: 'Multimodal' },
  { name: 'MiMo ASR', module: 'mimo-asr', use: 'Voice transcription', speed: 'Real-time' },
  { name: 'MiMo TTS', module: 'mimo-tts', use: 'Audio replies', speed: 'Streaming' },
];

function ThinkingDemo() {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-purple-500/5">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-500/60" />
        <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Thinking Trace</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">flash</span>
      </div>
      <div className="p-4 text-sm text-gray-400 font-mono space-y-2">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <span className="text-purple-300">→</span> Analyzing the selected function...
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <span className="text-purple-300">→</span> Found: function lacks error handling for null input
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <span className="text-purple-300">→</span> Checking: TypeScript strict mode is enabled
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <span className="text-purple-300">→</span> Strategy: Add guard clause + return type narrowing
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
          className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-green-400 uppercase tracking-wider">✨ Response</span>
          </div>
          <pre className="text-green-300 text-xs"><code>{`function process(data: string | null): Result {
  if (!data) return { error: 'No data provided' };
  // ... rest of logic
}`}</code></pre>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen grid-pattern">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
        <motion.div className="max-w-5xl mx-auto text-center relative"
          initial="initial" animate="animate" variants={stagger}>
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
              <Zap className="w-3 h-3" /> Powered by Xiaomi MiMo · 5 Models
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="glow-purple">See the Thinking,</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Not Just the Answer
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            MiMoCode brings Xiaomi&apos;s MiMo models into VS Code — with a <strong className="text-white">hybrid reasoning trace</strong> that
            shows you step-by-step thinking before code suggestions appear. Understand <em>why</em>, not just <em>what</em>.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/downloads/mimo-code-0.1.0.vsix"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors">
              <Zap className="w-4 h-4" /> Install VSIX
            </a>
            <a href="https://github.com/reyn/mimocode"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium transition-colors">
              <Code2 className="w-4 h-4" /> View Source
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Thinking Trace Demo */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold text-center mb-2">Watch It Think</h2>
            <p className="text-gray-500 text-center mb-8">MiMo Flash shows its reasoning in a dedicated side panel before the answer arrives.</p>
            <ThinkingDemo />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Five Superpowers</h2>
            <p className="text-gray-500 text-lg">Every feature powered by a different MiMo model.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeInUp}
                className={`card-glow rounded-xl p-6 border ${f.border} ${f.bg}`}>
                <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Models */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">5 MiMo Models, 1 Extension</h2>
            <p className="text-gray-500">Maximum model diversity for the Xiaomi ecosystem.</p>
          </motion.div>

          <motion.div className="space-y-3"
            initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            {models.map((m) => (
              <motion.div key={m.module} variants={fadeInUp}
                className="flex items-center gap-4 p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{m.name}</span>
                    <code className="text-xs text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">{m.module}</code>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{m.use}</p>
                </div>
                <span className="text-xs text-gray-600 hidden sm:block">{m.speed}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to See the Reasoning?
          </h2>
          <p className="text-gray-500 mb-8">
            Install MiMoCode, add your MiMo API key, and experience AI coding with full transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://platform.xiaomimimo.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors">
              Get API Key <ExternalLink className="w-4 h-4" />
            </a>
            <a href="https://github.com/reyn/mimocode"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium transition-colors">
              <Code2 className="w-4 h-4" /> Star on GitHub
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-6">
            MIT Licensed · Built for MiMo Orbit 100T Token Creator Program
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>MiMoCode © 2026 · MIT License</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/reyn/mimocode" className="hover:text-gray-400 transition-colors">GitHub</a>
            <a href="https://mimo.xiaomi.com" className="hover:text-gray-400 transition-colors">MiMo</a>
            <a href="https://platform.xiaomimimo.com" className="hover:text-gray-400 transition-colors">API Platform</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
