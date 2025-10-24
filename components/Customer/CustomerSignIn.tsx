import Image from "next/image";
import { manrope } from "@/font";
import SocialLoginButtons from "./SocialLoginButtons";

interface CustomerSignInProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerSignIn({ onClose, onSuccess }: CustomerSignInProps) {
  const img = '/Login/CustomerLogin.svg';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-10">
      <div className="bg-white rounded-lg w-full max-w-lg md:max-w-3xl shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 px-6 py-8 lg:px-8 lg:py-10">
          {/* Left image */}
          <div className="relative w-full aspect-square">
  <Image
    src={img}
    alt="Customer Signin"
    fill
    className="object-cover object-top rounded-2xl"
  />
</div>

          {/* Right text + buttons */}
          <div className={`${manrope.className} flex flex-col justify-center`}>
            <span className="text-lg md:text-xl lg:text-2xl font-bold text-black">
              Sign up to
            </span>
            <span className="text-sm md:text-base text-black font-normal">
              the new style of wearing Ethic with Attirelly
            </span>
            <div className="mt-4">
              <SocialLoginButtons onSuccess={onSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
