import { manrope, poppins } from "@/font";
import Image from "next/image";

interface IconicPhotoboothPageProps {
    title?:string;
    experiences?:string[];
}
export default function IconicPhotoboothPage({ title, experiences=[] }: IconicPhotoboothPageProps){
    return (
        <div className={`${manrope.className} flex flex-col gap-4`} style={{fontWeight:500}}>
            <h1 className={`${poppins.className} text-4xl md:text-5xl text-center`} style={{fontWeight:600}}>{title}</h1>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative w-full max-w-[557px] h-[450px] md:h-[557px]"> 
                    <Image
                    src="/BrideGroom/iconic_booth.svg"
                    alt="Iconic Photobooth"
                    fill // The image will fill the parent container (the div above)
                    style={{ objectFit: 'contain' }} // Add objectFit style for control
                    />
                </div>
                <div className="flex flex-col gap-4 px-4 lg:mt-4">
                    {experiences.map((experience, index) => (
                        <div className="py-4 px-8 lg:py-5 lg:px-12 shadow-lg border border-gray-200 border-2 rounded-lg">
<p key={index} className="text-lg md:text-xl text-black text-center">{experience}</p>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    )
}