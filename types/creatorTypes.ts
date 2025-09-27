export interface Media {
  media_id: string;
  insta_user_id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL'; // Using a specific union type is better than a generic string
  media_url: string;
  impressions: number;
  shares: number;
  comments: number;
  likes: number;
  saved: number;
  total_interactions: number;
  follows: number;
  profile_visits: number;
  profile_activity: number;
  reach: number;
  views: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

// --- TYPE DEFINITION ---
export interface Profile {
  username: string;
  profile_picture_url:string;
  followers: number;
  engagement: number;
  reach_day: number;
  reach_week:number;
  reach_month:number;
  media: Media[]
}