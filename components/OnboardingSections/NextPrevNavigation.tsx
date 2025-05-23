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
    // priceFiltersValid,
    // etc.
  } = useSellerStore();

  const handleNextClick = () => {
    if (!businessDetailsValid) {
      alert('Please fill all mandatory fields in Business Details.');
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

      {!isLast && (
        <button
          onClick={handleNextClick}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
          Next
        </button>
      )}
    </div>
  );
}
