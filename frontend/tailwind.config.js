/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a2332',
        secondary: '#f59e0b',
        accent: '#10b981',
        muted: '#6b7280',
        destructive: '#ef4444',
      },
    },
  },
  plugins: [],
}
