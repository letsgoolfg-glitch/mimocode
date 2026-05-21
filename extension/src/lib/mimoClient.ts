import * as vscode from 'vscode';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ThinkingChunk {
  type: 'thinking' | 'content' | 'done';
  text: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onThinking?: (chunk: string) => void;
  onContent?: (chunk: string) => void;
}

export class MiMoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  static fromConfig(): MiMoClient {
    const cfg = vscode.workspace.getConfiguration('mimocode');
    const apiKey = cfg.get<string>('apiKey', '');
    const baseUrl = cfg.get<string>('baseUrl', 'https://token-plan-sgp.xiaomimimo.com/v1');
    if (!apiKey) {
      throw new Error('MiMo API key not configured. Set mimocode.apiKey in Settings.');
    }
    return new MiMoClient(apiKey, baseUrl);
  }

  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
    const model = opts.model || vscode.workspace.getConfiguration('mimocode').get('defaultModel', 'mimo-v2.5-flash');

    if (opts.stream && opts.onThinking && opts.onContent) {
      return this.chatStream(messages, model, opts);
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`MiMo API ${res.status}: ${err}`);
    }

    const data = await res.json() as any;
    return data.choices?.[0]?.message?.content ?? '';
  }

  private async chatStream(messages: ChatMessage[], model: string, opts: ChatOptions): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`MiMo API ${res.status}: ${err}`);
    }

    let fullContent = '';
    let fullThinking = '';
    const reader = (res.body as any).getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;

        try {
          const chunk = JSON.parse(payload);
          const delta = chunk.choices?.[0]?.delta;
          if (!delta) continue;

          // Hybrid thinking trace (MiMo Flash specific)
          if (delta.reasoning_content) {
            fullThinking += delta.reasoning_content;
            opts.onThinking?.(delta.reasoning_content);
          }
          if (delta.content) {
            fullContent += delta.content;
            opts.onContent?.(delta.content);
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    return fullContent;
  }

  async transcribe(audioBase64: string, mimeType: string = 'audio/webm'): Promise<string> {
    const res = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'mimo-asr',
        audio: audioBase64,
        mime_type: mimeType,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`MiMo ASR ${res.status}: ${err}`);
    }

    const data = await res.json() as any;
    return data.text ?? data.transcription ?? '';
  }

  async vision(imageBase64: string, prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'mimo-vl',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
            ],
          },
        ],
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`MiMo VL ${res.status}: ${err}`);
    }

    const data = await res.json() as any;
    return data.choices?.[0]?.message?.content ?? '';
  }

  async speak(text: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'mimo-tts',
        input: text,
        voice: 'alloy',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`MiMo TTS ${res.status}: ${err}`);
    }

    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }
}
