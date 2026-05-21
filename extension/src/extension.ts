import * as vscode from 'vscode';
import { MiMoClient } from './lib/mimoClient';
import { ThinkingTraceProvider } from './webview/thinkingTrace';

let mimoClient: MiMoClient | undefined;
let thinkingProvider: ThinkingTraceProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('MiMoCode activated');

  try {
    mimoClient = MiMoClient.fromConfig();
  } catch (e: any) {
    vscode.window.showWarningMessage(`MiMoCode: ${e.message}`);
  }

  thinkingProvider = new ThinkingTraceProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('mimocode.thinkingTrace', thinkingProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('mimocode.chat', () => openChat(context)),
    vscode.commands.registerCommand('mimocode.explain', () => handleExplain()),
    vscode.commands.registerCommand('mimocode.refactor', () => handleRefactor()),
    vscode.commands.registerCommand('mimocode.voiceCommit', () => handleVoiceCommit(context)),
    vscode.commands.registerCommand('mimocode.screenshotPatch', () => handleScreenshotPatch(context)),
    vscode.commands.registerCommand('mimocode.fixError', () => handleFixError()),
    vscode.commands.registerCommand('mimocode.thinkingTrace', () => {
      vscode.commands.executeCommand('mimocode.thinkingTrace.focus');
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('mimocode')) {
        try { mimoClient = MiMoClient.fromConfig(); } catch { /* key removed */ }
      }
    })
  );
}

async function openChat(context: vscode.ExtensionContext) {
  if (!mimoClient) { vscode.window.showErrorMessage('MiMo API key not configured.'); return; }

  const editor = vscode.window.activeTextEditor;
  const selection = editor?.document.getText(editor.selection);
  const fileName = editor?.document.fileName;
  const language = editor?.document.languageId;

  const systemPrompt = `You are MiMoCode, an expert AI coding assistant inside VS Code.
The user is working in ${language || 'unknown'}.
Current file: ${fileName || 'none'}.
Be concise. Show code in fenced blocks with the language tag. Explain briefly before code.`;

  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Ask MiMo anything about your code',
    placeHolder: 'e.g. "Explain this function" or "Add error handling"',
  });

  if (!userPrompt) return;

  const codeBlock = selection
    ? `\n\`\`\`${language}\n${selection}\n\`\`\`\n`
    : '';
  const contextPrompt = selection
    ? `Here is the selected code:${codeBlock}\n${userPrompt}`
    : userPrompt;

  thinkingProvider?.clear();
  thinkingProvider?.show();

  try {
    const reply = await mimoClient.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextPrompt },
      ],
      {
        model: 'mimo-v2.5-flash',
        stream: true,
        onThinking: (chunk) => thinkingProvider?.appendThinking(chunk),
        onContent: (chunk) => thinkingProvider?.appendContent(chunk),
      }
    );

    if (editor && reply) {
      const action = await vscode.window.showInformationMessage(
        'MiMo suggestion ready', 'Insert at Cursor', 'Copy to Clipboard', 'Dismiss'
      );
      if (action === 'Insert at Cursor') {
        editor.edit(builder => { builder.insert(editor.selection.active, reply); });
      } else if (action === 'Copy to Clipboard') {
        vscode.env.clipboard.writeText(reply);
      }
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(`MiMo error: ${e.message}`);
  }
}

async function handleExplain() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !mimoClient) return;

  const code = editor.document.getText(editor.selection);
  if (!code) return;

  thinkingProvider?.clear();
  thinkingProvider?.show();

  const explanation = await mimoClient.chat(
    [
      { role: 'system', content: 'Explain the following code concisely. Focus on what it does, edge cases, and potential issues.' },
      { role: 'user', content: code },
    ],
    {
      stream: true,
      onThinking: (c) => thinkingProvider?.appendThinking(c),
      onContent: (c) => thinkingProvider?.appendContent(c),
    }
  );

  if (explanation) {
    vscode.window.showInformationMessage('Explanation shown in Thinking Trace panel');
  }
}

async function handleRefactor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !mimoClient) return;

  const code = editor.document.getText(editor.selection);
  if (!code) return;
  const lang = editor.document.languageId;

  thinkingProvider?.clear();
  thinkingProvider?.show();

  const refactored = await mimoClient.chat(
    [
      { role: 'system', content: 'Refactor the following code. Improve readability, performance, and idiomatic usage. Return ONLY the refactored code in a fenced block, then a brief explanation.' },
      { role: 'user', content: `\`\`\`${lang}\n${code}\n\`\`\`` },
    ],
    {
      model: 'mimo-v2.5-pro',
      stream: true,
      onThinking: (c) => thinkingProvider?.appendThinking(c),
      onContent: (c) => thinkingProvider?.appendContent(c),
    }
  );

  if (refactored) {
    const action = await vscode.window.showInformationMessage('Refactored code ready', 'Replace Selection', 'Insert Below', 'Dismiss');
    if (action === 'Replace Selection') {
      const match = refactored.match(/```\w*\n([\s\S]*?)\n```/);
      const newCode = match ? match[1] : refactored;
      editor.edit(b => b.replace(editor.selection, newCode));
    } else if (action === 'Insert Below') {
      const match = refactored.match(/```\w*\n([\s\S]*?)\n```/);
      const newCode = match ? match[1] : refactored;
      const end = editor.selection.end;
      editor.edit(b => b.insert(end, '\n' + newCode));
    }
  }
}

async function handleVoiceCommit(context: vscode.ExtensionContext) {
  if (!mimoClient) { vscode.window.showErrorMessage('MiMo API key not configured.'); return; }

  vscode.window.showInformationMessage('🎤 Voice Commit: Describe your changes');

  const description = await vscode.window.showInputBox({
    prompt: '🎤 Describe your changes (ASR voice input or type below)',
    placeHolder: 'e.g. "Added error handling to the API client"',
  });

  if (!description) return;

  thinkingProvider?.clear();
  thinkingProvider?.show();
  thinkingProvider?.appendThinking('Generating commit message from description...\n');

  const commitMsg = await mimoClient.chat(
    [
      { role: 'system', content: 'Generate a conventional commit message from the user\'s description. Format: type(scope): subject\n\nBody (if needed).\nTypes: feat, fix, refactor, docs, test, chore. Be concise. Return ONLY the commit message.' },
      { role: 'user', content: description },
    ],
    { model: 'mimo-v2.5-pro', temperature: 0.2 }
  );

  if (commitMsg) {
    thinkingProvider?.appendContent(commitMsg);
    const action = await vscode.window.showInformationMessage(
      'Commit message generated', 'Copy to Clipboard', 'Run Git Commit', 'Dismiss'
    );
    if (action === 'Copy to Clipboard') {
      vscode.env.clipboard.writeText(commitMsg);
    } else if (action === 'Run Git Commit') {
      const terminal = vscode.window.createTerminal('MiMo Git');
      terminal.sendText('git add -A');
      terminal.sendText(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
      terminal.show();
    }
  }
}

async function handleScreenshotPatch(context: vscode.ExtensionContext) {
  if (!mimoClient) { vscode.window.showErrorMessage('MiMo API key not configured.'); return; }

  const action = await vscode.window.showQuickPick(
    ['Select Image File', 'Paste Image from Clipboard'],
    { placeHolder: 'How to provide the screenshot?' }
  );

  let imageBase64 = '';

  if (action === 'Select Image File') {
    const uris = await vscode.window.showOpenDialog({
      filters: { Images: ['png', 'jpg', 'jpeg', 'webp', 'gif'] },
      canSelectMany: false,
    });
    if (!uris?.[0]) return;
    const fs = await import('fs/promises');
    const buffer = await fs.readFile(uris[0].fsPath);
    imageBase64 = buffer.toString('base64');
  } else if (action === 'Paste Image from Clipboard') {
    vscode.window.showInformationMessage('Save the screenshot to a file first, then use "Select Image File"');
    return;
  }

  if (!imageBase64) return;

  thinkingProvider?.clear();
  thinkingProvider?.show();
  thinkingProvider?.appendThinking('Analyzing screenshot with MiMo VL...\n');

  const analysis = await mimoClient.vision(
    imageBase64,
    'Analyze this screenshot. If it shows a UI bug, describe the issue. If it shows an error message, extract the error. If it shows a design mock, describe the desired layout. Be specific and technical.'
  );

  thinkingProvider?.appendThinking(`VL Analysis:\n${analysis}\n\nGenerating patch...\n`);

  const editor = vscode.window.activeTextEditor;
  const currentCode = editor ? editor.document.getText() : '';
  const lang = editor?.document.languageId || '';

  const patch = await mimoClient.chat(
    [
      { role: 'system', content: `You are a code fixer. Given a visual analysis of a UI issue or error, generate a code patch to fix it. Current file language: ${lang}. Return the fix as a fenced code block with a brief explanation.` },
      { role: 'user', content: `Visual analysis:\n${analysis}\n\nCurrent file code:\n\`\`\`${lang}\n${currentCode.slice(0, 8000)}\n\`\`\`` },
    ],
    {
      model: 'mimo-v2.5-pro',
      stream: true,
      onThinking: (c) => thinkingProvider?.appendThinking(c),
      onContent: (c) => thinkingProvider?.appendContent(c),
    }
  );

  if (patch) {
    vscode.window.showInformationMessage('Screenshot patch generated — see Thinking Trace panel');
  }
}

async function handleFixError() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !mimoClient) return;

  const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
  const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);

  if (errors.length === 0) {
    vscode.window.showInformationMessage('No errors found in current file.');
    return;
  }

  const error = errors[0];
  const errorRange = error.range;
  const lineStart = Math.max(0, errorRange.start.line - 5);
  const lineEnd = Math.min(editor.document.lineCount - 1, errorRange.end.line + 5);
  const contextRange = new vscode.Range(lineStart, 0, lineEnd, editor.document.lineAt(lineEnd).text.length);
  const contextCode = editor.document.getText(contextRange);

  thinkingProvider?.clear();
  thinkingProvider?.show();
  thinkingProvider?.appendThinking(`Fixing error: ${error.message}\n`);

  const fix = await mimoClient.chat(
    [
      { role: 'system', content: 'Fix the error in the code. Return ONLY the corrected code for the error region, then explain what was wrong.' },
      { role: 'user', content: `Error: ${error.message}\n\nCode context:\n\`\`\`${editor.document.languageId}\n${contextCode}\n\`\`\`` },
    ],
    {
      stream: true,
      onThinking: (c) => thinkingProvider?.appendThinking(c),
      onContent: (c) => thinkingProvider?.appendContent(c),
    }
  );

  if (fix) {
    const action = await vscode.window.showInformationMessage('Error fix ready', 'Apply Fix', 'Dismiss');
    if (action === 'Apply Fix') {
      const match = fix.match(/```\w*\n([\s\S]*?)\n```/);
      const newCode = match ? match[1] : fix;
      editor.edit(b => b.replace(errorRange, newCode));
    }
  }
}

export function deactivate() {}
