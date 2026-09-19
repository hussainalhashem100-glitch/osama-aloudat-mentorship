'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = 'w-10 h-10', size = 40 }: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-400 transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-brand-600/20 via-cyan-500/10 to-transparent pointer-events-none" />

      {/* Luxury Monogram SVG: Interlocking O and A with precision medical diamond */}
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="monogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield Frame */}
        <polygon
          points="50,4 92,26 92,74 50,96 8,74 8,26"
          stroke="url(#monogramGrad)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          opacity="0.4"
        />

        {/* Stylized 'O' Circle */}
        <circle
          cx="42"
          cy="50"
          r="26"
          stroke="url(#monogramGrad)"
          strokeWidth="6"
          strokeDasharray="140 30"
          strokeLinecap="round"
        />

        {/* Stylized 'A' Arch Intersecting */}
        <path
          d="M38 74 L58 26 L78 74"
          stroke="url(#monogramGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crossbar of 'A' */}
        <line
          x1="46"
          y1="56"
          x2="70"
          y2="56"
          stroke="url(#monogramGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Medical Precision Diamond Centerpiece */}
        <polygon
          points="58,16 62,22 58,28 54,22"
          fill="url(#accentGrad)"
        />
      </svg>
    </div>
  );
}
