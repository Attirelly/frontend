"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '@/lib/axios';

// --- A simple spinner for loading states ---
const Spinner = () => (
    <div className="h-5 w-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
);

// --- Define the structure of a Store ---
interface Store {
    store_id: string;
    name: string;
    location: string;
}

interface StoreSelectProps {
    value: string; // The currently selected store_id
    onChange: (storeId: string) => void;
    className?: string;
    error?: boolean;
}

export default function StoreSelect({ value, onChange, className, error }: StoreSelectProps) {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- Fetch all stores once when the component mounts ---
    useEffect(() => {
        const fetchStores = async () => {
            setIsLoading(true);
            try {
                // Assuming the API endpoint to fetch stores is /stores/
                const response = await api.get("/stores/");
                setStores(response.data);
            } catch (err) {
                console.error("Failed to fetch stores:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStores();
    }, []);
    
    // --- Effect to handle closing the dropdown when clicking outside ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    // --- Memoized filtering for search performance (searches name and location) ---
    const filteredStores = useMemo(() => {
        if (!searchTerm) return stores;
        return stores.filter(store =>
            store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, stores]);

    const selectedStoreDisplay = useMemo(() => {
        const store = stores.find(s => s.store_id === value);
        return store ? `${store.name} (${store.location})` : "";
    }, [value, stores]);
    
    const handleSelect = (store: Store) => {
        onChange(store.store_id);
        setSearchTerm("");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm text-left flex justify-between items-center ${className} ${error ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
            >
                <span className={selectedStoreDisplay ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStoreDisplay || "Select a store..."}
                </span>
                {isLoading ? <Spinner /> : <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search store name or location..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul>
                        {filteredStores.length > 0 ? filteredStores.map(store => (
                            <li
                                key={store.store_id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(store)}
                            >
                                <p className="text-sm font-medium text-gray-800">{store.name}</p>
                                <p className="text-xs text-gray-500">{store.location}</p>
                            </li>
                        )) : (
                            <li className="px-4 py-2 text-sm text-gray-500">No stores found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}