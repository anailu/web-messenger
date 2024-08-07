import ChatWebSocket from '../../../../api/webSocket';

let chatWebSocket: ChatWebSocket | null = null;

/**
 * Подключение к чату через WebSocket.
 * @param {number} chatId - Идентификатор чата, к которому нужно подключиться.
 * @param {number} userId - Идентификатор пользователя, который подключается.
 * @param {string} token - Токен для авторизации подключения.
 * @return {*}
 */
export async function connectToChat(
    chatId: number,
    userId: number,
    token: string
): Promise<ChatWebSocket | null> {
  try {
    chatWebSocket = new ChatWebSocket(userId, chatId, token);
    chatWebSocket.connect();
    return chatWebSocket;
  } catch (error) {
    console.error('Failed to get chat token:', error);
    return null;
  }
}

/**
 * Возвращает текущий объект WebSocket чата.
 * @return {*}
 */
export function getChatWebSocket() {
  return chatWebSocket;
}
