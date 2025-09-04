import { useHeaderStore } from "@/store/listing_header_store";
import StudentAmbassador from "./StudentAmbassador";
import HouseMakerAmbassador from "./HouseMakerAmbassador";
import InfluencerAmbassador from "./InfluencerAmbassador";
import FashionAmbassador from "./FashionAmbassador";
import WhoCanJoinTabs from "./WhoCanJoinTabs";
type Props = {
  screenSize?: string;
};

export default function AmbassadorWhoCanJoin({ screenSize }: Props) {
    const { ambassadorType } = useHeaderStore();
    return(
        <div className="flex flex-col items-center gap-4 px-2 md:px-10">
        <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{fontWeight:700}}>Who can join?</span>
        <span className="text-[14px] w-[350px] md:w-[450px] lg:w-full md:text-[18px] text-[#1B1C57] mb-8 text-center" style={{fontWeight:400}}>if you sell ethnic wear, ranging from affordable to luxury wear, Attirelly is for you. We work with:</span>
        <WhoCanJoinTabs defaultValue="Students"/>
        {ambassadorType === 'Students' 
        ? <StudentAmbassador screenSize={screenSize}/> : 
        ambassadorType === 'House makers' 
        ? <HouseMakerAmbassador screenSize={screenSize}/> :
        ambassadorType === 'Influencers'
        ? <InfluencerAmbassador screenSize={screenSize}/> :
        ambassadorType === 'Fashion'
        ? <FashionAmbassador screenSize={screenSize}/> : <div></div>}
      </div>
    )
}