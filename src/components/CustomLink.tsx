// src/components/CustomLink.tsx

"use client";

/**
 * @file CustomLink.tsx
 * @description
 * A reusable and customizable hyperlink component styled with Material-UI.
 * Designed to standardize link styles and provide flexible options for customization.
 * 
 * @usage
 * Use this component to create hyperlinks with customizable text, URL, color, and behavior (e.g., opening in a new tab).
 * Suitable for navigation, linking to external resources, or creating consistent links across the app.
 * 
 * @props
 * - `href` (required): The URL to which the link points.
 * - `text` (required): The text displayed for the link.
 * - `color` (optional): The color of the link. Accepts any valid Material-UI theme color (e.g., "primary", "secondary").
 *   Defaults to "secondary.main".
 * - `sx` (optional): An object containing additional styles to customize the link.
 *   Uses Material-UI's `SxProps<Theme>` for styling flexibility.
 * - `openInNewTab` (optional): Boolean flag to open the link in a new tab.
 *   Defaults to `false` (opens in the same tab).
 * 
 * @example
 * // Example 1: Default styling
 * <CustomLink href="/about" text="Learn more about us" />
 * 
 * @example
 * // Example 2: Customized color and behavior
 * <CustomLink
 *   href="https://example.com"
 *   text="Visit Example"
 *   color="primary.main"
 *   openInNewTab
 *   sx={{
 *     fontStyle: "normal",
 *     textDecoration: "underline",
 *   }}
 * />
 * 
 * @example
 * // Example 3: Additional hover effect
 * <CustomLink
 *   href="/features"
 *   text="Discover Features"
 *   sx={{
 *     "&:hover": {
 *       color: "primary.dark",
 *     },
 *   }}
 * />
 */

// MUI imports
import Link from "@mui/material/Link";
import { SxProps, Theme } from "@mui/system";

// TypeScript interfaces
interface CustomLinkProps {
  /** URL the link points to */
  href: string;
  /** Text displayed for the link */
  text: string;
  /** Optional custom color (Material-UI theme colors) */
  color?: string;
  /** Additional styles using Material-UI's SxProps */
  sx?: SxProps<Theme>;
  /** Whether to open the link in a new tab */
  openInNewTab?: boolean;
}

// Customizable link component with Material-UI styling
const CustomLink = ({
  href,
  text,
  color = "secondary.main",
  sx = {},
  openInNewTab = false,
}: CustomLinkProps) => (
  <Link
    href={href}
    target={openInNewTab ? "_blank" : "_self"}
    rel={openInNewTab ? "noopener noreferrer" : undefined}
    sx={{
      color,
      fontWeight: "bold",
      fontStyle: "italic",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
      ...sx,
    }}
  >
    {text}
  </Link>
);

export default CustomLink;


