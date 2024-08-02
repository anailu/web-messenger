import UserApi from '../../../../api/userApi';
import {User} from '../../../../api/type';

const userApi = new UserApi();

/**
 * Ищет пользователя по логину:
 *
 * делает запрос к API для поиска пользователя с указанным логином. Если найден,
 * информация сохраняется в хранилище и возвращается. В случае ошибки или если не найден,
 * возвращает `null` или `undefined`.
 *
 * @param {string} login - Логин пользователя для поиска.
 * @return {*} - Возвращает объект пользователя, `null` или `undefined`.
 */
export async function findUser(login: string): Promise<User | null | undefined> {
  window.store.set({isLoading: true});
  try {
    const response = await userApi.findUser({login});

    if (response && response.length > 0) {
      const foundUser = response[0] as User;

      window.store.set({foundUser});

      console.log('User found:', foundUser);
      alert(`User found: ${foundUser.login}`);

      return foundUser;
    } else {
      window.store.set({foundUser: null});
      alert('User not found');

      return null;
    }
  } catch (error) {
    window.store.set({chatError: 'Failed to find user'});

    console.error('Error finding user:', error);
    alert('Failed to find user');

    return undefined;
  } finally {
    window.store.set({isLoading: false});
  }
}
