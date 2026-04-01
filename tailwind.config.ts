import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        skin: {
          page: 'var(--surface-page)',
          panel: 'var(--surface-panel)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
          primary: 'var(--brand-primary)',
          'primary-soft': 'var(--brand-primary-soft)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          subtle: 'var(--text-muted)',
          up: 'var(--color-up)',
          down: 'var(--color-down)',
          border: 'var(--border-soft)'
        }
      },
      boxShadow: {
        soft: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
        glow: 'var(--shadow-glow)'
      },
      borderRadius: {
        skin: 'var(--radius-m)',
        shell: 'var(--radius-l)',
        pill: '999px'
      },
      spacing: {
        shell: 'var(--space-m)',
        section: 'var(--space-l)'
      },
      backgroundImage: {
        brand: 'var(--gradient-brand)',
        panel: 'var(--gradient-panel)',
        hero: 'var(--gradient-hero)',
        mesh: 'var(--gradient-mesh)'
      },
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        display: ['var(--font-family-display)'],
        mono: ['var(--font-family-mono)']
      }
    }
  },
  plugins: []
}
