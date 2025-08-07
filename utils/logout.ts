import { googleLogout } from '@react-oauth/google';
import { api } from '@/lib/axios';

const logoutFacebook = () => {
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.logout(() => {
      
    });
  }
};

export const logout = async (redirectPath: string = '/') => {
  

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