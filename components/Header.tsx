import { rosario, rubik } from '@/font';
import React from 'react';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

/**
 * Header component
 * 
 * A simple, reusable, and generic header component. It provides a consistent
 * layout with a title on the left and a flexible slot for actions on the right.
 *
 * ## Features
 * - Displays a prominent `title` on the left side of the header.
 * - Provides a flexible `actions` slot on the right, which can render any valid React node (e.g., a button, a link, an icon, etc.).
 * - The actions slot is styled to look like a clean, pill-shaped container.
 * - This is a stateless, presentational component designed for maximum reusability.
 *
 * ## Logic Flow
 * - This component is purely presentational and has no internal logic or state.
 * - It directly renders the `title` and `actions` props it receives from its parent.
 *
 * ## Imports
 * - **Core/Libraries**: `React` for creating the component.
 * - **Utilities**: `rosario`, `rubik` from `@/font` for consistent typography.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {string} props.title - The text to be displayed as the main title of the header.
 * @param {React.ReactNode} [props.actions] - Any valid React element to be rendered in the actions slot on the right side.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({ title, actions }: HeaderProps) {
  return (
          
    <header className="flex justify-between items-center px-6 py-2 bg-white">
      <h1 className={`${rosario.className} text-[24px] md:text-[30px] text-[#373737] cursor-pointer`} style={{fontWeight:700}}>{title}</h1>
      <div className="px-2 md:px-4 rounded-full 
             bg-white border border-gray-300 
             text-gray-800 font-medium text-sm
             hover:border-gray-400 hover:cursor-pointer
             active:scale-95
             focus:outline-none focus:ring-2 focus:ring-offset-2">{actions}</div>
    </header>
  );
}