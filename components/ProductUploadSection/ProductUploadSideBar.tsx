"use clients";

const sections = [
  {
    id: "product_basics",
    title: "Product Basics",
    desc: "Enter your brand address and owner name.",
  },
  {
    id: "brand_and_seller",
    title: "Brand and Seller",
    desc: "Define product tiers...",
  },
  {
    id: "attributes",
    title: "Attributes",
    desc: "Choose the place",
  },
  {
    id: "category_and_subcategory",
    title: "Category & Subcategory",
    desc: "Connect your Instagram and WhatsApp accounts.",
  },
  {
    id: "key_details",
    title: "Key Details",
    desc: "Upload a banner and profile photo.",
  },
  {
    id: "pricing_and_availability",
    title: "Pricing & Availability",
    desc: "Upload a banner and profile photo.",
  },
  {
    id: "variants_and_inventory",
    title: "Variants & Inventory",
    desc: "Upload a banner and profile photo.",
  },
  {
    id: "media_and_assets",
    title: "Media & Assets",
    desc: "Upload a banner and profile photo.",
  },
];

export default function ProductUploadSideBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border bg-white p-4 rounded-2xl w-full max-w-sm self-start">
      <h2 className="text-lg font-semibold mb-4">Complete your profile</h2>
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => onSelect(section.id)}
          className={`flex items-start gap-4 p-4 mb-2 cursor-pointer rounded-2xl border transition 
            ${
              selected === section.id
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}
        >
          <div className="flex flex-col">
            <h3 className="font-medium text-md">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
