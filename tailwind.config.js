/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary-rgb))",
          50: "rgb(var(--primary-rgb) / 0.05)",
          100: "rgb(var(--primary-rgb) / 0.1)",
          200: "rgb(var(--primary-rgb) / 0.2)",
          300: "rgb(var(--primary-rgb) / 0.3)",
          400: "rgb(var(--primary-rgb) / 0.4)",
          500: "rgb(var(--primary-rgb) / 0.5)",
          600: "rgb(var(--primary-rgb) / 0.6)",
          700: "rgb(var(--primary-rgb) / 0.7)",
          800: "rgb(var(--primary-rgb) / 0.8)",
          900: "rgb(var(--primary-rgb) / 0.9)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-rgb))",
          50: "rgb(var(--secondary-rgb) / 0.05)",
          100: "rgb(var(--secondary-rgb) / 0.1)",
          200: "rgb(var(--secondary-rgb) / 0.2)",
          300: "rgb(var(--secondary-rgb) / 0.3)",
          400: "rgb(var(--secondary-rgb) / 0.4)",
          500: "rgb(var(--secondary-rgb) / 0.5)",
          600: "rgb(var(--secondary-rgb) / 0.6)",
          700: "rgb(var(--secondary-rgb) / 0.7)",
          800: "rgb(var(--secondary-rgb) / 0.8)",
          900: "rgb(var(--secondary-rgb) / 0.9)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb))",
          50: "rgb(var(--accent-rgb) / 0.05)",
          100: "rgb(var(--accent-rgb) / 0.1)",
          200: "rgb(var(--accent-rgb) / 0.2)",
          300: "rgb(var(--accent-rgb) / 0.3)",
          400: "rgb(var(--accent-rgb) / 0.4)",
          500: "rgb(var(--accent-rgb) / 0.5)",
          600: "rgb(var(--accent-rgb) / 0.6)",
          700: "rgb(var(--accent-rgb) / 0.7)",
          800: "rgb(var(--accent-rgb) / 0.8)",
          900: "rgb(var(--accent-rgb) / 0.9)",
        },
        background: "rgb(var(--background-start-rgb))",
        foreground: "rgb(var(--foreground-rgb))",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
