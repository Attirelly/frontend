"use client";

import React from "react";

/**
 * @interface InstagramFeedProps
 * @description Defines the props for the InstagramFeed component.
 */
interface InstagramFeedProps {
  /**
   * @description The Instagram username of the account whose feed is to be embedded.
   */
  username: string;
}

/**
 * A component that embeds a public Instagram feed using an iframe.
 *
 * This component serves as a simple fallback to display a user's Instagram profile
 * when no data is available from either the official API or a scraping service.
 * It constructs an embed URL and renders it within a responsive iframe.
 *
 * ### Limitations
 * - This method relies on Instagram's embedding functionality, which can be subject to change or restrictions.
 * - It may not display correctly if the user has ad-blockers or privacy extensions that block social media embeds.
 * - It provides a read-only view and does not offer the same level of customization or interaction as a gallery built with API data.
 *
 * @param {InstagramFeedProps} props - The props for the component.
 * @returns {JSX.Element} A responsive iframe containing the Instagram feed.
 */
const InstagramFeed: React.FC<InstagramFeedProps> = ({ username }) => {
  // Construct the official Instagram embed URL using the provided username.
  const embedUrl = `https://www.instagram.com/${username}/embed`;

  return (
    // The component is wrapped in a container to control its max-width and centering.
    <div className="w-full max-w-4xl mx-auto">
      {/* A relative container with a 4:3 aspect ratio to maintain a consistent shape before the iframe loads. */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <iframe
          src={embedUrl}
          // The iframe is positioned absolutely to fill the aspect ratio container.
          className="absolute top-0 left-0 w-full h-full border-none"
          // These attributes are recommended by Instagram for proper embedding.
          allowTransparency
          allowFullScreen
          title={`Instagram feed for ${username}`}
        />
      </div>
    </div>
  );
};

export default InstagramFeed;
