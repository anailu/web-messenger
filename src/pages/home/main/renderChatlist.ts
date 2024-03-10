import Block from './block';
import {Chat} from './index';
import EventBus from '../../../scripts/eventBus';

interface ChatListBlockProps {
  chats: Chat[];
  eventBus: EventBus;
}

/**
 * класс блока списка чатов
 * @class
 */
class ChatListBlock extends Block {
  private chats: Chat[];
  private eventBus: EventBus;

  /**
   * конструктор класса ChatListBlock
   * @constructor
   * @param {ChatListBlockProps} props - объект свойств блока списка чатов
   */
  constructor(props: ChatListBlockProps) {
    super();
    this.chats = props.chats;
    this.eventBus = props.eventBus;
    this._addEvents({
      'click .chat_container': this._onChatItemClick.bind(this),
    });
    this.render();
  }

  /**
   * метод отрисовки списка чатов
   * @public
   */
  render(): void {
    const columnLeft = document.getElementById('chatlist-container');

    if (!columnLeft) {
      console.error('id \'chatlist-container\' не найден');
      return;
    }

    this.chats.forEach((chat) => {
      const chatItem = document.createElement('li');
      chatItem.classList.add('chat_container');
      chatItem.setAttribute('data-chat-id', chat.chatId);

      chatItem.innerHTML = `
        <div class='avatar_container'>
          <img src='${chat.photo}' alt="chat's avatar" class='avatar_image'>
        </div>
        <div class='dialog_container'>
          <div class='dialog_title'>
            ${chat.chatName}
            <div class='chat_container__message-data'>${chat.data}</div>
          </div>
          <div class='dialog_content'>${chat.message}</div>
        </div>
      `;

      this.addEvent(chatItem, chat);

      columnLeft.appendChild(chatItem);
    });
  }

  /**
   * метод для добавления обработчика события клика для чата
   * @param {HTMLElement} element - HTML-элемент чата
   * @param {Chat} chat - объект чата
   * @private
   */
  private addEvent(element: HTMLElement, chat: Chat): void {
    element.addEventListener('click', () => {
      this.eventBus.emit('chatSelected', chat);
    });
  }

  /**
   * обработчик события клика на элементе '.chat_container'
   * @param {Event} event - объект события
   * @private
   */
  private _onChatItemClick(event: Event): void {
    const chatItem = event.target as HTMLElement;
    const chatId = chatItem.getAttribute('data-chat-id');

    if (chatId !== null) {
      this.eventBus.emit('chatSelected', parseInt(chatId, 10));
    }
  }
}

export default ChatListBlock;
