import {api} from '@/lib/axios'; // Axios instance

export const refreshAccessToken = async (): Promise<void> => {
  try {
    await api.post("/users/refresh");

    // const { access_token } = response.data;
    // if (!access_token) throw new Error('No access token returned');
    // return access_token;

  } catch (error: any) {
    console.error('Error refreshing access token:', error?.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
};
