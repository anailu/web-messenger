import AuthApi from './auth-api';
import {CreateUser} from '../../../../api/type';

const authApi = new AuthApi();

export const register = async (model: unknown) => {
  window.store.set({isLoading: true});
  try {
    const currentUser = await authApi.me().catch(() => null);

    if (currentUser && !('reason' in currentUser)) {
      console.log(`Logging out current user: ${currentUser.login}`);
      await authApi.logout();
      window.store.set({user: null});
    }

    const createUserModel = model as CreateUser;
    const response = await authApi.create(createUserModel);
    console.log('Registration response:', response);

    const userData = await authApi.me();

    console.log('User Data:', userData);

    if (!('reason' in userData)) {
      window.store.set({user: userData});
      window.router.go('/messenger');
    } else {
      throw new Error(userData.reason);
    }
  } catch (error) {
    console.error('Registration failed:', error);

    window.store.set({
      registerError: error instanceof Error ? error.message : 'Registration failed',
    });
  } finally {
    window.store.set({isLoading: false});
  }
};
