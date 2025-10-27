import React from "react";

interface DateRangeFilterProps {
  label?: string;
  startDate: string; // ISO string or YYYY-MM-DD
  endDate: string;   // ISO string or YYYY-MM-DD
  onChange: (start: string, end: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label = "Created At",
  startDate,
  endDate,
  onChange,
}) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    if (new Date(newStart) > new Date(endDate)) return; // prevent invalid range
    onChange(newStart, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    if (new Date(newEnd) < new Date(startDate)) return; // prevent invalid range
    onChange(startDate, newEnd);
  };

  return (
    <div className="mb-6 w-full">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={startDate ? startDate.split("T")[0] : ""}
          onChange={handleStartChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate ? endDate.split("T")[0] : ""}
          onChange={handleEndChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
