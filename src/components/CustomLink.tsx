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

"use client";

// MUI imports
import Link from "@mui/material/Link";

// Props type
interface LinkProps {
  href: string; // URL the link points to
  text: string; // Text displayed for the link
  color?: string; // Optional custom color (Material-UI theme colors)
}

const CustomLink = ({ href, text, color = "secondary.main" }: LinkProps) => (
  <Link
    href={href}
    sx={{
      color, // Apply the passed color
      fontWeight: "bold", // Bold text
      textDecoration: "none", // Remove underline
      "&:hover": {
        textDecoration: "underline", // Add underline on hover
      },
    }}
  >
    {text}
  </Link>
);

export default CustomLink;
