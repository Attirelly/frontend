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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-gray-600 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 
                        lg:grid-cols-[1fr_1.5fr] gap-[40px] px-[20px] pb-[20px] lg:px-[21px] lg:py-[26px]
                        justify-items-center
                        mt-10 lg:mt-0">
          <div className="relative w-[277px] h-[221px] md:w-[338px] md:h-[221px] lg:w-[277px] lg:h-[277px]">
            <Image src={img} alt="Customer Signin" fill className="object-cover object-top rounded-2xl" />
          </div>

          <div className={`${manrope.className} flex flex-col justify-center`} style={{ fontWeight: 700 }}>
            <span className="text-[19px] lg:text-2xl text-black">Sign up to</span>
            <span className="text-[12px] lg:text-base text-black" style={{ fontWeight: 400 }}>the new style of wearing Ethic with Attirelly</span>
            <div className="mt-4">
              <SocialLoginButtons onSuccess={onSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
