import {LoginRequestData} from '../../../../api/type';
import AuthApi from './auth-api';

const authApi = new AuthApi();

export const login = async (model: LoginRequestData) => {
  window.store.set({isLoading: true});
  try {
    await authApi.login(model);

    const userData = await authApi.me();
    window.store.set({user: userData});
    console.log('Login successful:', userData);
    console.log('Store state after login:', window.store.getState());

    window.router.go('/messenger');
  } catch (error) {
    window.store.set({loginError: 'Login failed'});
  } finally {
    window.store.set({isLoading: false});
  }
};
