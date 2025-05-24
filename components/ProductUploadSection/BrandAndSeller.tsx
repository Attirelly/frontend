// 'use client';

// import React, { useState } from 'react';

// export default function BrandAndSeller(){
//   const [skuID, setSkuID] = useState('');
//   const [productName, setProductName] = useState('');
//   const [productDescription, setProductDescription] = useState('');
  

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg self-start">
//       <h1 className="text-2xl font-bold mb-2">Brand and seller info</h1>
//       <p className="text-gray-600 mb-6">Provide who's selling and where it ships from</p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Column 1 */}
//         <div className="flex flex-col gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Seller SKU ID</label>
//             <input
//               type="text"
//               value={skuID}
//               onChange={(e) => setSkuID(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//               placeholder="e.g., 1000 , 2000 "
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Product name</label>
//             <input
//               type="text"
//               value={productName}
//               onChange={(e) => setProductName(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//               placeholder="e.g., 100"
//             />
//           </div>
//         </div>

//         {/* Column 2 */}
//         <div className="flex flex-col gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Product description</label>
//             <input
//               type="text"
//               value={productDescription}
//               onChange={(e) => setProductDescription(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//               placeholder="e.g., 100"
//             />
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useFormActions, useFormData } from '@/store/product_upload_store';
import { useEffect, useState } from 'react';


export default function BrandAndSeller() {
  // Get form data and actions from Zustand store
  const { keyDetails } = useFormData();
  const { updateFormData } = useFormActions();

  // Initialize local state with stored values or defaults
  const [formState, setFormState] = useState({
    skuID: keyDetails?.skuID || '',
    productName: keyDetails?.productName || '',
    productDescription: keyDetails?.productDescription || ''
  });

  // Update Zustand store when component unmounts
  useEffect(() => {
    return () => {
      updateFormData('keyDetails', formState);
    };
  }, [formState, updateFormData]);

  // Optional: Auto-save after certain time of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('keyDetails', formState);
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formState, updateFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg self-start">
      <h1 className="text-2xl font-bold mb-2">Brand and seller info</h1>
      <p className="text-gray-600 mb-6">Provide who's selling and where it ships from</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Seller SKU ID</label>
            <input
              type="text"
              name="skuID"
              value={formState.skuID}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 1000, 2000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product name</label>
            <input
              type="text"
              name="productName"
              value={formState.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter product name"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product description</label>
            <textarea
              name="productDescription"
              value={formState.productDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              placeholder="Enter detailed product description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}