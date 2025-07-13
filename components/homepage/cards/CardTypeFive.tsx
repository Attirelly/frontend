import Image from "next/image";
import { manrope } from "@/font";

interface CardTwoTypeProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
}

export default function CardTypeFive({
  imageUrl,
  title,
  description,
  price,
  mrp,
  discount,
}: CardTwoTypeProps) {
  return (
    <div className="flex flex-col  gap-2 w-56">
      {/* Image */}
      <div className="relative w-full rounded-xl h-65">
        <Image
          src={imageUrl}
          alt="Card Type Two Image"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Text */}
      <div
        className={`${manrope.className} w-full flex flex-col gap-2`}
        style={{ fontWeight: 500 }}
      >
        <span className="text-base">{title}</span>
        <span
          className="text-[13px] text-[#5F5F5F] truncate"
          style={{ fontWeight: 300 }}
        >
          {description}
        </span>
        <div className="flex gap-1 items-center">
          <span className="text-base">₹{price.toLocaleString()}</span>
          {price !== mrp && (
            <span className="line-through text-gray-400 text-xs">
              ₹{mrp.toLocaleString()}
            </span>
          )}
          {price !== mrp && (
            <span
              className="text-green-600 text-[11px]"
              style={{ fontWeight: 600 }}
            >
              {discount}% OFF
            </span>
          )}

        </div>
      </div>
    </div>
  );
}
