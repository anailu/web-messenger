import AuthApi from './auth-api';

const authApi = new AuthApi();

export const logout = async () => {
  window.store.set({isLoading: true});
  try {
    await authApi.logout();

    const cookies = document.cookie.split('; ');

    console.log('Cookies after logout:', cookies);

    window.router.go('/');
  } catch (error) {
    window.store.set({logoutError: 'Logout failed'});

    console.error('Logout failed:', error);
  } finally {
    window.store.set({isLoading: false});
  }
};
