"use client";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { CheckCircle, ChevronLeft, ChevronRight, RefreshCcw, Truck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
  const images = [
    "https://picsum.photos/600/600",
    "https://picsum.photos/600/300",
    "https://picsum.photos/200/500",
    "https://picsum.photos/200/100",
    "https://picsum.photos/250/300",
  ];

  const related = [
    "https://picsum.photos/200/300",
    "https://picsum.photos/400/300",
    "https://picsum.photos/200/500",
    "https://picsum.photos/200/100",
    "https://picsum.photos/250/300",
  ];

  const colors = [
    { name: "Royal Brown", hex: "#5D4229" },
    { name: "White", hex: "#F4F4F4" },
    { name: "Blue", hex: "#3D6B92" },
    { name: "Black", hex: "#1A1A1A" },
  ];

  const features = [
    "Lunarlon midsole delivers ultra-plush responsiveness.",
    "Encapsulated Air-Sole heel unit for lightweight cushioning.",
    "Colour Shown: Ale Brown/Black/Goldtone/Ale Brown",
    "Style: 805989-202",
  ];

  const fabrics = [
    "Water-repellent finish and internal membrane help keep your feet dry.",
    "Toe piece with star pattern adds durability.",
    "Synthetic insulation helps keep you warm.",
  ];

  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(8);

  const sizes = [6, 8, 10, 14, 18, 20];

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div className="w-full h-full">
      <ListingPageHeader/>
      <div className="mx-auto lg:w-[1263px] flex flex-col gap-2">
        <div>Leafs</div>

        <div className="w-full flex flex-col">
          <div className="flex flex-row gap-20">
            {/* product image */}
            <div className="w-[607px] h-[740px] flex flex-col items-center">
              {/* Main Image */}
              <div className="w-[600px] h-[600px] relative rounded overflow-hidden border border-gray-200">
                <Image
                  src={images[activeIndex]}
                  alt={`Product Image ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails + Navigation */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="p-2 border rounded hover:bg-gray-100"
                  onClick={prevImage}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2 overflow-x-auto">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-20 relative border-2 rounded overflow-hidden cursor-pointer ${
                        idx === activeIndex ? "border-black" : "border-gray-300"
                      }`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="p-2 border rounded hover:bg-gray-100"
                  onClick={nextImage}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* product description */}
            <div className="text-[#111] font-sans w-full max-w-xl space-y-4">
              <p className="text-xl text-gray-600">
                By Nobel Kaur <span className="text-pink-500"></span>
              </p>

              <h1 className="text-4xl font-bold">Embroidery Kurta</h1>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold">₹50,000</p>
                <p className="text-xl line-through text-gray-400">₹65,000</p>
                <p className="text-green-600 font-semibold text-sm">15% OFF</p>
              </div>

              <hr className="border-t border-dashed border-[#666666] my-4" />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-1">Description:</h2>
                <p className="text-sm text-[#666666]">
                  Boba etiam ut bulla tea est potus dilectus singulari
                  compositione saporum et textuum, quae in Taiwan annis 1980
                  orta sunt. Boba refert ad pilas masticas tapiocas in fundo
                  potus inventas, quae typice lacte tea nigro sapiuntur. Boba
                  phaenomenon.{" "}
                  <span className="font-medium text-blue-600 cursor-pointer">
                    See More....
                  </span>
                </p>
              </div>

              {/* Color */}
              <div>
                <p className="text-sm font-medium">
                  Color:{" "}
                  <span className="font-semibold">{selectedColor.name}</span>
                </p>
                <div className="flex gap-3 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor.name === color.name
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Size: {selectedSize}</p>
                  <button className="text-blue-600 text-sm underline">
                    View Size Chart
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size
                          ? "border-black font-semibold"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button className="w-full bg-green-600 text-white flex items-center justify-center gap-2 py-3 rounded text-lg hover:bg-green-700 transition">
                <FaWhatsapp size={20} />
                Buy on WhatsApp
              </button>
            </div>
          </div>

          <div className="mt-12">
            {/* Tabs */}
            <div className="flex gap-8 pb-2">
              <button
                className={`text-lg font-medium ${
                  activeTab === "description"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`text-lg font-medium ${
                  activeTab === "reviews"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Product Overview</h3>
                  <ul className="list-none mt-2 space-y-1 text-sm text-gray-700">
                    {features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="bg-[#E7F4FC] w-[20px] h-[20px] rounded-full text-black flex justify-center" >✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm uppercase text-gray-500">
                    Fabric
                  </h3>
                  <ul className="list-none mt-2 space-y-1 text-sm text-gray-700">
                    {fabrics.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="bg-[#E7F4FC] w-[20px] h-[20px] rounded-full text-black flex justify-center" >✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery Info */}
                <div className="flex flex-col gap-4 mt-4 w-[500px]">
                  <div className="border rounded p-4 space-y-2 text-sm ">
                    <Truck size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Free Delivery</span>
                    <p>Enter your Postal code for Delivery Availability</p>
                  </div>
                  <div className="border rounded p-4 space-y-2 text-sm">
                    <RefreshCcw size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Return Delivery</span>
                    <p>
                      Free 30 days Delivery Return.{" "}
                      <span className="text-blue-600 cursor-pointer">
                        Details
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Related Products */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Other Seller Products</h3>
                <a href="#" className="text-sm text-blue-600">
                  View All
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {related.map((img, idx) => (
                  <div
                    key={idx}
                    className="min-w-[140px] h-[180px] relative rounded overflow-hidden border"
                  >
                    <Image
                      src={img}
                      alt={`Related ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
