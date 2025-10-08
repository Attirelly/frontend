import React from 'react';

// --- (Optional) It's good practice to define icons as separate components ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default function TopBar({ onAdd }) {
  return (
    // --- UI IMPROVEMENT: Added a subtle shadow for more depth ---
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      
      {/* --- Left Section: Title and Subtitle --- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all your sponsored product campaigns.</p>
      </div>

      {/* --- Right Section: Actions and User Info --- */}
      <div className="flex items-center gap-4">
        
        {/* --- UI/UX IMPROVEMENT: Placeholder icons for a more complete dashboard feel --- */}
        <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" title="Help & Documentation">
          <HelpIcon />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" title="Notifications">
          <BellIcon />
        </button>
        
        {/* --- UI IMPROVEMENT: Vertical separator for better visual grouping --- */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* --- UI/UX IMPROVEMENT: Avatar placeholder --- */}
        <div className="flex items-center gap-2">
            <img 
              src="https://i.pravatar.cc/40?u=a042581f4e29026704d" 
              alt="User Avatar" 
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="text-sm">
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Sponsor</p>
            </div>
        </div>

        {/* --- UI/UX IMPROVEMENT: CTA button with an icon and better hover effect --- */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <PlusIcon />
          New Campaign
        </button>

      </div>
    </header>
  );
}