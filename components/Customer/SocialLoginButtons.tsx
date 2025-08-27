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
            {/* Divider */}
            {/* <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 mx-4"></div>
                <span className="text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300 mx-4"></div>
            </div> */}

            {/* Social login buttons */}
            <div className={`${roboto.className} flex flex-col justify-center gap-[20px]`}
                style={{ fontWeight: 500 }}>
                {/* <button
                    type="button"
                    aria-label="Login with Facebook"
                    onClick={handleFacebookLogin}
                    className="w-[423px] h-[54px] rounded-xl bg-blue-500 shadow flex items-center justify-center hover:bg-blue-600 gap-2 cursor-pointer"
                >
                    <Image src="/Login/facebook_all_white.svg" alt="Facebook" width={24} height={24} />
                    <span className='text-xl text-white'>Sign In with Facebook</span>
                </button> */}
                <button
                    type="button"
                    aria-label="Login with Google"
                    onClick={() => handleGoogleLogin()}
                    className="w-[338px] h-[25px] rounded-xs md:w-[423px] md:h-[54px] md:rounded-xl bg-white shadow-sm shadow-black/30 flex items-center justify-center hover:bg-gray-100 gap-2 cursor-pointer"
                > 
                    <div className='relative w-[19px] h-[19px] md:w-[24px] md:h-[24px]'>
<Image src="/Login/google.svg" alt="Google" fill className='object-cover'/>
                    </div>
                    
                    <span className='text-base md:text-xl text-gray-400'>Sign In with Google</span>
                </button>

            </div>
        </div>
    );
}
