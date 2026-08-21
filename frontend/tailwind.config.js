/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0e17",
          850: "#0d1220",
          800: "#111827",
          700: "#1a2235",
          600: "#252f45",
          500: "#39445c",
        },
        primary: {
          50: "#eefcf7",
          100: "#d3f8ea",
          200: "#a4f0d6",
          300: "#69e2bd",
          400: "#35cba1",
          500: "#14b389",
          600: "#0a9271",
          700: "#0a745c",
          800: "#0b5c4a",
          900: "#0a4b3d",
        },
        accent: {
          400: "#7c9bff",
          500: "#5b7cfa",
          600: "#4560e0",
        },
        signal: {
          amber: "#f5a623",
          rose: "#fb5a72",
          violet: "#a78bfa",
        },
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(91,124,250,0.14), transparent 40%), radial-gradient(circle at 80% 0%, rgba(20,179,137,0.16), transparent 45%), radial-gradient(circle at 50% 100%, rgba(167,139,250,0.10), transparent 45%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(20,179,137,0.15), 0 8px 30px -8px rgba(20,179,137,0.35)",
        "glow-blue": "0 0 0 1px rgba(91,124,250,0.18), 0 8px 30px -8px rgba(91,124,250,0.4)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.6 },
          "80%": { transform: "scale(1.6)", opacity: 0 },
          "100%": { transform: "scale(1.6)", opacity: 0 },
        },
        "flow-dash": {
          to: { strokeDashoffset: -40 },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s infinite linear",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.8,0.4,1) infinite",
        "flow-dash": "flow-dash 1.2s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
