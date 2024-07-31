import Block from '../../../core/block';
import UserCard from './components/user-card';
import ListCard from './list-card';
import {connect} from '../../../scripts/connect';
import ChatTopBar from './components/chatTopBar';
import MessageContent from './components/messageContent';
import ChatBottomBar from './components/chatBottomBar';
import {loadUserData} from '../profile/api/meApi';

export interface Chat {
  id: string;
  title: string;
  avatar: string;
  [key: string]: any;
}

interface MessengerPageProps {
  chats: any[];
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
    console.log('ChatPage mounted with props:', this.props);
    try {
      await loadUserData();
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  /**
   * Инициализирует компоненты страницы.
   */
  init(): void {
    const onCardClikBind = this.onCardClick.bind(this);

    const ListUser = new ListCard({
      cards: this.mapUserCardToComponent(this.props.chats, null, onCardClikBind) || [],
    });

    const ChatTopBarComp = new ChatTopBar({
      avatar: this.props.selectChat?.avatar,
      title: this.props.selectChat?.title,
      chatId: this.props.selectChat?.id,
    });

    const ChatBottomBarComp = new ChatBottomBar();
    const MessageContentComp = new MessageContent({messages: [], userId: this.props.userId});

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

      console.log('updateMessageContent: Updating MessageContentComp with messages:', messages);

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
  mapUserCardToComponent(userCard: Chat[], activeId: string | null, handler: (chat: Chat) => void) {
    return userCard?.map(({title, logo, id}) =>
      new UserCard({
        title,
        avatar: logo,
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
    console.log('MessengerPage componentDidUpdate: oldProps', oldProps, 'newProps', newProps);
    const onCardClikBind = this.onCardClick.bind(this);

    if (oldProps.chats !== newProps.chats) {
      this.children.ListUser.setProps({
        cards: this.mapUserCardToComponent(newProps.chats, null, onCardClikBind) || [],
        showEmpty: newProps.chats.length === 0,
      });
    }

    if (oldProps.selectChat?.id !== newProps.selectChat?.id) {
      console.log('Updating selected chat components');
      this.children.ChatTopBarComp.setProps({
        avatar: newProps.selectChat?.avatar,
        title: newProps.selectChat?.title,
        chatId: newProps.selectChat?.id,
      });

      this.updateMessageContent(newProps);
    }

    console.log('componentDidUpdate props:', this.props);
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
