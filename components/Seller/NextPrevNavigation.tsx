'use client';
import React from 'react';
import { useSellerStore } from '@/store/sellerStore';

type Props = {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
};

/**
 * NextPrevNavigation component
 * 
 * A reusable navigation component that provides "Back" and "Next" buttons for a multi-step
 * form, such as the seller onboarding process. It also acts as a validation gatekeeper before
 * allowing the user to proceed to the next step.
 *
 * ## Features
 * - **Conditional Rendering**: The "Back" button is only rendered if the user is not on the first step of the process.
 * - **Step-Specific Validation**: Before allowing navigation to the next step, it performs validation checks specific to the current `activeSection`. It reads validation flags from the `useSellerStore` to determine if the form is complete.
 * - **User Feedback**: If validation for the current step fails, it uses a browser `alert()` to inform the user what needs to be corrected.
 * - **Callback-driven**: It is a controlled component that does not handle navigation logic itself. Instead, it calls the `onNext` and `onBack` functions provided by its parent.
 *
 * ## Logic Flow
 * 1.  The component renders "Back" and "Next" buttons. The "Back" button's visibility is controlled by the `isFirst` prop.
 * 2.  When the user clicks the "Back" button, it directly calls the `onBack` function passed via props.
 * 3.  When the user clicks the "Next" button, it triggers the internal `handleNextClick` function.
 * 4.  `handleNextClick` reads the current `activeSection` and corresponding validation flags (e.g., `businessDetailsValid`) from the `useSellerStore`.
 * 5.  It runs a series of `if` statements to check the validity of the current section.
 * 6.  If any validation check fails, it shows an `alert` to the user and stops execution.
 * 7.  If all validation checks for the current section pass, it then calls the `onNext` function from its props, allowing the parent component to handle the navigation and data-saving logic.
 *
 * ## Imports
 * - **Core/Libraries**: `React` from `react`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: To access the `activeSection` and the validation status flags for each form section.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {() => void} props.onNext - The callback function to execute when the "Next" button is clicked and validation passes.
 * @param {() => void} props.onBack - The callback function to execute when the "Back" button is clicked.
 * @param {boolean} props.isFirst - A flag to indicate if the current step is the first one, used to hide the "Back" button.
 * @param {boolean} props.isLast - A flag to indicate if the current step is the last one.
 *
 * @returns {JSX.Element} The rendered navigation buttons.
 */
export default function NextPrevNavigation({ onNext, onBack, isFirst, isLast }: Props) {
  const {
    businessDetailsValid,
    priceFiltersValid,
    priceFiltersData,
    activeSection,
    socialLinksValid,
    storePhotosValid
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
