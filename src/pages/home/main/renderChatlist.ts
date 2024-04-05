import Block, {BlockProps} from '../../../scripts/block';
import {Chat} from './index';
import {EventBus} from '../../../scripts/eventBus';

interface ChatListBlockProps extends BlockProps {
  chats: Chat[];
  eventBus: EventBus;
  events: {
    click?: (chat: Chat) => void;
  };
}

/**
 * класс блока списка чатов
 * @class ChatListBlock
 * @extends {Block}
 * @param {ChatListBlock} props - свойства блока формы
 */
class ChatListBlock extends Block<ChatListBlockProps> {
  props: ChatListBlockProps;
  chats: Chat[];

  /**
   * конструктор класса ExtendedBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   */
  constructor(props: ChatListBlockProps) {
    super('li', props);
    this.chats = props.chats;
    this.props = props;
  }

  /**
   * обработчик клика по чату
   * @param {Event} event - событие клика
   */
  handleChatClick(event: Event) {
    event.preventDefault();
    const clickedChatId = (event.currentTarget as HTMLElement).dataset.chatId;
    const clickedChat = this.props.chats.find((chat) => chat.chatId === clickedChatId);
    if (clickedChat && this.props.events && this.props.events.click) {
      this.props.eventBus.emit('chatSelected', clickedChatId);
    }
  }

  /**
   * метод для удаления блока
   */
  componentWillUnmount() {
    super.componentWillUnmount();
  }

  /**
   * метод для рендеринга HTML формы в строку
   * @return {string} - HTML форма в виде строки
   */
  render(): string {
    if (!this.props || !this.props.chats) return '';
    return this.props.chats.map((chat: Chat) => `
      <li class='chat_container' data-chat-id='${chat.chatId}'>
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
      </li>
    `).join('');
  }

  /**
   * метод для добавления слушателей событий
   */
  addClickListener() {
    const chatContainers = document.querySelectorAll('li.chat_container');
    chatContainers.forEach((chatContainer) =>{
      chatContainer.addEventListener('click', this.handleChatClick.bind(this));
    });
  }
}

export default ChatListBlock;
