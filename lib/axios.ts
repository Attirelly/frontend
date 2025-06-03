import axios from "axios";
import { refreshAccessToken } from "./authService";
import { logout } from '@/utils/logout';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the Access Token if available
// api.interceptors.request.use(
//   (config) => {
//     // Check if the window object is available (to avoid issues during SSR)
//     const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null; // Retrieve the access token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // Attach token to the Authorization header
//     }
//     return config;
//   },
//   (error) => Promise.reject(error) // Handle request errors
// );

// Response Interceptor: Handle Expired Token (401 Unauthorized Error)
// api.interceptors.response.use(
//   (response) => response, // If the request is successful, just return the response
//   async (error) => {
//     const originalRequest = error.config; // Get the original request that failed

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite loops in case of multiple retries

//       try {
//         // Try to refresh the access token using the refresh token
//         const newAccessToken = await refreshAccessToken();

//         // Save the new access token in localStorage
//         localStorage.setItem('access_token', newAccessToken);

//         // Retry the original request with the new access token
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return api(originalRequest); // Retry the request
//       } catch (err) {
//         console.error('Unable to refresh token:', err);
//         // Handle refresh token error (e.g., redirect to login)
//         localStorage.removeItem('access_token');
//         window.location.href = '/login'; // Redirect to the login page
//         return Promise.reject(err); // Reject the error
//       }
//     }

//     return Promise.reject(error); // Reject the error if it's not a 401
//   }
// );

api.interceptors.response.use(
  (response) => response,  // ✅ If response is OK (2xx), return as-is
  async (error) => {
    const originalRequest = error.config;
    const requestedUrl = originalRequest.url;
    if(requestedUrl?.includes("/users/refresh")){
      return Promise.reject(error);
    }
    if (error.response) {
      const { status } = error.response;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          return api(originalRequest);
        }
        catch (refreshError) {
          console.error('❌ Refresh failed, redirecting to login...');
          if(requestedUrl?.includes("/seller_dashboard")){
            logout("/seller_signin");
          } else if (requestedUrl?.includes("/customer_dashboard")){
            logout("/customer_sigin");
          }
          return Promise.reject(refreshError);
        }
      }

      if (status === 500) {
        console.error('Server error. Try again later.');
        //  Show toast or fallback UI
      }

      // Add more global error cases if needed
    } else {
      console.error('🌐 Network Error:', error.message);
      //  Handle server unreachable, CORS issues, etc.
    }

    return Promise.reject(error);  //  Pass error down to caller
  }
);
