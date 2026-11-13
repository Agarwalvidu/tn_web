'use client';

import { useId } from 'react';

// Avatars are generated locally (gradient + initials). No external image service.
export const AVATAR_PALETTES = {
  sunrise: ['#ff9a44', '#fc6076'],
  ocean: ['#2193b0', '#6dd5ed'],
  forest: ['#11998e', '#38ef7d'],
  berry: ['#8e2de2', '#e0509a'],
  midnight: ['#232526', '#5b6770'],
  coral: ['#ff6b6b', '#feca57'],
  mint: ['#43c6ac', '#a8e6cf'],
  gold: ['#f7971e', '#ffd200'],
};
export const AVATAR_KEYS = Object.keys(AVATAR_PALETTES);

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export default function Avatar({ avatarKey, name, size = 48 }) {
  const id = useId().replace(/:/g, '');
  const [c1, c2] = AVATAR_PALETTES[avatarKey] || AVATAR_PALETTES.ocean;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${name || 'User'} avatar`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#g${id})`} />
      <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        {initials(name)}
      </text>
    </svg>
  );
}
