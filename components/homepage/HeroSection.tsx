import Image from "next/image"
export default function HeroSection(){
    return (
        <div className="relative w-full h-150">
            <Image
            src="/Homepage/homepage_image.svg"
            alt="Homepage Image"
            fill
            className="object-cover"
            />
        </div>
    )
}