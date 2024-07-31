import AuthApi from '../pages/home/loginup/auth/auth-api';
import {UserDTO, APIError} from './type';

const authApi = new AuthApi();

export const loadProfile = async () => {
  window.store.set({isLoading: true});
  try {
    const userData: UserDTO | APIError = await authApi.me();

    if ('message' in userData) {
      throw new Error(userData.message);
    }

    window.store.set({user: userData});

    window.router.go('/settings');
  } catch (error) {
    window.store.set({loginError: 'failed'});
  } finally {
    window.store.set({isLoading: false});
  }
};
