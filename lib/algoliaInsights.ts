import aa from "search-insights";
import { v4 as uuidv4 } from "uuid";

// Initialize Algolia Insights
aa("init", {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!, // Search-only key
});

// Manage persistent userToken
function getUserToken(): string {
  let token = localStorage.getItem("algolia_user_token");
  if (!token) {
    token = uuidv4(); // anonymous unique ID
    localStorage.setItem("algolia_user_token", token);
  }
  return token;
}

export function sendSearchEvent(query: string, index: string) {
  aa("viewedFilters", {
    index,
    eventName: "Search Performed",
    userToken: getUserToken(),
    filters: [`query:${query}`],
  });
}

/**
 * 👆 Product click event
 */
export function sendClickEvent(objectID: string, queryID: string, index: string , position: number) {
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
 * 🏬 Store click event
 */
export function sendStoreClickEvent(storeID: string, index: string) {
  aa("clickedFilters", {
    index,
    eventName: "Store Clicked",
    userToken: getUserToken(),
    filters: [`store:${storeID}`],
  });
}

/**
 * 💳 Purchase / Conversion event
 */
export function sendConversionEvent(objectIDs: string[], queryID: string | null, index: string) {
  const event: any = {
    index,
    eventName: "Product Purchased",
    userToken: getUserToken(),
    objectIDs,
  };
  if (queryID !== null) {
    event.queryID = queryID;
  }
  aa("convertedObjectIDsAfterSearch", event);
}
