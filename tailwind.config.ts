import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // IBM Plex Mono — dados, IDs e timestamps da área autenticada
        // (design-system/tokens/typography.css → --font-mono)
        "mono-ds": ["var(--font-mono-ds)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // Bodoni Moda — reservada ao wordmark da Dália Semijoias (cases)
        bodoni: ["var(--font-bodoni)", "Didot", "Bodoni MT", "serif"],
      },
      colors: {
        // Namespace Flauzino — mapeia 1:1 design-system/tokens/colors.css.
        // Usado apenas pela aplicação autenticada; a landing segue com brand-*.
        flauzino: {
          navy: {
            950: "#080d18",
            900: "#0b1220",
            800: "#101a2d",
            700: "#13213a",
            600: "#1b2c4d",
            500: "#25395f",
          },
          ink: {
            950: "#050505",
            900: "#0a0a0a",
            800: "#111111",
            700: "#1a1a1a",
          },
          accent: {
            700: "#1d4ed8",
            600: "#2563eb",
            500: "#3b82f6",
            100: "#dbe6fe",
            50: "#eef3ff",
          },
          slate: {
            50: "#f6f8fb",
            100: "#eef2f7",
            200: "#e1e7ef",
            300: "#cbd4e1",
            400: "#9aa7bd",
            500: "#69788f",
            600: "#4d5b72",
            700: "#364152",
            800: "#232c3a",
            900: "#151b26",
          },
          success: { 600: "#1f7a4d", 100: "#dcefe4" },
          warning: { 600: "#b07410", 100: "#f6ecd4" },
          danger: { 600: "#b3261e", 100: "#f6dcd9" },
        },
        // Brand blue scale — each step has a dedicated purpose (see the design system).
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        canvas: "#F6F7F9",
      },
      boxShadow: {
        // Sombras frias tintadas de navy — design-system/tokens/elevation.css
        "fl-xs": "0 1px 2px rgba(11,18,32,0.06)",
        "fl-sm": "0 1px 3px rgba(11,18,32,0.08), 0 1px 2px rgba(11,18,32,0.04)",
        "fl-md": "0 4px 12px rgba(11,18,32,0.08), 0 2px 4px rgba(11,18,32,0.04)",
        "fl-lg": "0 12px 28px rgba(11,18,32,0.12), 0 4px 8px rgba(11,18,32,0.05)",
        "fl-xl": "0 24px 56px rgba(11,18,32,0.16)",
        "fl-inset": "inset 0 1px 2px rgba(11,18,32,0.06)",
        "fl-focus": "0 0 0 3px rgba(59,130,246,0.35)",
        soft: "0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)",
        card: "0 4px 16px -2px rgba(16,24,40,0.06), 0 2px 6px -2px rgba(16,24,40,0.04)",
        pop: "0 12px 32px -8px rgba(37,99,235,0.22)",
        lift: "0 24px 64px -24px rgba(16,24,40,0.22), 0 8px 24px -12px rgba(16,24,40,0.10)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.625rem",
      },
      maxWidth: {
        // Containers de conteúdo mais largos que o teto padrão do Tailwind
        // (7xl = 1280px) — usados nas seções da landing e nas páginas de
        // case para aproveitar melhor telas largas.
        "8xl": "90rem" /* 1440px */,
        "9xl": "100rem" /* 1600px */,
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.14em",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scan: {
          "0%": { transform: "translateY(-120%)" },
          "100%": { transform: "translateY(120%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.9" },
        },
        "star-movement-bottom": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(-100%, 0%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(100%, 0%)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        scan: "scan 3.2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
        "spin-slow": "spin-slow 28s linear infinite",
        glow: "glow 4s ease-in-out infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
        "star-movement-bottom": "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
