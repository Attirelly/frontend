// 'use client';

// import Image from 'next/image';
// import { useRef, useState } from 'react';

// interface ProductMagnifierProps {
//   src: string;
//   zoom?: number; // e.g., 2 = 2x zoom
//   width?: number;
//   height?: number;
// }

// export default function ProductMagnifierWithPreview({
//   src,
//   zoom = 2,
//   width = 600,
//   height = 600,
// }: ProductMagnifierProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isHovering, setIsHovering] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const bounds = containerRef.current!.getBoundingClientRect();
//     const x = e.clientX - bounds.left;
//     const y = e.clientY - bounds.top;
//     setPosition({ x, y });
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Original Image */}
//       <div
//         ref={containerRef}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//         onMouseMove={handleMouseMove}
//         className="relative border rounded overflow-hidden"
//         style={{ width, height }}
//       >
//         <Image
//           src={src}
//           alt="Main product image"
//           fill
//           className="object-cover pointer-events-none"
//         />

//         {/* Optional Lens */}
//         {isHovering && (
//           <div
//             className="absolute border border-gray-400 bg-white/20 backdrop-blur-sm pointer-events-none"
//             style={{
//               width: 100,
//               height: 100,
//               top: position.y - 50,
//               left: position.x - 50,
//             }}
//           />
//         )}
//       </div>

//       {/* Zoomed Preview */}
//       {isHovering && (
//         <div
//           className="border rounded overflow-hidden"
//           style={{
//             width: width / 2,
//             height: height / 2,
//             backgroundImage: `url(${src})`,
//             backgroundRepeat: 'no-repeat',
//             backgroundSize: `${width * zoom}px ${height * zoom}px`,
//             backgroundPosition: `-${position.x * zoom - width / 4}px -${position.y * zoom - height / 4}px`,
//           }}
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductMagnifierProps {
  src: string;
  width?: number;
  height?: number;
  zoom?: number; // e.g., 2 = 2x zoom
  lensSize?: number; // Diameter of the lens in px
}

export default function ProductMagnifier({
  src,
  width = 600,
  height = 600,
  zoom = 2,
  lensSize = 150,
}: ProductMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensPosition, setLensPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setLensPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  const lensStyle = lensPosition
    ? {
        display: 'block',
        top: lensPosition.y - lensSize / 2,
        left: lensPosition.x - lensSize / 2,
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${width * zoom}px ${height * zoom}px`,
        backgroundPosition: `-${lensPosition.x * zoom - lensSize / 2}px -${
          lensPosition.y * zoom - lensSize / 2
        }px`,
      }
    : { display: 'none' };

  return (
    <div
      className="relative"
      style={{ width, height }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image src={src} alt="Magnifier" width={width} height={height} className="object-cover" />

      <div
        className="absolute border-2 border-black rounded-full pointer-events-none"
        style={{
          ...lensStyle,
          width: lensSize,
          height: lensSize,
          position: 'absolute',
          backgroundColor: 'rgba(255,255,255,0.3)',
          backgroundClip: 'content-box',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
          zIndex: 10,
        }}
      />
    </div>
  );
}


// {
//   "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//   "store_id": "d013b10b-af22-407d-aa32-eec4d6e1bb50",
//   "product_name": "I WILL",
//   "brands": {
//     "brand_id": "37cdb2a5-4bd1-43e1-8af3-b001648b5da3",
//     "name": "levis",
//     "logo_url": "string"
//   },
//   "primary_category_id": null,
//   "description": "product detail page ",
//   "title": "I WILL",
//   "rent": false,
//   "target_audience": null,
//   "rating": 0,
//   "like": 0,
//   "views": 0,
//   "share": 0,
//   "categories": [
//     {
//       "category_id": "9bc784c9-9064-431d-bc0d-fdd174b18d1f",
//       "name": "Test1",
//       "level": 1
//     },
//     {
//       "category_id": "2e1bd14f-3347-4467-bded-5ddff8580f34",
//       "name": "Test2",
//       "level": 2
//     },
//     {
//       "category_id": "93765625-b4e1-475b-940b-8c31355c95cc",
//       "name": "Test3",
//       "level": 3
//     },
//     {
//       "category_id": "bc0488c7-910c-4bc3-a65f-53e9018b1353",
//       "name": "Test4",
//       "level": 4
//     }
//   ],
//   "attributes": [
//     {
//       "attribute_id": "f28ce35c-ab71-404e-ba9b-b3e9c9a2cefa",
//       "name": "Fit",
//       "value": "Regular"
//     },
//     {
//       "attribute_id": "42997e0d-63e6-4274-b8ea-2166757695a3",
//       "name": "Colar",
//       "value": "Round"
//     },
//     {
//       "attribute_id": "25c4b41c-5ef7-4fa8-a33b-283eab42eae0",
//       "name": "Sleeves",
//       "value": "Long"
//     },
//     {
//       "attribute_id": "bfb7f2eb-6dc7-4946-a927-31a063f45dc1",
//       "name": "T1",
//       "value": "B"
//     },
//     {
//       "attribute_id": "ce819767-9efc-415b-8c04-b30485b4533f",
//       "name": "T2",
//       "value": "F"
//     },
//     {
//       "attribute_id": "506a8d72-f833-4521-85e9-2b12c8197837",
//       "name": "Fabric",
//       "value": "Cotton"
//     }
//   ],
//   "variants": [
//     {
//       "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//       "sku": "S2-BLUE",
//       "price": 5000,
//       "mrp": 2000,
//       "shopify_id": null,
//       "color": {
//         "color_id": "e7ea334a-95a1-4c4b-89c0-2842f9c09137",
//         "color_name": "Blue",
//         "hex_code": null
//       },
//       "size": {
//         "size_id": "a07c6ee4-3fd7-44b0-8e9e-3b2a0b2f7f8a",
//         "size_name": "S2"
//       },
//       "images": [
//         {
//           "variant_id": "b16f3037-f868-46b6-8e42-de1024f60261",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/9b5b4f8b-559e-49ff-a18c-5eda4014acf9.jpg",
//           "image_id": "b31725aa-69a5-4b5a-b7f8-f668d8d46025"
//         },
//         {
//           "variant_id": "b16f3037-f868-46b6-8e42-de1024f60261",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/3367fa8f-dac0-46b0-a533-a80a3874c440.jpg",
//           "image_id": "3ab99660-ff59-4510-b56f-b84979711779"
//         },
//         {
//           "variant_id": "b16f3037-f868-46b6-8e42-de1024f60261",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/0e94a38e-d9ee-49e1-b422-818f4481c08b.jpg",
//           "image_id": "5475955b-7f3b-40b2-8648-1f9c45cafa16"
//         },
//         {
//           "variant_id": "b16f3037-f868-46b6-8e42-de1024f60261",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/94355984-0ae9-444a-9c72-50860147b457.jpg",
//           "image_id": "6e1dd3f9-b547-4139-8c08-807357f1028d"
//         }
//       ],
//       "active": true,
//       "quantity": 0,
//       "variant_id": "b16f3037-f868-46b6-8e42-de1024f60261"
//     },
//     {
//       "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//       "sku": "S2-ORANGE",
//       "price": 5000,
//       "mrp": 2000,
//       "shopify_id": null,
//       "color": {
//         "color_id": "4305374e-1cce-456b-a532-f08b0c95ea45",
//         "color_name": "Orange",
//         "hex_code": null
//       },
//       "size": {
//         "size_id": "a07c6ee4-3fd7-44b0-8e9e-3b2a0b2f7f8a",
//         "size_name": "S2"
//       },
//       "images": [
//         {
//           "variant_id": "2e6ca976-df84-499f-92f5-7c28b5bae848",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/65113c8b-e9fe-4a61-9e4c-082bcac4879c.jpg",
//           "image_id": "548463b3-65e1-4275-b6f3-c88479ab036e"
//         },
//         {
//           "variant_id": "2e6ca976-df84-499f-92f5-7c28b5bae848",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/a5ca896a-63d2-4d7d-885f-2dea15d7b0ff.jpg",
//           "image_id": "2d05aa69-877f-4d9f-8eb3-3444724e4d39"
//         }
//       ],
//       "active": true,
//       "quantity": 0,
//       "variant_id": "2e6ca976-df84-499f-92f5-7c28b5bae848"
//     },
//     {
//       "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//       "sku": "S4-BLUE",
//       "price": 5000,
//       "mrp": 2000,
//       "shopify_id": null,
//       "color": {
//         "color_id": "e7ea334a-95a1-4c4b-89c0-2842f9c09137",
//         "color_name": "Blue",
//         "hex_code": null
//       },
//       "size": {
//         "size_id": "d523b14e-933c-4f49-a734-4e547d98d5a4",
//         "size_name": "S4"
//       },
//       "images": [
//         {
//           "variant_id": "419ce98e-f40c-43bc-8ad6-9ce331ed7563",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/68dc84d9-625d-40f2-aaba-748f0d1c8369.jpg",
//           "image_id": "d42a2a2f-b8f2-4c60-9621-a2286d9eb291"
//         },
//         {
//           "variant_id": "419ce98e-f40c-43bc-8ad6-9ce331ed7563",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/7f7222de-671b-4d12-b3da-91bf1cd34ac0.jpg",
//           "image_id": "d01454ff-942b-4d35-add4-8f1a87898d9f"
//         },
//         {
//           "variant_id": "419ce98e-f40c-43bc-8ad6-9ce331ed7563",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/9b343764-6ee4-4ee4-af32-47ff757c5d38.jpg",
//           "image_id": "25bf6c32-4cb9-48a8-8036-ae43da719af7"
//         }
//       ],
//       "active": true,
//       "quantity": 0,
//       "variant_id": "419ce98e-f40c-43bc-8ad6-9ce331ed7563"
//     },
//     {
//       "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//       "sku": "S4-ORANGE",
//       "price": 5000,
//       "mrp": 2000,
//       "shopify_id": null,
//       "color": {
//         "color_id": "4305374e-1cce-456b-a532-f08b0c95ea45",
//         "color_name": "Orange",
//         "hex_code": null
//       },
//       "size": {
//         "size_id": "d523b14e-933c-4f49-a734-4e547d98d5a4",
//         "size_name": "S4"
//       },
//       "images": [
//         {
//           "variant_id": "afe6e4f3-e01c-4d8f-bd8f-e129b130f3f2",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/a8903606-db8e-48c6-9c6d-ba4f12db461e.jpg",
//           "image_id": "70ce08bd-02f3-4258-9fdf-09c38d6e438f"
//         },
//         {
//           "variant_id": "afe6e4f3-e01c-4d8f-bd8f-e129b130f3f2",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/9d95b6d7-a02a-485d-ad4e-5e46efbe04a1.jpg",
//           "image_id": "a57054d0-6ce2-480f-8e40-2779e6279afe"
//         },
//         {
//           "variant_id": "afe6e4f3-e01c-4d8f-bd8f-e129b130f3f2",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/577361d6-90ad-412c-b859-1e566035abbd.jpg",
//           "image_id": "fca04e03-9b14-4a2f-8572-07feacfd852c"
//         },
//         {
//           "variant_id": "afe6e4f3-e01c-4d8f-bd8f-e129b130f3f2",
//           "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/77d8f5d8-0fa9-4f09-855d-71691a31749e.jpg",
//           "image_id": "c01cd404-c3a7-48bd-af8f-f6c8323c710b"
//         }
//       ],
//       "active": true,
//       "quantity": 0,
//       "variant_id": "afe6e4f3-e01c-4d8f-bd8f-e129b130f3f2"
//     }
//   ],
//   "images": [
//     {
//       "image_id": "dccee932-76ea-43f6-a95b-2ce2e28cc0a2",
//       "product_id": "3601df25-8703-4f82-ac85-75fa6b1d6b5f",
//       "image_url": "https://attirellydev.s3.ap-south-1.amazonaws.com/uploads/5d737da9-5e88-48f8-a0ca-7bbad87cf88a.jpg"
//     }
//   ]
// }