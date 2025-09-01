// 'use client';
// import { useState, useEffect } from 'react';
// import { useSellerStore } from '@/store/sellerStore';
// import { api } from '@/lib/axios';
// import { jsPDF } from 'jspdf';

// export default function QrCodeGeneration() {
//     const { qrId, setQrId, storeId, furthestStep } = useSellerStore();
//     const [qrImageUrl, setQrImageUrl] = useState('');


//     // Auto-fetch QR image if qrId exists
//     useEffect(() => {
//         const fetchQrImage = async () => {
//             if (!qrId) return;

//             try {
//                 const response = await api.get(`qrcode/qr_by_id/${qrId}`);
//                 const data = response.data;
//                 setQrImageUrl(data.qr_path);  // e.g., /uploads/abc.png
                
//             } catch (err) {
//                 console.error("Failed to fetch QR image:", err);
//             }
//         };

//         fetchQrImage();
//     }, [qrId]);

//     // When generating QR
//     const generateQrCode = async () => {
//         try {
//             const response = await api.post(`/qrcode/qr_gen_user/${storeId}`);
//             const qrData = response.data;
//             await api.put(`/stores/${storeId}`, {curr_section:furthestStep + 1});
//             setQrId(qrData.qr_id);
//             setQrImageUrl(qrData.qr_path);
            
//         } catch (err) {
//             console.error("QR generation failed", err);
//         }
//     };
    

//     const handleDownload = async () => {
//         try {
//             const response = await api.get(qrImageUrl, { responseType: 'blob', });
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const base64data = reader.result as string;

//                 const pdf = new jsPDF();
//                 const width = pdf.internal.pageSize.getWidth();
//                 const height = pdf.internal.pageSize.getHeight();

//                 // Adjust width/height as needed
//                 pdf.addImage(base64data, 'PNG', 10, 10, width - 20, 0); // 0 = auto height
//                 pdf.save(`attirelly-qr-${storeId}.pdf`);

//             };
//             reader.readAsDataURL(response.data);

//         } catch (error) {
//             console.error("Download failed:", error);
//         }
//     };

//     return (
//         <div className="rounded-2xl p-6 space-y-6 w-3xl shadow-sm bg-white text-black">
//             <div>
//                 <h2 className="text-lg font-semibold">QR code</h2>
//                 <p className="text-sm text-gray-500">Download QR and share it with your customers to promote your store on Attirelly</p>
//             </div>

//             <div className="-mx-6 border-t border-dotted border-gray-300"></div>

//             {qrImageUrl ? (
//                 <div className="flex flex-col justify-center items-center">
//                     <img src={qrImageUrl} alt="QR Code" className="w-64 h-64 object-contain" />
//                     <button
//                         onClick={handleDownload}
//                         className="py-2 px-4 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black"
//                     >
//                         Download QR Code
//                     </button>
//                 </div>
//             ) : (
//                 <button
//                     onClick={generateQrCode}
//                     className="block mx-auto py-2 px-6 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black"
//                 >
//                     Generate QR Code
//                 </button>
//             )}
//         </div>
//     );
// }


'use client';
import { useState, useEffect } from 'react';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';
import { jsPDF } from 'jspdf';

export default function QrCodeGeneration() {
    const { qrId, setQrId, storeId, furthestStep } = useSellerStore();
    const [qrImageUrl, setQrImageUrl] = useState('');


    // Auto-fetch QR image if qrId exists
    useEffect(() => {
        const fetchQrImage = async () => {
            if (!qrId) return;

            try {
                const response = await api.get(`qrcode/qr_by_id/${qrId}`);
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
        <div className="rounded-2xl p-4 sm:p-6 space-y-6 w-full max-w-3xl mx-auto shadow-sm bg-white text-black">
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
