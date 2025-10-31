import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [heroui(), require('@tailwindcss/typography') ,  require('tailwind-scrollbar'), // Add this line // <-- Add this line
  ],
  theme: {
    extend: {},
  },
};
