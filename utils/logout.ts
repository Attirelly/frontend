import { googleLogout } from '@react-oauth/google';
import { api } from '@/lib/axios';

const logoutFacebook = () => {
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.logout(() => {
      console.log('Facebook user logged out');
    });
  }
};

export const logout = async (redirectPath: string = '/login') => {
  

  try{
    await api.post('users/logout');
    googleLogout();
    logoutFacebook();
    window.location.href = redirectPath;
  }
  catch(error){
    console.error('Logout failed:', error);
  }

  
};