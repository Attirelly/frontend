import { manrope } from '@/font';
import Image from 'next/image';
interface StepsCardProps {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}
export default function StepsCard({ id, title, subtitle, image }: StepsCardProps) {
  return (
    <div className="relative h-[361px] flex flex-col items-center justify-center pt-[54px] pb-[90px] px-[28px] rounded-2xl shadow-lg  p-4 bg-white hover:shadow-xl transition duration-300">
      <Image
        src={image}
        alt={title}
        width={97}
        height={97}
        className="rounded-full object-cover object-top"
      />
      <div className={`${manrope.className} w-[263px] h-[105px] mt-4 text-center`}>
        <h3 className="text-[24px] font-semibold" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-base text-gray-600 mt-2" style={{ fontWeight: 500 }}>{subtitle}</p>
      </div>
      <div className='z-10 absolute bottom-0 translate-y-1/2 w-[72px] h-[72px] flex items-center justify-center rounded-full border border-[5px] border-white bg-black'>
        <span className='text-white text-[39px]' style={{ fontWeight: 700 }}>{id}</span>
      </div>
    </div>
  )

}