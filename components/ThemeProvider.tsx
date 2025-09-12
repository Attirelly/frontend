"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * ThemeProvider component
 * A client-side wrapper component that provides theme management capabilities
 * to the entire application using the `next-themes` library.
 *
 * ## Features
 * - **Context Provider**: Wraps the application to make theme information and controls available to all descendant components.
 * - **Configuration**:
 * - `attribute="class"`: Configures `next-themes` to toggle themes by adding a class (e.g., `dark`) to the `<html>` element, enabling theme-based styling with Tailwind CSS.
 * - `defaultTheme="system"`: Sets the initial theme to match the user's operating system preference (light or dark).
 * - `enableSystem`: Enables the automatic detection and application of the system theme.
 *
 * ## Logic Flow
 * - This component is a simple, stateless wrapper.
 * - It renders the `NextThemeProvider` from the `next-themes` library.
 * - It passes its own `children` prop into the provider, making the theme context available to the rest of the application.
 *
 * ## Imports
 * - **Core/Libraries**:
 * - `ThemeProvider as NextThemeProvider` from `next-themes`: The core context provider from the library.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the theme provider, typically the entire application.
 *
 * @returns {JSX.Element} The theme provider wrapping its children.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}