'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { BrandType, City } from '@/types/SellerTypes';
import { useHeaderStore } from '@/store/listing_header_store';
import { SelectOption } from '@/types/SellerTypes';

// const priorityOrder = [
//     'Designer Labels',
//     'Retail brands',
//     'Boutiques',
//     'Western Wear',
//     'Exhibition',
//     'Stylist',
// ];

export default function ListingPageHeader() {
    const { setCity, query, setQuery } = useHeaderStore();
    const [cities, setCities] = useState<City[]>([]);
    // const [stores, setStoreTypes] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [tempQuery, setTempQuery] = useState<string>('');
    // const [defaultStoreType, setDefaultStoreType] = useState<BrandType | null>(null);

    // Create options from cities
    const cityOptions: SelectOption[] = cities.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    // Convert City to SelectOption
    const getOptionFromCity = (city: City): SelectOption => ({
        label: city.name,
        value: city.id,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setQuery(tempQuery);
        }
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await api.get('/location/cities/');
                setCities(res.data);
            } catch (error) {
                toast.error('Failed to fetch cities');
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            setCity(selectedCity);
        }
    }, [selectedCity]);

    return (
        <header className="bg-[#FFFFFF] shadow">
            <div className="grid grid-cols-[1fr_2fr_1fr] items-center px-20 py-4">
                {/* Left: Logo */}
                <div className="flex justify-Left">
                    <div className="text-3xl font-bold text-black">Attirelly</div>
                </div>

                {/* Center: Search Component */}
                <div className="flex justify-center">
                    <div className="flex border border-gray-300 rounded-full items-center gap-4 w-full max-w-[600px] px-4">
                        {/* City Selector */}
                        <div className="flex items-center gap-2 w-[50%]">
                            <div className="opacity-80">
                                <img src="/ListingPageHeader/location_pin.svg" alt="Location" />
                            </div>
                            <Select
                                options={cityOptions}
                                value={selectedCity ? getOptionFromCity(selectedCity) : null}
                                onChange={(newValue, _actionMeta) => {
                                    const val = newValue as SelectOption | null;
                                    const city = cities.find((c) => c.id === val?.value);
                                    setSelectedCity(city || null);
                                }}
                                className="w-full"
                                classNamePrefix="city-select"
                                isSearchable
                                placeholder="City Name"
                            />
                        </div>

                        <div className="border-l-2 border-gray-300 h-5 my-2" />

                        {/* Search Input */}
                        <div className="flex items-center px-4 py-2 w-full">
                            <div className="mr-2 opacity-80">
                                <img src="/ListingPageHeader/search_lens.svg" alt="Search" />
                            </div>
                            <input
                                type="text"
                                placeholder="Find your style..."
                                className="w-full focus:outline-none text-sm"
                                value={tempQuery}
                                onChange={(e) => setTempQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Profile + Cart */}
                <div className="flex justify-center">
                    <div className="flex items-center justify-between gap-10 text-sm w-full max-w-[200px]">
                        <div className="flex items-center gap-2">
                            <span>Archit</span>
                            <div className="opacity-100">
                                <img src="/ListingPageHeader/user_logo.svg" alt="User" />
                            </div>
                        </div>
                        <div className="opacity-100">
                            <img src="/ListingPageHeader/shopping_cart.svg" alt="Cart" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex justify-center gap-8 py-2 text-sm text-gray-600">
                <a href="#">Men</a>
                <a href="#">Women</a>
                {/* <a href="#">Wedding</a>
                <a href="#">Stores</a>
                <a href="#">Locations</a>
                <a href="#">Trends</a> */}
            </nav>
        </header>
    );
}
