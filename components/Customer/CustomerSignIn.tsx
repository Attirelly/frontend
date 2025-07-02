import Image from "next/image";
import { manrope } from "@/font";
import SocialLoginButtons from "./SocialLoginButtons";

interface CustomerSignInProps {
  onClose: () => void;
}

export default function CustomerSignIn({ onClose }: CustomerSignInProps) {
  const img = '/Login/CustomerLogin.svg';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <div className="grid grid-cols-[1fr_1.5fr] gap-6">
          <div className="relative w-60 h-60">
            <Image src={img} alt="Customer Signin" fill className="rounded" />
          </div>

          <div className={`${manrope.className} flex flex-col justify-center`} style={{ fontWeight: 700 }}>
            <span className="text-2xl">Sign up to</span>
            <span className="text-base font-normal">the new style of wearing Ethic with Attirelly</span>
            <div className="mt-4">
              <SocialLoginButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
