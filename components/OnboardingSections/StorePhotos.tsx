import React, { useRef } from 'react';

export default function PhotosPage() {
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const handleBannerClick = () => {
        bannerInputRef.current?.click();
    };

    const handleProfileClick = () => {
        profileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            console.log('Selected file:', file);
            // TODO: handle preview or upload logic here
        }
    };

    return (
        // <div className="min-h-screen bg-gray-100">
            <div className="max-w-2xl space-y-6 bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-lg font-semibold">Photos</h1>
                    <p className="text-gray-500 text-sm">Upload a banner photo to showcase your brand's look.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Profile Banner Upload */}
                    <div
                        onClick={handleBannerClick}
                        className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition"
                    >
                        <h2 className="text-lg font-semibold mb-4">Upload your banner image</h2>
                        <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            <span>Click to upload image (svg, png, jpg)</span>
                        </div>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept=".svg,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Card 2: Profile Image Upload */}
                    <div
                        onClick={handleProfileClick}
                        className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition"
                    >
                        <h2 className="text-lg font-semibold mb-4">Upload your profile image</h2>
                        <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                            <span>Click to upload image (svg, png, jpg)</span>
                        </div>
                        <input
                            ref={profileInputRef}
                            type="file"
                            accept=".svg,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>
        // </div>
    );
}