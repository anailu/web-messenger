import {HTTPTransport} from '../scripts/httpTransport';
import {APIError} from './type';

const chatsUsersApi = new HTTPTransport('/chats/users');

export interface UsersRequest {
  users: number[];
  chatId: number;
}

/**
 * Класс для работы с API управления пользователями в чатах
 */
export default class ChatsUsersApi {
  /**
   * Добавляет пользователей в чат
   * @param {UsersRequest} data - Данные запроса, содержат массив пользователей и id чата
   * @return {Promise<any | APIError>} - Возвращает результат выполнения операции или ошибку API
   */
  async addUsersToChat(data: UsersRequest): Promise<any | APIError> {
    return chatsUsersApi.put('', {data});
  }

  /**
   * Удаляет пользователей из чата
   * @param {UsersRequest} data - Данные запроса, содержаn массив пользователей и id чата
   * @return {Promise<any | APIError>} - Возвращает результат выполнения операции или ошибку API
   */
  async delUsersFromChat(data: UsersRequest): Promise<any | APIError> {
    return chatsUsersApi.delete('', {data});
  }
}
