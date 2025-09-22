'use client';
import { useState, useEffect } from 'react';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';
import { jsPDF } from 'jspdf';

/**
 * QrCodeGeneration components
 * 
 * A component within the seller dashboard that manages the lifecycle of a store's QR code.
 * It allows sellers to generate a new QR code if one doesn't exist, displays the existing code,
 * and provides functionality to download it as a PDF.
 *
 * ## Features
 * - **Conditional UI**: Displays a "Generate QR Code" button if no QR code has been created for the store. If a QR code exists, it displays the QR image and a "Download" button instead.
 * - **QR Code Generation**: Triggers an API call to create a new QR code linked to the seller's store.
 * - **Automatic Fetching**: If a `qrId` is found in the global store, a `useEffect` hook automatically fetches and displays the corresponding QR code image.
 * - **PDF Download**: Allows the user to download the QR code. The image is fetched as a blob, converted to Base64, and then embedded into a client-side generated PDF using the `jsPDF` library.
 *
 * ## Logic Flow
 * 1.  The component mounts and reads `qrId` and `storeId` from the `useSellerStore`.
 * 2.  A `useEffect` hook checks if `qrId` exists. If it does, it calls the `GET /qrcode/qr_by_id/{qrId}` API to fetch the image path and stores it in the `qrImageUrl` state.
 * 3.  The component's render logic checks if `qrImageUrl` has a value.
 * 4.  **If `qrImageUrl` is empty**: It renders the "Generate QR Code" button. Clicking this calls `generateQrCode`, which triggers the `POST /qrcode/qr_gen_user/{storeId}` API. On success, the new QR data is saved to the state, causing a re-render.
 * 5.  **If `qrImageUrl` has a value**: It renders the QR image and a "Download" button. Clicking this calls `handleDownload`.
 * 6.  The `handleDownload` function fetches the image file from `qrImageUrl` as a `blob`, uses a `FileReader` to convert it to a Base64 data URL, and then uses `jsPDF` to create and save a PDF containing the image.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `jsPDF` for client-side PDF generation.
 * - **State (Zustand Stores)**:
 *      - `useSellerStore`: For accessing `qrId` and `storeId`, and for setting the new `qrId` after generation.
 * - **Utilities**:
 *      - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - GET `/qrcode/qr_by_id/{id}`: Fetches the image path of an existing QR code.
 * - POST `/qrcode/qr_gen_user/{storeId}`: Requests the backend to generate a new QR code for a store.
 * - PUT `/stores/{storeId}`: Updates the user's onboarding progress after generating the QR code.
 * - A direct `GET` request is made to the QR image path to fetch it as a blob for PDF generation.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered QR code generation and download section.
 */
export default function QrCodeGeneration() {
    const { qrId, setQrId, storeId, furthestStep } = useSellerStore();
    const [qrImageUrl, setQrImageUrl] = useState('');


    // Auto-fetch QR image if qrId exists
    useEffect(() => {
        const fetchQrImage = async () => {
            if (!qrId) return;

            try {
                const response = await api.get(`/qrcode/qr_by_id/${qrId}`);
                const data = response.data;
                setQrImageUrl(data.qr_path);  // e.g., /uploads/abc.png

            } catch (err) {
                console.error("Failed to fetch QR image:", err);
            }
        };

        fetchQrImage();
    }, [qrId]);

    // When generating QR
    const generateQrCode = async () => {
        try {
            const response = await api.post(`/qrcode/qr_gen_user/${storeId}`);
            const qrData = response.data;
            await api.put(`/stores/${storeId}`, { curr_section: furthestStep + 1 });
            setQrId(qrData.qr_id);
            setQrImageUrl(qrData.qr_path);

        } catch (err) {
            console.error("QR generation failed", err);
        }
    };


    const handleDownload = async () => {
        try {
            const response = await api.get(qrImageUrl, { responseType: 'blob', });
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;

                const pdf = new jsPDF();
                const width = pdf.internal.pageSize.getWidth();
                
                // Center the image with margins
                const imgWidth = width * 0.8; // Use 80% of page width
                const x = (width - imgWidth) / 2;

                pdf.addImage(base64data, 'PNG', x, 15, imgWidth, 0); // 0 = auto height
                pdf.save(`attirelly-qr-${storeId}.pdf`);

            };
            reader.readAsDataURL(response.data);

        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className="rounded-2xl p-4 sm:p-6 space-y-6  mx-auto shadow-sm bg-white text-black">
            <div>
                <h2 className="text-base sm:text-lg font-semibold">QR code</h2>
                <p className="text-xs sm:text-sm text-gray-500">Download QR and share it with your customers to promote your store on Attirelly</p>
            </div>

            <div className="-mx-4 sm:-mx-6 border-t border-dotted border-gray-300"></div>

            {qrImageUrl ? (
                <div className="flex flex-col justify-center items-center gap-4 text-center">
                    <img src={qrImageUrl} alt="QR Code" className="w-48 h-48 sm:w-64 sm:h-64 object-contain" />
                    <button
                        onClick={handleDownload}
                        className="py-2 px-4 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black text-sm sm:text-base"
                    >
                        Download QR Code
                    </button>
                </div>
            ) : (
                <button
                    onClick={generateQrCode}
                    className="block mx-auto py-2 px-6 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black text-sm sm:text-base"
                >
                    Generate QR Code
                </button>
            )}
        </div>
    );
}
