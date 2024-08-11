import {LoginRequestData, UserDTO, APIError} from '../../../../api/type';
import AuthApi from './auth-api';

const authApi = new AuthApi();

export const login = async (model: LoginRequestData) => {
  window.store.set({isLoading: true});
  try {
    const loginResponse = await authApi.login(model);

    if (!(loginResponse instanceof Response) || loginResponse.status !== 200) {
      throw new Error('Login failed: Status not 200');
    }

    const userData: UserDTO | APIError = await authApi.me();

    if ('message' in userData) {
      throw new Error(userData.message);
    }

    window.store.set({user: userData});

    window.router.go('/messenger');
  } catch (error) {
    console.error(error);
    window.store.set({loginError: 'Login failed'});
  } finally {
    window.store.set({isLoading: false});
  }
};
