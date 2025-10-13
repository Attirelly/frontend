'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { Instagram } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const SocialLinks = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for the form fields
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookLink, setFacebookLink] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      instagram_url: `https://instagram.com/${instagramHandle}`,
      youtube_link: youtubeLink,
      website_url: websiteUrl,
      facebook_link: facebookLink,
    }),
  }));

  // Validation for mandatory fields
  const handleNext = () => {
    if (!instagramHandle) {
      alert('Please enter your Instagram handle.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
      <p className="text-gray-500 mb-8">Connect your social media and professional websites.</p>

      <div className="space-y-6">
        {/* Instagram Handle */}
        <div>
          <label htmlFor="instagram-handle" className="block text-sm font-medium text-gray-700">
            Instagram Handle <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              instagram.com/
            </span>
            <input
              type="text"
              id="instagram-handle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              placeholder="yourhandle"
            />
          </div>
        </div>

        {/* Optional Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="youtube-link" className="block text-sm font-medium text-gray-700">YouTube Link (Optional)</label>
                <input type="url" id="youtube-link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" placeholder="https://youtube.com/yourchannel"/>
            </div>
            <div>
                <label htmlFor="facebook-link" className="block text-sm font-medium text-gray-700">Facebook Link (Optional)</label>
                <input type="url" id="facebook-link" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" placeholder="https://facebook.com/yourpage"/>
            </div>
        </div>
        <div>
            <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">Website URL (Optional)</label>
            <input type="url" id="website-url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md" placeholder="https://yourwebsite.com"/>
        </div>

        {/* Divider */}
        <hr className="my-4" />

        {/* Instagram Integration UI */}
        <div>
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
        </div>
      </div>

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default SocialLinks;