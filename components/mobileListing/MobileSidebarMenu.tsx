import Link from "next/link";
import Image from "next/image";

type Props = {
  onClose: () => void;
  onLoginClick: () => void;
};

export default function MobileSidebarMenu({ onClose, onLoginClick }: Props) {
  return (
    <div className="h-fit inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="w-[50%] bg-[#F8F8F8] px-[24px] py-[12px]">
        <div
          className=" bg-[#F8F8F8] text-black flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1">
            <span
              className="cursor-pointer hover:underline"
              onClick={onLoginClick}
            >
              Login
            </span>
            <Image
              src="/SuggestionBox/top_right_arrow.svg"
              alt="top right arrow"
              width={10}
              height={10}
            />
          </div>

          <Link href="/seller_signin" onClick={onClose}>
            Seller SignIn
          </Link>
          <Link href="/seller_signup" onClick={onClose}>
            Seller SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
