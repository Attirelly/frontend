'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { send } from 'process';
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios'
import Header from '@/components/Header';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import SocialLoginButtons from '@/components/Customer/SocialLoginButtons';



export default function SellerSignup() {
    const [phone, setPhone] = useState('');
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

    useEffect(()=>{
     router.prefetch('/customer_signin')
    },[])

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

            // if success
            if (fullOtp === '123456') {
                try {
                    router.push('/customer_dashboard');
                }
                catch (error) {
                    console.error('Error fetching stores by section:', error);
                }
            }
            else {
                alert('wrong otp');
                return;
            }
        }
        else {

            if (!isPhoneValid) {
                alert('Please enter a valid 10-digit number.');
                return;
            }
            try {

                const response = await api.get('/users/user', { params: { phone_number: phone } });
                console.log(response);
                setSellerId(response.data.id);
                setSellerName(response.data.name);
                setSellerEmail(response.data.email);
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

            setSellerNumber(phone);

            setSendOTP(true);
            // Handle sending OTP
            alert(`OTP sent to ${phone}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header
                title="Attirelly"
                actions={
                    <button
                        className="border border-gray-600 px-4 py-1 shadow-lg text-sm rounded hover:bg-blue-100"
                        onClick={() => router.push(`/customer_signin`)}>
                        Sign In
                    </button>
                }
            />

            {/* Body */}
            <main className="flex-grow flex items-center justify-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
                >
                    <h2 className="text-xl font-semibold mb-4">Register as a customer</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Verifying the customer's phone number is a great way to make sure your profile reflects your identity and keeps your account safe.
                    </p>

                    {/*Phone number details section*/}
                    <div className={sendOTP ? "hidden" : ''}>
                        {/* Brand owner number */}
                        <label htmlFor="phone" className="block font-medium text-sm mb-1">
                            Phone number<span className="text-red-500">*</span>
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
                        Already have an account?{' '}
                        <Link href="/customer_signin" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>

                    <SocialLoginButtons/>

                </form>
            </main>
        </div>
    );
}
