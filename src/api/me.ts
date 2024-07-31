import AuthApi from '../pages/home/loginup/auth/auth-api';

const authApi = new AuthApi();

export const loadProfile = async () => {
  window.store.set({isLoading: true});
  try {
    const userData = await authApi.me();
    window.store.set({user: userData});

    window.router.go('/settings');
  } catch (error) {
    window.store.set({loginError: 'failed'});
  } finally {
    window.store.set({isLoading: false});
  }
};
