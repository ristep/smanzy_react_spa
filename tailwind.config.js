/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--color-background)',
                'background-secondary': 'var(--color-background-secondary)',
                'background-tertiary': 'var(--color-background-tertiary)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-muted': 'var(--color-text-muted)',
                border: 'var(--color-border)',
                'border-hover': 'var(--color-border-hover)',
                accent: 'var(--color-accent)',
                'accent-hover': 'var(--color-accent-hover)',
                'accent-foreground': 'var(--color-accent-foreground)',
                card: 'var(--color-card)',
                'card-border': 'var(--color-card-border)',
                input: 'var(--color-input)',
                'input-border': 'var(--color-input-border)',
            },
        },
    },
    plugins: [],
}
