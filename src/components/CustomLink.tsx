// src/components/CustomLink.tsx

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

// Props interface for CustomLink
interface LinkProps {
  href: string; // URL the link points to
  text: string; // Text displayed for the link
  color?: string; // Optional custom color (Material-UI theme colors)
  sx?: SxProps<Theme>; // Allow additional styles
  openInNewTab?: boolean; // Open link in a new tab
}

// Custom Link Component
const CustomLink = ({
  href,
  text,
  color = "secondary.main", // Default color
  sx = {}, // Default styles
  openInNewTab = false, // Default behavior to open in the same tab
}: LinkProps) => (
  <Link
    href={href}
    target={openInNewTab ? "_blank" : "_self"} // Set target based on prop
    rel={openInNewTab ? "noopener noreferrer" : undefined} // Add rel for security with _blank
    sx={{
      color, // Apply the passed color or default
      fontWeight: "bold", // Default bold text
      fontStyle: "italic", // Default italic text
      textDecoration: "none", // Default no underline
      "&:hover": {
        textDecoration: "underline", // Default underline on hover
      },
      ...sx, // Merge custom styles with defaults
    }}
  >
    {text}
  </Link>
);

export default CustomLink;


