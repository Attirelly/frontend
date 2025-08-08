import { manrope } from "@/font"
import StepsCard from "./StepsCard"

const steps = [
  {
    id:1,
    title:"Join Attirely",
    subtitle:"Enter your store details, integrate your instagram and you are good to go",
    image:"/SellerLanding/signup.svg",
  },
  {
    id:2,
    title:"List Products and Catalogues",
    subtitle:"Upload products directly from shopify or manually upload your catalogue",
    image:"/SellerLanding/list_products.svg",
  },
  {
    id:3,
    title:"Get Orders on WhatsApp",
    subtitle:"Get interested leads and potential customers directly from Whatsapp for online + offline sales",
    image:"/SellerLanding/whatsapp.svg",
  },
  {
    id:4,
    title:"Receive payment and ship",
    subtitle:"Receive payments directly from customer(no commission) and ship directly to them to build trust.",
    image:"/SellerLanding/payment.svg",
  },
]

export default function HowItWorks(){
    return(

    <div className={`${manrope.className} flex flex-col gap-[64px] bg-[#F7F9FC] pb-10 rounded-tl-4xl rounded-tr-4xl`} style={{fontWeight:700}}>
      <div className="flex flex-col items-center mt-16" style={{ fontWeight: 700 }}>
        <span className="text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>How it works</span>
        <span className="w-[641px] text-[18px] text-[#1B1C57] text-center" style={{fontWeight:400}}>Whether you run a boutique in Jaipur, a store in Chandni Chowk, or a tailor shop in Surat—Attirelly helps you grow your business online and offline.</span>
      </div>

      <div className="flex justify-center gap-[28px] mb-10">
        {steps.map((item) => (
<StepsCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} image={item.image}/>
        ))}
      </div>

    </div>
    )
}