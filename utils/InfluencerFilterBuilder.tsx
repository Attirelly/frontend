// src/utils/filterBuilders.ts

import { SelectedFilters } from "@/components/Seller/InfluencerSidebar";

// Define the default range to check against
const DEFAULT_RANGE: [number, number] = [0, 10000000];

/**
 * Builds an Algolia-compatible facet filter string array.
 * This creates OR groups for items within the same category
 * (e.g., location:A OR location:B)
 * and ANDs them with other categories (e.g., ... AND (gender:Male)).
 */
export function buildFacetFilterString(filters: SelectedFilters): string {
  const facetGroups: string[][] = [];

  // Handle 'location'
  if (filters.location.length > 0) {
    facetGroups.push(filters.location.map((val) => `city:${val}`)); // Use 'city' as in your old code
  }

  // Handle 'genders'
  if (filters.genders.length > 0) {
    facetGroups.push(filters.genders.map((val) => `gender:${val}`));
  }

  // Handle 'category'
  if (filters.category.length > 0) {
    facetGroups.push(
      filters.category.map((val) => `category_niche:${val}`)
    );
  }

  // Convert to JSON string for the URL parameter
  return JSON.stringify(facetGroups);
}

/**
 * Builds an Algolia-compatible numeric filter string array.
 * This creates AND groups for all numeric range filters.
 */
export function buildNumericFilterString(filters: SelectedFilters): string {
  const numericFilters: string[] = [];

  const rangeKeys: (keyof SelectedFilters)[] = [
    "followers_instagram",
    "followers_facebook",
    "followers_youtube",
    "price_story",
    "price_reel",
    "price_post",
    "avg_views",
  ];

  rangeKeys.forEach((key) => {
    const range = filters[key] as [number, number];
    const [low, high] = range;

    // --- Key Translation Logic (same as before) ---
    let algoliaField = key as string;
    if (key.startsWith("followers_")) {
      algoliaField = key.replace("followers_", "followers.");
    } else if (key.startsWith("price_")) {
      algoliaField = key.replace("price_", "pricing.");
    } else if(key === "avg_views"){
      algoliaField = key.replace("avg_views","engagement_metrics.avgViewsPerReel")
    }

    // // --- Check against default ranges ---
    const isMinDefault = low === DEFAULT_RANGE[0];
    const isMaxDefault = high === DEFAULT_RANGE[1];
    if(!isMaxDefault || !isMinDefault){
      numericFilters.push(`${algoliaField} >= ${low} AND ${algoliaField} <= ${high}`);
    }

    // // Only add a filter if the min or max is not the default
    // if (!isMinDefault) {
    //   numericFilters.push(`${algoliaField} >= ${low}`);
    // }
    // if (!isMaxDefault) {
    //   numericFilters.push(`${algoliaField} <= ${high}`);
    // }
    // if(low!=null && high!=null){
    //   numericFilters.push(`${algoliaField} >= ${low} AND ${algoliaField} <= ${high}`);
    // }

  });

  // Convert to JSON string for the URL parameter
  return numericFilters.join(" AND ");
}