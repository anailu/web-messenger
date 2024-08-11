import Block from '../../../../core/block';
import addMember from '../../../../static/images/add_member.svg';
import delChat from '../../../../static/images/del_chat.svg';
import SmallModal from './modals/chatMenuModal';
import IconButton from './iconButton';
import ChatHeader from './chatHeader';
import ChatInfoModal from './modals/chatInfoModal';
import {deleteChat, addUsersToChat, findUser} from '../api';
import {connect} from '../../../../scripts/connect';
import {SelectedCard} from '../../../../api/type';

interface ChatTopBarProps {
  selectedCard?: SelectedCard;
  title: string;
  avatar: string;
  chatId: number;
}

/**
 * Класс для отображения верхней панели чата
 * @extends Block
 */
class ChatTopBar extends Block {
  /**
   * Создает экземпляр ChatTopBar.
   * @param {ChatTopBarProps} props - Свойства компонента.
   */
  constructor(props: ChatTopBarProps) {
    super({
      ...props,
      users: [],
    });
  }

  /**
   * Инициализация компонента
   * Создает и настраивает модальные окна и кнопки управления.
   * @private
   */
  init(): void {
    const addMemberModal = new SmallModal({
      title: 'add member',
      content: '<input type="text" id="addMemberLogin" placeholder="login" />',
      buttonText: 'add',
      onSubmit: async () => {
        const input = document.getElementById('addMemberLogin') as HTMLInputElement;

        const login = input.value;
        if (login) {
          try {
            const user = await findUser(login);

            if (user) {
              await addUsersToChat([user.id], this.props.chatId);
              alert(`User ${user.login} added to chat`);
            } else {
              alert('User not found');
            }
          } catch (error) {
            console.error('Error during user search or adding:', error);
            alert('Failed to add user to chat.');
          } finally {
            addMemberModal.hide();
          }
        }
      },
    });

    const delChatModal = new SmallModal({
      title: 'delete chat',
      content: '<p>are you sure you want to delete this chat?</p>',
      buttonText: 'yes, delete',
      onSubmit: () => {
        console.log('submit'),

        deleteChat(this.props.chatId);
        delChatModal.hide();
      },
    });

    const addMemberButton = new IconButton({
      icon: addMember,
      modal: addMemberModal,
    });

    const delChatButton = new IconButton({
      icon: delChat,
      modal: delChatModal,
    });

    const chatInfoModal = new ChatInfoModal({
      chatId: this.props.chatId,
      users: [],
      chatTitle: '',
      chatAvatar: '',
      onSubmit: () => {
        console.log('submit');
      },
    });

    const chatHeader = new ChatHeader({
      avatar: this.props.selectedCard?.avatar || this.props.avatar,
      title: this.props.selectedCard?.title || this.props.title,
      chatId: this.props.selectedCard?.id || this.props.chatId,
      modal: chatInfoModal,
    });

    this.children = {
      chatHeader,
      addMemberButton,
      delChatButton,
      addMemberModal,
      delChatModal,
      chatInfoModal,
    };
  }

  /**
   * Обновляет компонент, если свойства изменились
   * @param {ChatTopBarProps} oldProps - Предыдущие свойства
   * @param {ChatHeaderProps} newProps - Новые свойства
   * @return {boolean} - Возвращает true, если свойства изменились
   */
  componentDidUpdate(oldProps: ChatTopBarProps, newProps: ChatTopBarProps): boolean {
    console.log('ChatTopBar updated:', newProps.selectedCard);
    if (oldProps.selectedCard !== newProps.selectedCard) {
      const newAvatar = newProps.selectedCard?.avatar || this.props.avatar;
      const newTitle = newProps.selectedCard?.title || this.props.title;

      this.children.chatHeader.setProps({
        avatar: newAvatar,
        title: newTitle,
      });
    }

    return true;
  }

  /**
   * Рендеринг компонента
   * @return {string} Шаблон компонента.
   */
  render() {
    return `
      <div class="chat-topbar_container person">
        {{{chatHeader}}}
        <div class="dialogMenu_buttons">
          {{{addMemberButton}}}
          {{{delChatButton}}}
        </div>
        {{{addMemberModal}}}
        {{{delChatModal}}}
        {{{chatInfoModal}}}
      </div>
    `;
  }
}

const mapStateToProps = (state: {
  selectedCard?: SelectedCard
}) => ({
  selectedCard: state.selectedCard,
  chatId: state.selectedCard?.id,
});

export default connect(mapStateToProps)(ChatTopBar);
