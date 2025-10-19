'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { Instagram } from 'lucide-react';
import { useWeddingPlannerStore } from '@/store/weddingPlannerStore'; // Import your store

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

/**
 * Extracts the Instagram handle from various possible inputs (full URL, handle, etc.)
 */
const getHandleFromInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '') // Remove domain
    .replace(/\/$/, '') // Remove trailing slash
    .split('?')[0]; // Remove query params
};


const SocialLinks = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // Get state and updater from Zustand
  const { socialLinks, updateSocialLinks } = useWeddingPlannerStore();

  // Expose data to the parent component (reads directly from Zustand)
  useImperativeHandle(ref, () => ({
    getData: () => ({
      instagram_url: socialLinks.instagramUrl,
      youtube_link: socialLinks.youtubeLink,
      website_url: socialLinks.websiteUrl,
      facebook_link: socialLinks.facebookLink,
    }),
  }));

  // Validation for mandatory fields (reads from Zustand)
  const handleNext = () => {
    if (!socialLinks.instagramUrl) {
      alert('Please enter your Instagram handle.');
      return;
    }
    onNext();
  };

  /**
   * Special handler for Instagram.
   * Cleans the input to get just the handle, then saves the full URL to the store.
   */
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const handle = getHandleFromInput(e.target.value);
    updateSocialLinks({ instagramUrl: handle ? `https://instagram.com/${handle}` : '' });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
      <p className="text-gray-500 mb-8">Connect your social media and professional websites.</p>

      <div className="space-y-6">
        {/* Instagram Handle */}
        <div>
          <label htmlFor="instagram-handle" className="block text-sm font-medium text-gray-700">
            Instagram Handle <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 text-gray-500 sm:text-sm">
              instagram.com/
            </span>
            <input
              type="text"
              id="instagram-handle"
              value={getHandleFromInput(socialLinks.instagramUrl)} // Display only the handle
              onChange={handleInstagramChange} // Use special handler
              className="w-full min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2 bg-gray-50 focus:border-black focus:ring-black sm:text-sm"
              placeholder="yourhandle"
            />
          </div>
        </div>

        {/* Optional Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="youtube-link" className="block text-sm font-medium text-gray-700">YouTube Link (Optional)</label>
                <input 
                  type="url" 
                  id="youtube-link" 
                  value={socialLinks.youtubeLink} 
                  onChange={(e) => updateSocialLinks({ youtubeLink: e.target.value })} 
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" 
                  placeholder="https://youtube.com/yourchannel"/>
            </div>
            <div>
                <label htmlFor="facebook-link" className="block text-sm font-medium text-gray-700">Facebook Link (Optional)</label>
                <input 
                  type="url" 
                  id="facebook-link" 
                  value={socialLinks.facebookLink} 
                  onChange={(e) => updateSocialLinks({ facebookLink: e.target.value })} 
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" 
                  placeholder="https://facebook.com/yourpage"/>
            </div>
        </div>
        <div>
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">Website URL (Optional)</label>
            <input 
              type="url" 
              id="website-url" 
              value={socialLinks.websiteUrl} 
              onChange={(e) => updateSocialLinks({ websiteUrl: e.target.value })} 
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" 
              placeholder="https://yourwebsite.com"/>
        </div>

        {/* Instagram Integration UI (No state changes, left as-is) */}
        {/* <div>
            <h2 className="text-xl font-semibold mb-4">Integrate</h2>
            <div className="flex w-full items-center justify-between p-6 border rounded-lg">
                <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">Integrate with Instagram</h3>
                    <p className="text-gray-600 text-sm">Connect your Instagram, so Attirelly can engage</p>
                    <button className="mt-4 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800">
                        Disconnect
                    </button>
                </div>
                <div className="flex-shrink-0">
                    <Instagram className="h-10 w-10 text-pink-500" />
                </div>
            </div>
        </div> */}
      </div>
    </div>
  );
});

export default SocialLinks;