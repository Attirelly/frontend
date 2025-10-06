import aa from "search-insights";
import { v4 as uuidv4 } from "uuid";

// Initialize Algolia Insights
aa("init", {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
});

// Manage persistent userToken
function getUserToken(): string {
  let token = localStorage.getItem("algolia_user_token");
  if (!token) {
    token = uuidv4();
    localStorage.setItem("algolia_user_token", token);
  }
  return token;
}

/**
 * ✨ Search Results Viewed Event
 * Call this when search results are successfully fetched and displayed.
 */
export function sendViewEvent(objectIDs: string[]  ,index: string) {
  aa("viewedObjectIDs", {
    index,
    eventName: "Search Results Viewed",
    userToken: getUserToken(),
    objectIDs,
  });
}

/**
 * 🎨 Generic Filter Click Event
 * Call this when a user clicks any filter or facet.
 */
export function sendFilterClickEvent(filterName: string, filterValue: string, index: string) {
  aa("clickedFilters", {
    index,
    eventName: "Filter Applied",
    userToken: getUserToken(),
    filters: [`${filterName}:${filterValue}`],
  });
}

/**
 * 👆 Product Click Event
 * Call this when a user clicks a product from a search results page.
 */
export function sendClickEvent(objectID: string, queryID: string, index: string, position: number) {
  aa("clickedObjectIDsAfterSearch", {
    index,
    eventName: "Product Clicked",
    userToken: getUserToken(),
    objectIDs: [objectID],
    queryID,
    positions: [position],
  });
}

/**
 * 💳 Purchase / Conversion Event
 * Call this after a user completes a purchase.
 */
export function sendConversionEvent(objectIDs: string[], queryID: string | null, index: string) {
  const eventPayload: any = {
    index,
    eventName: "Product Purchased",
    userToken: getUserToken(),
    objectIDs,
  };
  if (queryID) {
    eventPayload.queryID = queryID;
  }
  aa("convertedObjectIDsAfterSearch", eventPayload);
}