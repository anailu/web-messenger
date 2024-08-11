import Block from '../../../../core/block';
import {connect} from '../../../../scripts/connect';
import {setActiveChat} from '../api/chats-api';
import {connectToChat} from '../api/chatWebSocketManager';
import ChatWebSocket from '../../../../api/webSocket';
import ChatApi from '../../../../api/chatApi';
import {Chat} from '../messengerPage';
import defaultAvatar from '../../../../static/images/default_avatar.png';
import {getChatUsers} from '../api/chats-api';

const BASE_URL = 'https://ya-praktikum.tech/api/v2/resources/';

export interface UserCardProps {
  id: number;
  title: string;
  avatar: string | null;
  activeId?: number;
  selectedCard?: { id: number };
  click?: (chat: Chat) => void;
}

/**
 * Класс для отображения карточки чата.
 * @extends Block
 */
class UserCard extends Block {
  private chatWebSocket: ChatWebSocket | null = null;
  private chatApi: ChatApi;

  /**
   * Создает экземпляр UserCard.
   * @param {UserCardProps} props - Свойства компонента карточки чата.
   */
  constructor(props: UserCardProps) {
    super({
      ...props,
      active: props.activeId === props.id,
      events: {
        click: async () => {
          const card = {
            title: props.title,
            avatar: props.avatar,
            id: props.id,
          };
          setActiveChat(card);
          this.connectToChatHere(card.id);
          await getChatUsers(card.id);
        },
      },
    });

    this.chatApi = new ChatApi();
  }

  /**
   * Подключение к веб-сокету для чата.
   * Если уже существует активное соединение, оно будет закрыто перед созданием нового.
   * @param {number} chatId - Идентификатор чата, к которому нужно подключиться.
   * @throws {Error} В случае ошибки при получении токена или подключении к веб-сокету.
   */
  async connectToChatHere(chatId: number) {
    if (this.chatWebSocket) {
      this.chatWebSocket.close();
      this.chatWebSocket = null;
    }

    const store = window.store.getState();
    const userId = store.user.id;

    try {
      const tokenResponse = await this.chatApi.getChatToken(chatId);
      if ('token' in tokenResponse) {
        const token = tokenResponse.token;
        this.chatWebSocket = await connectToChat(chatId, userId, token);
        if (this.chatWebSocket) {
          this.chatWebSocket.loadOldMessages(0);
        } else {
          console.error('Failed to connect to chat');
        }
      } else {
        console.error('Failed to retrieve token');
      }
    } catch (error) {
      console.error('Error getting chat token:', error);
    }
  }

  /**
   * Рендерит HTML для компонента списка карточек.
   * @return {string} HTML разметка компонента.
   */
  render(): string {
    const isActive = this.props.selectedCard?.id === this.props.id;

    const avatarUrl = this.props.avatar ?
      `${BASE_URL}${this.props.avatar}` :
      defaultAvatar;

    return `
        <div class="{{#if ${isActive}}}card_active{{/if}}">
          <li class='chat_container' data-chat-id='{{id}}'>
            <div class='avatar_container'>
              <img src='${avatarUrl}' alt="chat's avatar" class='avatar_image'>
            </div>
            <div class='dialog_container'>
              <div class='dialog_title'>
                {{ title }}
                <div class='chat_container__message-data'></div>
              </div>
              <div class='dialog_content'></div>
            </div>
          </li>
        </div>
      `;
  }
}

const mapStateToPropsShort = (state: { selectedCard?: { id: number } }) => ({
  selectedCard: state.selectedCard,
});

export default connect(mapStateToPropsShort)(UserCard);
