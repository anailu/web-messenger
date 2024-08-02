import {HTTPTransport} from '../scripts/httpTransport';
import {APIError, ChatDTO} from './type';


const chatApi = new HTTPTransport('/chats');

export interface GetChatsParams {
  offset?: number;
  limit?: number;
  title?: string;
}

export interface CreateChatRequest {
  title: string;
}

export interface DeleteChatRequest {
  chatId: number;
}

/**
 * Класс для работы с API чатов.
 * Использует HTTPTransport для отправки запросов к серверу.
 */
export default class ChatApi {
  /**
   * Получает список чатов с возможностью фильтрации
   * @param {GetChatsParams} params - Параметры запроса для получения чатов
   * @return {Promise<ChatDTO | APIError>} - Список чатов или ошибка API
   */
  async getChats(params: GetChatsParams): Promise<ChatDTO | APIError> {
    const queryString = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(
          params[key as keyof GetChatsParams]!
        )}`)
        .join('&');
    return chatApi.get(`?${queryString}`);
  }

  /**
   * Создает новый чат
   * @param {CreateChatRequest} data - Данные запроса для создания чата
   * @return {Promise<{ id: number } | APIError>} - Информация о созданном чате или ошибка API
   */
  async createChat(data: CreateChatRequest): Promise<{ id: number } | APIError> {
    return chatApi.post('', {data});
  }

  /**
   * Удаляет существующий чат
   * @param {CreateChatRequest} data - Данные запроса для удаления чата
   * @return {Promise<{ result: string } | APIError>} - Результат удаления чата или ошибка API
   */
  async deleteChat(data: DeleteChatRequest): Promise<{ result: string } | APIError> {
    return chatApi.delete('', {data});
  }

  /**
   * Получает токен для чата
   * @param {number} chatId - Идентификатор чата
   * @return {Promise<{ token: string } | APIError>} - Токен чата или ошибка API
   */
  async getChatToken(chatId: number): Promise<{ token: string } | APIError> {
    return chatApi.post(`/token/${chatId}`);
  }

  /**
   * Получает количество непрочитанных сообщений в чате
   * @param {number} chatId - Идентификатор чата
   * @return {*} - Количество непрочитанных сообщений или ошибка API
   */
  async getNewMessagesCount(chatId: number): Promise<{ unread_count: number } | APIError> {
    return chatApi.get(`/new/${chatId}`);
  }
}
