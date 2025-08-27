"use client";

import React from "react";

interface InstagramFeedProps {
  username: string;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({ username }) => {
  const embedUrl = `https://www.instagram.com/${username}/embed`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-none"
          allowTransparency
          allowFullScreen
          title={`Instagram feed for ${username}`}
        />
      </div>
    </div>
  );
};

export default InstagramFeed;