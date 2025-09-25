'use client';

import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react'; // Removed SlidersHorizontal

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

// --- MODIFIED: PROFILE CARD COMPONENT ---
// It now accepts 'activeFilter' to conditionally display metrics.
const ProfileCard = ({ profile, activeFilter }: { profile: Profile; activeFilter: string }) => {

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div>
          <h2 className="font-bold text-base sm:text-lg text-gray-800">@{profile.username}</h2>
          <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-x-2">
            <span>Followers: {profile.followers}</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            {/* --- CHANGE: Conditional Metric Display --- */}
            {activeFilter === 'Engagement Rate' && (
              <span>Engagement: {profile.engagement}</span>
            )}
            {activeFilter === 'Reach' && (
              <span>Reach: {profile.reach}</span>
            )}
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
  const [activeFilter, setActiveFilter] = useState('Reach'); // Default filter is Reach
  const [activePeriod, setActivePeriod] = useState('7d');
  
  // --- CHANGE: Removed 'Followers Growth' ---
  const mainFilters = ['Engagement Rate', 'Reach'];
  const timePeriods = ['7d', '30d', '90d'];

  const handleConnectClick = () => {
    try {
            let appId = process.env.NEXT_INSTAGRAM_APP_ID || "548897007892754";
            // const redirectUri = `${window.location.origin}/auth/callback`;
            const redirectUri = `https://5e872f4b90c1.ngrok-free.app/auth/callback`;

            // Build state object to pass data through OAuth redirect
            const stateData = {
              instagram_url: 'https://instagram.com/taswirein',
              redirect_uri: redirectUri,
            };

            const encodedState = encodeURIComponent(JSON.stringify(stateData));

            // Redirect user to Instagram OAuth authorize page
            window.location.href = `https://www.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_business_basic,instagram_business_manage_insights&response_type=code&state=${encodedState}`;
        } catch (error: any) {
            console.log(error.message);
        }
  }

  return (
    <main className="bg-white text-gray-800 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Instagram Insights</h1>
          {/* --- CHANGE: Simplified header, removed filter button --- */}
          <div className="relative w-full sm:max-w-xs mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search username..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow" 
            />
          </div>
          <button 
          key='Button'
          className='px-4 py-1.5 rounded-lg text-sm font-medium transition-colors bg-black text-white cursor-pointer'
          onClick={handleConnectClick}>
            Connect
          </button>
        </header>

        {/* Filters and Time Period Section */}
        <section className="mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Main Filters */}
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

                {/* --- CHANGE: Conditionally render Time Period Filter --- */}
                {/* This block now only shows when the 'Reach' filter is active */}
                {activeFilter === 'Reach' && (
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
                )}
            </div>
        </section>

        {/* Profile List Section */}
        <section>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* --- CHANGE: Pass 'activeFilter' state down to each ProfileCard --- */}
            {profileData.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} activeFilter={activeFilter} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default InstagramInsightsPage;