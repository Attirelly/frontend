"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RefreshCcw,
  Truck,
} from "lucide-react";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import ListingFooter from "@/components/listings/ListingFooter";
import { api } from "@/lib/axios";
import { Brand, Color, Product, Size, Variant } from "./type";
import { useParams, useRouter } from "next/navigation";
// import { useSellerStore } from "@/store/sellerStore";
import ShowMoreProducts from "@/components/curations/ShowMoreProducts";
import { roboto, manrope } from "@/font";
import CustomerSignIn from "@/components/Customer/CustomerSignIn";

export default function ProductDetail() {
  const params = useParams();
  const product_id = params?.product_id as string;
  const router = useRouter()

  // const { setStoreId } = useSellerStore();
  const [signIn, setSignIn] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [storeBasicInfo, setStoreBasicInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [isProductDetailCollapse, setProductDetailCollapse] = useState(true);
  const [isProductDescriptionCollapse, setProductDescriptionCollapse] =
    useState(true);
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

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await api.get(`/products/${product_id}`);
        const data: Product = response.data;
        console.log(data);
        setProduct(data);
        // setStoreId(data.store_id);
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

  useEffect(() => {
    async function fetchStoreBasicInfo() {
      try {
        const response = await api.get(
          `/stores/store_basic?store_id=${product?.store_id}`
        );
        setStoreBasicInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch store basic info", error);
      }
    }

    if (product?.store_id) {
      fetchStoreBasicInfo();
    }
  }, [product]);

  const sendToWhatsApp = async () => {
    setSignIn(true);
    try {
      const phoneNumber = storeBasicInfo?.whatsapp_number; // Replace with your WhatsApp number
      const message = `Hello, I’m interested in this product! ${product?.product_name} ${selectedVariant?.sku} at price ${selectedVariant?.mrp}`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  };


  const updateVariantBySelection = (color: Color | null, size: Size | null) => {
    if (!product) return;
    if (!color && !size) return;
    let matched;
    if (color && size) {
      matched = product.variants.find(
        (v) =>
          v.color.color_id === color.color_id && v.size.size_id === size.size_id
      );
    }
    else if (color) {
      matched = product.variants.find(
        (v) =>
          v.color.color_id === color?.color_id
      );
    }
    else {
      matched = product.variants.find(
        (v) =>
          v.size.size_id === size?.size_id
      );
    }


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
      .filter((color): color is Color => color !== null && color !== undefined)
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.color_id === value.color_id) === index
      ) || [];

  const sizes =
    product?.variants
      .map((v) => v.size)
      .filter((size): size is Size => size !== null && size !== undefined)
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

  if (!product) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      <ListingPageHeader />
      <div className="mx-auto lg:w-[1300px] flex flex-col gap-2">
        <div className="w-full flex flex-col mt-10 mb-10">
          <div className="flex flex-row gap-20">
            {/* Left: Product image */}
            <div className="w-[607px] h-[740px] flex flex-col items-center relative">
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-[600px] h-[600px] relative rounded overflow-hidden"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`Product Image ${activeIndex + 1}`}
                  fill
                  className="object-cover rounded-xl"
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
                  className="p-2 rounded-xl bg-gray-50 "
                  onClick={prevImage}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2 overflow-x-auto">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-20 relative border-2 rounded overflow-hidden cursor-pointer ${idx === activeIndex ? "border-black" : "border-gray-300"
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
                  className="p-2 rounded-xlbg-gray-100"
                  onClick={nextImage}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right: Product Description */}
            <div className="text-[#111] font-sans w-full max-w-xl">
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
                      backgroundPosition: `-${lensPosition.x * 2 - 150}px -${lensPosition.y * 2 - 150
                        }px`,
                    }}
                  />
                </div>
              )}
              <p className="text-[32px] font-medium leading-9.5 tracking-normal">
                By {storeBasicInfo?.store_name}
              </p>
              <h1 className="text-2xl text-[#7D7D7D] font-medium tracking-tighter mt-2">
                {product?.title || ''}
              </h1>

              <div className="flex items-center gap-4 mt-4">
                {selectedVariant?.mrp === selectedVariant?.price ? (
                  <p className="text-[27px] font-medium">
                    ₹{selectedVariant?.mrp}
                  </p>
                ) : (
                  <>
                    <p className="text-[27px] font-medium">
                      ₹{selectedVariant?.price}
                    </p>
                    <p className="text-[22px] line-through text-gray-400">
                      ₹{selectedVariant?.mrp}
                    </p>
                    <p className="text-[20px] font-semibold text-[#00AA63] tracking-normal">
                      {selectedVariant?.discount}% Off
                    </p>
                  </>
                )}
              </div>

              <hr className="border-t border-dashed border-[#A3A3A3] border-[0.5]px mt-7.5 mb-7.5 " />

              {/* size collection */}

              {sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xl font-medium">
                      <span className="text-[#7D7D7D]">Size:</span>{" "}
                      <span>{selectedSize?.size_name}</span>
                    </p>
                    <button className="text-lg text-[#7D7D7D] underline">
                      View Size Chart
                    </button>
                  </div>
                  <div className="flex gap-3 flex-wrap mt-5">
                    {sizes.map((size) => (
                      <button
                        key={size.size_id}
                        onClick={() =>
                          updateVariantBySelection(selectedColor, size)
                        }
                        className={`border rounded-sm w-19 h-10 ${selectedSize?.size_id === size.size_id
                            ? "border-black font-semibold bg-[#EBEBEB]"
                            : "border-gray-300"
                          }`}
                      >
                        {size.size_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selection */}
              {colors.length > 0 && (
                <div className="mt-5 mb-5">
                  <p className="text-lg font-medium">
                    <span className="text-[#7D7D7D]">Available Color: </span>
                  </p>
                  <div className="flex gap-3 mt-5">
                    {colors.map((color) => (
                      <div className="flex flex-col items-center">
                        <button
                          key={color.color_id}
                          className={`w-10 h-10 rounded-full border-0.25  ${selectedColor?.color_id === color.color_id
                              ? "border-black"
                              : "border-gray-300"
                            }`}
                          style={{ backgroundColor: color.hex_code || "#ccc" }}
                          onClick={() =>
                            updateVariantBySelection(color, selectedSize)
                          }
                        />
                        <span className="text-sm mt-1">
                          {color.color_name}
                        </span>
                      </div>

                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Button */}
              <button
                className="w-full mt-5 h-15 p-5 bg-[#00AA63] text-white flex items-center justify-center gap-6 rounded text-2xl hover:bg-green-700 transition"
                onClick={sendToWhatsApp}
              >
                <FaWhatsapp size={36} />
                Buy on WhatsApp
              </button>

              {/* Product Details & Care */}
              {!product.shopify_id && (
<div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="w-full text-xl font-500 border-y border-0.25 border-[#CCCCCC] py-5">
                    Product Details
                  </h1>
                  <button
                    onClick={() =>
                      setProductDetailCollapse(!isProductDetailCollapse)
                    }
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {isProductDetailCollapse ? <ChevronDown /> : <ChevronUp />}
                  </button>
                </div>

                {!isProductDetailCollapse && (
                  <div>
                    <ul className="grid grid-cols-2 gap-4">
                      {product?.attributes.map((item, idx) => (
                        <li key={idx} className="flex flex-col">
                          <div className="text-sm font-40 text-[#766874]">
                            {item.name}
                          </div>
                          <div className="text-4 font-500 mt-2">
                            {item.value}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4">
                      <h2 className="font-400 mb-1 text-[#766874]">
                        Care Instructions
                      </h2>
                      <p className="text-4 font-500 mt-2">
                        Do not wash with white clothes, Do not use hard
                        detergents
                      </p>
                    </div>
                  </div>
                )}
              </div>
              )}
              

              {/* Product Description */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="w-full text-xl font-500 border-y border-0.25 border-[#CCCCCC] py-5">
                    Product Description
                  </h1>
                  <button
                    onClick={() =>
                      setProductDescriptionCollapse(
                        !isProductDescriptionCollapse
                      )
                    }
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {isProductDescriptionCollapse ? (
                      <ChevronDown />
                    ) : (
                      <ChevronUp />
                    )}
                  </button>
                </div>

                {!isProductDescriptionCollapse && (
                  <div>
                    <div>{product?.description}</div>
                  </div>
                )}
              </div>

              <div>
                {/* Delivery Info */}
                <div className="flex flex-col gap-4 mt-4 w-[500px]">
                  <div className="border rounded-xl border-0.25 border-[#CCCCCC] p-4 space-y-2 text-sm">
                    <Truck size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Free Delivery</span>
                    <p className="text-[#726C6C]">
                      Enter your Postal code for Delivery Availability
                    </p>
                  </div>
                  <div className="border rounded-xl border-0.25 border-[#CCCCCC] p-4 space-y-2 text-4">
                    <RefreshCcw size={18} className="text-black inline-block" />
                    <span className="font-semibold ml-1">Return Delivery</span>
                    <p className="text-[#726C6C]">
                      Free 30 days Delivery Return.{" "}
                      <span className="underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {product && (
        <div className="w-300 flex flex-col mx-auto">
          <hr
            className="border-t border-transparent"
            style={{
              borderImage:
                "repeating-linear-gradient(to right, gray 0, gray 5px, transparent 5px, transparent 10px)",
              borderImageSlice: 1,
            }}
          />

          <div className={`${roboto.className} flex mt-16 justify-between`}>
            <span className="text-3xl" style={{ fontWeight: 600 }}>
              More from {storeBasicInfo?.store_name}
            </span>
            <span
              className="text-base text-[#525252] underline cursor-pointer transition hover:text-gray-700"
              style={{ fontWeight: 500 }}
              onClick={() => { router.push(`/store_profile/${product?.store_id}?defaultButton=${encodeURIComponent("Catalogue")}`) }}
            >
              View All
            </span>
          </div>

          <div className="relative mt-6">
            <ShowMoreProducts store_id={product?.store_id} limit={5} />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-25 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      )}


      <div className="mt-10">
        <ListingFooter />
      </div>
      {signIn && <CustomerSignIn onClose={() => setSignIn(false)} />}
    </div>
  );
}
