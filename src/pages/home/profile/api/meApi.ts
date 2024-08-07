import AuthApi from '../../loginup/auth/auth-api';
import UserApi from '../../../../api/userApi';
import {
  UpdateUserProfileRequest,
  UpdateUserPasswordRequest,
  UpdateUserAvatarRequest,
  User, APIError,
} from '../../../../api/type';

const authApi = new AuthApi();
const userApi = new UserApi();

export const loadUserData = async () => {
  window.store.set({isLoading: true});
  try {
    const userData: User | APIError = await authApi.me();
    if ('id' in userData) {
      window.store.set({user: userData, isLoading: false});
    } else {
      window.store.set({loginError: (userData as APIError).message, isLoading: false});
    }
  } catch (error) {
    console.error(error);
    window.store.set({isLoading: false});
  }
};

export const updateUserData = async (userRequest: UpdateUserProfileRequest) => {
  window.store.set({isLoading: true});
  try {
    const response = await userApi.updateUserProfile(userRequest);
    if (response && !response.error) {
      window.store.set({user: response, isLoading: false});
    } else {
      window.store.set({loginError: (response as APIError).message, isLoading: false});
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    window.store.set({isLoading: false});
  }
};

export const updateUserPassword = async (passwordData: UpdateUserPasswordRequest) => {
  window.store.set({isLoading: true});
  try {
    const response = await userApi.updateUserPassword(passwordData);
    if (response === 200) {
      alert('Password updated successfully');
    } else {
      window.store.set({loginError: (response as APIError).message, isLoading: false});
      alert('Failed to update password');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    window.store.set({isLoading: false});
    alert('Failed to update password');
  } finally {
    window.store.set({isLoading: false});
  }
};

export const updateUserAvatar = async (avatarData: UpdateUserAvatarRequest) => {
  window.store.set({isLoading: true});
  try {
    const response = await userApi.updateUserAvatar(avatarData);
    if (response.status === 200) {
      alert('Avatar updated successfully');
    } else {
      window.store.set({loginError: (response as APIError).message, isLoading: false});
      alert('Failed to update avatar');
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    window.store.set({isLoading: false});
    alert('Failed to update avatar');
  } finally {
    window.store.set({isLoading: false});
  }
};
