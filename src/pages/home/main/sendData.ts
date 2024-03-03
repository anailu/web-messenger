/**
 * Обработчик события отправки сообщения.
 * @param {Event} event - Событие отправки формы.
 * @return {void}
 */
function sendMessage(event: Event): void {
  event.preventDefault();

  const messageInput = document.getElementById('messageInput') as HTMLInputElement;
  const message = messageInput.value;

  console.log('Message:', message);

  messageInput.value = '';
}

export {sendMessage};
