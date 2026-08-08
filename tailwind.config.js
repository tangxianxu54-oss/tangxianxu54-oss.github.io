/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        charcoal: "#0F1419",
        "charcoal-light": "#1A1F2B",
        "charcoal-card": "#2A2F3A",
        flame: {
          DEFAULT: "#FF6B35",
          light: "#FF8A5C",
          dark: "#E5532A",
        },
        mint: {
          DEFAULT: "#06D6A0",
          light: "#3DE9B8",
          dark: "#04B88A",
        },
        cream: "#F5F1EB",
        carb: "#FBBF24",
        protein: "#EF4444",
        fat: "#3B82F6",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ['"Noto Sans SC"', "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
