/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        green: 'var(--green)',
        green2: 'var(--green2)',
        blue: 'var(--blue)',
        gold: 'var(--gold)',
        gold2: 'var(--gold2)',
        red: 'var(--red)',
        purple: 'var(--purple)',
        teal: 'var(--teal)',
        cyan: 'var(--cyan)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
