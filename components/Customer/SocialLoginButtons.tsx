// components/SocialLoginButtons.tsx
'use client';

import {useRouter} from 'next/navigation';

import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/axios';
import { useEffect } from 'react';

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

export default function SocialLoginButtons() {
    const router = useRouter();
    useEffect(()=>{
       router.prefetch("/customer_dashboard")
    },[])
    // ----------------- Google Login -----------------
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await api.post('/users/google', {
                    access_token: tokenResponse.access_token,
                });
                alert('Google login successful!');
                router.push('/customer_dashboard');
            } catch (err) {
                console.error('Google login error:', err);
                alert('Google login failed.');
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

                        alert('Facebook login successful!');
                        router.push('/customer_dashboard');
                    } catch (err) {
                        console.error('Facebook login error:', err);
                        alert('Facebook login failed.');
                    }
                })();``
            },
            { scope: 'email, public_profile' }
        );

    };

    return (
        <div className="w-full">
            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 mx-4"></div>
                <span className="text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300 mx-4"></div>
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center gap-6">
                <button
                    type="button"
                    aria-label="Login with Google"
                    onClick={() => handleGoogleLogin()}
                    className="w-12 h-12 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                    <Image src="/google-logo.png" alt="Google" width={40} height={40} />
                </button>
                <button
                    type="button"
                    aria-label="Login with Facebook"
                    onClick={handleFacebookLogin}
                    className="w-12 h-12 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                    <Image src="/facebook-logo.png" alt="Facebook" width={40} height={40} />
                </button>
            </div>
        </div>
    );
}
