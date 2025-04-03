import { SxProps, Theme } from '@mui/material';
import { spacing, containerPadding } from '../constants/spacing';

/** Container styles for public layout */
export const containerStyles: SxProps<Theme> = {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    py: {
        xs: spacing.md / 8,    // Comfortable padding for mobile
        sm: containerPadding.tablet.y / 8,
        md: containerPadding.desktop.y / 8,
    },
    px: {
        xs: spacing.sm / 8,    // Minimal side padding on mobile
        sm: containerPadding.tablet.x / 8,
        md: containerPadding.desktop.x / 8,
    },
    mb: {
        xs: 8,  // Space for bottom navigation
        sm: 9,
    },
    maxWidth: {
        xs: '100%',
        sm: '600px !important',
        md: '600px !important',
    },
    mx: 'auto',
};

/** Content box styles for public layout */
export const contentBoxStyles: SxProps<Theme> = {
    borderRadius: {
        xs: spacing.xs / 8,    // Subtle radius on mobile
        sm: spacing.md / 8,
        md: spacing.lg / 8,
    },
    p: {
        xs: spacing.md / 8,    // Comfortable padding
        sm: spacing.lg / 8,
        md: spacing.xl / 8,
    },
    minHeight: {
        xs: 'calc(100vh - 120px)',  // Account for navigation
        sm: 'auto',
        md: 'auto',
    },
    maxWidth: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm / 8,
    boxShadow: {
        xs: 'none',
        sm: '0 4px 20px rgba(0,0,0,0.05)',
    },
    bgcolor: {
        xs: 'transparent',
        sm: 'background.paper',
    },
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: {
            xs: 'none',
            sm: '0 8px 30px rgba(0,0,0,0.1)',
        }
    },
    '& a, & button': {
        position: 'relative',
        zIndex: 2,
    },
    mx: 'auto',
    my: {
        xs: 0,
        sm: 4,
        md: 6,
    },
}; 