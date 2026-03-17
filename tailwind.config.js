/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#8E1D2C",
          gold: "#D1A34A",
          green: "#2D6A4F",
          cream: "#F9F6EF",
        },
      },
      boxShadow: {
        soft: "0 12px 30px rgba(28, 20, 10, 0.08)",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        "gold-glow":
          "radial-gradient(circle at 20% 20%, rgba(209, 163, 74, 0.35), rgba(255, 255, 255, 0) 40%)",
      },
    },
  },
  plugins: [],
};
