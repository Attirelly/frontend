"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Truck,
} from "lucide-react";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import ListingFooter from "@/components/listings/ListingFooter";
import { api } from "@/lib/axios";
import { Brand, Color, Product, Size, Variant } from "./type";
import { useParams } from 'next/navigation';

// interface PageProps {
//   params: {
//     product_id: string;
//   };
// }

export default function ProductDetail() {
  const params = useParams();
  const product_id = params?.product_id as string;
  console.log(product_id);
  // const { product_id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [isProductDetailCollapse, setProductDetailCollapse] = useState(true);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [lensPosition, setLensPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  const sendToWhatsApp = async() => {

    try {
      const response = await api.get(`/stores/store_basic?store_id=${product?.store_id}`)
      const data = response.data ;
      const phoneNumber = data.whatsapp_number; // Replace with your WhatsApp number
      const message = `Hello, I’m interested in this product! ${product?.product_name} ${selectedVariant?.sku} at price ${selectedVariant?.mrp}`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      console.log(url)
      window.open(url, "_blank");

    } catch (error) {
      console.error("Failed to fetch product details", error);
    }

  };
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await api.get(`/products/${product_id}`);
        const data: Product = response.data;
        setProduct(data);

        const defaultVariant = data.variants[0];
        setSelectedVariant(defaultVariant);
        setSelectedColor(defaultVariant.color);
        setSelectedSize(defaultVariant.size);
        setActiveIndex(0);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      }
    }

    fetchProductDetails();
  }, [product_id]);

  const updateVariantBySelection = (color: Color | null, size: Size | null) => {
    if (!color || !size || !product) return;

    const matched = product.variants.find(
      (v) =>
        v.color.color_id === color.color_id && v.size.size_id === size.size_id
    );

    if (matched) {
      setSelectedVariant(matched);
      setSelectedColor(matched.color);
      setSelectedSize(matched.size);
      setActiveIndex(0);
    }
  };

  const colors =
    product?.variants
      .map((v) => v.color)
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.color_id === value.color_id) === index
      ) || [];

  const sizes =
    product?.variants
      .map((v) => v.size)
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.size_id === value.size_id) === index
      ) || [];

  const images = selectedVariant?.images.map((img) => img.image_url) || [];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!product || !selectedVariant || !selectedColor || !selectedSize) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      <ListingPageHeader />
      <div className="mx-auto lg:w-[1263px] flex flex-col gap-2">
        <div className="w-full flex flex-col mt-10 mb-10">
          <div className="flex flex-row gap-20">
            {/* Left: Product image */}
            <div className="w-[607px] h-[740px] flex flex-col items-center relative">
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-[600px] h-[600px] relative rounded overflow-hidden border border-gray-200"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`Product Image ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {lensPosition && (
                <div
                  className="absolute pointer-events-none transition-all duration-75 ease-linear"
                  style={{
                    width: 100,
                    height: 100,
                    top: Math.floor(lensPosition.y / 100) * 100,
                    left: Math.floor(lensPosition.x / 100) * 100,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(0, 123, 255, 0.6)",
                    borderRadius: 4,
                    boxShadow: "0 0 4px rgba(0, 123, 255, 0.3)",
                    zIndex: 20,
                  }}
                />
              )}

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

            {/* Right: Product Description */}
            <div className="text-[#111] font-sans w-full max-w-xl space-y-4">
              {/* ✅ Magnifier Preview Inside Description */}
              {lensPosition && (
                <div>
                  <div
                    className="border border-gray-300"
                    style={{
                      width: 600,
                      height: 600,
                      backgroundImage: `url(${images[activeIndex]})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${600 * 2}px ${600 * 2}px`,
                      backgroundPosition: `-${lensPosition.x * 2 - 150}px -${
                        lensPosition.y * 2 - 150
                      }px`,
                    }}
                  />
                </div>
              )}
              <p className="text-xl text-gray-600">By {product.brands.name}</p>
              <h1 className="text-4xl font-bold">{product.title}</h1>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold">₹{selectedVariant.mrp}</p>
                <p className="text-xl line-through text-gray-400">
                  ₹{selectedVariant.price}
                </p>
              </div>

              {/* Color selection */}
              <div>
                <p className="text-sm font-medium">
                  Color:{" "}
                  <span className="font-semibold">
                    {selectedColor.color_name}
                  </span>
                </p>
                <div className="flex gap-3 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color.color_id}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor.color_id === color.color_id
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex_code || "#ccc" }}
                      onClick={() =>
                        updateVariantBySelection(color, selectedSize)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">
                    Size: {selectedSize.size_name}
                  </p>
                  <button className="text-sm underline">View Size Chart</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size.size_id}
                      onClick={() =>
                        updateVariantBySelection(selectedColor, size)
                      }
                      className={`px-4 py-2 border rounded ${
                        selectedSize.size_id === size.size_id
                          ? "border-black font-semibold"
                          : "border-gray-300"
                      }`}
                    >
                      {size.size_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Button */}
              <button className="w-full bg-green-600 text-white flex items-center justify-center gap-2 py-3 rounded text-lg hover:bg-green-700 transition" onClick={sendToWhatsApp}>
                <FaWhatsapp size={20} />
                Buy on WhatsApp
              </button>

              {/* Product Details & Care */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-xl font-bold">Product Details</h1>
                  <button
                    onClick={() =>
                      setProductDetailCollapse(!isProductDetailCollapse)
                    }
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {isProductDetailCollapse ? "Show Details" : "Hide Details"}
                  </button>
                </div>

                {!isProductDetailCollapse && (
                  <div>
                    <ul className="grid grid-cols-2 gap-4">
                      {product.attributes.map((item, idx) => (
                        <li key={idx} className="flex flex-col">
                          <div className="text-sm font-medium text-gray-600">
                            {item.name}
                          </div>
                          <div className="text-sm font-bold">{item.value}</div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t">
                      <h2 className="font-bold mb-1">Care Instructions</h2>
                      <p>
                        Do not wash with white clothes, Do not use hard
                        detergents
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description/Reviews Tabs */}
              <div className="mt-12">
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

                {activeTab === "description" && (
                  <div>
                    <p className="text-sm text-[#666666]">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="flex flex-col gap-4 mt-4 w-[500px]">
                  <div className="border rounded p-4 space-y-2 text-sm">
                    <Truck size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Free Delivery</span>
                    <p>Enter your Postal code for Delivery Availability</p>
                  </div>
                  <div className="border rounded p-4 space-y-2 text-sm">
                    <RefreshCcw size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Return Delivery</span>
                    <p>
                      Free 30 days Delivery Return.{" "}
                      <span className="underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <ListingFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
