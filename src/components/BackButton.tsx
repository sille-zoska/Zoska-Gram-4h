// src/components/BackButton.tsx

/**
 * @file BackButton.tsx
 * @description
 * A reusable "Back" button component for navigating to the previous page in the browser history.
 * If no history is available, it redirects the user to the home page (`/`).
 * 
 * @usage
 * This component is intended for use in pages or views where the user needs an easy way to return 
 * to the previous page, such as terms of service, privacy policy, or multi-step forms.
 * 
 * @props
 * - `text` (optional): The text displayed on the button. Defaults to "Späť".
 * - `color` (optional): The color of the button. Accepts any valid Material-UI button color (e.g., "primary", "secondary").
 *   Defaults to "primary".
 * - `variant` (optional): The variant of the button. Accepts 'text', 'outlined', 'contained', or 'icon'.
 *   Defaults to 'outlined'.
 * - `tooltip` (optional): The text to display in a tooltip when hovering over the button.
 * - `size` (optional): The size of the button. Accepts 'small', 'medium', or 'large'.
 * - `useGradient` (optional): Whether to use a gradient effect on the button.
 * 
 * @example
 * // Example usage in a React component:
 * import BackButton from "@/components/auth/BackButton";
 * 
 * const SomeView = () => (
 *   <div>
 *     <h1>Some Page</h1>
 *     <BackButton text="Go Back" color="secondary" variant="contained" useGradient={true} />
 *   </div>
 * );
 */

"use client";

// MUI Component imports
import { Button, useTheme, Tooltip, IconButton, Box } from "@mui/material";

// MUI Icon imports
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Types
interface BackButtonProps {
  /** Optional button text, defaults to "Späť" */
  text?: string;
  /** Material-UI button color variant */
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /** Optional variant for different visual styles */
  variant?: 'text' | 'outlined' | 'contained' | 'icon';
  /** Optional tooltip text */
  tooltip?: string;
  /** Optional size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to use gradient effect */
  useGradient?: boolean;
}

/**
 * BackButton Component
 * 
 * A reusable back navigation button with modern UI effects.
 * Features:
 * - Multiple visual variants (text, outlined, contained, icon)
 * - Gradient effect option
 * - Hover animations
 * - Tooltip support
 * - Size variants
 * - Smart history navigation
 * 
 * @example
 * // Default usage
 * <BackButton />
 * 
 * // Icon only with tooltip
 * <BackButton variant="icon" tooltip="Go back" />
 * 
 * // Gradient contained button
 * <BackButton variant="contained" useGradient={true} />
 */
const BackButton = ({
  text = "Späť",
  color = "primary",
  variant = 'outlined',
  tooltip,
  size = 'medium',
  useGradient = false,
}: BackButtonProps) => {
  const theme = useTheme();

  // Navigate back or to home if no history
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const buttonStyles = {
    mt: 4,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    ...(useGradient && variant === 'contained' && {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      color: 'white',
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
      },
    }),
    ...(variant === 'outlined' && {
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 8px ${theme.palette.primary.main}30`,
      },
    }),
    ...(variant === 'text' && {
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
        transform: 'translateX(-4px)',
      },
    }),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
      transition: 'left 0.5s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
  };

  const iconStyles = {
    animation: 'none',
    transition: 'transform 0.3s ease',
    '.MuiButton-root:hover &': {
      transform: 'translateX(-4px)',
    },
  };

  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <IconButton
          color={color}
          onClick={handleGoBack}
          size={size}
          sx={{
            mt: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(-8deg)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      );
    }

    return (
      <Button
        variant={variant}
        color={color}
        size={size}
        startIcon={<ArrowBackIcon sx={iconStyles} />}
        onClick={handleGoBack}
        sx={buttonStyles}
      >
        {text}
      </Button>
    );
  };

  const button = renderButton();

  return tooltip ? (
    <Tooltip 
      title={tooltip}
      arrow
      placement="right"
      enterDelay={300}
      sx={{
        '& .MuiTooltip-arrow': {
          color: theme.palette.grey[700],
        },
        '& .MuiTooltip-tooltip': {
          backgroundColor: theme.palette.grey[700],
          fontSize: '0.875rem',
          padding: '8px 12px',
          borderRadius: '6px',
        },
      }}
    >
      <Box component="span">{button}</Box>
    </Tooltip>
  ) : button;
};

export default BackButton;
