import {HTTPTransport} from '../../../../scripts/httpTransport';
import {
  APIError,
  CreateUser,
  LoginRequestData,
  SignUpResponse,
  UserDTO} from '../../../../api/type';

const authApi = new HTTPTransport('/auth');

/**
 * Класс для работы с API аутентификации.
 * @class
 */
export default class AuthApi {
  /**
   * Создает нового пользователя.
   * @param {CreateUser} data - Данные для создания пользователя.
   * @return {Promise<SignUpResponse>} - Ответ от сервера после регистрации.
   * @throws {APIError} - В случае ошибки запроса.
   */
  async create(data: CreateUser): Promise<SignUpResponse> {
    return authApi.post<SignUpResponse>('/signup', {data});
  }

  /**
   * Выполняет вход пользователя.
   * @param {LoginRequestData} data - Данные для входа (логин и пароль).
   * @return {Promise<void | APIError>} - Успешный ответ или ошибка, если вход не удался.
   * @throws {APIError} - В случае ошибки запроса.
   */
  async login(data: LoginRequestData): Promise<void | APIError> {
    return authApi.post('/signin', {data});
  }

  /**
   * Получает данные текущего пользователя.
   * @return {Promise<UserDTO | APIError>} - Данные пользователя или ошибка, если запрос не удался.
   * @throws {APIError} - В случае ошибки запроса.
   */
  async me(): Promise<UserDTO | APIError> {
    return authApi.get('/user');
  }

  /**
   * Выполняет выход пользователя.
   * @return {Promise<void | APIError>} - Успешный ответ или ошибка, если выход не удался.
   * @throws {APIError} - В случае ошибки запроса.
   */
  async logout(): Promise<void | APIError> {
    return authApi.post('/logout');
  }
}
