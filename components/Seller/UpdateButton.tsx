'use client';

type UpdateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

/**
 * UpdateButton component
 * 
 * A simple, reusable button component specifically styled for "Update" actions,
 * typically used at the bottom of forms in the seller dashboard.
 *
 * ## Features
 * - Renders a button with the static text "Update".
 * - Has a consistent visual style (white background, gray border).
 * - Supports a `disabled` state, which is visually indicated by reduced opacity and a "not-allowed" cursor.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives an `onClick` handler and an optional `disabled` boolean via props.
 * - The `onClick` prop is passed directly to the `<button>` element's `onClick` event.
 * - The `disabled` prop controls both the button's `disabled` attribute and its conditional CSS classes.
 *
 * ## Imports
 * - This component has no external imports.
 *
 * ## API Calls
 * - This component does not make any direct API calls. It triggers an `onClick` function
 * provided by its parent, which is responsible for initiating any API requests.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {() => void} props.onClick - The function to be executed when the button is clicked.
 * @param {boolean} [props.disabled=false] - A flag to disable the button and change its appearance.
 *
 * @returns {JSX.Element} The rendered update button.
 */
export default function UpdateButton({ onClick, disabled = false }: UpdateButtonProps) {
  return (
    <div className="mt-6">
      <button
        className={`px-6 py-2 rounded-full 
             bg-white border border-gray-300 
             text-gray-800 font-medium text-sm
             hover:border-gray-400 hover:cursor-pointer
              ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        Update
      </button>
    </div>
  );
}
