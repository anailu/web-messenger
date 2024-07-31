import {getChatWebSocket} from '../pages/home/main/api/chatWebSocketManager';
import {sanitizeMessage} from './sanitize';

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
    const messageObject = {
      content: message,
      type: 'message',
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
