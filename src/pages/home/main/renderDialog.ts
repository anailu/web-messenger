import Block from './block';
import eventBus from '../../../scripts/eventBus';
import {validateMessage} from '../../../scripts/validationRules';
import {sendMessage} from './sendData';
import {Chat} from './index';

interface DialogBlockProps {
  chatId?: string;
  selectedChat?: Chat;
  eventBus: eventBus;
}
/**
 * класс блока диалога
 * @class
 */
class DialogBlock extends Block {
  public chatId?: string;
  private selectedChat?: Chat | undefined;
  public element: HTMLElement;
  private eventBus: eventBus;

  /**
   * конструктор класса DialogBlock
   * @constructor
   * @param {DialogBlockProps} props - объект свойств блока диалога
   */
  constructor(props: DialogBlockProps) {
    super();
    this.chatId = props.chatId;
    this.eventBus = props.eventBus;
    this.selectedChat = props.selectedChat;
    this.element = document.createElement('div');
    this.render();
    this.addEvents();
  }

  /**
   * метод для добавления обработчиков событий
   * @private
   */
  private addEvents(): void {
    const sendMessageButton = document.getElementById('sendMessage') as HTMLButtonElement | null;
    const messageInput = document.getElementById('messageInput') as HTMLInputElement | null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;

    if (sendMessageButton && messageInput && fileInput) {
      sendMessageButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (!validateMessage(messageInput.value, fileInput.value)) {
          alert('write a message or attach a file');
          return;
        }

        sendMessage(event);

        this.eventBus.emit('messageSent', {chatId: this.selectedChat?.chatId, message: 'dkmv'});
      });
    }
  }

  /**
   * метод для отрисовки блока диалога
   * @public
   */
  render(): void {
    const columnRight = document.getElementById('column-right');

    if (!columnRight) {
      console.error('Элемент с id \'column-right\' не найден');
      return;
    }

    columnRight.innerHTML = '';

    const personDiv = document.createElement('div');
    personDiv.classList.add('chat-topbar_container', 'person');
    personDiv.innerHTML = `
      <div class='chat-topbar_container'>
        <div class='person'>
          <img class='person-avatar' 
               src='${this.selectedChat?.photo}' 
               alt="chat's avatar">
          <div class='person-name'>${this.selectedChat?.chatName}</div>
        </div>
      </div>
    `;
    columnRight.appendChild(personDiv);

    const dialogContainer = document.createElement('div');
    dialogContainer.classList.add('dialog_content');
    dialogContainer.innerHTML = `
      <div class='message_container'>
        ${this.selectedChat?.message}
        <span class='message-date'>${this.selectedChat?.data}</span>
      </div>
    `;
    columnRight.appendChild(dialogContainer);

    const formContainer = document.createElement('form');
    formContainer.id = 'message';
    formContainer.classList.add('chat_bottombar');
    formContainer.innerHTML = `
      <input type='file' id='fileInput'>
      <label for='fileInput' class='bottombar_attach-button'>
        <img src='../static/images/attach_icon.svg' 
             alt='attach' 
             class='attach-icon'>
      </label>
      <input type='text' placeholder='write a message' class='chat_input' 
        id='messageInput' autocomplete='off' name='message'>
      <button type='submit' class='send-message' id='sendMessage'>
        <img src='../static/images/send-message.svg' 
        alt='send' class='send-message_icon'>
      </button>
    `;
    columnRight.appendChild(formContainer);
  }
}

export default DialogBlock;
