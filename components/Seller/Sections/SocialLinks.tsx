"use client";
import React, { useState, useEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";

export default function SocialLinksComponent() {
  const { setSocialLinksData, setSocialLinksValid, socialLinksData } =
    useSellerStore();
  const [instagramUsname, setInstagramUsname] = useState(
    socialLinksData?.instagramUsname || ""
  );
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(
    socialLinksData?.websiteUrl || ""
  );
  const [facebookUrl, setFacebookUrl] = useState(
    socialLinksData?.facebookUrl || ""
  );

  console.log(socialLinksData);
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.trim().replace(/^@/, "");
    setInstagramUsname(username);
    setInstagramUrl(`https://instagram.com/${username}`);
    console.log(username);
  };
  useEffect(() => {
    // const isValid = instagramUrl !== '' && websiteUrl !== '' && facebookUrl !== '';
    // setSocialLinksValid(isValid);
    console.log("setting data");
    console.log(instagramUrl);

    setSocialLinksData({
      instagramUsname,
      instagramUrl: `https://instagram.com/${socialLinksData?.instagramUsname}`,
      facebookUrl,
      websiteUrl,
    });
  }, [instagramUrl, websiteUrl, facebookUrl, setSocialLinksData]);
  function validateInstagramUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
    return pattern.test(url);
  }

  const handleInstagramConnect = () => {
    if(validateInstagramUrl(instagramUrl)){
      let appId = process.env.NEXT_INSTAGRAM_APP_ID
      console.log(appId)
      appId = '548897007892754'
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
      console.log(redirectUri)
      window.location.href = `https://www.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_business_basic&response_type=code&state=${instagramUrl}`   
    }
  };
  return (
    <div className="space-y-8 rounded-md overflow-hidden w-3xl">
      {/* Container 1 */}
      <div className="rounded-2xl p-6 space-y-4 max-w-2xl shadow-sm bg-white">
        <div>
          <h2 className="text-lg font-semibold">Social Links</h2>
          <p className="text-sm text-gray-500">
            Customers will see these details on Attirelly
          </p>
        </div>
        {/* Divider */}
        <div className="-mx-6 border-t border-gray-300"></div>

        {/* Instagram Username Input */}
        <div>
          {/* <span className="text-red-500">*</span> */}
          <label className="block text-sm font-medium mb-1">
            Instagram username
          </label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
              instagram.com/
            </span>
            <input
              type="text"
              placeholder="your_username"
              defaultValue={instagramUsname || ""}
              className="flex-1 px-3 py-2 outline-none text-sm"
              onChange={handleInstagramChange}
            />
          </div>
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="https://yourwebsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        {/* Facebook URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Facebook URL</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="https://facebook.com/yourpage"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Integrate Label */}
      <div className="text-xl font-semibold">Integrate</div>

      {/* Instagram Integration */}
      <div className="bg-white shadow-sm max-w-2xl space-y-6 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-3 md:w-2/3">
          <h3 className="text-xl font-semibold">Integrate with Instagram</h3>
          <p className="text-gray-500">
            Connect your Instagram, so Attirelly can engage
          </p>
          <button
            className="bg-black text-white px-5 py-2 rounded-full"
            onClick={handleInstagramConnect}
          >
            Integrate
          </button>
        </div>
        <div className="mt-4 md:mt-0 md:w-1/3 flex justify-center">
          <img
            src={"/OnboardingSections/instagram.svg"}
            alt={"bros"}
            className="w-15 h-15 rounded-2xl object-cover"
          />
        </div>
      </div>

      {/* Shopify Integration */}
      {/* <div className="bg-white shadow-sm max-w-2xl space-y-6 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-3 md:w-2/3">
          <h3 className="text-xl font-semibold">Integrate with Shopify</h3>
          <p className="text-gray-500">Connect your Shopify store, so Attirelly can engage</p>
          <button className="bg-black text-white px-5 py-2 rounded-full">Integrate</button>
        </div>
        <div className="mt-4 md:mt-0 md:w-1/3 flex justify-center">
          <img
            src={'/OnboardingSections/shopify.png'}
            alt={'bros'}
            className="w-15 h-15 rounded-2xl object-cover"
          />
        </div>
      </div> */}
    </div>
  );
}
