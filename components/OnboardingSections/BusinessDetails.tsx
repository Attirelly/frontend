import React, { useState } from 'react';
export default function BusinessDetailsComponent() {
    const [sameAsOwner, setSameAsOwner] = useState(true);
    const [brandTypes, setBrandTypes] = useState<string[]>([]);
    const [genders, setGenders] = useState<string[]>([]);
    const [rentOutfits, setRentOutfits] = useState<string | null>(null);

    const brandTypeOptions = [
        'Designer labels',
        'Western wear',
        'Retail brands',
        'Exhibition',
        'Boutiques',
        'Stylist',
    ];

    const genderOptions = ['Male', 'Female'];

    const handleMultiSelect = (option: string, list: string[], setList: (val: string[]) => void) => {
        setList(list.includes(option) ? list.filter(item => item !== option) : [...list, option]);
    };

    return (
        <div className="space-y-8 p-6 max-w-3xl mx-auto bg-gray-100">
            {/* Container 1 */}
            <div className="border p-6 rounded-2xl shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-1">Brand owner details</h2>
                <p className="text-sm text-gray-500 mb-4">
                    This is for internal data, your customers won't see this.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        {/*Column 1*/}
                        <div>
                            <label className="block text-sm font-medium mb-1">Brand owner number*</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="+91-8949389493"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email address*</label>
                            <input
                                type="email"
                                className="w-full border rounded px-3 py-2"
                                placeholder="abc@xyz.com"
                            />
                        </div>


                    </div>
                    {/* Column 2 */}

                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium mb-1">Brand owner name*</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Please enter your full name"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Container 2 */}
            <div className="border p-6 rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-semibold mb-1">Brand details</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Customers will see these details on Attirelly
                </p>

                <div className="space-y-4">
                    {/* Brand Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand name*</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Please enter your full name"
                        />
                    </div>

                    {/* Business WhatsApp */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Business WhatsApp number</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 mb-1"
                            placeholder="+91-8949389493"
                            disabled={sameAsOwner}
                        />
                        <label className="text-sm flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={sameAsOwner}
                                onChange={() => setSameAsOwner(!sameAsOwner)}
                            />
                            Same as owner number
                        </label>
                    </div>

                    {/* Brand Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Brand type*</label>
                        <div className="flex flex-wrap gap-2">
                            {brandTypeOptions.map(type => (
                                <label
                                    key={type}
                                    className={`px-3 py-2 border rounded cursor-pointer ${brandTypes.includes(type) ? 'bg-black text-white' : 'bg-white'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={brandTypes.includes(type)}
                                        onChange={() => handleMultiSelect(type, brandTypes, setBrandTypes)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Genders Catered */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Genders catered*</label>
                        <div className="flex gap-2">
                            {genderOptions.map(gender => (
                                <label
                                    key={gender}
                                    className={`px-4 py-2 border rounded cursor-pointer ${genders.includes(gender) ? 'bg-black text-white' : 'bg-white'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={genders.includes(gender)}
                                        onChange={() => handleMultiSelect(gender, genders, setGenders)}
                                    />
                                    {gender}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rent Outfits */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Do you rent outfits</label>
                        <div className="flex gap-4">
                            {['Yes', 'No'].map(option => (
                                <label
                                    key={option}
                                    className={`px-4 py-2 border rounded cursor-pointer ${rentOutfits === option ? 'bg-black text-white' : 'bg-white'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="rentOutfits"
                                        className="hidden"
                                        value={option}
                                        checked={rentOutfits === option}
                                        onChange={() => setRentOutfits(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Container 3 */}
            <div className="border p-6 rounded-2xl shadow-sm bg-white">
                <div>
                    <h2 className="text-lg font-semibold">Brand location</h2>
                    <p className="text-sm text-gray-500">
                        Customers will see these details on Attirelly
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">City*</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Please enter your city"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Brand address</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Please enter your Google Map URL"
                            />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Area</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Please enter your locality"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Pin code*</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Please enter your pincode"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        className="mt-4 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition"
                    >
                        Add another outlet
                    </button>
                </div>
            </div>

        </div>
    );
}