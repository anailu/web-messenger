import {Block} from './block';
import {EventBus} from './eventBus';
import {ChatData} from './renderChatlist';
import {sendMessage} from './sendData';

/**
 * рендерит содержимое правой колонки старницы, связанной с выбранным чатом
 * @param {HTMLLIElement} item - элемент списка чатов, представляющий выбранный чат
 * @param {Block} columnRight - экземпляр класса Block, представляющий правую колонку
 * @param {EventBus} eventBus - экземпляр класса EventBus для обработки событий
 * @param {ChatData[]} exampleChatsData - массив с данными о чатах
 */
export function renderColumn(
    item: HTMLLIElement,
    columnRight: Block,
    eventBus: EventBus,
    exampleChatsData: ChatData[]
): void {
  const chatListItems = document.querySelectorAll<HTMLLIElement>('.chatlist li');
  chatListItems.forEach((chat) => chat.classList.remove('active'));

  item.classList.add('active');

  const chatId = item.dataset.chatId;
  const selectedChat = exampleChatsData.find((chat) => chat.id === chatId);

  if (selectedChat) {
    columnRight.getElement().textContent = '';

    const personDiv = new Block('div');
    personDiv.getElement().classList.add('chat-topbar_container', 'person');
    personDiv.getElement().innerHTML = `
          <div class='chat-topbar_container'>
              <div class='person'>
                  <img class='person-avatar' src='${selectedChat.photo}' alt='chat's avatar'>
                  <div class='person-name'>${selectedChat.chatname}</div>
              </div>
          </div>
      `;
    columnRight.getElement().appendChild(personDiv.getElement());

    const dialogContainer = new Block('div');
    dialogContainer.getElement().classList.add('dialog_content');
    dialogContainer.getElement().innerHTML = `
        <div class='message_container'>
          ${selectedChat.message}
          <span class='message-date'>${selectedChat.data}</span>
        </div>
      `;
    columnRight.getElement().appendChild(dialogContainer.getElement());

    columnRight.getElement().innerHTML += `
          <form id='message' class='chat_bottombar'>
              <input type='file' id='fileInput'>
              <label for='fileInput' class='bottombar_attach-button'>
                  <img src='../../../../static/images/attach_icon.svg' 
                  alt='attach' class='attach-icon'>
              </label>
              <input type='text' placeholder='write a message' class='chat_input' 
              id='messageInput' autocomplete='off' name='message'>
              <button type='submit' class='send-message' id='sendMessage'>
                  <img src='../../../../static/images/send-message.svg' 
                  alt='send' class='send-message_icon'>
              </button>
          </form>
      `;

    const sendMessageButton = columnRight.getElement().querySelector('#sendMessage');
    if (sendMessageButton) {
      sendMessageButton.addEventListener('click', (event) => {
        sendMessage(event);
      });
    }
  }

  setTimeout(() => {
    if (selectedChat && chatId !== selectedChat.id) {
      eventBus.emit('chatSelected', {chatId, selectedChat});
    }
  }, 0);
}
