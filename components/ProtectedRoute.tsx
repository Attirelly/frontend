'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';

type Props = {
  role?: 'admin' | 'user' | 'super_admin'; // optional prop to check role
  children: React.ReactNode;   // components inside this wrapper
};

export default function ProtectedRoute({ role, children }: Props) {
  const{
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
        if(user.role == "admin"){
          setSellerNumber(user.contact_number);
          setSellerName(user.name);
          setSellerId(user.id);
          setSellerEmail(user.email);
        }
        setUser(user);
        console.log(user);

        if (role && user.role !== role) {
          // router.replace('/unauthorized');
          alert("Unauthorized");
           router.replace(role === 'admin' ? '/seller_signin' : role === 'user' ? '/customer_signin' : '/admin/login');
        } else {
          setIsReady(true);
        }
      } catch (err) {
        // Not authenticated or token invalid
        router.replace(role === 'admin' ? '/seller_signin' : role === 'user' ? '/customer_signin' : '/admin/login');
      }
    };

    verifyUser();
  }, [router, role]);

  if(!isReady){
    return <LoadingSpinner />;
  }

  return <>{children}</>; // render the children only if checks pass
}