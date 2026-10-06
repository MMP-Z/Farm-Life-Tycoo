import React from 'react';
import { CoinIcon } from './CoinIcon';
import { GameIcon } from './GameIcon';

/**
 * Renders a plain-text game message, swapping emoji tokens for pixel-art /
 * Lucide equivalents. Used by toasts, tutorial text, NPC advice and other
 * string-based messages so no emoji leaks through text paths.
 *
 * Token coverage comes from GameIcon's map; 💰 gets the dedicated CoinIcon.
 */
const TOKEN_RE =
  /([\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1FA70}-\u{1FAFF}](?:\u200D[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]+)*)/gu;

export const RichText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let key = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    parts.push(
      token === '💰' ? (
        <CoinIcon key={key++} />
      ) : (
        <GameIcon key={key++} e={token} />
      )
    );
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <span className={className}>{parts}</span>;
};
