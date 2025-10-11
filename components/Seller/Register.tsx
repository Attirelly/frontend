"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import axios from "axios";
import Header from "@/components/Header";
import { toast } from "sonner";

/**
 * SellerSignup component
 * 
 * The main registration page for new sellers. This component manages a two-step sign-up process
 * using phone number and OTP verification. It handles user validation, OTP logic, rate-limiting,
 * account creation, and final redirection to the onboarding flow.
 *
 * ## Features
 * - A two-step form: phone number input followed by OTP verification.
 * - **Phone Number Validation**: Checks for a valid 10-digit number and ensures the user agrees to terms before proceeding.
 * - **Pre-registration Check**: Verifies that the phone number is not already registered before sending an OTP.
 * - **OTP Input**: A user-friendly 6-digit input with auto-focusing and proper backspace handling.
 * - **Resend OTP**: A button to resend the OTP that becomes available after a 60-second cooldown.
 * - **Rate Limiting**: If OTP verification fails too many times, the form is temporarily blocked, and a message displays when the user can try again.
 * - **Account Creation & Redirection**: Upon successful verification, it registers the new user, logs them in, and routes them to the seller onboarding page.
 *
 * ## Logic Flow
 * 1.  On mount, the `useSellerStore` is reset to ensure a clean state for the new user.
 * 2.  The page initially displays a form for the user's phone number and a terms & conditions checkbox.
 * 3.  On submit, it first calls `GET /users/new_user_auth` to check if the phone number is available.
 * 4.  If the number is already registered (403 error), an error toast is shown.
 * 5.  If available, it calls `POST /otp/send_otp` to send a verification code.
 * 6.  The UI then switches to the 6-digit OTP input view, and a 60-second resend timer starts.
 * 7.  The user enters the OTP and submits again.
 * 8.  The `POST /otp/verify_otp` API is called. If verification fails with a 403 error (too many attempts), the component enters a blocked state.
 * 9.  If OTP verification is successful, it proceeds to call `POST /users/register_user` to create the account.
 * 10. Immediately after registration, it calls `POST /users/login` to create a session.
 * 11. Finally, it redirects the new seller to the onboarding flow at `/seller_signup/sellerOnboarding`.
 *
 * ## Imports
 * - **Core/Libraries**:
 * - `useEffect`, `useRef`, `useState` from `react`: For managing component lifecycle, state, and references.
 * - `useRouter`, `Link`, `Image` from `next/navigation`: For routing and optimized images.
 * - `axios`: For error type checking (e.g., `isAxiosError`).
 * - `toast` from `sonner`: For displaying user-friendly notifications.
 * - **State (Zustand Stores)**:
 * - `useSellerStore`: For managing global state related to the new seller's session (e.g., setting the seller ID).
 * - **Key Components**:
 * - {@link Header}: The reusable header component for the page.
 * - **Utilities**:
 * - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - GET `/users/new_user_auth`: Checks if a phone number is available for registration before sending an OTP.
 * - POST `/otp/send_otp`: Sends the initial OTP and handles resend requests.
 * - POST `/otp/verify_otp`: Verifies the OTP entered by the user.
 * - POST `/users/register_user`: Creates a new user account after successful OTP verification.
 * - POST `/users/login`: Logs the newly registered user in to create a session.
 *
 * ## Props
 * - This is a page component and does not accept any props.
 *
 * @returns {JSX.Element} The rendered seller sign-up page.
 */
export default function SellerSignup() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [sendOTP, setSendOTP] = useState(false);
  const { setSellerId, setSellerNumber } = useSellerStore();

  const [resendTimer, setResendTimer] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);

  const resetSellerStore = useSellerStore((state) => state.resetSellerStore);
  const isPhoneValid = /^\d{10}$/.test(phone);

  const router = useRouter();
  const testing_phone = "7015241757";

  /**
     * prefetching necessary routes
     */
  useEffect(() => {
    resetSellerStore();
    router.prefetch("/seller_signup/sellerOnboarding");
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  // API to resend OTP only if minimum time to resend otp is complete
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    try {
      await api.post("/otp/send_otp", null, {
        params: { phone_number: phone, otp_template: "UserLoginOTP" },
      });
      toast.success("OTP resent successfully");
      setResendTimer(60); // Restart resend timer
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  /**
     * Form submit logic
     * If form is submitted with mobile number i.e sendOtp is false
     *  - throws alert if phone number is not valid or user did not accept T&C
     *  - checks if user is already registered, if yes shows error
     *  - trigger api to send otp
     *  - set sendOtp to true
     * If form is submitted with OTP i.e. sendOtp is true
     *  - check if otp length is valid, if not return error
     *  - trigger api to verify otp
     *  - if successfully verified, send api to create/register user
     *  - route to seller onboarding
     */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendOTP) {
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) {
        alert("Please enter a valid 6-digit OTP");
        return;
      }
      try {
        await api.post("/otp/verify_otp", null, {
          params: { phone_number: phone, otp: fullOtp },
        });
        try {
          const payload = {
            contact_number: phone.toString(),
            role: "admin",
          };
          const response = await api.post("/users/register_user", payload);

          console.log(response);
          const newSellerId = response.data.id;
          console.log(newSellerId);
          setSellerId(newSellerId);
          await api.post("/users/login", { contact_number: phone });

          router.push("/seller_signup/sellerOnboarding");
        } catch (error) {
          console.error("Error fetching stores by section:", error);
          toast.error("Failed to sign up!");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          const detail = error.response.data?.detail;
          const msg = typeof detail === "string" ? detail : detail?.message;

          toast.error(msg || "Too many attempts. Please wait.");

          if (typeof msg === "string" && msg.includes("Try again after")) {
            const untilMatch = msg.match(/after (\d{2}:\d{2}:\d{2}) UTC/);
            if (untilMatch) {
              const now = new Date();
              const [hours, minutes, seconds] = untilMatch[1]
                .split(":")
                .map(Number);
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
    } else {
      if (!isPhoneValid) {
        alert("Please enter a valid 10-digit number.");
        return;
      }
      if (!agreed) {
        alert("You must accept the SMS authorization terms.");
        return;
      }
      try {
        const response = await api.get("/users/new_user_auth", {
          params: { contact_number: phone },
        });
        console.log(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            // Mobile number already exists
            // alert("Mobile number already exists");
            toast.error("Mobile number already exists");
            console.error("Mobile number already exists");
            return false;
          } else {
            console.error("Unexpected error:", error.message);
          }
        } else {
          console.error("Unknown error:", error);
        }

        return false;
      }
      const confirmed = window.confirm("Please confirm you phone number");
      if (!confirmed) return;
      try {
        await api.post("/otp/send_otp", null, {
          params: { phone_number: phone, otp_template: "UserLoginOTP" },
        });
        setSendOTP(true);
        // alert(`OTP sent to ${phone}`);
        setSellerNumber(phone);
      } catch {
        toast.error("Failed to send OTP!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header
        title="Attirelly"
        actions={
          <button
            onClick={() => router.push(`/seller_signin`)}
          >
            Sign In
          </button>
        }
      />

      {/* Body */}
      <main className="flex-grow flex items-center justify-center px-4 text-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Register as a seller</h2>
          <p className="text-sm text-gray-500 mb-4">
            Verifying the store's phone number is a great way to make sure your
            profile reflects your identity and keeps your account safe.
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
          <div className={sendOTP ? "hidden" : ""}>
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your mobile number"
              required
            />
            {/* Checkbox */}
            <div className="flex items-center mb-4">
              <input
                id="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                {/* By accepting, you agree to receive SMS for account authorization */}
                By accepting, you agree to <Link href="/term_and_condition" className="hover:underline text-blue-600 ">Terms and Condition</Link> and <Link href="privacy_policy" className="hover:underline text-blue-600 ">Privacy Policy</Link> of Attirelly.
              </label>
            </div>
            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Send OTP
            </button>
          </div>

          {/* OTP verification section */}
          <div className={sendOTP ? "" : "hidden"}>
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
            {/* Resend OTP + Block Message */}
            <div className="mt-2 text-center text-sm text-gray-600">
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
          </div>
          {/* Sign In link */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/seller_signin"
              className="text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
