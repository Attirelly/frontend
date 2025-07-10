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
        console.log('Authenticated user:',user);

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
            }[user.role as RoleType] || '/';
            router.replace(fallback);
            return;
          }
        }

        // Mark as ready if no role restriction or valid role
        setIsReady(true);

      } catch (err) {
        const fallback = {
          admin: '/seller_signin',
          user: '/customer_signin',
          super_admin: '/admin/login'
        }[(role && typeof role === 'string') ? role : 'user'] || '/';
        router.replace(fallback);
      }
    };

    verifyUser();
  }, []);

  if(!isReady){
    return <LoadingSpinner />;
  }

  return <>{children}</>; // render the children only if checks pass
}