import { manrope } from "@/font";
import Image from "next/image";

export default function NoResultFound() {
  return (
    <div className={`${manrope.className} text-black flex flex-col items-center justify-center h-full`} style={{fontWeight: 500}}>
      <Image
        src="/ListingPageHeader/empty_cupboard.svg"
        alt="No Results Found"
        width={315}
        height={327}
        className="mb-4"
      />
      <h2 className="text-2xl">Sorry Nothing to show here</h2>
      <p className="text-xs text-[#333333]" style={{fontWeight:400}}>Probably a wrong search or typo, please try again.</p>
    </div>
  );
}