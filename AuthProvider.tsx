'use client'

import { useEffect } from 'react'
import useAuthStore from './store/auth'


/**
 * AuthProvider component
 * 
 * A client-side wrapper component responsible for initializing the application's
 * authentication state. It ensures that as soon as the app loads on the client, it checks
 * for an existing user session.
 *
 * ## Features
 * - **Initialization Trigger**: Uses a `useEffect` hook to call the `initializeAuth` function from the `useAuthStore` on the initial client-side render.
 * - **Non-Visual Wrapper**: This component does not render any UI itself; it simply returns its `children`, allowing it to be seamlessly wrapped around the application.
 *
 * ## Logic Flow
 * 1.  The component is rendered as part of the root layout.
 * 2.  On the initial client-side render, the `useEffect` hook is triggered once.
 * 3.  Inside the effect, it calls the `initializeAuth` function from the `useAuthStore`.
 * 4.  The `initializeAuth` function (defined within the Zustand store) is responsible for checking for a stored session token (e.g., in a cookie or localStorage) and updating the global auth state accordingly.
 * 5.  The component immediately renders its `children`, allowing the rest of the application to render without waiting for the auth check to complete.
 *
 * ## Imports
 * - **Core/Libraries**:
 *    - `useEffect` from `react`: For running the initialization logic as a side effect.
 * - **State (Zustand Stores)**:
 *    - `useAuthStore`: To access the `initializeAuth` action.
 *
 * ## API Calls
 * - This component does not make any direct API calls. However, the `initializeAuth` function that it triggers is expected to make an API call (e.g., to `/users/me`) to verify a session token and fetch user data.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider, typically the entire application.
 *
 * @returns {JSX.Element} The children of the provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore(state => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}