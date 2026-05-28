import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./contexts/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050B18', surface: '#0A1628', card: '#0D1B2E',
        indigo: '#4F46E5', blue: '#3B82F6', green: '#22C55E',
        red: '#EF4444', purple: '#8B5CF6', cyan: '#06B6D4',
        primary: '#F8FAFC', secondary: '#94A3B8', muted: '#475569',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
