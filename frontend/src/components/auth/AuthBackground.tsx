"use client";

import { ReactNode } from "react";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Abstract Background Elements */}
      
      {/* Soft gradient orb 1 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
      
      {/* Soft gradient orb 2 */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIC8+Cgk8L3N2Zz4=')] opacity-50" />

      {/* Abstract neural network / nodes graphic (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none">
          {/* We use some generic bezier curves to look like connections */}
          <path d="M -100 200 C 150 100 250 400 600 300 S 800 100 1200 250" />
          <path d="M -100 400 C 200 450 300 200 550 400 S 900 600 1200 400" />
          <path d="M 100 -100 C 300 200 150 500 400 700" />
          <path d="M 700 -100 C 600 300 800 600 650 900" />
          
          {/* Nodes */}
          <circle cx="150" cy="180" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="250" cy="400" r="3" fill="rgba(255,255,255,0.3)" />
          <circle cx="600" cy="300" r="5" fill="rgba(59,130,246,0.5)" />
          <circle cx="800" cy="100" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="200" cy="450" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="550" cy="400" r="6" fill="rgba(99,102,241,0.5)" />
          <circle cx="900" cy="600" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="300" cy="200" r="5" fill="rgba(255,255,255,0.3)" />
          <circle cx="150" cy="500" r="3" fill="rgba(255,255,255,0.3)" />
          <circle cx="400" cy="700" r="4" fill="rgba(255,255,255,0.3)" />
        </g>
      </svg>
    </div>
  );
}
