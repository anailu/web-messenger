import ChatApi, {GetChatsParams} from '../../../../api/chatApi';

export const chatApi = new ChatApi();

/**
 * Загружает список чатов и обновляет состояние хранилища.
 * Устанавливает состояние загрузки перед запросом и обновляет его после завершения запроса.
 * Если произошла ошибка, устанавливает соответствующее сообщение об ошибке в хранилище.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */

export const getChats = async () => {
  window.store.set({isLoading: true});
  try {
    const params: GetChatsParams = {offset: 0, limit: 10, title: ''};
    const chats = await chatApi.getChats(params);
    console.log('Loaded chats(chats-api):', chats);

    window.store.set({chats});
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
    alert('Chat deleted successfully');
  } catch (error) {
    console.error('Error deleting chat:', error);
    alert('Failed to delete chat.');
  }
}
