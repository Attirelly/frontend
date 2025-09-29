"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '@/lib/axios';

// --- A simple spinner for loading states ---
const Spinner = () => (
    <div className="h-5 w-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
);

// --- Define the structure of a Category ---
interface Category {
    category_id: string;
    name: string;
}

interface CategorySelectProps {
    value: string; // The currently selected category_id
    onChange: (categoryId: string) => void;
    className?: string;
    error?: boolean;
}

export default function CategorySelect({ value, onChange, className, error }: CategorySelectProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- Fetch all categories once when the component mounts ---
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/categories/");
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
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


    // --- Memoized filtering for search performance ---
    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categories;
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, categories]);

    const selectedCategoryName = useMemo(() => {
        return categories.find(c => c.category_id === value)?.name || "";
    }, [value, categories]);
    
    const handleSelect = (category: Category) => {
        onChange(category.category_id);
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
                <span className={selectedCategoryName ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedCategoryName || "Select a category..."}
                </span>
                {isLoading ? <Spinner /> : <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul>
                        {filteredCategories.length > 0 ? filteredCategories.map(category => (
                            <li
                                key={category.category_id}
                                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(category)}
                            >
                                {category.name}
                            </li>
                        )) : (
                            <li className="px-4 py-2 text-sm text-gray-500">No categories found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}