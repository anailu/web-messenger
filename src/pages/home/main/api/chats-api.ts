import ChatApi, {GetChatsParams, GetChatUsersParams} from '../../../../api/chatApi';
import {APIError} from '../../../../api/type';
import {Chat} from '../messengerPage';

export const chatApi = new ChatApi();

/**
 * Загружает список чатов и обновляет состояние хранилища.
 * Устанавливает состояние загрузки перед запросом и обновляет его после завершения запроса.
 * Если произошла ошибка, устанавливает соответствующее сообщение об ошибке в хранилище.
 *
 * @async
 * @function
 * @return {Promise<void>}
 */
export const getChats = async () => {
  window.store.set({isLoading: true});
  try {
    const params: GetChatsParams = {offset: 0, limit: 10, title: ''};
    const chats = await chatApi.getChats(params);
    console.log('Loaded chats(chats-api):', chats);

    if (Array.isArray(chats)) {
      window.store.set({chats});
    } else {
      throw new Error((chats as APIError).reason || 'Unknown error');
    }
  } catch (error) {
    console.error('Error getting chats:', error);
    window.store.set({chatError: 'some error'});
  } finally {
    window.store.set({isLoading: false});
  }
};

/**
 * Устанавливает активный чат в хранилище.
 *
 * @param {any} card - Данные активного чата.
 * @function
 */
export const setActiveChat = (card: any) => {
  window.store.set({
    selectedCard: card,
    messages: card.messages || [],
  });
};

/**
 * Создает новый чат с указанным заголовком.
 * После успешного создания отображает сообщение об успешном создании.
 * В случае ошибки отображает сообщение об ошибке.
 *
 * @async
 * @param {string} title - Заголовок создаваемого чата.
 * @return {Promise<void>}
 */
export async function createChat(title: string): Promise<void> {
  try {
    await chatApi.createChat({title});
    await getChats();
    alert('chat created successfully');
  } catch (error) {
    console.error('error creating chat:', error);
    alert('failed to create chat');
  }
}

/**
 * Удаляет чат по указанному идентификатору.
 * После успешного удаления отображает сообщение об успешном удалении.
 * В случае ошибки отображает сообщение об ошибке.
 *
 * @async
 * @param {number} chatId - Идентификатор удаляемого чата.
 * @return {Promise<void>}
 */
export async function deleteChat(chatId: number): Promise<void> {
  try {
    await chatApi.deleteChat({chatId});
    await getChats();
    window.store.set({selectedCard: null});
    alert('Chat deleted successfully');
  } catch (error) {
    console.error('Error deleting chat:', error);
    alert('Failed to delete chat.');
  }
}

/**
 * Загружает список пользователей чата и обновляет состояние хранилища.
 * Если произошла ошибка, устанавливает соответствующее сообщение об ошибке в хранилище.
 *
 * @async
 * @function
 * @param {number} chatId - Идентификатор чата
 * @param {GetChatUsersParams} params - Параметры запроса для получения пользователей чата
 * @return {Promise<void>}
 */
export const getChatUsers = async (
    chatId: number,
    params: GetChatUsersParams = {
      offset: 0,
      limit: 10,
    }
) => {
  window.store.set({isLoading: true});
  try {
    const users = await chatApi.getChatUsers(chatId, params);
    console.log('Loaded chat users:', users);

    if (Array.isArray(users)) {
      window.store.set({usersInChat: users});
      return users;
    } else {
      throw new Error((users as APIError).reason || 'Unknown error');
    }
  } catch (error) {
    console.error('Error getting chat users:', error);
    window.store.set({errorCode: 'some error'});

    return null;
  } finally {
    window.store.set({isLoading: false});
  }
};

/**
 * Загружает аватар чата и обновляет состояние хранилища.
 * Если произошла ошибка, устанавливает соответствующее сообщение об ошибке в хранилище.
 *
 * @async
 * @function
 * @param {number} chatId - Идентификатор чата.
 * @param {File} avatar - Новый аватар для чата.
 * @return {Promise<void>}
 */
export const uploadChatAvatar = async (chatId: number, avatar: File): Promise<void> => {
  window.store.set({isLoading: true});
  try {
    const result = await chatApi.uploadChatAvatar({chatId, avatar});
    console.log('avatar upload result:', result);

    if (result) {
      alert('avatar uploaded successfully');
      await getChats();

      const updatedChatList = window.store.getState().chats;
      const updatedChat = updatedChatList.find((chat: Chat) => chat.id === chatId);

      if (updatedChat) {
        window.store.set({
          selectedCard: updatedChat,
        });
      }
    } else {
      throw new Error((result as APIError).reason || 'unknown error');
    }
  } catch (error) {
    console.error('error uploading chat avatar:', error);
    window.store.set({chatError: 'failed to upload avatar'});
  } finally {
    window.store.set({isLoading: false});
  }
};
