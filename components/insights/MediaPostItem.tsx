// components/MediaPostItem.tsx

import { Media } from "@/types/creatorTypes";
import { Heart, MessageCircle, Send, Eye, Bookmark, BarChart2 } from "lucide-react";

const Stat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number | string }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        {icon}
        <span className="font-medium">{label}:</span>
        <span className="font-bold text-gray-800">{value.toLocaleString()}</span>
    </div>
);

const MediaPostItem = ({ media }: { media: Media }) => {
    // Calculate engagement rate: ((Likes + Comments) / Reach) * 100
    const engagementRate = media.reach > 0 
        ? (((media.likes + media.comments) / media.reach) * 100).toFixed(2) + "%" 
        : "0.00%";

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Post Image */}
      <div className="w-full sm:w-40 h-40 flex-shrink-0">
        <img
          src={media.media_url}
          alt={`Instagram post ${media.media_id}`}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Post Insights */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        <h3 className="col-span-full text-lg font-bold text-gray-800 border-b pb-2 mb-1">
          Post Insights
        </h3>
        <Stat icon={<Heart size={16} className="text-red-500"/>} label="Likes" value={media.likes} />
        <Stat icon={<MessageCircle size={16} className="text-blue-500"/>} label="Comments" value={media.comments} />
        <Stat icon={<Send size={16} className="text-green-500"/>} label="Shares" value={media.shares} />
        <Stat icon={<Eye size={16} className="text-purple-500"/>} label="Reach" value={media.reach} />
        <Stat icon={<BarChart2 size={16} className="text-yellow-500"/>} label="Impressions" value={media.impressions} />
        <Stat icon={<Bookmark size={16} className="text-indigo-500"/>} label="Saves" value={media.saved} />
        <div className="col-span-full mt-2 pt-2 border-t">
             <Stat icon={<BarChart2 size={16} className="text-teal-500"/>} label="Engagement Rate" value={engagementRate} />
        </div>
      </div>
    </div>
  );
};

export default MediaPostItem;