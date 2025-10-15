"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { api } from "@/lib/axios";
import Header from "@/components/Header";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore"; // you’ll create this like influencerStore

export default function MakeupArtistSignup() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [agreed, setAgreed] = useState(false);
  const [sendOTP, setSendOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const isPhoneValid = /^\d{10}$/.test(phone);

  const { setArtistId, setPhoneInternal, resetStore } = useMakeupArtistStore();

  // Prefetch routes
  useEffect(() => {
    resetStore();
    router.prefetch("/makeup_artist/onboarding");
  }, []);

  // Resend timer logic
  useEffect(() => {
    if (sendOTP && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sendOTP, resendTimer]);

  // OTP block release logic
  useEffect(() => {
    if (isBlocked && blockedUntil) {
      const now = new Date();
      const diff = blockedUntil.getTime() - now.getTime();
      if (diff > 0) {
        const timer = setTimeout(() => {
          setIsBlocked(false);
          setBlockedUntil(null);
        }, diff);
        return () => clearTimeout(timer);
      } else {
        setIsBlocked(false);
        setBlockedUntil(null);
      }
    }
  }, [isBlocked, blockedUntil]);

  // Handle OTP change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  // Handle Backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await api.post("/otp/send_otp", null, {
        params: { phone_number: phone, otp_template: "UserLoginOTP" },
      });
      toast.success("OTP resent successfully");
      setResendTimer(60);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  // ✅ Main form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sendOTP) {
      // Step 2: Verify OTP
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) return alert("Enter valid 6-digit OTP");

      try {
        await api.post("/otp/verify_otp", null, {
          params: { phone_number: phone, otp: fullOtp },
        });

        // ✅ Create user
        const userPayload = { contact_number: phone, role: "artist" };
        const userResp = await api.post("/users/register_user", userPayload);
        const userId = userResp.data.id;

        // ✅ Create Makeup Artist entry
        const artistPayload = {
          userId,
          phone_internal: phone,
        };
        const artistResp = await api.post(
          "/makeup_artists/create_with_mobile",
          artistPayload
        );

        const artistId = artistResp.data.id;
        setArtistId(artistId);
        setPhoneInternal(phone);

        await api.post("/users/login", { contact_number: phone });

        router.push("/makeup_artist/onboarding");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          const msg = error.response.data?.detail?.message ?? "Too many attempts";
          toast.error(msg);
        } else {
          toast.error("Verification failed. Please try again.");
        }
      }
    } else {
      // Step 1: Send OTP
      if (!isPhoneValid) return alert("Enter valid 10-digit phone number");
      if (!agreed) return alert("Accept Terms & Conditions first");

      try {
        const existing = await api.get("/makeup_artists/by-phone", {
          params: { phone_number: phone },
        });
        if (existing.data.exists) {
          toast.error("This number is already registered.");
          return;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          const confirmSend = window.confirm("Send OTP to this number?");
          if (!confirmSend) return;
          try {
            await api.post("/otp/send_otp", null, {
              params: { phone_number: phone, otp_template: "UserLoginOTP" },
            });
            setSendOTP(true);
            setPhoneInternal(phone);
          } catch {
            toast.error("Failed to send OTP");
          }
        } else {
          toast.error("Unexpected error, please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        title="Attirelly"
        actions={<button onClick={() => router.push(`/makeup_artist/signin`)}>Sign In</button>}
      />

      <main className="flex-grow flex items-center justify-center px-4 text-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Register as a Makeup Artist</h2>
          <p className="text-sm text-gray-500 mb-4">
            Verify your mobile number to start creating your artist profile.
          </p>

          <div className="flex justify-center mb-6">
            <Image
              src="/OnboardingSections/otp_image.png"
              alt="OTP Illustration"
              width={150}
              height={0}
            />
          </div>

          {/* Step 1: Phone Input */}
          {!sendOTP && (
            <>
              <label htmlFor="phone" className="block font-medium text-sm mb-1">
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                maxLength={10}
                pattern="\d{10}"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your mobile number"
                required
              />

              <div className="flex items-center mb-4">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  By continuing, you agree to our{" "}
                  <Link href="/term_and_condition" className="text-blue-600 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy_policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2: OTP Input */}
          {sendOTP && (
            <>
              <label className="block font-medium text-sm mb-1">
                Enter the verification code sent to {phone}
              </label>
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
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

              <div className="mt-3 text-center text-sm text-gray-600">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isBlocked}
                  className={`text-blue-600 hover:underline disabled:text-gray-400`}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>

              {isBlocked && blockedUntil && (
                <div className="text-red-600 text-sm mt-2 text-center">
                  Too many incorrect attempts. Try again at{" "}
                  {blockedUntil.toLocaleTimeString()}.
                </div>
              )}
            </>
          )}

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/makeup_artist/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
