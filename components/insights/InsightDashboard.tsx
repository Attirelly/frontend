'use client'; // Add this line at the top

import { useState } from 'react'; // Import useState
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';

// --- TYPE DEFINITION ---
interface Profile {
  username: string;
  followers: string;
  engagement: string;
  reach: string;
}

// --- MOCK DATA ---
const profileData: Profile[] = [
  {
    username: 'misthi_dev',
    followers: '1.2M',
    engagement: '4.5%',
    reach: '500K',
  },
  {
    username: 'creative_code',
    followers: '800K',
    engagement: '3.8%',
    reach: '400K',
  },
  {
    username: 'design_daily',
    followers: '2.1M',
    engagement: '5.1%',
    reach: '800K',
  },
  {
    username: 'coding_art',
    followers: '650K',
    engagement: '3.1%',
    reach: '320K',
  },
];

// --- PROFILE CARD COMPONENT ---
const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div>
          <h2 className="font-bold text-base sm:text-lg text-gray-800">@{profile.username}</h2>
          <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-x-2">
            <span>Followers: {profile.followers}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>Engagement: {profile.engagement}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <span>Reach: {profile.reach}</span>
          </p>
        </div>
      </div>
      <ChevronRight className="text-gray-400 flex-shrink-0 ml-2" size={24} />
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const InstagramInsightsPage = () => {
  // --- STATE MANAGEMENT for filters ---
  const [activeFilter, setActiveFilter] = useState('Reach');
  const [activePeriod, setActivePeriod] = useState('7d');
  
  const mainFilters = ['Followers Growth', 'Engagement Rate', 'Reach'];
  const timePeriods = ['7d', '30d', '90d'];

  return (
    <main className="bg-white text-gray-800 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Instagram Insights</h1>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search username..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow" 
              />
            </div>
            <button className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <SlidersHorizontal size={20} className="mx-auto sm:mx-0" />
            </button>
          </div>
        </header>

        {/* MODIFIED: Filters and Time Period Section */}
        <section className="mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Main Filters with state */}
                <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2">
                    {mainFilters.map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Time Period Filter with state */}
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                    {timePeriods.map((period) => (
                         <button 
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-5 py-1.5 rounded-md text-sm font-semibold transition-colors ${activePeriod === period ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-white'}`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Profile List Section */}
        <section>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {profileData.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default InstagramInsightsPage;