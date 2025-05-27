'use client';
import React from 'react';
// import { useFormValidation } from '@/components/FormValidationContext';
import { useSellerStore } from '@/store/sellerStore';

type Props = {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function NextPrevNavigation({ onNext, onBack, isFirst, isLast }: Props) {
  const {
    businessDetailsValid,
    // Add other validations here as needed, like:
    // socialLinksValid,
    priceFiltersValid,
    priceFiltersData,
    activeSection,
    socialLinksValid,
    storePhotosValid
    // etc.
  } = useSellerStore();

  const handleNextClick = () => {

    if (activeSection === 'brand' && !businessDetailsValid) {
      alert('Please fill all mandatory fields in Business Details.');
      return;
    }
    if (activeSection === 'price') {
      if (!priceFiltersValid) {
        alert('Please fill all mandatory fields in Price Filters');
        return;
      }
      if (priceFiltersData) {
        if (priceFiltersData.avgPriceMax < priceFiltersData.avgPriceMin) {
          alert('Minimum Price can not be more than Maximum Price')
          return;
        }
      }
    }

    if (activeSection === 'photos' && !storePhotosValid) {
      alert('Please fill all mandatory fields in Store Photos');
      return;
    }

    onNext();
  };

  return (
    <div className="flex justify-between mt-4">
      {!isFirst ? (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back
        </button>
      ) : (
        <div />
      )}


      <button
        onClick={handleNextClick}
        className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
      >
        Next
      </button>

    </div>
  );
}
