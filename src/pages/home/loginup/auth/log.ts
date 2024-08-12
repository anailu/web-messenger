import {LoginRequestData} from '../../../../api/type';
import AuthApi from './auth-api';

const authApi = new AuthApi();

export const login = async (model: LoginRequestData) => {
  window.store.set({isLoading: true});
  try {
    const currentUser = await authApi.me().catch(() => null);

    if (currentUser && !('reason' in currentUser) && currentUser.login !== model.login) {
      throw new Error(`already logged in as ${currentUser.login}<br>please log out first`);
    }

    const loginResponse = await authApi.login(model);

    if (loginResponse && typeof loginResponse === 'object' && 'reason' in loginResponse) {
      if (loginResponse.reason === 'User already in system') {
        window.router.go('/messenger');
        return;
      } else {
        throw new Error(loginResponse.reason || 'Login failed: Unknown error');
      }
    }

    const userData = await authApi.me();

    if ('reason' in userData) {
      throw new Error(userData.reason);
    }

    window.store.set({user: userData});
    window.router.go('/messenger');
  } catch (error) {
    console.error(error);
    window.store.set({
      loginError: error instanceof Error ? error.message : 'Login failed',
    });
  } finally {
    window.store.set({isLoading: false});
  }
};
