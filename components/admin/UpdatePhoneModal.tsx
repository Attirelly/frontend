import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Define the shape of a seller object (adjust as needed)
// This should match the 'seller' object type in your page.tsx
type Seller = {
    id: string;
    name: string;
    email: string;
    mobile: string;
    // ... other seller properties
};

// Define the props for the modal
type UpdatePhoneModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: { [key: string]: string }) => Promise<any>;
    selectedSellers: Seller[];
};

const UpdatePhoneModal: React.FC<UpdatePhoneModalProps> = ({
    isOpen,
    onClose,
    onUpdate,
    selectedSellers,
}) => {

    // 2. ADD loading and error state to the modal
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // State to hold the phone number changes.
    // We use an object map { sellerId: newPhoneNumber }
    const [updatedPhones, setUpdatedPhones] = useState<{ [key: string]: string }>(
        {}
    );

    // When the modal opens (or selected sellers change),
    // populate the state with the current phone numbers.
    useEffect(() => {
        if (isOpen) {
            const initialPhones = selectedSellers.reduce(
                (acc, seller) => {
                    acc[seller.id] = seller.mobile || ""; // Use current mobile or empty string
                    return acc;
                },
                {} as { [key: string]: string }
            );
            setUpdatedPhones(initialPhones);
        }
    }, [isOpen, selectedSellers]);

    // Handle changes to any phone number input
    const handlePhoneChange = (sellerId: string, newPhone: string) => {
        // Regex to allow only digits
        const onlyDigits = /^[0-9]*$/;

        // We only update the state if:
        // 1. The new value is empty (user is deleting)
        // 2. The new value contains only digits AND is 10 characters or less
        if (
            newPhone === "" ||
            (onlyDigits.test(newPhone) && newPhone.length <= 10)
        ) {
            setUpdatedPhones((prev) => ({
                ...prev,
                [sellerId]: newPhone,
            }));
        }
    };

    // Handle the final update click
    const handleUpdateClick = async () => {
        setIsLoading(true);

        // 3.1. VALIDATION: Check for 10-digit numbers
        const invalidPhones = Object.values(updatedPhones).some(
            (phone) => phone.length > 0 && phone.length < 10
        );

        if (invalidPhones) {
            toast.error("Enter 10 digits phone numbers")
            setIsLoading(false);
            return;
        }
        try {
            // Call the async function passed from page.tsx
            await onUpdate(updatedPhones);
            // Success is handled in page.tsx (it will close the modal)
        } catch (err: any) {
            // Catch any errors thrown by the onUpdate function
            console.error("Modal update error:", err);
            const errorMessage =
                err.response?.data?.detail || "An unexpected error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render anything if the modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 transform transition-all">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Update Phone Numbers
                </h2>

                {/* Scrollable Table Container */}
                <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Store Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone Number (Editable)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedSellers.map((seller) => (
                                <tr key={seller.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {seller.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {seller.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* Editable Input Field */}
                                        <input
                                            type="tel"
                                            value={updatedPhones[seller.id] || ""}
                                            onChange={(e) =>
                                                handlePhoneChange(seller.id, e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter 10-digit number"
                                            maxLength={10} // <-- Prevents typing more than 10 chars
                                            pattern="[0-9]{10}"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading} // Disable cancel when loading
                        className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateClick}
                        disabled={isLoading} // Disable update when loading
                        className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                            </div>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePhoneModal;