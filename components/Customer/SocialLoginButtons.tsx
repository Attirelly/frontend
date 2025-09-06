// components/SocialLoginButtons.tsx
'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';

import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/axios';
import { useEffect } from 'react';
import { roboto } from '@/font';
import { toast } from 'sonner';

type FacebookLoginResponse = {
    status: string;
    authResponse?: {
        accessToken: string;
        userID: string;
        expiresIn: number;
        signedRequest: string;
        reauthorize_required_in: number;
    };
};

export default function SocialLoginButtons({ onSuccess }: { onSuccess: () => void }) {
    const { fetchUser } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        router.prefetch("/customer_dashboard")
    }, [])
    // ----------------- Google Login -----------------
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await api.post('/users/google', {
                    access_token: tokenResponse.access_token,
                });
                fetchUser();
                onSuccess();
                alert('Google login successful!');
                // router.push('/customer_dashboard');
            } catch (err) {
                console.error('Google login error:', err);
                toast.error('Google login failed.');
            }
        },
        onError: () => {
            alert('Google Sign In Failed');
        },
        scope: 'openid email profile',
    });

    // ----------------- Facebook Login -----------------
    const handleFacebookLogin = () => {
        if (!window.FB) {
            alert('Facebook SDK not loaded');
            return;
        }

        window.FB.login(
            function (response: FacebookLoginResponse) {
                if (!response.authResponse) {
                    alert('Facebook login cancelled');
                    return;
                }
                (async () => {
                    try {
                        const res = await api.post('/users/facebook', {
                            access_token: response.authResponse?.accessToken,
                            userID: response.authResponse?.userID,
                        });
                        fetchUser();
                        onSuccess();
                        alert('Facebook login successful!');
                        // router.push('/customer_dashboard');
                    } catch (err) {
                        console.error('Facebook login error:', err);
                        alert('Facebook login failed.');
                    }
                })();
            },
            { scope: 'email, public_profile, commerce_account_read_settings' }
        );

    };

    return (
         <div className="w-full">
      <div
        className={`${roboto.className} flex flex-col items-center gap-4`}
        style={{ fontWeight: 500 }}
      >
        <button
          type="button"
          aria-label="Login with Google"
          onClick={() => handleGoogleLogin()}
          className="w-full sm:w-72 md:w-96 h-10 sm:h-12 md:h-14 rounded-lg bg-white shadow-sm shadow-black/30 flex items-center justify-center hover:bg-gray-100 gap-2 cursor-pointer"
        >
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <Image src="/Login/google.svg" alt="Google" fill className="object-contain" />
          </div>
          <span className="text-sm sm:text-base md:text-lg text-gray-500">
            Sign In with Google
          </span>
        </button>
      </div>
    </div>
    );
}
