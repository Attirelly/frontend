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
import useAuthStore from "@/store/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import ListingMobileHeader from "@/components/mobileListing/ListingMobileHeader";
import { useSwipeable } from 'react-swipeable';


export default function ProductDetail() {
  const { user } = useAuthStore();
  const params = useParams();
  const product_id = params?.product_id as string;
  const router = useRouter();

  // const { setStoreId } = useSellerStore();
  const [signIn, setSignIn] = useState(false);
  const [pendingWhatsApp, setPendingWhatsApp] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); // k 
  const [startIndex, setStartIndex] = useState(0);  //  i 
  const [endIndex, setEndIndex] = useState(4);     //   j 
  const [storeBasicInfo, setStoreBasicInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [isProductDetailCollapse, setProductDetailCollapse] = useState(true);
  const [isProductDescriptionCollapse, setProductDescriptionCollapse] =
    useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [lensPosition, setLensPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);


  const ZOOM_FACTOR = 2; // Adjust this value as needed
  const LENS_WIDTH = 150;
  const LENS_HEIGHT = 100;
  const ORIGINAL_IMAGE_WIDTH = 600;
  const ORIGINAL_IMAGE_HEIGHT = 600; // your image container size

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ensure lens stays within image bounds
    const boundedX = Math.max(0, Math.min(x - LENS_WIDTH / 2, rect.width - LENS_WIDTH));
    const boundedY = Math.max(0, Math.min(y - LENS_HEIGHT / 2, rect.height - LENS_HEIGHT));

    setLensPosition({ x: boundedX, y: boundedY });
  };
  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  const imageRef = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number>(1);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const naturalWidth = imageRef.current.naturalWidth;
      const naturalHeight = imageRef.current.naturalHeight;
      const containerWidth = 600;
      const containerHeight = 600;
      const ratioio = naturalWidth / naturalHeight;
      console.log(ratio);
      setRatio(ratioio);
    }
  };



  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await api.get(`/products/${product_id}`);
        const data: Product = response.data;

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

  const isCustomerAuthenticated = () => {
    return Boolean(user?.id); // Or session value / cookie
  }

  useEffect(() => {
    if (!pendingWhatsApp) return;
    if (isCustomerAuthenticated()) {
      sendToWhatsApp();
      setPendingWhatsApp(false);
    }
  }, [pendingWhatsApp, user?.id]);

  const handleSendToWhatsAppClick = () => {
    setPendingWhatsApp(true);
    if (!isCustomerAuthenticated()) {
      setSignIn(true);
    }
  };

  const sendToWhatsApp = async () => {
    // setSignIn(true);
    try {
      const phoneNumber = (storeBasicInfo?.whatsapp_number).substring(0, 5) === "11111" ? "9915916707" : storeBasicInfo?.whatsapp_number;
      const storeName = storeBasicInfo?.store_name || "Store"; // fallback if not available
      const productName = product?.title || "";
      const variant = "color : " + selectedColor?.color_name + " " + "size : " + selectedSize?.size_name || "";
      const price = "₹" + (selectedVariant?.mrp || "");
      const productLink = window.location.href; // current page link

      const message = `Hi ${storeName}, I'm interested in the following product listed on your Attirelly storepage:

    Product Name: ${productName} 
    Variant: ${variant}
    Price: ${price}
    Link: ${productLink}

Could you please confirm its availability and share more details.`;

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
    } else if (color) {
      matched = product.variants.find(
        (v) => v.color.color_id === color?.color_id
      );
    } else {
      matched = product.variants.find((v) => v.size.size_id === size?.size_id);
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

  const images = (selectedVariant?.images?.length
    ? selectedVariant.images
    : product?.images || []
  ).map((img) => img.image_url);


  const nextImage = () => {
    if (activeIndex === endIndex) {
      setEndIndex((prev) => Math.min(prev + 1, images.length));
      setStartIndex((prev) => Math.min(prev + 1, images.length - 1));
    }
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (activeIndex === startIndex) {
      setStartIndex((prev) => Math.max(prev - 1, 0));
      setEndIndex((prev) => Math.max(prev - 1, 4));
    }
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventScrollOnSwipe: true, // Prevents vertical scrolling when swiping horizontally
    trackMouse: false, // Don't track mouse movements as swipes
  });

  const { ref: swipeableRef, ...restHandlers } = handlers;

  // Creates a "callback ref" function
  const handleRef = (el: HTMLDivElement | null) => {
    // 1. Gives the element to the swipe library
    swipeableRef(el);

    // 2. Gives the element to your own ref object
    imageContainerRef.current = el;
  };

  if (!product) {
    return <div className="p-4"><LoadingSpinner /></div>;
  }





  return (
    <div className="w-full h-full bg-white">
      <ListingMobileHeader className='block lg:hidden' />
      <ListingPageHeader className='hidden lg:block' />
      <div className="mx-auto lg:w-[1300px] flex flex-col gap-2">
        <div className="w-full flex flex-col mt-1 md:mt-10 mb-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-20">
            {/* Left: Product image */}
            <div className="flex flex-col items-center relative">
              <div
                ref={handleRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-[370px] h-[370px] md:w-[600px] md:h-[600px] lg:w-[600px] lg:h-[600px] relative rounded-xl overflow-hidden"
               {...restHandlers}>
                <Image
                  ref={imageRef}
                  src={images[activeIndex]}
                  alt={`Product Image ${activeIndex + 1}`}
                  fill
                  className="object-contain rounded-xl object-top"
                  onLoad={handleImageLoad}
                />
                <div>
                {/* create bubbles here with horizontally centred and bottom-15  */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full md:hidden ${index === activeIndex ? 'bg-black' : 'bg-gray-300'
                                } transition-all duration-300`}
                        />
                    ))}
                </div>
            </div>
              </div>

              {lensPosition && (
                <div
                  className="absolute pointer-events-none transition-all hidden lg:flex duration-75 ease-linear"
                  style={{
                    width: LENS_WIDTH,
                    height: LENS_HEIGHT,
                    top: lensPosition.y,
                    left: lensPosition.x,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(0, 123, 255, 0.6)",
                    borderRadius: 4,
                    boxShadow: "0 0 4px rgba(0, 123, 255, 0.3)",
                    zIndex: 20,
                  }}
                />
              )}

              <div className="mt-4 hidden md:flex items-center gap-2">
                <button
                  className="p-2 rounded-xl bg-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  onClick={prevImage}
                  disabled={startIndex === 0 && activeIndex === 0}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2 overflow-x-auto">
                  {images.slice(startIndex, startIndex + 5).map((src, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-20 relative border-2 rounded overflow-hidden cursor-pointer ${startIndex + idx === activeIndex ? "border-black" : "border-gray-300"
                        }`}
                      onClick={() => setActiveIndex(startIndex + idx)}
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="p-2 rounded-xl bg-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  onClick={nextImage}
                  disabled={activeIndex === endIndex && endIndex === images.length - 1}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right: Product Description */}
            <div className="text-[#111] px-4 lg:px-0 font-sans w-full lg:max-w-xl">
              {/* ✅ Magnifier Preview Inside Description */}
              {lensPosition && (
                <div
                  className="hidden lg:flex border border-gray-300 overflow-hidden"
                  style={{
                    width: LENS_WIDTH * ZOOM_FACTOR * 2,
                    height: LENS_HEIGHT * ZOOM_FACTOR * 2,
                    backgroundImage: `url(${images[activeIndex]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${ORIGINAL_IMAGE_WIDTH * ZOOM_FACTOR * 2 * ratio}px ${ORIGINAL_IMAGE_HEIGHT * ZOOM_FACTOR * 2}px`,
                    backgroundPosition: `-${lensPosition.x * ZOOM_FACTOR * 2 * ratio}px -${lensPosition.y * ZOOM_FACTOR * 2}px`,
                  }}
                />
              )}
              <p className="text-[24px] font-medium leading-9.5 tracking-normal">
                By <Link href={`/store_profile/${product?.store_id}`} className="hover:text-gray-500">{storeBasicInfo?.store_name}</Link>
              </p>
              <h1 className="text-[20px] text-[#7D7D7D] font-medium tracking-tighter md:mt-2">
                {product?.title
                  ? product.title.charAt(0).toUpperCase() + product.title.slice(1)
                  : ""}
              </h1>

              <div className="flex items-center gap-4 md:mt-4 pb-4 mb-4
            border-b border-dashed border-[#A3A3A3] border-[0.5]px">
                {selectedVariant?.mrp === selectedVariant?.price ? (
                  <p className="text-[24px] font-medium">
                    ₹{selectedVariant?.mrp.toLocaleString()}
                  </p>
                ) : (
                  <>
                    <p className="text-[24px] font-medium">
                      ₹{selectedVariant?.price.toLocaleString()}
                    </p>
                    <p className="text-[20px] line-through text-gray-400">
                      ₹{selectedVariant?.mrp.toLocaleString()}
                    </p>
                    <p className="text-[18px] font-semibold text-[#00AA63] tracking-normal">
                      {selectedVariant?.discount}% Off
                    </p>
                  </>
                )}
              </div>

              {/* <hr className="border-t border-dashed border-[#A3A3A3] border-[0.5]px mt-7.5 mb-7.5 " /> */}

              {/* size collection */}

              {sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[15px] md:text-xl font-medium">
                      <span className="text-[#7D7D7D]">Size:</span>{" "}
                      <span>{selectedSize?.size_name}</span>
                    </p>
                    {/* <button className="text-lg text-[#7D7D7D] underline">
                      View Size Chart
                    </button> */}
                  </div>
                  <div className="flex gap-3 flex-wrap mt-2 md::mt-5">
                    {sizes.map((size) => (
                      <button
                        key={size.size_id}
                        onClick={() =>
                          updateVariantBySelection(selectedColor, size)
                        }
                        className={`border rounded-sm min-w-[57px] min-h-[30px] md:min-w-19 md:min-h-10 px-1 ${selectedSize?.size_id === size.size_id
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
                <div className="mt-2 mb-2 md:mt-5 md:mb-5">
                  <p className="text-[15px] md:text-lg font-medium">
                    <span className="text-[#7D7D7D]">Available Color </span>
                  </p>
                  <div className="flex gap-4 mt-2 md:mt-5"> {/* Increased gap slightly for the ring */}
                    {colors.map((color) => {
                      const isSelected = selectedColor?.color_id === color.color_id;
                      return (
                        <div key={color.color_id} className="flex flex-col items-center">
                          <button
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 transition-all duration-200
                ${isSelected ? "ring-2 ring-black ring-offset-2" : ""
                              }`}
                            style={{ backgroundColor: color.hex_code || "#ccc" }}
                            onClick={() => updateVariantBySelection(color, selectedSize)}
                          />
                          {/* ✅ Emphasize the text of the selected color */}
                          <span
                            className={`text-sm mt-2 transition-colors duration-200 ${isSelected ? "font-semibold text-black" : "text-gray-500"
                              }`}
                          >
                            {color.color_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WhatsApp Button */}
              <button
                className="w-full h-[50px] md:h-15 mt-5 p-5 bg-[#00AA63] text-white flex items-center justify-center gap-3 rounded text-[18px] md:text-2xl hover:bg-green-700 transition"
                onClick={handleSendToWhatsAppClick}
              >
                {/* <FaWhatsapp size={36} /> */}
                <FaWhatsapp size={typeof window !== "undefined" && window.innerWidth < 768 ? 24 : 36} />
                Buy on WhatsApp
              </button>

              {/* Product Details & Care */}
              {!product.shopify_id && (
                <div className="mt-8">
                  <div className="flex justify-between items-center border-b border-0.25 border-[#CCCCCC] mb-2">
                    <h1 className="w-full text-[13px] md:text-xl py-2 md:py-5" style={{ fontWeight: 500 }}>
                      Product Details
                    </h1>
                    <button
                      onClick={() =>
                        setProductDetailCollapse(!isProductDetailCollapse)
                      }
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      {isProductDetailCollapse ? (
                        <ChevronDown />
                      ) : (
                        <ChevronUp />
                      )}
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
                            <div className="text-base mt-2" style={{ fontWeight: 500 }}>
                              {item.value}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4">
                        <h2 className="font-400 mb-1 text-[#766874]">
                          Care Instructions
                        </h2>
                        <p className="text-base mt-2" style={{ fontWeight: 500 }}>
                          Do not wash with white clothes, Do not use hard
                          detergents
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Description */}
              <div className="mt-4 md:mt-8">
                <div className="flex justify-between items-center border-b border-0.25 border-[#CCCCCC] mb-2">
                  <h1 className="w-full text-[13px] md:text-xl py-2 md:py-5" style={{ fontWeight: 500 }}>
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
                    <div className="text-[14px] text-black">{product?.description}</div>
                  </div>
                )}
              </div>

              <div>
                {/* Delivery Info */}
                <div className="flex flex-col gap-4 mt-4 w-full border rounded-xl border-[#E4E4E4] py-4">
                  <div className="flex flex-row px-4 gap-2">
                    <div className="flex items-center">
                      <Image
                        src="/ListingPageHeader/truck.svg"
                        alt="truck"
                        width={18}
                        height={18}
                        className="text-black inline-block self-start"
                      />

                    </div>
                    <div className="flex flex-col">
                      <span className=" text-[13px] md:text-base" style={{ fontWeight: 700 }}>Free Delivery</span>
                      <p className="text-[10px] md:text-[14px] text-[#726C6C]" style={{ fontWeight: 400 }}>
                        Enter your Postal code for Delivery Availability
                      </p>
                    </div>

                  </div>

                  {storeBasicInfo?.return_days > 0 && (
                    <div className="flex flex-col gap-4">
                      <hr className="border-t border-[#E4E4E4]" />
                      <div className="flex flex-row px-4 gap-2">
                        <div className="flex items-center">
                          <Image
                            src="/ListingPageHeader/shopping_bag.svg"
                            alt="shopping bag"
                            width={18}
                            height={18}
                            className="text-black inline-block"
                          />

                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] md:text-base" style={{ fontWeight: 700 }}>Return Delivery</span>
                          <p className="text-[10px] md:text-[14px] text-[#726C6C]" style={{ fontWeight: 400 }}>
                            Free {storeBasicInfo?.return_days} days Delivery Return.{" "}
                            <span className="underline cursor-pointer">Details</span>
                          </p>
                        </div>


                      </div>
                    </div>
                  )}
                  {storeBasicInfo?.exchange_days > 0 && (
                    <div className="flex flex-col gap-4">
                      <hr className="border-t border-[#E4E4E4]" />
                      <div className="flex flex-row px-4 gap-2">
                        <div className="flex items-center">
                          <RefreshCcw size={18} className="text-black inline-block self-start" />

                        </div>
                        <div className="flex flex-col gap">
                          <span className="text-[13px] md:text-base" style={{ fontWeight: 700 }}>Exchange Delivery</span>
                          <p className="text-[10px] md:text-[14px] text-[#726C6C]" style={{ fontWeight: 400 }}>
                            Free {storeBasicInfo?.exchange_days} days Delivery Exchange.{" "}
                            <span className="underline cursor-pointer">Details</span>
                          </p>
                        </div>

                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {product && (
        <div className="px-10 w-full flex flex-col mx-auto">
          <hr
            className="border-t border-gray-300 hidden md:block"
          // style={{
          //   borderImage:
          //     "repeating-linear-gradient(to right, gray 0, gray 5px, transparent 5px, transparent 10px)",
          //   borderImageSlice: 1,
          // }}
          />

          <div className={`${roboto.className} flex mt-4 md:mt-16 justify-between items-center`}>
            <span
              className="text-[20px] md:text-[28px] text-[#141414]"
              style={{ fontWeight: 600 }}
            >
              More from {storeBasicInfo?.store_name}
            </span>
            <span
              className="text-[14px] md:text-base text-[#525252] underline cursor-pointer transition hover:text-gray-700"
              style={{ fontWeight: 500 }}
              onClick={() => {
                router.push(
                  `/store_profile/${product?.store_id
                  }?defaultButton=${encodeURIComponent("Products")}`
                );
              }}
            >
              View All
            </span>
          </div>

          <div className="relative mt-6 overflow-hidden">
            <ShowMoreProducts store_id={product?.store_id} limit={5} />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-25 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      )}

      <div className="mt-10">
        <ListingFooter />
      </div>
      {signIn && (
        <CustomerSignIn
          onClose={() => {
            setSignIn(false);
            setPendingWhatsApp(false); // Cancel WhatsApp intent if modal closed
          }}
          onSuccess={() => {
            console.log("success");
            setSignIn(false);
            if (pendingWhatsApp) {
              sendToWhatsApp();        // Proceed now
              setPendingWhatsApp(false);
            }
          }}
        />
      )}
    </div>
  );
}
