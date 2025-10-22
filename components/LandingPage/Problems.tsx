import { manrope } from "@/font";
import Image from "next/image";

interface ProblemsPageProps {
    title?: string;
    problems?: string[];
}
export default function ProblemsPage({ title, problems=[] }: ProblemsPageProps){
    return(        
        <div className={`${manrope.className} flex flex-col items-center gap-12`} style={{fontWeight:500}}>
            <h1 className="text-black text-3xl md:text-4xl lg:text-5xl text-center" style={{fontWeight:700}}>{title}</h1>
            <div className="flex flex-col md:flex-row gap-4 lg:gap-12 justify-center items-center px-12 md:px-8 lg:px-0">
                {problems.map((problem, index) => (
                    <div key={index} className="flex flex-row items-start gap-4 bg-white py-3 px-6 rounded-xl shadow-lg w-full max-w-sm">
                        <Image
                        src="/BrideGroom/star.svg"
                        alt="Star"
                        width={32}
                        height={32}/>
                        <p className="text-lg text-black" style={{fontWeight:600}}>{problem}</p>
                    </div>
                ))}
            </div>
            
        </div>
    );
}