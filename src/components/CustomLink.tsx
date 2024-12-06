// src/components/CustomLink.tsx

/**
 * @file Link.tsx
 * @description
 * A reusable and customizable hyperlink component styled with Material-UI. 
 * Allows for consistent styling of links across the app.
 * 
 * @usage
 * Use this component to create hyperlinks with customizable text, URL, and color.
 * Ideal for navigation within forms, authentication views, or any page where 
 * a styled link is needed.
 * 
 * @props
 * - `href` (required): The URL to which the link points.
 * - `text` (required): The text displayed for the link.
 * - `color` (optional): The color of the link. Accepts any valid Material-UI theme color (e.g., "primary", "secondary").
 *   Defaults to "secondary.main".
 * 
 * @example
 * // Example usage in a React component:
 * import Link from "@/components/Link";
 * 
 * const ExampleComponent = () => (
 *   <div>
 *     <p>Don't have an account? <Link href="/signup" text="Sign up here" color="primary.main" /></p>
 *   </div>
 * );
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


