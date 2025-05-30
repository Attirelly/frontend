'use client';
import { useState, useEffect } from 'react';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QrCodeGeneration() {
    const { qrId, setQrId, storeId } = useSellerStore();
    const [qrImageUrl, setQrImageUrl] = useState('');


    // Auto-fetch QR image if qrId exists
    useEffect(() => {
        const fetchQrImage = async () => {
            if (!qrId) return;

            try {
                const response = await api.get(`qrcode/qr_by_id/${qrId}`);
                const data = response.data;
                setQrImageUrl(`${BASE_URL}${data.qr_path}`);  // e.g., /uploads/abc.png
                console.log(data);
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
            setQrId(qrData.qr_id);
            setQrImageUrl(`${BASE_URL}${qrData.qr_path}`);
            console.log(qrData);
        } catch (err) {
            console.error("QR generation failed", err);
        }
    };

    return (
        <div className="rounded-2xl p-6 space-y-6 w-3xl shadow-sm bg-white">
            <div>
                <h2 className="text-lg font-semibold">QR code</h2>
                <p className="text-sm text-gray-500">Customers will see these details on Attirelly</p>
            </div>

            <div className="-mx-6 border-t border-dotted border-gray-300"></div>

            {qrImageUrl ? (
                <div className="flex flex-col justify-center items-center">
                    <img src={qrImageUrl} alt="QR Code" className="w-64 h-64 object-contain" />
                    <a
                        href={qrImageUrl}
                        download={`attirelly-qr-${storeId}.png`}
                        className="py-2 px-4 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black"
                    >
                        Download QR Code
                    </a>
                </div>
            ) : (
                <button
                    onClick={generateQrCode}
                    className="block mx-auto py-2 px-6 rounded-2xl bg-black text-white transition duration-200 hover:bg-gray-200 hover:text-black"
                >
                    Generate QR Code
                </button>
            )}
        </div>
    );
}
