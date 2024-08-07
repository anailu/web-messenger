import AuthApi from './auth-api';
import {CreateUser} from '../../../../api/type';

const authApi = new AuthApi();

export const register = async (model: unknown) => {
  window.store.set({isLoading: true});
  try {
    const createUserModel = model as CreateUser;
    const response = await authApi.create(createUserModel);
    console.log('Registration response:', response);

    const userData = await authApi.me();

    console.log('User Data:', userData);

    window.router.go('/messenger');
  } catch (error) {
    console.error('Registration failed:', error);

    window.store.set({registerError: 'some error'});
  } finally {
    window.store.set({isLoading: false});
  }
};
