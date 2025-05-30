import { googleLogout } from '@react-oauth/google';

const logoutFacebook = () => {
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.logout(() => {
      console.log('Facebook user logged out');
    });
  }
};

export const logout = (redirectPath: string = '/login') => {
  googleLogout();
  logoutFacebook();

  localStorage.removeItem('credentials');
  localStorage.removeItem('user_role');

  window.location.href = redirectPath;
};