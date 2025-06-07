import { useSellerStore } from '@/store/sellerStore';

export default function ProfileSidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { furthestStep } = useSellerStore();
  const sections = [
    {
      id: 'brand',
      title: 'Business details',
      desc: 'Enter your brand address and owner name.',
      iconUrl: '/OnboardingSections/business_details.png',
    },
    {
      id: 'price',
      title: 'Price filters',
      desc: 'Define product tiers...',
      iconUrl: '/OnboardingSections/price_filters.png',
    },
    {
      id: 'market',
      title: 'Select where you want to sell',
      desc: 'Choose the place',
      iconUrl: '/OnboardingSections/where_to_sell.png',
    },
    {
      id: 'social',
      title: 'Social links',
      desc: 'Connect your Instagram and WhatsApp accounts.',
      iconUrl: '/OnboardingSections/social_links.png',
    },
    {
      id: 'photos',
      title: 'Photos',
      desc: 'Upload a banner and profile photo.',
      iconUrl: '/OnboardingSections/store_photos.png',
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start">
      <h2 className="text-lg font-semibold mb-4">Complete your profile</h2>
      {sections.map((section, index) => {
        const isDisabled = index > furthestStep;
        const isSelected = selected === section.id;

        return (
          <div
            key={section.id}
            onClick={() => {
              if (!isDisabled) onSelect(section.id);
            }}
            className={`flex items-start gap-4 p-4 mb-2 rounded-2xl border transition 
              ${isSelected ? 'border-black bg-gray-100' : 'border-gray-300'} 
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
          >
            <img
              src={section.iconUrl}
              alt={section.title}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="font-medium text-md">{section.title}</h3>
              <p className="text-sm text-gray-500">{section.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
