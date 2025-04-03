/** Breakpoint values in pixels for responsive design */
export const breakpoints = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
} as const;

/** Media query breakpoints for easier usage */
export const mediaQueries = {
    up: {
        sm: `@media (min-width: ${breakpoints.sm}px)`,
        md: `@media (min-width: ${breakpoints.md}px)`,
        lg: `@media (min-width: ${breakpoints.lg}px)`,
        xl: `@media (min-width: ${breakpoints.xl}px)`,
    },
    down: {
        sm: `@media (max-width: ${breakpoints.sm - 1}px)`,
        md: `@media (max-width: ${breakpoints.md - 1}px)`,
        lg: `@media (max-width: ${breakpoints.lg - 1}px)`,
        xl: `@media (max-width: ${breakpoints.xl - 1}px)`,
    },
} as const; 