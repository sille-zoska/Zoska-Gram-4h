/** Base spacing unit in pixels */
export const SPACING_UNIT = 8;

/** Spacing values for consistent layout */
export const spacing = {
    xs: SPACING_UNIT / 2,    // 4px
    sm: SPACING_UNIT,        // 8px
    md: SPACING_UNIT * 2,    // 16px
    lg: SPACING_UNIT * 3,    // 24px
    xl: SPACING_UNIT * 4,    // 32px
    xxl: SPACING_UNIT * 6,   // 48px
} as const;

/** Container padding for different screen sizes */
export const containerPadding = {
    mobile: {
        x: spacing.md,    // 16px
        y: spacing.lg,    // 24px
    },
    tablet: {
        x: spacing.xl,    // 32px
        y: spacing.xl,    // 32px
    },
    desktop: {
        x: spacing.xxl,   // 48px
        y: spacing.xxl,   // 48px
    },
} as const; 