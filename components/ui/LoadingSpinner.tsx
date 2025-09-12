/**
 * LoadingSpinner component
 * 
 * A simple, reusable UI component that displays a spinning loading indicator.
 * It is typically used to signify that a process is running in the background, such as data fetching.
 *
 * ## Features
 * - Renders a centered spinning circle animation.
 * - The animation is created entirely with Tailwind CSS utility classes (`animate-spin`).
 * - Designed to be centered on the screen (`h-screen`) for use as a full-page loader.
 * - This is a stateless, presentational component.
 *
 * ## Logic Flow
 * - This component is purely presentational and has no internal logic, state, or side effects.
 * - It renders a single `div` element styled to look and animate like a spinner.
 *
 * ## Imports
 * - This component has no external imports.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered loading spinner.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}