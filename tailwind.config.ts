import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", sm: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a192f",
          50:"#e8edf4",100:"#c5d0e0",200:"#9fb0c9",300:"#7890b2",
          400:"#567aa0",500:"#34648e",600:"#1e4d78",700:"#0e3660",
          800:"#0a192f",900:"#060f1c",
        },
        teal: {
          DEFAULT: "#2ec4b6",
          50:"#e8faf8",100:"#c3f2ee",200:"#9ae9e3",300:"#6ddfd7",
          400:"#47d4cc",500:"#2ec4b6",600:"#22a99c",700:"#178d82",
          800:"#0e7069",900:"#075450",
        },
        coral: {
          DEFAULT: "#ff6b3d",
          50:"#fff0eb",100:"#ffd5c5",200:"#ffb89e",300:"#ff9a76",
          400:"#ff7d54",500:"#ff6b3d",600:"#e85a2d",700:"#cc4920",
          800:"#aa3815",900:"#88280c",
        },
        neutral: {
          DEFAULT: "#f5f7fa",
          50:"#ffffff",100:"#f5f7fa",200:"#e8ecf2",300:"#d1d8e4",
          400:"#a8b4c8",500:"#7f90aa",600:"#5c6e8a",700:"#3d506e",
          800:"#243352",900:"#0a192f",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)", "system-ui", "sans-serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        code:    ["var(--font-mono)", "monospace"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm:"0.375rem", DEFAULT:"0.5rem", md:"0.5rem",
        lg:"0.625rem", xl:"0.875rem", "2xl":"1rem", "3xl":"1.5rem",
      },
      boxShadow: {
        "surface":    "0 1px 3px rgba(10,25,47,0.06), 0 1px 8px rgba(10,25,47,0.03)",
        "lift":       "0 4px 16px rgba(10,25,47,0.08), 0 2px 6px rgba(10,25,47,0.05)",
        "float":      "0 12px 40px rgba(10,25,47,0.12), 0 4px 12px rgba(10,25,47,0.06)",
        "brand-sm":   "0 1px 4px rgba(10,25,47,0.08)",
        "brand-md":   "0 4px 16px rgba(10,25,47,0.10)",
        "brand-lg":   "0 12px 40px rgba(10,25,47,0.12)",
        "brand-xl":   "0 24px 64px rgba(10,25,47,0.15)",
        "teal-glow":  "0 0 24px rgba(46,196,182,0.30)",
        "coral-glow": "0 0 24px rgba(255,107,61,0.30)",
        "card":       "0 1px 3px rgba(10,25,47,0.06), 0 2px 8px rgba(10,25,47,0.04)",
        "card-hover": "0 4px 20px rgba(10,25,47,0.10), 0 8px 32px rgba(10,25,47,0.06)",
      },
      keyframes: {
        "accordion-down": { from:{height:"0"},to:{height:"var(--radix-accordion-content-height)"} },
        "accordion-up":   { from:{height:"var(--radix-accordion-content-height)"},to:{height:"0"} },
        fadeUp:       { from:{opacity:"0",transform:"translateY(12px)"},to:{opacity:"1",transform:"translateY(0)"} },
        fadeIn:       { from:{opacity:"0"},to:{opacity:"1"} },
        slideInRight: { from:{opacity:"0",transform:"translateX(12px)"},to:{opacity:"1",transform:"translateX(0)"} },
        slideInDown:  { from:{opacity:"0",transform:"translateY(-8px)"},to:{opacity:"1",transform:"translateY(0)"} },
        float:        { "0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-5px)"} },
        pulseDot:     { "0%,100%":{opacity:"1",transform:"scale(1)"},"50%":{opacity:"0.5",transform:"scale(0.7)"} },
        shimmer:      { from:{backgroundPosition:"200% 0"},to:{backgroundPosition:"-200% 0"} },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-up":         "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":         "fadeIn 0.3s ease both",
        "slide-right":     "slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both",
        "slide-down":      "slideInDown 0.25s cubic-bezier(0.22,1,0.36,1) both",
        "float":           "float 4s ease-in-out infinite",
        "pulse-dot":       "pulseDot 2s ease-in-out infinite",
        "shimmer":         "shimmer 1.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
