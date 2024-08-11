import {HTTPTransport} from './httpTransport';
import {APIError, ChatDTO, UserDTO} from './type';


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

export interface GetChatUsersParams {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
}


export interface UploadAvatarRequest {
  chatId: number;
  avatar: File;
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

  /**
   * Получает список пользователей чата
   * @param {number} chatId - Идентификатор чата
   * @param {GetChatUsersParams} params - Параметры запроса для получения пользователей
   * @return {Promise<UserDTO[] | APIError>} - Список пользователей или ошибка API
   */
  async getChatUsers(chatId: number, params: GetChatUsersParams): Promise<UserDTO[] | APIError> {
    const queryString = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(
        params[key as keyof GetChatUsersParams]!
        )}`)
        .join('&');
    return await chatApi.get(`/${chatId}/users?${queryString}`);
  }

  /**
   * Установка аватара чата
   * @param {UploadAvatarRequest} data - Объект с идентификатором чата и файлом аватара
   * @return {Promise<{ result: string } | APIError>} - Результат операции или ошибка API
   */
  async uploadChatAvatar(data: UploadAvatarRequest): Promise<{ result: string } | APIError> {
    const formData = new FormData();
    formData.append('chatId', data.chatId.toString());
    formData.append('avatar', data.avatar);

    return chatApi.put('/avatar', {data: formData});
  }
}
