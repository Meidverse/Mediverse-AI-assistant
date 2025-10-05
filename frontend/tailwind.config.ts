import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex)", "var(--font-inter)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        medical: ["var(--font-ibm-plex)", "sans-serif"],
      },
      colors: {
        mediverse: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e293b",
          950: "#0f172a",
        },
        accent: {
          purple: "#8b5cf6",
          indigo: "#6366f1",
          cyan: "#06b6d4",
          emerald: "#10b981",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "radial-gradient(at 40% 20%, hsla(228,94%,67%,0.15) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(262,52%,57%,0.12) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(211,100%,50%,0.08) 0, transparent 50%)",
      },
      keyframes: {
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "1",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" 
          },
          "50%": { 
            opacity: "0.7",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.7)" 
          },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "slide-up": {
          "0%": { 
            transform: "translateY(30px)",
            opacity: "0" 
          },
          "100%": { 
            transform: "translateY(0)",
            opacity: "1" 
          },
        },
        "slide-down": {
          "0%": { 
            transform: "translateY(-30px)",
            opacity: "0" 
          },
          "100%": { 
            transform: "translateY(0)",
            opacity: "1" 
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { 
            transform: "scale(0.9)",
            opacity: "0" 
          },
          "100%": { 
            transform: "scale(1)",
            opacity: "1" 
          },
        },
        ripple: {
          "0%": { 
            transform: "scale(0)",
            opacity: "1" 
          },
          "100%": { 
            transform: "scale(2)",
            opacity: "0" 
          },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "gradient-move": "gradient-move 6s ease infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        ripple: "ripple 0.6s ease-out",
        typing: "typing 2s steps(40, end)",
        blink: "blink 1s step-end infinite",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(59, 130, 246, 0.3)",
        "glow-md": "0 0 20px rgba(59, 130, 246, 0.4)",
        "glow-lg": "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
        "glow-xl": "0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(59, 130, 246, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [],
};

export default config;
