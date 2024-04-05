import Block, {BlockProps} from '../../../scripts/block';
import {EventBus} from '../../../scripts/eventBus';
import {validateMessage} from '../../../scripts/validationRules';
import {Chat} from './index';
import {getFileData} from '../../../scripts/fileUtils';

interface DialogBlockProps extends BlockProps {
  selectedChat?: Chat | undefined;
  eventBus: EventBus;
  chats: Chat[];
}

/**
 * класс блока формы диалога
 * @class DialogBlock
 * @extends {Block}
 * @param {DialogBlock} props - свойства блока формы
 */
class DialogBlock extends Block<DialogBlockProps> {
  private selectedChat?: Chat;
  chats: Chat[];

  /**
   * конструктор класса DialogBlock
   * @constructor
   * @param {DialogBlockProps} props - объект свойств блока диалога
   */
  constructor(props: DialogBlockProps) {
    super('div', props);
    this.chats = props.chats;
    this.eventBus = props.eventBus;
    this.addEventListeners();
  }

  /**
   * добавляет слушатели событий
   */
  addEventListeners() {
    this.eventBus.on('chatSelected', this.handleChatSelected.bind(this));
  }

  /**
   * обрабатывает событие выбора чата
   * @param {string} chatId - идентификатор выбранного чата
   */
  handleChatSelected(chatId: string) {
    const selectedChat = this.chats.find((chat) => chat.chatId === chatId);
    if (selectedChat) {
      this.selectedChat = selectedChat;
      const dialogContainer = document.getElementById('dialog-container');

      if (dialogContainer) {
        dialogContainer.innerHTML = this.render();
        this.addSubmitListener();
      } else {
        console.error('dialog-container not found');
      }
    }
  }

  /**
   * добавляет слушатель события отправки сообщения
   */
  addSubmitListener() {
    const messageForm = document.getElementById('message');
    if (messageForm) {
      messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput') as HTMLInputElement;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;

        if (messageInput && fileInput) {
          const {isValid, errorMessage} = validateMessage(
              messageInput.value.trim(), fileInput.value.trim());
          if (isValid) {
            const messageObject = {
              message: messageInput.value,
              files: getFileData(fileInput.files),
            };

            console.log('Message:', messageObject);

            messageInput.value = '';
            fileInput.value = '';
          } else {
            alert(errorMessage);
          }
        }
      });
    } else {
      console.error('message form not found');
    }
  }

  /**
   * метод для удаления блока
   */
  componentWillUnmount() {
    super.componentWillUnmount();
  }

  /**
   * рендерит HTML содержимое блока формы диалога
   * @return {string} HTML содержимое блока формы диалога
   */
  render(): string {
    if (!this.selectedChat) {
      return '';
    }

    return `
      <div class='chat-topbar_container person'>
        <div class='person'>
          <img class='person-avatar' 
              src='${this.selectedChat.photo}' 
              alt="chat's avatar">
          <div class='person-name'>${this.selectedChat.chatName}</div>
        </div>
      </div>
      <div class='dialog_content'>
        <div class='message_container'>
          ${this.selectedChat.message}
          <span class='message-date'>${this.selectedChat.data}</span>
        </div>
      </div>
      <form id='message' class='chat_bottombar'>
        <input type='file' id='fileInput' multiple>
        <label for='fileInput' class='bottombar_attach-button'>
          <img src='../static/images/attach_icon.svg' 
              alt='attach' 
              class='attach-icon'>
        </label>
        <input type='text' placeholder='write a message' class='chat_input' 
          id='messageInput' autocomplete='off' name='message'>
        <button type='submit' class='send-message' id='sendMessage'>
          <img src='../../static/images/send-message.svg' 
              alt='send' class='send-message_icon'>
        </button>
      </form>
    `;
  }
}

export default DialogBlock;
