import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "var(--kli-bg-primary)", // KLI: Deep navy
                foreground: "var(--kli-text-primary)", // KLI: Primary text
                primary: {
                    DEFAULT: "var(--kli-primary)", // KLI: Electric Blue
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "var(--kli-bg-elevated)", // KLI: Elevated
                    foreground: "var(--kli-text-primary)",
                },
                destructive: {
                    DEFAULT: "var(--kli-accent-rose)", // KLI: Rose
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "var(--kli-bg-tertiary)",
                    foreground: "var(--kli-text-muted)",
                },
                accent: {
                    DEFAULT: "var(--kli-bg-tertiary)",
                    foreground: "var(--kli-text-primary)",
                },
                popover: {
                    DEFAULT: "var(--kli-bg-secondary)",
                    foreground: "var(--kli-text-primary)",
                },
                card: {
                    DEFAULT: "var(--kli-bg-secondary)",
                    foreground: "var(--kli-text-primary)",
                },
                // KLI Custom Colors
                kli: {
                    primary: {
                        DEFAULT: "var(--kli-primary)",
                        light: "var(--kli-primary-light)",
                        dark: "var(--kli-primary-dark)",
                    },
                    accent: {
                        cyan: "var(--kli-accent-cyan)",
                        emerald: "var(--kli-accent-emerald)",
                        amber: "var(--kli-accent-amber)",
                        rose: "var(--kli-accent-rose)",
                    },
                    bg: {
                        primary: "var(--kli-bg-primary)",
                        secondary: "var(--kli-bg-secondary)",
                        tertiary: "var(--kli-bg-tertiary)",
                        elevated: "var(--kli-bg-elevated)",
                    },
                    text: {
                        primary: "var(--kli-text-primary)",
                        secondary: "var(--kli-text-secondary)",
                        muted: "var(--kli-text-muted)",
                    },
                    border: {
                        DEFAULT: "var(--kli-border)",
                        light: "var(--kli-border-light)",
                    }
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
