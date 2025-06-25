"use client";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { api } from "@/lib/axios";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Brand, Color, Product, Size, Variant } from "./type";
import ListingFooter from "@/components/listings/ListingFooter";
import ProductMagnifierWithPreview from "./ProductMagnifier";
import ProductMagnifier from "./ProductMagnifier";

interface PageProps {
  params: {
    product_id: string;
  };
}

export default function ProductDetail({ params }: PageProps) {
  const { product_id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

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

  const features =
    product?.attributes
      .filter((attr) => attr.name !== "Fabric")
      .map((attr) => `${attr.name}: ${attr.value}`) || [];

  const fabrics =
    product?.attributes
      .filter((attr) => attr.name === "Fabric")
      .map((attr) => `${attr.name}: ${attr.value}`) || [];

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
            {/* product image */}
            <div className="w-[607px] h-[740px] flex flex-col items-center">
              <div className="w-[600px] h-[600px] relative rounded overflow-hidden border border-gray-200">
                {/* <Image
                  src={images[activeIndex]}
                  alt={`Product Image ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                /> */}
                {/* <ProductMagnifierWithPreview src={images[activeIndex]} zoom={2.5} /> */}
                <ProductMagnifier
                  src={images[activeIndex]}
                  width={600}
                  height={600}
                  zoom={2}
                  lensSize={150}
                />
              </div>
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
              <p className="text-xl text-gray-600">By {product.brands.name}</p>

              <h1 className="text-4xl font-bold">{product.title}</h1>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold">₹{selectedVariant.mrp}</p>
                <p className="text-xl line-through text-gray-400">
                  ₹{selectedVariant.price}
                </p>
              </div>

              <div className="my-6 w-full h-[1px] bg-[length:12px_1px] bg-repeat-x bg-[linear-gradient(to_right,_#666_60%,_transparent_40%)]" />

              <div>
                <h2 className="text-2xl font-semibold mb-1">Description:</h2>
                <p className="text-sm text-[#666666]">{product.description}</p>
              </div>

              {/* Color */}
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
                      style={{
                        backgroundColor: color.hex_code || "#ccc",
                      }}
                      onClick={() =>
                        updateVariantBySelection(color, selectedSize)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
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

              <button className="w-full bg-green-600 text-white flex items-center justify-center gap-2 py-3 rounded text-lg hover:bg-green-700 transition">
                <FaWhatsapp size={20} />
                Buy on WhatsApp
              </button>
            </div>
          </div>

          {/* Tabs */}
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
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Product Overview</h3>
                  <ul className="list-none mt-2 space-y-1 text-sm text-gray-700">
                    {features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="bg-[#E7F4FC] w-[20px] h-[20px] rounded-full text-black flex justify-center">
                          ✓
                        </span>
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
                        <span className="bg-[#E7F4FC] w-[20px] h-[20px] rounded-full text-black flex justify-center">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

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
                      <span className="underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ListingFooter />
    </div>
  );
}
