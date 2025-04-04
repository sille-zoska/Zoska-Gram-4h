import { SxProps, Theme } from '@mui/material';
import { spacing, containerPadding } from '../constants/spacing';

/** Container styles for private layout */
export const containerStyles: SxProps<Theme> = {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    py: {
        xs: containerPadding.mobile.y / 8,
        sm: containerPadding.tablet.y / 8,
        md: containerPadding.desktop.y / 8,
    },
    px: {
        xs: containerPadding.mobile.x / 8,
        sm: containerPadding.tablet.x / 8,
    },
    mb: {
        xs: 8,  // Space for bottom navigation
        sm: 9,
    },
    animation: 'fadeIn 0.5s ease-in-out',
};

/** Content box styles for private layout */
export const contentBoxStyles: SxProps<Theme> = {
    borderRadius: {
        xs: spacing.sm / 8,
        sm: spacing.md / 8,
        md: spacing.lg / 8,
    },
    p: {
        xs: spacing.md / 8,
        sm: spacing.lg / 8,
        md: spacing.xl / 8,
    },
    minHeight: {
        xs: 'calc(100vh - 140px)', // Adjusted for mobile
        sm: 'calc(100vh - 160px)',
        md: 'calc(100vh - 200px)',
    },
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px var(--mui-palette-primary-main-rgb, 0, 0, 0)10',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out',
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
        boxShadow: '0 8px 40px var(--mui-palette-primary-main-rgb, 0, 0, 0)15',
        transform: 'translateY(-2px)',
    },
    '& .fade-in-up': {
        animation: 'fadeInUp 0.6s ease-out',
    },
    '@keyframes fadeInUp': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '@keyframes fadeIn': {
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
        },
    },
}; 