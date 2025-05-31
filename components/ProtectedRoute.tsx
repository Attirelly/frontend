'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/axios';

type Props = {
  role?: 'admin' | 'user'; // optional prop to check role
  children: React.ReactNode;   // components inside this wrapper
};

export default function ProtectedRoute({ role, children }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get('users/me'); 
        const user = res.data;
        console.log(user);

        if (role && user.role !== role) {
          router.replace('/unauthorized');
        } else {
          setIsReady(true);
        }
      } catch (err) {
        // Not authenticated or token invalid
        router.replace(role === 'admin' ? '/seller_signin' : '/customer_signin');
      }
    };

    verifyUser();
  }, [router, role]);

  if(!isReady){
    return <LoadingSpinner />;
  }

  return <>{children}</>; // render the children only if checks pass
}