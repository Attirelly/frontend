import {api} from '@/lib/axios'; // Axios instance

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
      {}, // No body needed; refresh token is in the cookie
      { withCredentials: true } // Send cookies
    );

    const { access_token } = response.data;
    if (!access_token) throw new Error('No access token returned');
    return access_token;

  } catch (error: any) {
    console.error('Error refreshing access token:', error?.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
};
