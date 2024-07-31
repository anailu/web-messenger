import ChatsUsersApi from '../../../../api/chatsUsersApi';

const chatsUserApi = new ChatsUsersApi();

export const addUsersToChat = async (users: number[], chatId: number): Promise<void> => {
  window.store.set({isLoading: true});
  try {
    const usersRequest = {users, chatId};
    const response = await chatsUserApi.addUsersToChat(usersRequest);
    console.log('Users added to chat:', response);

    window.store.set({usersInChat: response});
  } catch (error) {
    console.error('Error adding users to chat:', error);
    window.store.set({chatError: 'Error adding users to chat'});
  } finally {
    window.store.set({isLoading: false});
  }
};

export const delUsersFromChat = async (users: number[], chatId: number): Promise<void> => {
  window.store.set({isLoading: true});
  try {
    const usersRequest = {users, chatId};
    const response = await chatsUserApi.delUsersFromChat(usersRequest);
    console.log('Users removed from chat:', response);

    window.store.set({usersInChat: response});
  } catch (error) {
    console.error('Error removing users from chat:', error);
    window.store.set({chatError: 'Error removing users from chat'});
  } finally {
    window.store.set({isLoading: false});
  }
};
