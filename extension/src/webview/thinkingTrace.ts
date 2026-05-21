import * as vscode from 'vscode';

export class ThinkingTraceProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'mimocode.thinkingTrace';
  private _view?: vscode.WebviewView;
  private _thinking = '';
  private _content = '';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtml();
  }

  public clear() {
    this._thinking = '';
    this._content = '';
    this._update();
  }

  public show() {
    this._view?.show(true);
  }

  public appendThinking(chunk: string) {
    this._thinking += chunk;
    this._update();
  }

  public appendContent(chunk: string) {
    this._content += chunk;
    this._update();
  }

  private _update() {
    if (this._view) {
      this._view.webview.html = this._getHtml();
    }
  }

  private _getHtml(): string {
    const thinkingHtml = this._thinking
      ? this._escapeHtml(this._thinking)
      : '<span class="empty">Waiting for query...</span>';

    const contentHtml = this._content
      ? this._renderMarkdown(this._content)
      : '';

    const hasContent = this._content ? 'true' : '';
    const isTyping = this._thinking && !this._content ? 'typing' : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--vscode-font-family, 'Segoe UI', system-ui, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      color: var(--vscode-foreground, #ccc);
      padding: 12px;
      line-height: 1.5;
    }
    .section { margin-bottom: 16px; border-radius: 8px; overflow: hidden; }
    .section-header {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; font-weight: 600; font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .thinking .section-header {
      background: rgba(139, 92, 246, 0.15); color: #a78bfa;
      border-left: 3px solid #8b5cf6;
    }
    .content .section-header {
      background: rgba(34, 197, 94, 0.15); color: #4ade80;
      border-left: 3px solid #22c55e;
    }
    .section-body {
      padding: 12px; font-size: 13px; white-space: pre-wrap;
      word-break: break-word; max-height: 400px; overflow-y: auto;
    }
    .thinking .section-body {
      background: rgba(139, 92, 246, 0.05);
      color: var(--vscode-descriptionForeground, #999);
      font-style: italic;
    }
    .content .section-body { background: rgba(34, 197, 94, 0.05); }
    .empty { color: var(--vscode-descriptionForeground, #666); font-style: italic; }
    code {
      background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px;
      font-family: var(--vscode-editor-font-family, monospace);
    }
    pre {
      background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;
      overflow-x: auto; margin: 8px 0;
    }
    pre code { background: none; padding: 0; }
    .model-badge {
      display: inline-block; padding: 2px 8px; border-radius: 12px;
      font-size: 11px; background: rgba(139, 92, 246, 0.2); color: #a78bfa;
      margin-left: auto;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .typing::after { content: '\\25CF'; animation: pulse 1s infinite; margin-left: 4px; }
  </style>
</head>
<body>
  <div class="section thinking">
    <div class="section-header">🧠 Thinking Trace <span class="model-badge">flash</span></div>
    <div class="section-body ${isTyping}">${thinkingHtml}</div>
  </div>
  ${hasContent ? `
  <div class="section content">
    <div class="section-header">✨ Response</div>
    <div class="section-body">${contentHtml}</div>
  </div>` : ''}
</body>
</html>`;
  }

  private _escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  private _renderMarkdown(text: string): string {
    let html = this._escapeHtml(text);
    // Code blocks
    html = html.replace(/```\w*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Newlines (not inside pre)
    html = html.replace(/\n/g, '<br>');
    return html;
  }
}
