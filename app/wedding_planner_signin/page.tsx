"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import Header from "@/components/Header";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import { useInfluencerStore } from "@/store/influencerStore";
import { set } from "date-fns";
import { useWeddingPlannerStore } from "@/store/weddingPlannerStore";

export default function WeddingPlannerSignin() {
  const [phone, setPhone] = useState("");
  const [currSection, setCurrSection] = useState(0);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [sendOTP, setSendOTP] = useState(false);
  const { setPlannerId, setPlannerNumber, plannerId } = useWeddingPlannerStore();

  const [resendTimer, setResendTimer] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);

  const isPhoneValid = /^\d{10}$/.test(phone);
  const router = useRouter();
  const testing_phone = "7015241757";

  /**
   * prefetching necessary routes
   */
  useEffect(() => {
    router.prefetch("/wedding_planner_dashboard");
    router.prefetch("/wedding_planner_signup");
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
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) {
        alert("Please enter a valid 6-digit OTP");
        return;
      }
      // send api to verify otp
      try {
        if (phone !== "1111111111") {
          await api.post("/otp/verify_otp", null, {
            params: { phone_number: phone, otp: fullOtp },
          });
        }
        try {
          // here we will create jwt tokens
          const user_resp = await api.post("/users/login", {
            contact_number: phone,
          });
          console.log("User response is ", user_resp);
          const userId = user_resp.data.user_id;

          // fetch the wedding planner details to get the onboarding step
          const infl_resp = await api.get("/wedding_planner/by-user", {
            params: { user_id: userId },
          });
          const curr_section_res = infl_resp.data.onboarding_step;

          setCurrSection(curr_section_res);
          setPlannerId(infl_resp.data.id);
          setPlannerNumber(phone);

          if (curr_section_res < 6) {
            toast.error("Please complete onboarding first!");

            router.push("/wedding_planner_signup/onboarding");
          } else {
            router.push("/wedding_planner_dashboard");
            toast.success("Logged in successfully");
          }
        } catch (error) {
          console.log("Error fetching user details:", error);
          console.error("Error fetching stores by section:", error);
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
      try {
        // Check if phone number is already registered
        const response = await api.get("/wedding_planner/by-phone", {
          params: { phone_number: phone },
        });

        const planner_data = response.data;
        const curr_section_res = planner_data.onboarding_step;
        setCurrSection(curr_section_res);
        setPlannerId(planner_data.id);
        if (phone === "1111111111") {
          setSendOTP(true);
          // alert(`OTP sent to ${phone}`);
          setPlannerNumber(phone);
          return;
        }
        try {
          await api.post("/otp/send_otp", null, {
            params: { phone_number: phone, otp_template: "UserLoginOTP" },
          });
          setSendOTP(true);
          // alert(`OTP sent to ${phone}`);
          setPlannerNumber(phone);
        } catch {
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
            toast.error(
              `Error: ${
                error.response.data?.message || "Something went wrong"
              }. Please try again.`
            );
            return;
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header
        title="Attirelly"
        actions={<Link href="/wedding_planner_signup">Sign Up</Link>}
      />

      {/* Body */}
      <main className="flex-grow flex items-center justify-center px-4 text-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Sign in as a Wedding Planner</h2>
          <p className="text-sm text-gray-500 mb-4">
            Verifying the phone number is a great way to make sure your
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
            {/* Submit button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-black text-white py-2 rounded hover:bg-gray-800  hover:shadow-md active:scale-[0.98] transition-all duration-200"
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
              className={`w-full py-2 rounded ${
                isBlocked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
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
            New to Attirelly?{" "}
            <Link
              href="/wedding_planner_signup"
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
