import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MiMoCode — AI Coding Assistant for VS Code',
  description: 'Xiaomi MiMo-powered VS Code extension with thinking trace, voice commit, and screenshot-to-patch. See the reasoning behind every suggestion.',
  keywords: ['mimo', 'xiaomi', 'vscode', 'ai', 'copilot', 'coding-assistant', 'thinking-trace'],
  openGraph: {
    title: 'MiMoCode — See the Thinking, Not Just the Answer',
    description: 'VS Code AI assistant powered by Xiaomi MiMo with hybrid reasoning trace, voice commits, and visual debugging.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
