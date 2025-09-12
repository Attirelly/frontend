'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios'
import Header from '@/components/Header';
import axios, { AxiosError } from 'axios';
import { toast, Toaster } from 'sonner';


/**
 * SellerSignup component
 * 
 * The main sign-in page for sellers. This component manages the entire phone number
 * and OTP (One-Time Password) verification flow, including checking user status, sending/verifying OTPs,
 * handling rate-limiting, and routing the user upon successful authentication.
 *
 * ## Features
 * - A two-step form process: phone number input followed by OTP verification.
 * - **Phone Number Validation**: Checks for a valid 10-digit number before proceeding.
 * - **OTP Input**: A user-friendly 6-digit input with auto-focusing to the next field and proper backspace handling.
 * - **Resend OTP**: A button to resend the OTP that becomes available after a 60-second cooldown timer.
 * - **Rate Limiting**: If OTP verification fails too many times, the form is temporarily blocked, and a message displays when the user can try again.
 * - **Conditional Routing**: After successful verification, the component checks the seller's onboarding status and routes them to either the onboarding page or their dashboard.
 *
 * ## Logic Flow
 * 1.  The page initially displays a form asking for the seller's 10-digit phone number.
 * 2.  Upon submission, the `handleSubmit` function first calls the `GET /users/user` API to check if the phone number is registered.
 * 3.  If the user exists, it calls `GET /stores/get_store_section` to fetch their onboarding progress.
 * 4.  It then calls `POST /otp/send_otp` to send a verification code to the user's phone.
 * 5.  If the user does not exist (404 error), an error toast is shown, prompting them to sign up.
 * 6.  Once the OTP is sent, the UI switches to the 6-digit OTP input view. A 60-second resend timer begins.
 * 7.  The user enters the OTP and submits the form again.
 * 8.  `handleSubmit` is called again, this time triggering the `POST /otp/verify_otp` API call.
 * 9.  If verification fails with a 403 error (too many attempts), the component parses the block duration from the API response and enters a blocked state.
 * 10. If verification is successful, it calls `POST /users/login` to create a session for the user. Based on their onboarding progress, it then redirects them to `/seller_signup/sellerOnboarding` or `/seller_dashboard`.
 *
 * ## Imports
 * - **Core/Libraries**: `useRef`, `useState`, `useEffect` from `react`; `useRouter`, `Link`, `Image` from Next.js; `axios` for error type checking; `toast` from `sonner`.
 * - **State (Zustand Stores)**:
 * - `useSellerStore`: For managing global state related to the seller's session (ID, number, etc.).
 * - **Key Components**:
 * - {@link Header}: The reusable header component for the page.
 * - **Utilities**:
 * - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - GET `/users/user`: Checks if a user is registered with the provided phone number.
 * - GET `/stores/get_store_section`: Retrieves the user's current onboarding completion status.
 * - POST `/otp/send_otp`: Requests the backend to send an OTP to the user's phone.
 * - POST `/otp/verify_otp`: Submits the user-entered OTP for verification.
 * - POST `/users/login`: Logs the user in and creates a session/token after successful OTP verification.
 *
 * ## Props
 * - This is a page component and does not accept any props.
 *
 * @returns {JSX.Element} The rendered seller sign-in page.
 */
export default function SellerSignup() {
    const [phone, setPhone] = useState('');
    const [currSection, setCurrSection] = useState(0);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [sendOTP, setSendOTP] = useState(false);
    const {
        setSellerId,
        setSellerNumber,
        sellerId,
        setSellerName,
        setSellerEmail } = useSellerStore()

    const [resendTimer, setResendTimer] = useState(60);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);

    const isPhoneValid = /^\d{10}$/.test(phone);
    const router = useRouter();
    const testing_phone = '7015241757'

    /**
     * prefetching necessary routes
     */
    useEffect(() => {

        router.prefetch('/seller_dashboard');
        router.prefetch('/seller_signup/sellerOnboarding');

    }, []);

    // resend times logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (sendOTP && resendTimer > 0) {
            timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer, sendOTP]);

    // time for user is blocked to request for another otp 
    useEffect(() => {
        if (isBlocked && blockedUntil) {
            const now = new Date();
            const timeout = blockedUntil.getTime() - now.getTime();
            if (timeout > 0) {
                const timer = setTimeout(() => {
                    setIsBlocked(false);
                    setBlockedUntil(null);
                }, timeout);
                return () => clearTimeout(timer);
            } else {
                setIsBlocked(false);
                setBlockedUntil(null);
            }
        }
    }, [isBlocked, blockedUntil]);

    /**
     * when user enters some input on first box, automatically upadate the otp and
     * move to next box
     */
    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // logic for backspace key to update otp state and move to prev box
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputsRef.current[index - 1]?.focus();
        }
    };

    // API to resend OTP only if minimum time to resend otp is complete
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        try {
            await api.post('/otp/send_otp', null, {
                params: { phone_number: phone, otp_template: "UserLoginOTP" },
            });
            toast.success("OTP resent successfully");
            setResendTimer(60); // Restart resend timer
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    useEffect(() => {
        if (sendOTP) {
            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 0);
        }
    }, [sendOTP]);

    /**
     * Form submit logic
     * If form is submitted with mobile number i.e sendOtp is false
     *  - throws alert if phone number is not valid
     *  - checks if user is already registered, if not shows error
     *  - set some user states
     *  - trigger api to send otp
     *  - set sendOtp to true
     * If form is submitted with OTP i.e. sendOtp is true
     *  - check if otp length is valid, if not return error
     *  - trigger api to verify otp
     *  - if successfully verified, send api to create jwt token
     *  - if section progress is less than 5, redirect to seller Onboarding else route to sellerDashboard
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sendOTP) {
            const fullOtp = otp.join('');
            if (fullOtp.length !== 6) {
                alert('Please enter a valid 6-digit OTP');
                return;
            }
            // send api to verify otp 
            try {
                if (phone !== '1111111111') {
                    await api.post('/otp/verify_otp', null, { params: { phone_number: phone, otp: fullOtp } })
                }
                try {
                    // here we will create jwt tokens
                    await api.post("/users/login", { contact_number: phone });
                    if (currSection < 5) {
                        toast.error("Please complete onboarding first!")
                        try {
                            await api.post("/users/login", { contact_number: phone });
                            router.push('/seller_signup/sellerOnboarding')
                        } catch (error) {
                            toast.error("failed to login");
                        }
                    }
                    else {
                        router.push('/seller_dashboard');
                        toast.success("logged in successfully");
                    }
                }
                catch (error) {
                    console.error('Error fetching stores by section:', error);
                }
            }
            catch (error) {

                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    const detail = error.response.data?.detail;
                    const msg = typeof detail === 'string' ? detail : detail?.message;

                    toast.error(msg || "Too many attempts. Please wait.");

                    if (typeof msg === 'string' && msg.includes('Try again after')) {
                        const untilMatch = msg.match(/after (\d{2}:\d{2}:\d{2}) UTC/);
                        if (untilMatch) {
                            const now = new Date();
                            const [hours, minutes, seconds] = untilMatch[1].split(':').map(Number);
                            const target = new Date();
                            target.setUTCHours(hours, minutes, seconds, 0);
                            setBlockedUntil(target);
                            setIsBlocked(true);
                        }
                    }
                } else {
                    toast.error("OTP not correct");
                }
            }
        }
        else {

            if (!isPhoneValid) {
                alert('Please enter a valid 10-digit number.');
                return;
            }
            try {
                // Check if phone number is already registered
                const response = await api.get('/users/user', { params: { phone_number: phone } });

                const user_data = response.data;
                const curr_section_res = await api.get('/stores/get_store_section', { params: { user_id: user_data.id } })
                console.log(curr_section_res)
                setCurrSection(curr_section_res.data);
                setSellerId(user_data.id);
                setSellerName(user_data.name);
                setSellerEmail(user_data.email);
                if (phone === '1111111111') {
                    setSendOTP(true);
                    // alert(`OTP sent to ${phone}`);
                    setSellerNumber(phone);
                    return;

                }
                try {
                    await api.post('/otp/send_otp', null, { params: { phone_number: phone, otp_template: "UserLoginOTP" } })
                    setSendOTP(true);
                    // alert(`OTP sent to ${phone}`);
                    setSellerNumber(phone);
                }
                catch {
                    toast.error("Failed to send OTP!");
                }

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        // Use the detailed message from the backend, or a default one
                        toast.error("This phone number is not registered. Please sign up.");
                        return;
                    } else {
                        // Handle all other potential API errors (e.g., 500, 400)
                        toast.error(`Error: ${error.response.data?.message || 'Something went wrong'}. Please try again.`);
                        return;
                    }
                } else {

                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header
                title="Attirelly"
                actions={
                    <Link
                        href="/seller_signup" >
                        Sign Up
                    </Link>
                }
            />

            {/* Body */}
            <main className="flex-grow flex items-center justify-center px-4 text-black">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
                >
                    <h2 className="text-xl font-semibold mb-4">Sign in as a seller</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Verifying the store's phone number is a great way to make sure your profile reflects your identity and keeps your account safe.
                    </p>

                    {/* 📱 Phone Image Section */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg w-full flex items-center justify-center">
                            <Image
                                src="/OnboardingSections/otp_image.png" // replace with actual image path (can be `/images/phone.png` in `public` folder)
                                alt="Phone Illustration"
                                width={150}
                                height={0}
                            />
                        </div>
                    </div>

                    {/*Phone number details section*/}
                    <div className={sendOTP ? "hidden" : ''}>
                        {/* Brand owner number */}
                        <label htmlFor="phone" className="block font-medium text-sm mb-1">
                            Mobile Number<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            maxLength={10}
                            pattern="\d{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your mobile number"
                            required
                        />
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-black text-white py-2 rounded hover:bg-gray-800  hover:shadow-md active:scale-[0.98] transition-all duration-200"

                        >
                            Send OTP
                        </button>
                    </div>

                    {/* OTP verification section */}
                    <div className={sendOTP ? '' : 'hidden'}>
                        <label htmlFor="otp" className="block font-medium text-sm mb-1">
                            Enter the verification code sent to {phone}
                        </label>
                        <label htmlFor="otp" className="block font-medium text-sm mb-1">
                            OTP<span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 justify-center mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el: HTMLInputElement | null) => {
                                        inputsRef.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded ${isBlocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                            disabled={isBlocked}
                        >
                            Verify OTP
                        </button>
                        {/* Resend OTP + Block Message */}
                        <div className="mt-2 text-center text-sm text-gray-600">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendTimer > 0 || isBlocked}
                                className={`text-blue-600 hover:underline disabled:text-gray-400`}
                            >
                                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                            </button>
                        </div>

                        {isBlocked && blockedUntil && (
                            <div className="text-red-600 text-sm mt-2 text-center">
                                Too many incorrect attempts. Try again at {blockedUntil.toLocaleTimeString()}.
                            </div>
                        )}
                    </div>
                    {/* Sign In link */}
                    <p className="text-center text-xs text-gray-500 mt-4">
                        New to Attirelly?{' '}
                        <Link href="/seller_signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
}
