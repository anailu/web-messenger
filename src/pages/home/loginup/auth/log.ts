import {LoginRequestData, UserDTO, APIError} from '../../../../api/type';
import AuthApi from './auth-api';

const authApi = new AuthApi();

export const login = async (model: LoginRequestData) => {
  window.store.set({isLoading: true});
  try {
    await authApi.login(model);

    const userData: UserDTO | APIError = await authApi.me();

    if ('message' in userData) {
      throw new Error(userData.message);
    }

    window.store.set({user: userData});

    console.log('Login successful:', userData);

    window.router.go('/messenger');
  } catch (error) {
    window.store.set({loginError: 'Login failed'});
  } finally {
    window.store.set({isLoading: false});
  }
};
