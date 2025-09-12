'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';

type RoleType = 'admin' | 'user' | 'super_admin';
type Props = {
  role?: RoleType | RoleType[]; // single or multiple allowed roles
  children: React.ReactNode;
};


/**
 * ProtectedRoute component
 * 
 * A client-side wrapper component (Higher-Order Component) that protects a route
 * or a set of components from unauthorized access. It verifies the user's authentication
 * status and, optionally, their role before rendering its children.
 *
 * ## Features
 * - **Authentication Check**: On mount, it makes an API call to a `/users/me` endpoint to verify the user's session token and fetch their data.
 * - **Role-Based Authorization**: Accepts an optional `role` prop (either a single role or an array of roles) and checks if the authenticated user's role is permitted.
 * - **Automatic Redirection**: If the user is not authenticated or does not have the required role, they are automatically redirected to an appropriate login page.
 * - **Loading State**: Displays a `LoadingSpinner` component while the verification process is in progress, preventing child components from rendering prematurely.
 * - **Global State Hydration**: Upon successful verification, it populates the `useSellerStore` with the authenticated user's details.
 *
 * ## Logic Flow
 * 1.  When the component mounts, it immediately renders a `<LoadingSpinner />` because the `isReady` state is initially `false`.
 * 2.  A `useEffect` hook triggers the `verifyUser` function to start the authentication check.
 * 3.  `verifyUser` makes an API call to `GET /users/me`.
 * 4.  **Success Path**:
 * - The API returns a user object. The user's data is used to hydrate the global `useSellerStore`.
 * - If a `role` prop was passed, the component checks if the user's role is included in the allowed roles.
 * - If the role check passes (or if no role was required), the `isReady` state is set to `true`.
 * - The component re-renders, and because `isReady` is true, it renders its `children`.
 * - If the role check fails, the user is redirected to a fallback login page.
 * 5.  **Failure Path**:
 * - The API call to `/users/me` fails (e.g., 401 Unauthorized), indicating no valid session.
 * - The `catch` block executes, and the user is redirected to an appropriate login page based on the expected `role`. The children are never rendered.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `useRouter` from `next/navigation`.
 * - **State (Zustand Stores)**:
 * - `useSellerStore`: For hydrating with the authenticated user's data.
 * - **Key Components**:
 * - {@link LoadingSpinner}: The UI component displayed during the verification process.
 * - **Utilities**:
 * - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - `GET /users/me`: The primary endpoint to fetch the currently authenticated user's data and verify their session.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {RoleType | RoleType[]} [props.role] - A single role string or an array of roles that are allowed to access the wrapped content.
 * @param {React.ReactNode} props.children - The component(s) to be rendered if the user is authenticated and authorized.
 *
 * @returns {JSX.Element} The child components if authorized, otherwise a loading spinner or null during redirection.
 */
export default function ProtectedRoute({ role, children }: Props) {
  const {
    setSellerId,
    setSellerNumber,
    setSellerName,
    setSellerEmail,
    setUser
  } = useSellerStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get('users/me');
        const user = res.data;
        if (user.role == "admin") {
          setSellerNumber(user.contact_number);
          setSellerName(user.name);
          setSellerId(user.id);
          setSellerEmail(user.email);
        }
        setUser(user);


        //   if (role && user.role !== role) {
        //     // router.replace('/unauthorized');
        //     alert("Unauthorized");
        //      router.replace(role === 'admin' ? '/seller_signin' : role === 'user' ? '/customer_signin' : '/admin/login');
        //   } else {
        //     setIsReady(true);
        //   }
        // } catch (err) {
        //   // Not authenticated or token invalid
        //   router.replace(role === 'admin' ? '/seller_signin' : role === 'user' ? '/customer_signin' : '/admin/login');
        // }
        if (role) {
          const allowedRoles = Array.isArray(role) ? role : [role];
          if (!allowedRoles.includes(user.role)) {
            alert('Unauthorized access');
            const fallback = {
              admin: '/seller_signin',
              user: '/customer_signin',
              super_admin: '/admin/login'
            }[role && typeof role === 'string' ? role : allowedRoles[0]] || '/';
            router.replace(fallback);
            return;
          }
        }


        // Mark as ready if no role restriction or valid role
        setIsReady(true);

      } catch (err) {
        console.log('Error fetching user role:', role);

        const fallback = {
          admin: '/seller_signin',
          user: '/customer_signin',
          super_admin: '/admin/login'
        }[role && typeof role === 'string' ? role : Array.isArray(role) ? role[0] : 'user'] || '/';

        console.log('fallback route:', fallback);
        router.replace(fallback);
      }
    };

    verifyUser();
  }, []);

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return <>{children}</>; // render the children only if checks pass
}