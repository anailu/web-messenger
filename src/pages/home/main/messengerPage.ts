import Block from '../../../core/block';
import {UserCard, ChatTopBar, MessageContent, ChatBottomBar} from './components';
import ListCard from './list-card';
import {connect} from '../../../scripts/connect';
import {loadUserData} from '../profile/api/meApi';
import {LastMessage} from '../../../api/type';

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: LastMessage | null;
  click: () => void;
  messages: [];
}

interface MessengerPageProps {
  chats: Chat[];
  selectChat?: Chat;
  userId: number;
}

/**
 * Класс для страницы мессенджера.
 * @extends Block
 */
class MessengerPage extends Block {
  /**
   * Создает экземпляр MessengerPage.
   * @param {MessengerPageProps} props - Свойства страницы мессенджера.
   */
  constructor(props: MessengerPageProps) {
    super(props);
  }

  /**
   * Компонент монтируется и загружает данные пользователя.
   * @return {Promise<void>}
   */
  async componentDidMount(): Promise<void> {
    try {
      await loadUserData();
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  /**
   * Инициализирует компоненты страницы.
   */
  init(): void {
    const cards = this.props.chats.map((chat: Chat) => new UserCard({
      id: chat.id,
      title: chat.title,
      avatar: chat.avatar,
      activeId: this.props.activeChatId,
      selectedCard: this.props.selectedCard,
    }));

    const ListUser = new ListCard({
      cards,
    });

    const ChatTopBarComp = new ChatTopBar({
      avatar: this.props.selectChat?.avatar,
      title: this.props.selectChat?.title,
      chatId: this.props.selectChat?.id,
    });

    const ChatBottomBarComp = new ChatBottomBar();

    const MessageContentComp = new MessageContent({
      messages: [],
      userId: this.props.userId,
    });

    this.children = {
      ListUser,
      ChatTopBarComp,
      ChatBottomBarComp,
      MessageContentComp,
    };

    this.updateMessageContent(this.props);
  }

  /**
   * Обновляет контент сообщений в выбранном чате.
   * @param {MessengerPageProps} props - Свойства страницы мессенджера.
   */
  updateMessageContent(props: MessengerPageProps): void {
    if (this.children.MessageContentComp) {
      const messages = props.selectChat?.messages || [];

      this.children.MessageContentComp.setProps({
        messages,
        userId: props.userId,
        selectedChatId: props.selectChat?.id,
      });
    }
  }

  /**
   * Маппирует карточки пользователей в компоненты.
   * @param {Chat[]} userCard - Массив данных карточек пользователей.
   * @param {string | null} activeId - Идентификатор активного чата.
   * @param {function} handler - Обработчик клика на карточку.
   * @return {UserCard[]} Массив компонентов карточек пользователей.
   */
  mapUserCardToComponent(
      userCard: Chat[],
      activeId: string | null,
      handler: (chat: Chat) => void
  ) {
    return userCard?.map(({title, avatar, id}) =>
      new UserCard({
        title,
        avatar: avatar,
        click: handler,
        id: Number(id),
        activeId: activeId !== null ? Number(activeId) : undefined,
      }));
  }

  /**
   * Обновляет компоненты при изменении свойств.
   * @param {MessengerPageProps} oldProps - Старые свойства.
   * @param {MessengerPageProps} newProps - Новые свойства.
   * @return {boolean} true, если компонент был обновлен, иначе false.
   */
  componentDidUpdate(oldProps: MessengerPageProps, newProps: MessengerPageProps): boolean {
    const onCardClikBind = this.onCardClick.bind(this);

    if (oldProps.chats !== newProps.chats) {
      this.children.ListUser.setProps({
        cards: this.mapUserCardToComponent(newProps.chats, null, onCardClikBind) || [],
        showEmpty: newProps.chats.length === 0,
      });
    }

    return true;
  }

  /**
   * Обработчик клика на карточку чата.
   * @param {Chat} chat - Данные чата.
   */
  onCardClick(chat: Chat) {
    console.log(chat);
  }

  /**
   * Рендерит HTML структуру страницы мессенджера.
   * @return {string} HTML разметка страницы.
   */
  render() {
    return `
      <div class="chat-container">
        {{{ ListUser }}}
        {{#if selectChat}}
          <div class="column-right">
            {{{ ChatTopBarComp }}}
            {{{MessageContentComp}}}
            {{{ChatBottomBarComp}}}
          <div>
        {{/if}}
      </div>
      {{{addChatModal}}}
    `;
  }
}

export default connect(({
  chats, selectedCard}: {
    chats: Chat[],
    selectedCard: Chat }) => ({
  chats,
  selectChat: selectedCard,
}))(MessengerPage);
