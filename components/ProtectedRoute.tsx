'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Props = {
  role?: 'seller' | 'customer'; // optional prop to check role
  children: React.ReactNode;   // components inside this wrapper
};

export default function ProtectedRoute({ role, children }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const credentialsStr = localStorage.getItem('credentials');
    const credentials = credentialsStr ? JSON.parse(credentialsStr) : null;  // get auth token from localStorage
    const userRole = localStorage.getItem('user_role');         // get saved role: 'seller' or 'customer'
    const access_token = credentials?.access_token;
    // If token is missing, redirect to login
    if (!access_token) {
      router.replace(role === 'seller' ? '/seller_signin' : '/customer_signin');
    } 
    // If user has a token but their role doesn't match
    else if (role && userRole !== role) {
      router.replace('/unauthorized');  // redirect to optional unauthorized page
    }
    else{
        setIsReady(true);
    }
  }, [router, role]);

  if(!isReady){
    return <LoadingSpinner />;
  }

  return <>{children}</>; // render the children only if checks pass
}