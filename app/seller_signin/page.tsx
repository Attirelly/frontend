'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { send } from 'process';
import Image from "next/image";
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios'
import Header from '@/components/Header';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';



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

    const isPhoneValid = /^\d{10}$/.test(phone);
    const router = useRouter();

    useEffect(() => {
        console.log('started');
        router.prefetch('/seller_dashboard');
        router.prefetch('/seller_signup/sellerOnboarding');
        console.log(router);
    }, []);

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

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputsRef.current[index - 1]?.focus();
        }
    };

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
                await api.post('/otp/verify_otp', null ,{ params: { phone_number: phone, otp: fullOtp } })
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
                toast.error("OTP not correct")
            }

            // if success
            // if (fullOtp === '123456') {
            //     try {
            //         // here we will create jwt tokens
            //         await api.post("/users/login", { contact_number: phone });
            //         if (currSection < 5) {
            //             toast.error("Please complete onboarding first!")
            //             try {
            //                 await api.post("/users/login", { contact_number: phone });
            //                 router.push('/seller_signup/sellerOnboarding')
            //             } catch (error) {
            //                 toast.error("failed to login");
            //             }
            //         }
            //         else {
            //             router.push('/seller_dashboard');
            //             toast.success("logged in successfully");
            //         }
            //     }
            //     catch (error) {
            //         console.error('Error fetching stores by section:', error);
            //     }
            // }
            // else {
            //     alert('wrong otp');
            //     return;
            // }
        }
        else {

            if (!isPhoneValid) {
                alert('Please enter a valid 10-digit number.');
                return;
            }
            try {

                const response = await api.get('/users/user', { params: { phone_number: phone } });
                console.log(response);
                const user_data = response.data;
                const curr_section_res = await api.get('/stores/get_store_section', { params: { user_id: user_data.id } })
                console.log(curr_section_res)
                setCurrSection(curr_section_res.data);
                // if(curr_section < 5){
                //     toast.error("Onboarding not completed!")
                //     return;
                // }
                setSellerId(user_data.id);
                setSellerName(user_data.name);
                setSellerEmail(user_data.email);
                try {
                    await api.post('/otp/send_otp', null ,{ params: { phone_number: phone, otp_template: "UserLoginOTP" } })
                    setSendOTP(true);
                    alert(`OTP sent to ${phone}`);
                    setSellerNumber(phone);
                }
                catch {
                    toast.error("Failed to send OTP!");
                }

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log('Status Code:', error.response.status);
                    console.log('Response Data:', error.response.data);
                    alert(`Error : ${error.response.data?.message || 'Something went wrong'}, Please Sign In`);
                    return;
                } else {
                    console.log('Unexpected error:', error);
                    alert('An unexpected error occurred. Please try again.');
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
                        className="border border-gray-600 px-4 py-1 shadow-lg text-sm rounded hover:bg-blue-100"
                        href="/seller_signup" >
                        Sign Up
                    </Link>
                }
            />

            {/* Body */}
            <main className="flex-grow flex items-center justify-center px-4">
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
                            Brand owner number<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            maxLength={10}
                            pattern="\d{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your mobile number"
                            required
                        />
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
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
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                        >
                            Verify OTP
                        </button>
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
