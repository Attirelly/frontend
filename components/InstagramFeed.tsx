"use client";

import React, { useEffect } from "react";

interface InstagramFeedProps {
  username: string;
  width?: number;
  height?: number;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({
  username,
  width = 1200,
  height = 900,
}) => {

  
  // const embedUrl = `https://www.instagram.com/${username}/embed`;
  const embedUrl = `https://www.instagram.com/${username}/embed`;

  

  return (
    <div className="w-full flex justify-center">
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        allowTransparency
        allowFullScreen
        title={`Instagram feed for ${username}`}
        style={{ border: "none" }}
      />
    </div>
  );
};

export default InstagramFeed;
