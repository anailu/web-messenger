import {HTTPTransport} from '../scripts/httpTransport';
import {
  APIError,
  FindUserRequest,
  UpdateUserProfileRequest,
  UpdateUserPasswordRequest,
  UpdateUserAvatarRequest,
} from './type';


const userApi = new HTTPTransport('/user');

/**
 * Класс для работы с API пользователей
 */
export default class UserApi {
  /**
   * Ищет пользователя по данным запроса
   * @param {FindUserRequest} data - Данные запроса для поиска пользователя
   * @return {Promise<any | APIError>} - Возвращает данные пользователя или ошибку API
   */
  async findUser(data: FindUserRequest): Promise<any | APIError> {
    return userApi.post('/search', {data});
  }

  /**
   * Обновляет профиль пользователя
   * @param {UpdateUserProfileRequest} data - Данные запроса для обновления профиля
   * @return {Promise<any | APIError>} - Возвращает обновленные данные профиля или ошибку API
   */
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<any | APIError> {
    return userApi.put('/profile', {data});
  }

  /**
   * Обновляет пароль пользователя
   * @param {UpdateUserPasswordRequest} data - Данные запроса для обновления пароля
   * @return {Promise<any | APIError>} - Возвращает успех или ошибку API
   */
  async updateUserPassword(data: UpdateUserPasswordRequest): Promise<any | APIError> {
    return userApi.put('/password', {data});
  }

  /**
   * Обновляет аватар пользователя
   * @param {UpdateUserAvatarRequest} data - Данные запроса для обновления аватара
   * @return {Promise<any | APIError>} - Возвращает успех или ошибку API
   */
  async updateUserAvatar(data: UpdateUserAvatarRequest): Promise<any | APIError> {
    const formData = new FormData();
    formData.append('avatar', data.avatar);

    return userApi.put('/profile/avatar', {data: formData});
  }
}
