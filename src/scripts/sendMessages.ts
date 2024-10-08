import {getChatWebSocket} from '../pages/home/main/api/chatWebSocketManager';
import {sanitizeMessage} from './sanitize';
import {UserDTO} from '../api/type';

/**
 * Обработчик события отправки сообщения.
 * @param {Event} event - Событие отправки формы.
 * @return {void}
 */
export function sendMessage(event: Event): void {
  event.preventDefault();

  const messageInput = document.getElementById('messageInput') as HTMLInputElement;
  let message = messageInput.value;

  message = sanitizeMessage(message);

  if (message) {
    const currentState = window.store.getState();
    const currentUser: UserDTO = currentState.user;

    const messageObject = {
      content: message,
      type: 'message',
      user_id: currentUser.id,
      time: new Date().toISOString(),
    };

    const chatWebSocket = getChatWebSocket();

    if (chatWebSocket) {
      chatWebSocket.sendMessage(messageObject);

      const currentState = window.store.getState();
      const updatedMessages = [messageObject, ...currentState.messages];
      window.store.set({messages: updatedMessages});
    } else {
      console.error('chatWebSocket is not defined');
    }

    messageInput.value = '';
  }

  console.log('Message:', message);
}
