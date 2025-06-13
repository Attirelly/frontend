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
api.interceptors.request.use(
  (config) => {
    // Check if the window object is available (to avoid issues during SSR)
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null; // Retrieve the access token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to the Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);


// Response interceptor 
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
