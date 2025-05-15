'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
};

export default function SearchableSelect({ label, options, value, onChange }: Props) {
  const [query, setQuery] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            className="w-full border px-3 py-2 rounded"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(val: string) =>
              options.find((opt) => opt.value === val)?.label || ''
            }
            placeholder={`Select ${label}`}
          />
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white border rounded shadow-lg z-10">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No results found.</div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${
                      active ? 'bg-blue-600 text-white' : 'text-black'
                    }`
                  }
                >
                  {option.label}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
