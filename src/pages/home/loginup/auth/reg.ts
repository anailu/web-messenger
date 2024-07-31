import AuthApi from './auth-api';

const authApi = new AuthApi();

export const register = async (model: any) => {
  window.store.set({isLoading: true});
  try {
    const response = await authApi.create(model);
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
